// src/hooks/useNotas.js — agregar clientes al hook
import { useState, useEffect, useRef, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export const useNotas = () => {
  const [notasCredito, setNotasCredito] = useState([]);
  const [notasDebito, setNotasDebito] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]); // ✅ NUEVO

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

  const cargarDatos = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const [ncRes, ndRes, facRes, proRes, cliRes] = await Promise.all([
        axiosClient.get("/NotaCredito"),
        axiosClient.get("/NotasDebito"),
        axiosClient.get("/Facturas"),
        axiosClient.get("/Productos"),
        axiosClient.get("/Clientes"),
      ]);
      if (!mountedRef.current) return;
      setNotasCredito(ncRes.data ?? []);
      setNotasDebito(ndRes.data ?? []);
      setFacturas(facRes.data ?? []);
      setProductos(proRes.data ?? []);
      setClientes(cliRes.data ?? []); // ✅ NUEVO
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err.response?.data?.message || err.message || "Error al cargar datos",
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const ejecutarCrud = useCallback(
    async (fn) => {
      setSaving(true);
      setErrorCrud(null);
      try {
        const result = await fn();
        await cargarDatos();
        return result;
      } catch (err) {
        if (!mountedRef.current) return;
        const msg =
          err.response?.data?.message || err.message || "Error al guardar";
        setErrorCrud(msg);
        throw new Error(msg);
      } finally {
        if (mountedRef.current) setSaving(false);
      }
    },
    [cargarDatos],
  );

  const crearNotaCredito = (d) =>
    ejecutarCrud(() =>
      axiosClient.post("/NotasCredito", d).then((r) => r.data),
    );
  const actualizarNotaCredito = (id, d) =>
    ejecutarCrud(() =>
      axiosClient.put(`/NotasCredito/${id}`, d).then((r) => r.data),
    );
  const eliminarNotaCredito = (id) =>
    ejecutarCrud(() => axiosClient.delete(`/NotasCredito/${id}`));

  const crearNotaDebito = (d) =>
    ejecutarCrud(() => axiosClient.post("/NotasDebito", d).then((r) => r.data));
  const actualizarNotaDebito = (id, d) =>
    ejecutarCrud(() =>
      axiosClient.put(`/NotasDebito/${id}`, d).then((r) => r.data),
    );
  const eliminarNotaDebito = (id) =>
    ejecutarCrud(() => axiosClient.delete(`/NotasDebito/${id}`));

  return {
    notasCredito,
    notasDebito,
    facturas,
    productos,
    clientes, // ✅ NUEVO
    loading,
    saving,
    error,
    errorCrud,
    limpiarErrorCrud: () => setErrorCrud(null),
    crearNotaCredito,
    actualizarNotaCredito,
    eliminarNotaCredito,
    crearNotaDebito,
    actualizarNotaDebito,
    eliminarNotaDebito,
    recargarDatos: cargarDatos,
  };
};
