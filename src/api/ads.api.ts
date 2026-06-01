import { apiClient } from "@/api/client";
import type { Ad, AnnonceDto, CreateAdDto } from "@/types";
import { EMPTY_PATH } from "zod";

interface AdsEnvelope {
  data: AnnonceDto[];
  message?: string;
}

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
    return data.data;
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
