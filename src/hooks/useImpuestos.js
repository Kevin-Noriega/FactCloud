import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient"; // ← nombre correcto

// ─── Tipos de impuesto disponibles ────────────────────────────────────────
export const TIPOS_IMPUESTO = [
  "IVA",
  "INC",
  "ICA",
  "Retefuente",
  "ReteICA",
  "ReteIVA",
  "Impoconsumo",
  "Ad-Valorem",
  "Comestibles ultraprocesados",
];

const FILA_NUEVA_IMPUESTO = {
  _nueva: true,
  enUso: true,
  codigo: "",
  nombre: "",
  tipoImpuesto: "",
  porValor: false,
  tarifa: "",
  cuentaDebitoVentasId: null,
  cuentaCreditoVentasId: null,
  cuentaDebitoComprasId: null,
  cuentaCreditoComprasId: null,
  cuentaDevolucionVentasId: null,
  cuentaDevolucionComprasId: null,
};

export function useImpuestos() {
  const [impuestos, setImpuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filaNueva, setFilaNueva] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/impuestos");
      setImpuestos(data);
    } catch {
      setError("Error al cargar impuestos.");
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
      await axiosClient.put(`/impuestos/${id}`, { enUso: !valorActual });
      setImpuestos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, enUso: !valorActual } : i)),
      );
    } catch {
      setError("No se pudo actualizar el impuesto.");
    }
  };

  // ── Fila nueva ───────────────────────────────────────────────────────────
  const iniciarFilaNueva = () => setFilaNueva({ ...FILA_NUEVA_IMPUESTO });
  const actualizarFilaNueva = (campo, valor) =>
    setFilaNueva((prev) => ({ ...prev, [campo]: valor }));
  const cancelarFilaNueva = () => setFilaNueva(null);

  // ── Guardar nuevo ────────────────────────────────────────────────────────
  const guardarNuevo = async () => {
    if (!filaNueva.nombre || !filaNueva.tipoImpuesto) {
      setError("Nombre y tipo de impuesto son obligatorios.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        codigo: parseInt(filaNueva.codigo) || impuestos.length + 1,
        nombre: filaNueva.nombre,
        tipoImpuesto: filaNueva.tipoImpuesto,
        tarifa: parseFloat(filaNueva.tarifa) || 0,
        porValor: filaNueva.porValor,
        cuentaDebitoVentasId: filaNueva.cuentaDebitoVentasId || null,
        cuentaCreditoVentasId: filaNueva.cuentaCreditoVentasId || null,
        cuentaDebitoComprasId: filaNueva.cuentaDebitoComprasId || null,
        cuentaCreditoComprasId: filaNueva.cuentaCreditoComprasId || null,
        cuentaDevolucionVentasId: filaNueva.cuentaDevolucionVentasId || null,
        cuentaDevolucionComprasId: filaNueva.cuentaDevolucionComprasId || null,
      };
      const { data } = await axiosClient.post("/impuestos", payload);
      setImpuestos((prev) => [...prev, data]);
      setFilaNueva(null);
    } catch (e) {
      setError(e.response?.data?.message || "Error al guardar el impuesto.");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este impuesto?")) return;
    try {
      await axiosClient.delete(`/impuestos/${id}`);
      setImpuestos((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "No se pudo eliminar.");
    }
  };

  return {
    impuestos,
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
