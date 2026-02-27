import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

export const usePlanes = () => {
  return useQuery({
    queryKey: ["planes"],
    queryFn: async () => {
      //usar axiosClient, no fetch
      const response = await axiosClient.get("/planes");

      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};
