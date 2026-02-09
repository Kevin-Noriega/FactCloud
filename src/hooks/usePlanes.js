import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../api/config";
export const usePlanes = () => {
  return useQuery({
    queryKey: ["planes"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/planes`);

       if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: false, // No reintenta en Home
  });
};
