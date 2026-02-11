import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode"; // Instala: npm install jwt-decode

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

      // ✅ Usar el ID que está en localStorage (guardado en el login)
      const userId = usuarioData.id;

      if (!userId) {
        localStorage.removeItem("usuario");
        throw new Error("Sesión expirada. Redirige al login.");
      }

      // 2️⃣ Fetch usuario actualizado desde API usando el ID correcto
      const { data } = await axiosClient.get(`/Usuarios/${userId}`);

      // 3️⃣ Guardar usuario actualizado en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      return {
        ...data,
        tieneSuscripcionActiva: data.suscripcion?.activa ?? false,
        esDemo: !data.suscripcion?.activa,
        documentosRestantes: data.suscripcion?.documentosRestantes ?? 0,
        puedeFacturar:
          data.suscripcion?.activa || data.suscripcion?.documentosRestantes > 0,
        nombreCompleto:
          `${data.usuario.nombre} ${data.usuario.apellido ?? ""}`.trim(),
        negocioNit: data.negocio?.nit ?? "",
      };
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: "always",
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    onError: (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
      }
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useSuscripcionStatus = () => {
  const { data, ...query } = useUsuarios();
  return {
    ...query,
    esPremium:
      data?.suscripcion?.activa && data?.suscripcion?.documentosRestantes > 100,
    necesitaRenovar: data?.suscripcion?.activa === false,
    diasRestantes: data?.suscripcion?.fechaExpiracion
      ? Math.floor(
          (new Date(data.suscripcion.fechaExpiracion).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : 0,
  };
};
