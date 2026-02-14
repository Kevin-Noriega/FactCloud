import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../api/config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  // Query GET usuario
  const query = useQuery({
    queryKey: ["usuario"],
    queryFn: async () => {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) throw new Error("No hay usuario autenticado");

      const usuarioData = JSON.parse(usuarioGuardado);
      if (!usuarioData?.id) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Sesión expirada");
      }

      const response = await fetch(`${API_URL}/Usuarios/${usuarioData.id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
          throw new Error("Sesión expirada");
        }
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      return {
        ...data,
        tieneSuscripcionActiva: data.suscripcion?.activa ?? false,
        esDemo: !data.suscripcion?.activa,
        documentosRestantes: data.suscripcion?.documentosRestantes ?? 0,
        puedeFacturar: data.suscripcion?.activa || data.suscripcion?.documentosRestantes > 0,
        nombreCompleto: `${data.usuario.nombre} ${data.usuario.apellido ?? ""}`.trim(),
        planNombre: data.usuario.planNombre,
        negocioNit: data.negocio?.nit ?? "",
        fechaDesactivacion: data.fechaDesactivacion
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false, 
  });

  // 🔧 MODIFICAR perfil
  const actualizarPerfil = useMutation({
    mutationFn: async (datos) => {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      const response = await fetch(`${API_URL}/Usuarios/${usuarioGuardado.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Error ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      
      return data;
    },
    onError: (error) => {
      console.error("Error actualizar:", error);
    },
  });

  // 🔧 CAMBIAR estado (activar/desactivar) - CON LOGS
  const cambiarEstado = useMutation({
    mutationFn: async (nuevoEstado) => {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      
      console.log("=== CAMBIAR ESTADO DEBUG ===");
      console.log("1. Usuario localStorage:", usuarioGuardado);
      console.log("2. Usuario ID:", usuarioGuardado.id);
      console.log("3. Nuevo estado:", nuevoEstado);
      console.log("4. URL completa:", `${API_URL}/Usuarios/${usuarioGuardado.id}/estado`);
      console.log("5. Body:", JSON.stringify({ estado: nuevoEstado }));
      
      const response = await fetch(`${API_URL}/Usuarios/${usuarioGuardado.id}/estado`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      console.log("6. Response status:", response.status);
      console.log("7. Response ok:", response.ok);

      // 🔧 Intentar parsear respuesta (incluso si falla)
      const contentType = response.headers.get("content-type");
      let data;
      
      try {
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          console.log("8. Response JSON:", data);
        } else {
          const text = await response.text();
          console.log("8. Response TEXT:", text);
          data = { error: text || "Respuesta no JSON" };
        }
      } catch (parseError) {
        console.error("9. Error parsing response:", parseError);
        data = { error: "No se pudo leer la respuesta" };
      }

      if (!response.ok) {
        console.error("10. ERROR Response:", data);
        throw new Error(data.error || data.mensaje || "Error al cambiar estado");
      }

      // Actualizar localStorage con estructura correcta
      const usuarioActualizado = { 
        ...usuarioGuardado, 
        estado: nuevoEstado,
        fechaDesactivacion: data.fechaDesactivacion || null
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      
      // Invalidar query para refetch
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      
      console.log("11. SUCCESS - Estado actualizado");
      return data;
    },
    onError: (error) => {
      console.error("=== ERROR MUTATION ===");
      console.error("Error completo:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    },
  });

  return {
    // Query
    ...query,
    
    // Mutations
    actualizarPerfil: actualizarPerfil.mutateAsync,
    actualizarPerfilLoading: actualizarPerfil.isPending,
    
    cambiarEstado: cambiarEstado.mutateAsync,
    cambiarEstadoLoading: cambiarEstado.isPending,
    
    // Helpers
    logout: () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    },
  };
};

export const useSuscripcionStatus = () => {
  const { data } = useUsuarios();
  return {
    esPremium: data?.suscripcion?.documentosRestantes > 100,
    necesitaRenovar: !data?.tieneSuscripcionActiva,
    diasRestantes: data?.suscripcion?.fechaExpiracion 
      ? Math.floor((new Date(data.suscripcion.fechaExpiracion) - new Date()) / (1000 * 60 * 60 * 24))
      : 0,
  };
};
