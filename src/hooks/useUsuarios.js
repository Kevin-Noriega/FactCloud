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
      // 1️⃣ Verificar usuario local
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) {
        throw new Error("No hay usuario autenticado");
      }

      const usuarioData = JSON.parse(usuarioGuardado);
      if (!usuarioData?.id) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        throw new Error("Sesión expirada. Redirige al login.");
      }

      // 2️⃣ Fetch usuario actualizado desde API
      const response = await fetch(`${API_URL}/Usuarios/${usuarioData.id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // 401/403 → Logout automático
        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
          throw new Error("Sesión expirada");
        }
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 3️⃣ Guardar usuario actualizado en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      return {
        ...data,
        // Computed properties útiles
        tieneSuscripcionActiva: data.suscripcion?.activa ?? false,
        esDemo: !data.suscripcion?.activa,
        documentosRestantes: data.suscripcion?.documentosRestantes ?? 0,
        puedeFacturar: data.suscripcion?.activa || data.suscripcion?.documentosRestantes > 0,
        nombreCompleto: `${data.usuario.nombre} ${data.usuario.apellido ?? ""}`.trim(),
        negocioNit: data.negocio?.nit ?? "",
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: "always", // Siempre refrescar al volver
    retry: (failureCount, error) => {
      // No reintentar errores de auth
      if (error.message.includes("401") || error.message.includes("403")) return false;
      return failureCount < 2;
    },
    // Auto-logout si falla 3 veces
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 🎯 Hook específico para estado de suscripción
export const useSuscripcionStatus = () => {
  const { data, ...query } = useUsuarios();
  return {
    ...query,
    // Estados derivados
    esPremium: data?.suscripcion?.activa && data?.suscripcion?.documentosRestantes > 100,
    necesitaRenovar: data?.suscripcion?.activa === false,
    diasRestantes: data?.suscripcion?.fechaExpiracion 
      ? Math.floor((new Date(data.suscripcion.fechaExpiracion).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0,
  };
};
