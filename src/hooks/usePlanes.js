import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import { normalizePlan } from "../utils/plans/normalizePlan";

export const usePlanes = () => {
  return useQuery({
    queryKey: ["planes"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/planes");
      return Array.isArray(data) ? data.map(normalizePlan) : [];
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};
