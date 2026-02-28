// hooks/useTienda.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

export const useTienda = (options = {}) => {
  const queryClient = useQueryClient();

  // ===========================
  // 📊 QUERY GET - Datos de la tienda
  // ===========================
  const query = useQuery({
    queryKey: ["tienda"],
    queryFn: async () => {
      try {
        console.log("🔍 Cargando datos de la tienda...");

        // Peticiones paralelas con manejo de errores individual
        const [planActualRes, planesRes, addonsRes, estadisticasRes] =
          await Promise.allSettled([
            axiosClient.get("/planes/actual"),
            axiosClient.get("/planes"),
            axiosClient.get("/addons"),
            axiosClient.get("/planes/estadisticas"),
          ]);

        // Planes disponibles (siempre debe funcionar)
        const planesDisponibles = planesRes.status === "fulfilled" 
          ? planesRes.value.data 
          : [];

        // Addons disponibles
        const addonsDisponibles = addonsRes.status === "fulfilled" 
          ? addonsRes.value.data 
          : [];

        // Plan actual (puede fallar si no tiene plan)
        const planActual = planActualRes.status === "fulfilled" 
          ? planActualRes.value.data 
          : null;

        // Estadísticas (puede fallar si no tiene plan)
        const estadisticas = estadisticasRes.status === "fulfilled" 
          ? estadisticasRes.value.data 
          : null;

        console.log("✅ Datos cargados:", {
          planActual,
          totalPlanes: planesDisponibles.length,
          totalAddons: addonsDisponibles.length,
          estadisticas
        });

        // Calcular días restantes
        let diasRestantes = 0;
        if (estadisticas?.fechaFin) {
          diasRestantes = Math.floor(
            (new Date(estadisticas.fechaFin).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          );
        }

        return {
          planActual,
          planesDisponibles,
          addonsDisponibles,
          estadisticas,
          tienePlanActivo: planActual !== null,
          puedeActualizarPlan: planesDisponibles.length > 0,
          necesitaRenovacion: diasRestantes < 7 && diasRestantes > 0,
          diasRestantes: Math.max(0, diasRestantes),
        };
      } catch (error) {
        console.error("❌ Error al cargar datos de la tienda:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ⚠️ NO recargar automáticamente al montar
    retry: 1, // Solo 1 reintento
    retryDelay: 1000,
    enabled: false, // ⚠️ DESHABILITADO POR DEFECTO
    ...options, // Permitir override
  });

  // ===========================
  // 🔄 MUTATION - Cambiar Plan
  // ===========================
  const cambiarPlanMutation = useMutation({
    mutationFn: async ({ planId, periodoAnual }) => {
      const response = await axiosClient.post("/planes/actualizar", {
        planId,
        periodoAnual,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Plan cambiado:", data);
      queryClient.invalidateQueries({ queryKey: ["tienda"] });
    },
    onError: (error) => {
      console.error("❌ Error cambiar plan:", error.response?.data);
    },
  });

  // ===========================
  // ➕ MUTATION - Agregar Addons
  // ===========================
  const agregarAddonsMutation = useMutation({
    mutationFn: async (addonsIds) => {
      if (!addonsIds || addonsIds.length === 0) {
        throw new Error("Debe seleccionar al menos un addon");
      }
      const response = await axiosClient.post("/addons/agregar", {
        addons: addonsIds,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tienda"] });
    },
  });

  return {
    // Query data
    ...query,
    planActual: query.data?.planActual ?? null,
    planesDisponibles: query.data?.planesDisponibles ?? [],
    addonsDisponibles: query.data?.addonsDisponibles ?? [],
    estadisticas: query.data?.estadisticas ?? null,
    
    // Computed
    tienePlanActivo: query.data?.tienePlanActivo ?? false,
    puedeActualizarPlan: query.data?.puedeActualizarPlan ?? false,
    necesitaRenovacion: query.data?.necesitaRenovacion ?? false,
    diasRestantes: query.data?.diasRestantes ?? 0,

    // Mutations
    cambiarPlan: cambiarPlanMutation.mutateAsync,
    cambiarPlanLoading: cambiarPlanMutation.isPending,
    
    agregarAddons: agregarAddonsMutation.mutateAsync,
    agregarAddonsLoading: agregarAddonsMutation.isPending,

    // Helpers
    cargarDatos: query.refetch, // ⚠️ Método manual para cargar datos
  };
};
