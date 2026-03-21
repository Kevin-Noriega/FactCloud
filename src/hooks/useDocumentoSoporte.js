import { useState, useEffect, useRef, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export const useDocumentoSoporte = () => {

  const [documentos, setDocumentos] = useState([]);  
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState(null);
  const [errorCrud,  setErrorCrud]  = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Carga inicial ────────────────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get("/DocumentosSoporte");

      if (!mountedRef.current) return;

      // Protección: garantiza array sin importar la forma del response
      const data = res?.data ?? res;
      setDocumentos(Array.isArray(data) ? data : data?.items ?? data?.data ?? []);

    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Error al cargar documentos"
      );
      setDocumentos([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // ── Wrapper CRUD ─────────────────────────────────────────────────
  const ejecutarCrud = useCallback(async (fn) => {
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
        err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors ?? {})[0]]?.[0] ||
        err?.message ||
        "Error al guardar";
      setErrorCrud(msg);
      throw new Error(msg);
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }, [cargarDatos]);

  // ── CRUD ─────────────────────────────────────────────────────────
  const crearDocumento = (data) =>
    ejecutarCrud(() =>
      axiosClient.post("/DocumentosSoporte", data).then((r) => r?.data ?? r)
    );

  const actualizarDocumento = (id, data) =>
    ejecutarCrud(() =>
      axiosClient.put(`/DocumentosSoporte/${id}`, data).then((r) => r?.data ?? r)
    );

  const eliminarDocumento = (id) =>
    ejecutarCrud(() =>
      axiosClient.delete(`/DocumentosSoporte/${id}`)
    );

  const enviarDocumento = (id) =>
    ejecutarCrud(() =>
      axiosClient.post(`/DocumentosSoporte/${id}/enviar`).then((r) => r?.data ?? r)
    );

  const obtenerDocumento = useCallback(async (id) => {
    try {
      const res = await axiosClient.get(`/DocumentosSoporte/${id}`);
      return res?.data ?? res;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Error al obtener el documento";
      setErrorCrud(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    documentos,         
    loading,
    saving,
    error,
    errorCrud,
    crearDocumento,
    actualizarDocumento,
    eliminarDocumento,
    enviarDocumento,
    obtenerDocumento,
    recargarDatos:        cargarDatos,
    limpiarErrorCrud:     () => setErrorCrud(null),
  };
};