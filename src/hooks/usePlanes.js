import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../api/config";
import axiosClient from "../api/axiosClient";

export const usePlanes = () => {
  return useQuery({
    queryKey: ["planes"],
    queryFn: async () => {
      const response = await axiosClient.get(`/planes`);

       if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};
