import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface CategoryNode {
  id: number;
  nom: string;
  children?: CategoryNode[];
}

const fetchCategories = async (): Promise<CategoryNode[]> => {
  const response = await apiClient.get<CategoryNode[]>("/api/Categorie/tree", {
    timeout: 5000,
  });

  return Array.isArray(response.data) ? response.data : [];
};

export const categoriesQueryKey = ["categories", "tree"] as const;

export const useCategories = () => {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
