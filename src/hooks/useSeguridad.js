import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../api/config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useSeguridad = () => {
  const queryClient = useQueryClient();

  // Cambiar contraseña
  const cambiarContrasena = useMutation({
    mutationFn: async (datos) => {
      const response = await fetch(`${API_URL}/Seguridad/cambiar-contraseña`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al cambiar contraseña");
      }

      return await response.json();
    },
  });

  // Obtener historial de sesiones
  const { data: sesiones, isLoading: sesionesLoading} = useQuery({
    queryKey: ["historial-sesiones"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/Seguridad/historial-sesiones`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Error al cargar sesiones");
      
      const data = await response.json();
      console.log("DATA BACKEND:", data);
      return data.sesiones;
      
    },
    
    staleTime: 60000, // 1 min
  });
  

  // Cerrar sesión específica
  const cerrarSesion = useMutation({
    mutationFn: async (sesionId) => {
      const response = await fetch(`${API_URL}/Seguridad/sesiones/${sesionId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Error al cerrar sesión");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historial-sesiones"] });
    },
  });

  // 🚨 Cerrar todas las sesiones
  const cerrarTodasSesiones = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/Seguridad/cerrar-todas-sesiones`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Error al cerrar sesiones");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historial-sesiones"] });
    },
  });

  return {
    cambiarContrasena: cambiarContrasena.mutateAsync,
    cambiarContrasenaLoading: cambiarContrasena.isPending,
    
    sesiones,
    sesionesLoading,
    
    cerrarSesion: cerrarSesion.mutateAsync,
    cerrarSesionLoading: cerrarSesion.isPending,
    
    cerrarTodasSesiones: cerrarTodasSesiones.mutateAsync,
    cerrarTodasSesionesLoading: cerrarTodasSesiones.isPending,
  };
};
