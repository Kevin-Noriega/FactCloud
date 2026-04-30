import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient"; // ← nombre correcto

export const TIPOS_AUTORETENCION = ["Autoretención 2201", "Autoretención ICA"];

const FILA_NUEVA = {
  _nueva: true,
  enUso: true,
  codigo: "",
  nombre: "",
  tipoAutoretencion: "Autoretención 2201",
  tarifa: "",
  cuentaDebitoId: null,
  cuentaCreditoId: null,
};

export function useAutorretenciones() {
  const [autorretenciones, setAutorretenciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filaNueva, setFilaNueva] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/autorretenciones");
      setAutorretenciones(data);
    } catch {
      setError("Error al cargar autoretenciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ── Toggle "En uso" ──────────────────────────────────────────────────────
  const toggleEnUso = async (id, valorActual) => {
    try {
      await axiosClient.put(`/autorretenciones/${id}`, { enUso: !valorActual });
      setAutorretenciones((prev) =>
        prev.map((a) => (a.id === id ? { ...a, enUso: !valorActual } : a)),
      );
    } catch {
      setError("No se pudo actualizar.");
    }
  };

  // ── Fila nueva ───────────────────────────────────────────────────────────
  const iniciarFilaNueva = () => setFilaNueva({ ...FILA_NUEVA });
  const actualizarFilaNueva = (campo, valor) =>
    setFilaNueva((prev) => ({ ...prev, [campo]: valor }));
  const cancelarFilaNueva = () => setFilaNueva(null);

  // ── Guardar nuevo ────────────────────────────────────────────────────────
  const guardarNuevo = async () => {
    if (!filaNueva.nombre || !filaNueva.tarifa) {
      setError("Nombre y tarifa son obligatorios.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        codigo: parseInt(filaNueva.codigo) || autorretenciones.length + 1,
        nombre: filaNueva.nombre,
        tipoAutoretencion: filaNueva.tipoAutoretencion,
        tarifa: parseFloat(filaNueva.tarifa),
        cuentaDebitoId: filaNueva.cuentaDebitoId || null,
        cuentaCreditoId: filaNueva.cuentaCreditoId || null,
      };
      const { data } = await axiosClient.post("/autorretenciones", payload);
      setAutorretenciones((prev) => [...prev, data]);
      setFilaNueva(null);
    } catch (e) {
      setError(e.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta autorretención?")) return;
    try {
      await axiosClient.delete(`/autorretenciones/${id}`);
      setAutorretenciones((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "No se pudo eliminar.");
    }
  };

  return {
    autorretenciones,
    loading,
    error,
    saving,
    filaNueva,
    toggleEnUso,
    iniciarFilaNueva,
    actualizarFilaNueva,
    cancelarFilaNueva,
    guardarNuevo,
    eliminar,
    setError,
  };
}
