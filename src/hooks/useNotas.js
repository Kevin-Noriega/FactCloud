import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useNotas = () => {
  const [notasCredito, setNotasCredito] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [notasRes, facturasRes, productosRes] = await Promise.all([
        axiosClient.get("/NotasCredito"),
        axiosClient.get("/Facturas"),
        axiosClient.get("/Productos"),
      ]);

      setNotasCredito(notasRes.data);
      setFacturas(facturasRes.data);
      setProductos(productosRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.response?.data?.message || err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearNotaCredito = async (notaData) => {
    const response = await axiosClient.post("/NotasCredito", notaData);
    await cargarDatos(); // Recargar datos
    return response.data;
  };

  const actualizarNotaCredito = async (id, notaData) => {
    const response = await axiosClient.put(`/NotasCredito/${id}`, notaData);
    await cargarDatos(); // Recargar datos
    return response.data;
  };

  const eliminarNotaCredito = async (id) => {
    await axiosClient.delete(`/NotasCredito/${id}`);
    await cargarDatos(); // Recargar datos
  };

  return {
    notasCredito,
    facturas,
    productos,
    loading,
    error,
    crearNotaCredito,
    actualizarNotaCredito,
    eliminarNotaCredito,
    recargarDatos: cargarDatos,
  };
};
