import { useQuery } from "@tanstack/react-query";
import { adsApi } from "@/api/ads.api";

export const useAds = () => {
  return useQuery({
    queryKey: ["ads"],
    queryFn: adsApi.getAll,
  });
};
