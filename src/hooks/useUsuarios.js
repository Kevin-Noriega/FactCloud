import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../api/config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuario"],
    queryFn: async () => {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado?.id) {
        throw new Error("No hay usuario autenticado");
      }

      const response = await fetch(
        `${API_URL}/Usuarios/${usuarioGuardado.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
