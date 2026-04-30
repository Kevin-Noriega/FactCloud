// hooks/useCuentasContables.js
import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export function useCuentasContables() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async (filtros = {}) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/cuentascontables", {
        params: filtros,
      });
      setCuentas(data);
    } catch (e) {
      setError("Error al cargar cuentas contables");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Construye árbol jerárquico desde lista plana
  const arbol = buildTree(cuentas);

  const guardar = async (dto) => {
    setSaving(true);
    try {
      if (dto.id) {
        const { data } = await axiosClient.put(
          `/cuentascontables/${dto.id}`,
          dto,
        );
        setCuentas((prev) => prev.map((c) => (c.id === dto.id ? data : c)));
        setSeleccionada(data);
      } else {
        const { data } = await axiosClient.post("/cuentascontables", dto);
        setCuentas((prev) => [...prev, data]);
        setSeleccionada(data);
      }
      return true;
    } catch (e) {
      setError(e.response?.data?.message || "Error al guardar");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/cuentascontables/${id}`);
      setCuentas((prev) => prev.filter((c) => c.id !== id));
      setSeleccionada(null);
    } catch (e) {
      setError(e.response?.data?.message || "No se puede eliminar esta cuenta");
    }
  };

  const exportarExcel = async () => {
    const { data } = await axiosClient.get("/cuentascontables/exportar", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuentas-contables.xlsx";
    a.click();
  };

  return {
    cuentas,
    arbol,
    loading,
    error,
    seleccionada,
    setSeleccionada,
    saving,
    guardar,
    eliminar,
    exportarExcel,
    recargar: cargar,
    setError,
  };
}

// Convierte lista plana en árbol por CodigoPadre
function buildTree(lista) {
  const map = {};
  lista.forEach((c) => {
    map[c.codigo] = { ...c, hijos: [] };
  });
  const raices = [];
  lista.forEach((c) => {
    if (c.codigoPadre && map[c.codigoPadre]) {
      map[c.codigoPadre].hijos.push(map[c.codigo]);
    } else {
      raices.push(map[c.codigo]);
    }
  });
  return raices;
}
