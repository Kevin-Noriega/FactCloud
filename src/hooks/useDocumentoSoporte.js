import { useState, useEffect, useRef, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export const useDocumentoSoporte = () => {
  const [documentos, setDocumentos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errorCrud, setErrorCrud] = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── Carga inicial ────────────────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const [docsRes, provsRes, prodsRes, cliRes] = await Promise.allSettled([
        axiosClient.get("/DocumentosSoporte"),
        axiosClient.get("/Clientes?esProveedor=true"), 
        axiosClient.get("/Productos"),
        axiosClient.get("/Clientes"),
      ]);

      if (!mountedRef.current) return;

      // allSettled no rechaza — tomamos el valor si fue fulfilled
      setDocumentos(
        docsRes.status === "fulfilled" ? (docsRes.value.data ?? []) : [],
      );
      setProveedores(
        provsRes.status === "fulfilled" ? (provsRes.value.data ?? []) : [],
      );
      setProductos(
        prodsRes.status === "fulfilled" ? (prodsRes.value.data ?? []) : [],
      );
      setClientes(
        cliRes.status === "fulfilled" ? (cliRes.value.data ?? []) : [],
      );

      // Si el endpoint principal falló, propagar el error
      if (docsRes.status === "rejected") {
        throw docsRes.reason;
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al cargar los datos",
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // ── Wrapper CRUD ─────────────────────────────────────────────────
  const ejecutarCrud = useCallback(
    async (fn) => {
      if (!mountedRef.current) return;
      setSaving(true);
      setErrorCrud(null);
      try {
        const result = await fn();
        await cargarDatos();
        return result;
      } catch (err) {
        if (!mountedRef.current) return;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.errors?.[
            Object.keys(err?.response?.data?.errors ?? {})[0]
          ]?.[0] ||
          err?.message ||
          "Error al guardar";
        setErrorCrud(msg);
        throw new Error(msg);
      } finally {
        if (mountedRef.current) setSaving(false);
      }
    },
    [cargarDatos],
  );

  // ── CRUD Documento Soporte ───────────────────────────────────────
  const crearDocumento = (data) =>
    ejecutarCrud(() =>
      axiosClient.post("/DocumentosSoporte", data).then((r) => r.data),
    );

  const actualizarDocumento = (id, data) =>
    ejecutarCrud(() =>
      axiosClient.put(`/DocumentosSoporte/${id}`, data).then((r) => r.data),
    );

  const eliminarDocumento = (id) =>
    ejecutarCrud(() => axiosClient.delete(`/DocumentosSoporte/${id}`));

  const enviarDocumento = (id) =>
    ejecutarCrud(() =>
      axiosClient.post(`/DocumentosSoporte/${id}/enviar`).then((r) => r.data),
    );

  const obtenerDocumento = useCallback(async (id) => {
    try {
      const res = await axiosClient.get(`/DocumentosSoporte/${id}`);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al obtener el documento";
      setErrorCrud(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    // Datos
    documentos,
    proveedores,
    productos,
    clientes,

    // Estados
    loading,
    saving,
    error,
    errorCrud,

    // Acciones
    crearDocumento,
    actualizarDocumento,
    eliminarDocumento,
    enviarDocumento,
    obtenerDocumento,
    recargarDatos: cargarDatos,
    limpiarErrorCrud: () => setErrorCrud(null),
  };
};
