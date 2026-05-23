import { apiClient } from "@/api/client";
import type { Ad, AnnonceDto, CreateAdDto } from "@/types";

interface AdsEnvelope {
  data: AnnonceDto[];
  message?: string;
}

export const adsApi = {
  getAll: async (): Promise<AnnonceDto[]> => {
    const { data } = await apiClient.get<AdsEnvelope>("/api/Annonce/getall");
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
};
