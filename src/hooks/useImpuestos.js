// src/hooks/useImpuestos.js
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO DIAN / FE
// ═══════════════════════════════════════════════════════════════

export const TIPOS_IMPUESTO = [
  {
    codigo: "01",
    nombre: "IVA",
    descripcion: "Impuesto sobre las Ventas",
    tarifas: [
      { codigoTarifa: "19", nombre: "IVA General", porcentaje: 19 },
      { codigoTarifa: "05", nombre: "IVA Reducido", porcentaje: 5 },
      { codigoTarifa: "00", nombre: "IVA Excluido/Exento", porcentaje: 0 },
    ],
  },
  {
    codigo: "03",
    nombre: "ICA",
    descripcion: "Impuesto de Industria, Comercio y Aviso",
    tarifas: [
      { codigoTarifa: "0.966", nombre: "ICA 0.966%", porcentaje: 0.966 },
      { codigoTarifa: "0.414", nombre: "ICA 0.414%", porcentaje: 0.414 },
    ],
  },
  {
    codigo: "04",
    nombre: "INC",
    descripcion: "Impuesto Nacional al Consumo",
    tarifas: [
      { codigoTarifa: "08", nombre: "INC General 8%", porcentaje: 8 },
      { codigoTarifa: "04", nombre: "INC Restaurantes 4%", porcentaje: 4 },
      { codigoTarifa: "00", nombre: "INC 0%", porcentaje: 0 },
    ],
  },
  {
    codigo: "05",
    nombre: "ReteIVA",
    descripcion: "Retención sobre IVA",
    tarifas: [{ codigoTarifa: "15", nombre: "ReteIVA 15%", porcentaje: 15 }],
  },
  {
    codigo: "06",
    nombre: "ReteFuente",
    descripcion: "Retención en la fuente",
    tarifas: [
      { codigoTarifa: "2.5", nombre: "Servicios 2.5%", porcentaje: 2.5 },
      { codigoTarifa: "3.5", nombre: "Compras 3.5%", porcentaje: 3.5 },
      { codigoTarifa: "11", nombre: "Honorarios 11%", porcentaje: 11 },
    ],
  },
  {
    codigo: "07",
    nombre: "ReteICA",
    descripcion: "Retención de ICA",
    tarifas: [
      { codigoTarifa: "0.966", nombre: "ReteICA 0.966%", porcentaje: 0.966 },
      { codigoTarifa: "0.414", nombre: "ReteICA 0.414%", porcentaje: 0.414 },
    ],
  },
];

export const TIPOS_IMPUESTO_OPTIONS = TIPOS_IMPUESTO.map((x) => ({
  value: x.codigo,
  label: `${x.codigo} - ${x.nombre}`,
  nombre: x.nombre,
  descripcion: x.descripcion,
  tarifas: x.tarifas,
}));

export const getTipoImpuestoByCodigo = (codigo) =>
  TIPOS_IMPUESTO.find((x) => x.codigo === codigo) || null;

export const getNombreTipoImpuesto = (codigo) =>
  getTipoImpuestoByCodigo(codigo)?.nombre || codigo || "";

export const getTarifasPorTipo = (codigo) =>
  getTipoImpuestoByCodigo(codigo)?.tarifas || [];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const normalizarNumero = (valor, fallback = 0) => {
  if (valor === null || valor === undefined || valor === "") return fallback;
  const n = Number(valor);
  return Number.isNaN(n) ? fallback : n;
};

const crearFilaNueva = () => ({
  enUso: true,
  codigo: "",
  nombre: "",
  tipoImpuesto: "",
  porValor: false,
  tarifa: "",
  cuentaDebitoVentasId: null,
  cuentaCreditoComprasId: null,
  cuentaDevolucionVentasId: null,
  cuentaDevolucionComprasId: null,
  cuentaDebitoVentasObj: null,
  cuentaCreditoComprasObj: null,
  cuentaDevolucionVentasObj: null,
  cuentaDevolucionComprasObj: null,
});

const mapImpuestoDesdeApi = (imp) => ({
  ...imp,
  tipoImpuestoNombre: getNombreTipoImpuesto(imp.tipoImpuesto),
});

const construirPayload = (fila) => ({
  enUso: !!fila.enUso,
  codigo: String(fila.codigo || "").trim(),
  nombre: String(fila.nombre || "").trim(),
  tipoImpuesto: String(fila.tipoImpuesto || "").trim(),
  porValor: !!fila.porValor,
  tarifa: normalizarNumero(fila.tarifa, 0),
  cuentaDebitoVentasId: fila.cuentaDebitoVentasId ?? null,
  cuentaCreditoComprasId: fila.cuentaCreditoComprasId ?? null,
  cuentaDevolucionVentasId: fila.cuentaDevolucionVentasId ?? null,
  cuentaDevolucionComprasId: fila.cuentaDevolucionComprasId ?? null,
});

// ═══════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function useImpuestos() {
  const [impuestos, setImpuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [filaNueva, setFilaNueva] = useState(null);

  // ── Cargar lista ─────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosClient.get("/impuestos");
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      setImpuestos(items.map(mapImpuestoDesdeApi));
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando impuestos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ── Crear fila nueva ─────────────────────────────────────────
  const iniciarFilaNueva = useCallback(() => {
    setError(null);
    setFilaNueva(crearFilaNueva());
  }, []);

  const cancelarFilaNueva = useCallback(() => {
    setFilaNueva(null);
  }, []);

  const actualizarFilaNueva = useCallback((campo, valor) => {
    setFilaNueva((prev) => {
      if (!prev) return prev;

      const next = { ...prev, [campo]: valor };

      if (campo === "tipoImpuesto") {
        const tipo = getTipoImpuestoByCodigo(valor);

        if (tipo) {
          if (!next.nombre?.trim()) {
            next.nombre = tipo.nombre;
          }

          if (next.tarifa === "" && tipo.tarifas?.length === 1) {
            next.tarifa = tipo.tarifas[0].porcentaje;
          }
        }
      }

      return next;
    });
  }, []);

  // ── Validaciones ─────────────────────────────────────────────
  const validarFilaNueva = useCallback((fila) => {
    if (!fila) return "No hay datos para guardar.";
    if (!String(fila.codigo || "").trim()) return "El código es obligatorio.";
    if (!String(fila.nombre || "").trim()) return "El nombre es obligatorio.";
    if (!String(fila.tipoImpuesto || "").trim())
      return "Debes seleccionar un tipo de impuesto.";

    if (fila.tarifa !== "" && Number.isNaN(Number(fila.tarifa))) {
      return "La tarifa debe ser numérica.";
    }

    return null;
  }, []);

  // ── Guardar nuevo ────────────────────────────────────────────
  const guardarNuevo = useCallback(async () => {
    const msg = validarFilaNueva(filaNueva);
    if (msg) {
      setError(msg);
      return { ok: false, error: msg };
    }

    setSaving(true);
    setError(null);

    try {
      const payload = construirPayload(filaNueva);
      const { data } = await axiosClient.post("/impuestos", payload);

      setImpuestos((prev) => [...prev, mapImpuestoDesdeApi(data)]);
      setFilaNueva(null);

      return { ok: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Error guardando el impuesto.";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, [filaNueva, validarFilaNueva]);

  // ── Activar / desactivar ─────────────────────────────────────
  const toggleEnUso = useCallback(async (id, enUsoActual) => {
    setError(null);

    try {
      await axiosClient.patch(`/impuestos/${id}/activar`, !enUsoActual);

      setImpuestos((prev) =>
        prev.map((x) => (x.id === id ? { ...x, enUso: !enUsoActual } : x)),
      );

      return { ok: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || "No se pudo cambiar el estado.";
      setError(msg);
      return { ok: false, error: msg };
    }
  }, []);

  // ── Eliminar ─────────────────────────────────────────────────
  const eliminar = useCallback(async (id) => {
    if (!window.confirm("¿Deseas eliminar este impuesto?")) {
      return { ok: false, cancelled: true };
    }

    setSaving(true);
    setError(null);

    try {
      await axiosClient.delete(`/impuestos/${id}`);
      setImpuestos((prev) => prev.filter((x) => x.id !== id));
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Error eliminando impuesto.";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  // ── Utilidades para UI ───────────────────────────────────────
  const impuestosActivos = useMemo(
    () => impuestos.filter((x) => x.enUso),
    [impuestos],
  );

  return {
    impuestos,
    impuestosActivos,
    loading,
    saving,
    error,
    setError,

    filaNueva,
    iniciarFilaNueva,
    actualizarFilaNueva,
    cancelarFilaNueva,
    guardarNuevo,

    toggleEnUso,
    eliminar,
    recargar: cargar,

    tiposImpuesto: TIPOS_IMPUESTO,
    tiposImpuestoOptions: TIPOS_IMPUESTO_OPTIONS,
    getTipoImpuestoByCodigo,
    getNombreTipoImpuesto,
    getTarifasPorTipo,
  };
}
