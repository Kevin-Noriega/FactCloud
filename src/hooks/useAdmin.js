import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { normalizePlan } from "../utils/plans/normalizePlan";

const handleApiError = (error, fallbackMsg = "Error en la operación") => {
  const msg =
    error?.response?.data?.mensaje ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMsg;
  toast.error(msg);
  throw error;
};

// ════════════════════════════════════════════════════════════
// USUARIOS — admin ve TODOS (usa /Admin/usuarios)
// ════════════════════════════════════════════════════════════
export const useAdminUsuarios = (filtros = {}) => {
  return useQuery({
    queryKey: ["admin", "usuarios", filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
      if (filtros.rol) params.set("rol", filtros.rol);
      if (filtros.estado !== undefined && filtros.estado !== "") params.set("estado", filtros.estado);
      const { data } = await axiosClient.get(`/Admin/usuarios?${params}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminCrearUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/Admin/usuarios", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Usuario creado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al crear usuario"),
  });
};

export const useAdminEditarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await axiosClient.patch(`/Admin/usuarios/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Usuario actualizado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al actualizar usuario"),
  });
};

export const useAdminEliminarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/usuarios/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar usuario"),
  });
};

export const useAdminCambiarEstadoUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }) => {
      const { data } = await axiosClient.patch(`/Admin/usuarios/${id}/estado`, { estado });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Estado de usuario actualizado");
    },
    onError: (err) => handleApiError(err, "Error al cambiar estado"),
  });
};

export const useAdminCambiarRolUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rol }) => {
      const { data } = await axiosClient.patch(`/Admin/usuarios/${id}/rol`, { rol });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Rol actualizado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al cambiar rol"),
  });
};

export const useAdminResetPassword = () => {
  return useMutation({
    mutationFn: async ({ id, nuevaContrasena }) => {
      const { data } = await axiosClient.post(`/Admin/usuarios/${id}/reset-password`, {
        nuevaContrasena,
      });
      return data;
    },
    onSuccess: () => toast.success("Contraseña reseteada correctamente"),
    onError: (err) => handleApiError(err, "Error al resetear contraseña"),
  });
};

// ════════════════════════════════════════════════════════════
// CLIENTES — admin ve TODOS (usa /Admin/clientes)
// ════════════════════════════════════════════════════════════
export const useAdminClientes = (busqueda = "") => {
  return useQuery({
    queryKey: ["admin", "clientes", busqueda],
    queryFn: async () => {
      const params = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
      const { data } = await axiosClient.get(`/Admin/clientes${params}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminEliminarCliente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/clientes/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "clientes"] });
      toast.success("Cliente eliminado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar cliente"),
  });
};

// ════════════════════════════════════════════════════════════
// FACTURAS — admin ve TODAS (usa /Admin/facturas)
// ════════════════════════════════════════════════════════════
export const useAdminFacturas = (filtros = {}) => {
  return useQuery({
    queryKey: ["admin", "facturas", filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtros.estado) params.set("estado", filtros.estado);
      if (filtros.usuarioId) params.set("usuarioId", filtros.usuarioId);
      const { data } = await axiosClient.get(`/Admin/facturas?${params}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminCambiarEstadoFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }) => {
      const { data } = await axiosClient.patch(`/Admin/facturas/${id}/estado`, { estado });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "facturas"] });
      toast.success("Estado de factura actualizado");
    },
    onError: (err) => handleApiError(err, "Error al cambiar estado de factura"),
  });
};

export const useAdminEliminarFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/facturas/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "facturas"] });
      toast.success("Factura eliminada correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar factura"),
  });
};

// ════════════════════════════════════════════════════════════
// PRODUCTOS — admin ve TODOS (usa /Admin/productos)
// ════════════════════════════════════════════════════════════
export const useAdminProductos = (busqueda = "") => {
  return useQuery({
    queryKey: ["admin", "productos", busqueda],
    queryFn: async () => {
      const params = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
      const { data } = await axiosClient.get(`/Admin/productos${params}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminEliminarProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/productos/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "productos"] });
      toast.success("Producto eliminado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar producto"),
  });
};

// ════════════════════════════════════════════════════════════
// PLANES — CRUD completo (usa /Admin/planes)
// ════════════════════════════════════════════════════════════
export const useAdminPlanes = () => {
  return useQuery({
    queryKey: ["admin", "planes"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/Admin/planes");
      return Array.isArray(data) ? data.map(normalizePlan) : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminCrearPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/Admin/planes", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "planes"] });
      qc.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan creado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al crear plan"),
  });
};

export const useAdminEditarPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await axiosClient.put(`/Admin/planes/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "planes"] });
      qc.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan actualizado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al actualizar plan"),
  });
};

export const useAdminEliminarPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/planes/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "planes"] });
      qc.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan eliminado correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar plan"),
  });
};

export const useAdminTogglePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, activo }) => {
      const { data } = await axiosClient.patch(`/Admin/planes/${id}/toggle`, { activo });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "planes"] });
      qc.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Estado del plan actualizado");
    },
    onError: (err) => handleApiError(err, "Error al cambiar estado del plan"),
  });
};

// ════════════════════════════════════════════════════════════
// SUSCRIPCIONES — Admin gestiona TODAS
// ════════════════════════════════════════════════════════════
export const useAdminSuscripciones = (activa) => {
  return useQuery({
    queryKey: ["admin", "suscripciones", activa],
    queryFn: async () => {
      const params = activa !== undefined ? `?activa=${activa}` : "";
      const { data } = await axiosClient.get(`/Admin/suscripciones${params}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminCrearSuscripcion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/Admin/suscripciones", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] });
      qc.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      toast.success("Suscripción creada correctamente");
    },
    onError: (err) => handleApiError(err, "Error al crear suscripción"),
  });
};

export const useAdminCancelarSuscripcion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.patch(`/Admin/suscripciones/${id}/cancelar`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] });
      toast.success("Suscripción cancelada correctamente");
    },
    onError: (err) => handleApiError(err, "Error al cancelar suscripción"),
  });
};

export const useAdminEliminarSuscripcion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/Admin/suscripciones/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] });
      toast.success("Suscripción eliminada correctamente");
    },
    onError: (err) => handleApiError(err, "Error al eliminar suscripción"),
  });
};

// ════════════════════════════════════════════════════════════
// AUDITORÍA
// ════════════════════════════════════════════════════════════
export const useAdminAuditoria = (pagina = 1) => {
  return useQuery({
    queryKey: ["admin", "auditoria", pagina],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/Admin/auditoria?pagina=${pagina}`);
      return data;
    },
    staleTime: 60 * 1000,
  });
};

// ════════════════════════════════════════════════════════════
// ESTADÍSTICAS DEL SISTEMA (usa /Admin/estadisticas)
// ════════════════════════════════════════════════════════════
export const useAdminEstadisticas = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "estadisticas"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/Admin/estadisticas");
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const añoActual = new Date().getFullYear();

  const ventasPorMes = (data?.ventasPorMes ?? []).map((v) => ({
    mes: new Date(añoActual, v.mes - 1).toLocaleString("es-CO", { month: "short" }),
    total: v.total,
    cantidad: v.cantidad,
  }));

  // Completar meses sin datos
  const mesesCompletos = Array.from({ length: 12 }, (_, i) => {
    const mesNombre = new Date(añoActual, i).toLocaleString("es-CO", { month: "short" });
    return ventasPorMes.find((v) => v.mes === mesNombre) ?? { mes: mesNombre, total: 0, cantidad: 0 };
  });

  const ventasPorPlan = (data?.ventasPorPlan ?? []).map((p) => ({
    plan: p.plan,
    cantidad: p.cantidad,
  }));

  const topClientes = (data?.topClientes ?? []).map((c) => ({
    nombre: c.nombre,
    total: c.total,
    count: c.count,
  }));

  const tiposDocumentos = (data?.tiposDocumentos ?? []).map((d) => ({
    tipo: d.tipo,
    cantidad: d.cantidad,
  }));

  const tiposProductos = (data?.tiposProductos ?? []).map((p) => ({
    tipo: p.tipo,
    cantidad: p.cantidad,
  }));

  return {
    loading: isLoading,
    totalUsuarios: data?.usuarios?.total ?? 0,
    usuariosActivos: data?.usuarios?.activos ?? 0,
    totalClientes: data?.negocio?.totalClientes ?? 0,
    totalProductos: data?.negocio?.totalProductos ?? 0,
    suscripcionesActivas: data?.negocio?.suscripcionesActivas ?? 0,
    totalFacturas: data?.facturacion?.totalFacturas ?? 0,
    totalIngresos: data?.facturacion?.totalIngresos ?? 0,
    facturasEmitidas: data?.facturacion?.emitidas ?? 0,
    facturasPendientes: data?.facturacion?.pendientes ?? 0,
    facturasAnuladas: data?.facturacion?.anuladas ?? 0,
    ventasPorMes: mesesCompletos,
    ventasPorPlan,
    topClientes,
    tiposDocumentos,
    tiposProductos,
    actividadReciente: [],
  };
};
