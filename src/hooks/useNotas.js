import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useNotas = () => {

  // ESTADOS
  const [notasCredito, setNotasCredito] = useState([]);
  const [notasDebito, setNotasDebito] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CARGAR TODOS LOS DATOS
  const cargarDatos = async () => {

    try {

      setLoading(true);
      setError(null);

      const [
        notasCreditoRes,
        notasDebitoRes,
        facturasRes,
        productosRes

      ] = await Promise.all([

        axiosClient.get("/NotasCredito"),
        axiosClient.get("/NotasDebito"),
        axiosClient.get("/Facturas"),
        axiosClient.get("/Productos"),

      ]);

      setNotasCredito(notasCreditoRes.data || []);
      setNotasDebito(notasDebitoRes.data || []);
      setFacturas(facturasRes.data || []);
      setProductos(productosRes.data || []);

    } catch (err) {

      console.error("Error al cargar datos:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al cargar datos"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    cargarDatos();
  }, []);


  // ================================
  // CRUD NOTAS CRÉDITO
  // ================================

  const crearNotaCredito = async (notaData) => {

    const response = await axiosClient.post("/NotasCredito", notaData);

    await cargarDatos();

    return response.data;

  };

  const actualizarNotaCredito = async (id, notaData) => {

    const response = await axiosClient.put(`/NotasCredito/${id}`, notaData);

    await cargarDatos();

    return response.data;

  };

  const eliminarNotaCredito = async (id) => {

    await axiosClient.delete(`/NotasCredito/${id}`);

    await cargarDatos();

  };


  // ================================
  // CRUD NOTAS DÉBITO
  // ================================

  const crearNotaDebito = async (notaData) => {

    const response = await axiosClient.post("/NotasDebito", notaData);

    await cargarDatos();

    return response.data;

  };

  const actualizarNotaDebito = async (id, notaData) => {

    const response = await axiosClient.put(`/NotasDebito/${id}`, notaData);

    await cargarDatos();

    return response.data;

  };

  const eliminarNotaDebito = async (id) => {

    await axiosClient.delete(`/NotasDebito/${id}`);

    await cargarDatos();

  };


  // RETORNO DEL HOOK
  return {

    // datos
    notasCredito,
    notasDebito,
    facturas,
    productos,

    // estados
    loading,
    error,

    // crédito
    crearNotaCredito,
    actualizarNotaCredito,
    eliminarNotaCredito,

    // débito
    crearNotaDebito,
    actualizarNotaDebito,
    eliminarNotaDebito,

    // general
    recargarDatos: cargarDatos,

  };

};