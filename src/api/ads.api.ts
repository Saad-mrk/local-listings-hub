import { apiClient } from "@/api/client";
import type { Ad, CreateAdDto } from "@/types";

export const adsApi = {
  getAll: async (): Promise<Ad[]> => {
    const { data } = await apiClient.get<Ad[]>("/ads");
    return data;
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
