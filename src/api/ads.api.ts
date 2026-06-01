import { apiClient, getAuthAccessToken } from "@/api/client";
import { usersApi } from "@/api/users.api";
import type { Ad, AnnonceDto, CreateAdDto } from "@/types";
import type { UserProfile } from "@/types/user.types";
import { EMPTY_PATH } from "zod";

interface AdsEnvelope {
  data: AnnonceDto[];
  message?: string;
}

const attachSellerProfiles = async (ads: AnnonceDto[]): Promise<AnnonceDto[]> => {
  const hasAuthToken = Boolean(getAuthAccessToken() ?? localStorage.getItem("authToken"));

  if (!hasAuthToken) {
    return ads;
  }

  const getSellerId = (ad: AnnonceDto) => (ad as any).idutilisateur ?? (ad as any).idutlisateur ?? null;
  const sellerIds = Array.from(new Set(ads.map((ad) => getSellerId(ad)).filter(Number.isFinite)));
  console.debug("attachSellerProfiles: sellerIds ->", sellerIds);
  const sellerProfiles = new Map<number, UserProfile | null>();

  await Promise.all(
    sellerIds.map(async (sellerId) => {
      try {
        const profile = await usersApi.getById(sellerId);
        sellerProfiles.set(sellerId, profile);
      } catch {
        console.warn(`attachSellerProfiles: failed to fetch profile for sellerId=${sellerId}`);
        sellerProfiles.set(sellerId, null);
      }
    }),
  );

  console.debug("attachSellerProfiles: sellerProfiles ->", Array.from(sellerProfiles.entries()));

  return ads.map((ad) => ({
    ...ad,
    vendeur: sellerProfiles.get(getSellerId(ad)) ?? null,
  }));
};

export const adsApi = {
  getAll: async (filters?: {
    categoryId?: number;
    subCategoryId?: number;
    ville?: string | null;
  }): Promise<AnnonceDto[]> => {
    const queryParams = new URLSearchParams();
    const categoryId = filters?.categoryId ?? 0;
    const subCategoryId = filters?.subCategoryId ?? 0;
    const ville = filters?.ville ?? null;

    queryParams.set("categoryId", String(categoryId));
    queryParams.set("subCategoryId", String(subCategoryId));
    if (ville !== null && ville !== undefined && String(ville).trim() !== "") {
      queryParams.set("ville", String(ville));
    }

    const url = `/api/Annonce/getall/category/ville?${queryParams.toString()}`;
    const { data } = await apiClient.get<AdsEnvelope>(url);
    return attachSellerProfiles(data.data);
  },
  getById: async (id: string): Promise<Ad> => {
    const { data } = await apiClient.get<Ad>(`/ads/${id}`);
    return data;
  },
  create: async (payload: CreateAdDto): Promise<Ad> => {
    const { data } = await apiClient.post<Ad>("/ads", payload);
    return data;
  },
  getFavorites: async (): Promise<AnnonceDto[]> => {
    const { data } = await apiClient.get<AdsEnvelope>("/api/Annonce/favorites/USER");
    return data.data;
  },
};
