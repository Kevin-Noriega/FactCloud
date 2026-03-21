import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

export const useTienda = (options = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tienda"],
    queryFn: async () => {
      const [planActualRes, planesRes, addonsRes, estadisticasRes] =
        await Promise.allSettled([
          axiosClient.get("/planes/actual"),
          axiosClient.get("/planes"),
          axiosClient.get("/addons"),
          axiosClient.get("/planes/estadisticas"),
        ]);

      const planesDisponibles = planesRes.status === "fulfilled"
        ? planesRes.value.data : [];

      const addonsDisponibles = addonsRes.status === "fulfilled"
        ? addonsRes.value.data : [];

      const planActual = planActualRes.status === "fulfilled"
        ? planActualRes.value.data : null;

      const estadisticas = estadisticasRes.status === "fulfilled"
        ? estadisticasRes.value.data : null;

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
        tienePlanActivo:    planActual !== null,
        puedeActualizarPlan: planesDisponibles.length > 0,
        necesitaRenovacion: diasRestantes < 7 && diasRestantes > 0,
        diasRestantes:      Math.max(0, diasRestantes),
      };
    },

    // ── Corrección principal ──────────────────────────────────────
    // staleTime: 0 → los datos se consideran desactualizados siempre,
    // así refetch() trae números reales cada vez.
    staleTime: 0,

    // Recargar cuando el usuario vuelve a la pestaña/ventana —
    // esto actualiza el conteo si creó docs en otra página.
    refetchOnWindowFocus: true,

    // Recargar al montar el componente — necesario para que al
    // navegar de vuelta a /tienda los números estén frescos.
    refetchOnMount: true,

    gcTime:  10 * 60 * 1000,
    retry:   1,
    retryDelay: 1000,
    ...options,
  });

  // ── Mutation: cambiar plan ────────────────────────────────────────
  const cambiarPlanMutation = useMutation({
    mutationFn: async ({ planId, periodoAnual }) => {
      const res = await axiosClient.post("/planes/actualizar", { planId, periodoAnual });
      return res.data;
    },
    onSuccess: () => {
      // Invalida y recarga inmediatamente con datos frescos
      queryClient.invalidateQueries({ queryKey: ["tienda"] });
    },
    onError: (err) => {
      console.error("Error cambiar plan:", err.response?.data);
    },
  });

  // ── Mutation: agregar addons ──────────────────────────────────────
  const agregarAddonsMutation = useMutation({
    mutationFn: async (addonsIds) => {
      if (!addonsIds?.length) throw new Error("Debe seleccionar al menos un addon");
      const res = await axiosClient.post("/addons/agregar", { addons: addonsIds });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tienda"] });
    },
  });

  return {
    ...query,
    planActual:          query.data?.planActual          ?? null,
    planesDisponibles:   query.data?.planesDisponibles   ?? [],
    addonsDisponibles:   query.data?.addonsDisponibles   ?? [],
    estadisticas:        query.data?.estadisticas        ?? null,
    tienePlanActivo:     query.data?.tienePlanActivo     ?? false,
    puedeActualizarPlan: query.data?.puedeActualizarPlan ?? false,
    necesitaRenovacion:  query.data?.necesitaRenovacion  ?? false,
    diasRestantes:       query.data?.diasRestantes        ?? 0,

    cambiarPlan:         cambiarPlanMutation.mutateAsync,
    cambiarPlanLoading:  cambiarPlanMutation.isPending,
    agregarAddons:       agregarAddonsMutation.mutateAsync,
    agregarAddonsLoading: agregarAddonsMutation.isPending,

    cargarDatos: query.refetch,
  };
};