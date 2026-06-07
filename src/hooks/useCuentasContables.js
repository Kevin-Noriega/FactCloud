// hooks/useCuentasContables.js
import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";

// Categorías base del PUC en Colombia

export const CATEGORIAS_PUC = [
  {
    codigo: "1",
    nombre: "ACTIVO",
    descripcion: "Recursos controlados por la empresa",
    tarifas: [],
  },
  {
    codigo: "2",
    nombre: "PASIVO",
    descripcion: "Obligaciones presentes de la empresa",
    tarifas: [],
  },
  {
    codigo: "3",
    nombre: "PATRIMONIO",
    descripcion: "Interés residual en los activos",
    tarifas: [],
  },
  {
    codigo: "4",
    nombre: "INGRESOS",
    descripcion: "Incrementos en beneficios económicos",
    tarifas: [],
  },
  {
    codigo: "5",
    nombre: "GASTOS",
    descripcion: "Decrementos en beneficios económicos",
    tarifas: [],
  },
  {
    codigo: "6",
    nombre: "COSTOS DE VENTAS",
    descripcion: "Costo de los bienes vendidos",
    tarifas: [],
  },
  {
    codigo: "7",
    nombre: "COSTOS DE PRODUCCIÓN U OPERACIÓN",
    descripcion: "Costos del proceso productivo",
    tarifas: [],
  },
  {
    codigo: "8",
    nombre: "CUENTAS DE ORDEN DEUDORAS",
    descripcion: "Cuentas contingentes deudoras",
    tarifas: [],
  },
  {
    codigo: "9",
    nombre: "CUENTAS DE ORDEN ACREEDORAS",
    descripcion: "Cuentas contingentes acreedoras",
    tarifas: [],
  },
];
// Devuelve la etiqueta del nivel jerárquico según la longitud numérica del código PUC
export function labelNivel(codigo = "") {
  const n = String(codigo).replace(/\D/g, "").length;

  switch (n) {
    case 1:
      return "Clase";
    case 2:
      return "Grupo";
    case 4:
      return "Cuenta";
    case 6:
      return "Subcuenta";
    default:
      return "Auxiliar";
  }
}

export function useCuentasContables() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosClient.get("/cuentascontables", {
        params: filtros,
      });

      setCuentas(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        e.response?.data?.message || "Error al cargar cuentas contables",
      );
      setCuentas([]);
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
    setError(null);

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
    setError(null);

    try {
      await axiosClient.delete(`/cuentascontables/${id}`);
      setCuentas((prev) => prev.filter((c) => c.id !== id));

      setSeleccionada((prev) => (prev?.id === id ? null : prev));
    } catch (e) {
      setError(e.response?.data?.message || "No se puede eliminar esta cuenta");
    }
  };

  const exportarExcel = async () => {
    try {
      const { data } = await axiosClient.get("/cuentascontables/exportar", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cuentas-contables.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.response?.data?.message || "Error al exportar a Excel");
    }
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

// Convierte lista plana en árbol por codigoPadre
function buildTree(lista = []) {
  const map = {};

  lista.forEach((c) => {
    if (!c?.codigo) return;
    map[c.codigo] = { ...c, hijos: [] };
  });

  const raices = [];

  lista.forEach((c) => {
    if (!c?.codigo) return;

    if (c.codigoPadre && map[c.codigoPadre]) {
      map[c.codigoPadre].hijos.push(map[c.codigo]);
    } else {
      raices.push(map[c.codigo]);
    }
  });

  return raices;
}
