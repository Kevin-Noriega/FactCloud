import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

export const useEstadisticas = () => {
  return useQuery({
    queryKey: ["estadisticas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axiosClient.get("/planes/estadisticas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 min
    retry: 1,
  });
};
