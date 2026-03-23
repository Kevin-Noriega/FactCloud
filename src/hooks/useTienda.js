import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

export const useTienda = (options = {}) => {
  const queryClient = useQueryClient();

  // ── Query principal ───────────────────────────────────────────
  const query = useQuery({
    queryKey: ["tienda"],
    queryFn: async () => {
      const [planActualRes, planesRes, addonsRes, estadisticasRes, misAddonsRes] =
        await Promise.allSettled([
          axiosClient.get("/planes/actual"),
          axiosClient.get("/planes"),
          axiosClient.get("/addons"),
          axiosClient.get("/planes/estadisticas"),
          axiosClient.get("/addons/mis-addons"),
        ]);

      const planesDisponibles = planesRes.status === "fulfilled"
        ? planesRes.value.data : [];
      const addonsDisponibles = addonsRes.status === "fulfilled"
        ? addonsRes.value.data : [];
      const planActual = planActualRes.status === "fulfilled"
        ? planActualRes.value.data : null;
      const estadisticas = estadisticasRes.status === "fulfilled"
        ? estadisticasRes.value.data : null;
      const misAddons = misAddonsRes.status === "fulfilled"
        ? misAddonsRes.value.data : [];

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
        misAddons,
        estadisticas,
        tienePlanActivo:     planActual !== null,
        puedeActualizarPlan: planesDisponibles.length > 0,
        necesitaRenovacion:  diasRestantes < 7 && diasRestantes > 0,
        diasRestantes:       Math.max(0, diasRestantes),
      };
    },
    staleTime:            0,
    refetchOnWindowFocus: true,
    refetchOnMount:       true,
    gcTime:               10 * 60 * 1000,
    retry:                1,
    retryDelay:           1000,
    ...options,
  });

  // ── Mutation: cambiar plan ────────────────────────────────────
  const cambiarPlanMutation = useMutation({
    mutationFn: async ({ planId, periodoAnual }) => {
      const res = await axiosClient.post("/planes/actualizar", { planId, periodoAnual });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tienda"] }),
    onError:   (err) => console.error("Error cambiar plan:", err.response?.data),
  });

  // ── Mutation: agregar addons ──────────────────────────────────
  const agregarAddonsMutation = useMutation({
    mutationFn: async (addonsIds) => {
      if (!addonsIds?.length) throw new Error("Selecciona al menos un complemento.");
      const res = await axiosClient.post("/addons/agregar", { addons: addonsIds });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tienda"] }),
    onError: (err) => {
      throw new Error(
        err?.response?.data?.mensaje || err?.message || "Error al agregar complementos."
      );
    },
  });

  // ── Mutation: cancelar addon ──────────────────────────────────
  const cancelarAddonMutation = useMutation({
    mutationFn: async (addonId) => {
      const res = await axiosClient.delete(`/addons/cancelar/${addonId}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tienda"] }),
    onError: (err) => {
      throw new Error(
        err?.response?.data?.mensaje || err?.message || "Error al cancelar complemento."
      );
    },
  });

  return {
    ...query,
    planActual:           query.data?.planActual          ?? null,
    planesDisponibles:    query.data?.planesDisponibles   ?? [],
    addonsDisponibles:    query.data?.addonsDisponibles   ?? [],
    misAddons:            query.data?.misAddons           ?? [],
    estadisticas:         query.data?.estadisticas        ?? null,
    tienePlanActivo:      query.data?.tienePlanActivo     ?? false,
    puedeActualizarPlan:  query.data?.puedeActualizarPlan ?? false,
    necesitaRenovacion:   query.data?.necesitaRenovacion  ?? false,
    diasRestantes:        query.data?.diasRestantes        ?? 0,

    cambiarPlan:          cambiarPlanMutation.mutateAsync,
    cambiarPlanLoading:   cambiarPlanMutation.isPending,
    agregarAddons:        agregarAddonsMutation.mutateAsync,
    agregarAddonsLoading: agregarAddonsMutation.isPending,
    cancelarAddon:        cancelarAddonMutation.mutateAsync,
    cancelarAddonLoading: cancelarAddonMutation.isPending,

    cargarDatos: query.refetch,
  };
};