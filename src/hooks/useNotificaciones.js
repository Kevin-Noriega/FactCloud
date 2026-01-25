import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../api/config";
import { useSignalR } from "../contexts/SignalRContext";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Obtener todas las notificaciones (con SignalR)
export const useNotificaciones = () => {
  const { isConnected } = useSignalR();

  return useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/notificaciones`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Error al cargar notificaciones");
      }
      return response.json();
    },
    // Solo hacer polling si SignalR no está conectado
    refetchInterval: isConnected ? false : 30000,
    enabled: true,
  });
};

// Obtener cantidad de notificaciones no leídas
export const useNotificacionesNoLeidas = () => {
  const { isConnected } = useSignalR();

  return useQuery({
    queryKey: ["notificaciones-no-leidas"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/notificaciones/NoLeidas`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Error al cargar notificaciones no leídas");
      }
      return response.json();
    },
    // Solo hacer polling si SignalR no está conectado
    refetchInterval: isConnected ? false : 15000,
    enabled: true,
  });
};

// Resto de hooks (marcar leída, eliminar, etc.) igual que antes...
export const useMarcarComoLeida = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificacionId) => {
      const response = await fetch(
        `${API_URL}/notificaciones/${notificacionId}/Leer`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Error al marcar como leída");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notificaciones"]);
      queryClient.invalidateQueries(["notificaciones-no-leidas"]);
    },
  });
};

export const useMarcarTodasLeidas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/notificaciones/LeerTodas`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Error al marcar todas como leídas");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notificaciones"]);
      queryClient.invalidateQueries(["notificaciones-no-leidas"]);
    },
  });
};

export const useEliminarNotificacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificacionId) => {
      const response = await fetch(
        `${API_URL}/notificaciones/${notificacionId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar notificación");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notificaciones"]);
      queryClient.invalidateQueries(["notificaciones-no-leidas"]);
    },
  });
};
