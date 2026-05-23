import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { favoritesApi } from "@/features/favorites/api/favorites.api";
import type { FavoriteRecord, FavoritesState } from "@/features/favorites/types";

const FAVORITES_STORAGE_KEY = "lbal:favorites:v1";
const FAVORITES_QUERY_KEY = ["favorites", "state"] as const;

const defaultRecord: FavoriteRecord = {
  isFavorite: false,
  favoritesCount: 0,
  updatedAt: "",
};

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const sanitizeRecord = (value: unknown): FavoriteRecord | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<FavoriteRecord>;
  return {
    isFavorite: Boolean(candidate.isFavorite),
    favoritesCount: Number.isFinite(candidate.favoritesCount)
      ? Number(candidate.favoritesCount)
      : 0,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : "",
  };
};

const loadFavoritesState = (): FavoritesState => {
  if (!canUseStorage()) return {};

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<FavoritesState>((accumulator, [annonceId, record]) => {
      const normalized = sanitizeRecord(record);
      if (normalized) {
        accumulator[annonceId] = normalized;
      }
      return accumulator;
    }, {});
  } catch {
    return {};
  }
};

const persistFavoritesState = (state: FavoritesState) => {
  if (!canUseStorage()) return;

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
};

const mergeRecord = (
  previous: FavoriteRecord | undefined,
  isFavorite: boolean,
  favoritesCount?: number,
): FavoriteRecord => ({
  isFavorite,
  favoritesCount: Math.max(
    0,
    favoritesCount ?? (previous?.favoritesCount ?? 0) + (isFavorite ? 1 : -1),
  ),
  updatedAt: new Date().toISOString(),
});

export const useFavoritesState = () => {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: loadFavoritesState,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useFavorite = (annonceId?: string | number) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const normalizedId = annonceId === undefined || annonceId === null ? null : String(annonceId);

  const favoriteRecordQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: loadFavoritesState,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: useMemo(
      () => (state: FavoritesState) =>
        normalizedId ? (state[normalizedId] ?? defaultRecord) : defaultRecord,
      [normalizedId],
    ),
  });

  const favoriteRecord = favoriteRecordQuery.data ?? defaultRecord;

  const mutation = useMutation({
    mutationFn: async (nextValue: boolean) => {
      if (!normalizedId) {
        throw new Error("Missing annonce identifier.");
      }

      if (!isAuthenticated) {
        throw new Error("Veuillez vous connecter pour gérer vos favoris.");
      }

      return nextValue ? favoritesApi.add(normalizedId) : favoritesApi.remove(normalizedId);
    },
    onMutate: async (nextValue: boolean) => {
      if (!normalizedId) return undefined;

      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previousState = queryClient.getQueryData<FavoritesState>(FAVORITES_QUERY_KEY) ?? {};
      const previousRecord = previousState[normalizedId];
      const optimisticRecord = mergeRecord(previousRecord, nextValue);
      const optimisticState = {
        ...previousState,
        [normalizedId]: optimisticRecord,
      };

      queryClient.setQueryData(FAVORITES_QUERY_KEY, optimisticState);
      persistFavoritesState(optimisticState);

      return { previousState };
    },
    onError: (_error, _nextValue, context) => {
      if (!context?.previousState) return;
      queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousState);
      persistFavoritesState(context.previousState);
    },
    onSuccess: (response, nextValue) => {
      if (!normalizedId) return;

      const currentState = queryClient.getQueryData<FavoritesState>(FAVORITES_QUERY_KEY) ?? {};
      const previousRecord = currentState[normalizedId];
      const nextState = {
        ...currentState,
        [normalizedId]: mergeRecord(previousRecord, nextValue, response.data),
      };

      queryClient.setQueryData(FAVORITES_QUERY_KEY, nextState);
      persistFavoritesState(nextState);
    },
  });

  const setFavorite = useCallback(
    (nextValue: boolean) => {
      if (!normalizedId || mutation.isPending) return;
      mutation.mutate(nextValue);
    },
    [mutation, normalizedId],
  );

  const toggleFavorite = useCallback(() => {
    if (mutation.isPending) return;
    const latestState = queryClient.getQueryData<FavoritesState>(FAVORITES_QUERY_KEY) ?? {};
    const latestRecord = normalizedId
      ? (latestState[normalizedId] ?? defaultRecord)
      : defaultRecord;
    setFavorite(!latestRecord.isFavorite);
  }, [mutation.isPending, normalizedId, queryClient, setFavorite]);

  return {
    isFavorite: favoriteRecord.isFavorite,
    favoritesCount: favoriteRecord.favoritesCount,
    isLoading: favoriteRecordQuery.isLoading,
    isError: favoriteRecordQuery.isError,
    error: mutation.error,
    isPending: mutation.isPending,
    setFavorite,
    toggleFavorite,
  };
};
