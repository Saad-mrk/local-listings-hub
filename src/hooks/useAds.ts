import { useState, useEffect } from "react";
import { Ad } from "@/types/ad.types";
import { getDefaultAds, getAdsByCategory, getCategories } from "@/data";

/**
 * Hook pour gérer les annonces (par défaut depuis defaultAds.json)
 */
export function useAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les annonces par défaut
    const defaultAds = getDefaultAds();
    setAds(defaultAds);
    setCategories(getCategories());
    setIsLoading(false);
  }, []);

  const getAdsByCategory_Fn = (category: string): Ad[] => {
    return getAdsByCategory(category);
  };

  return {
    ads,
    categories,
    isLoading,
    getAdsByCategory: getAdsByCategory_Fn,
  };
}
