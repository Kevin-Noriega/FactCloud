import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useDashboard = (añoSeleccionado = new Date().getFullYear()) => {
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [facturasCount, setFacturasCount] = useState(0);
  const [facturasPendientes, setFacturasPendientes] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [añosDisponibles, setAñosDisponibles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resClientes, resProductos, resFacturas] = await Promise.all([
        axiosClient.get("/clientes"),
        axiosClient.get("/productos"),
        axiosClient.get("/facturas"),
      ]);

      const clientes = resClientes.data;
      const productos = resProductos.data;
      const facturasData = resFacturas.data;

      setFacturas(facturasData);

      setClientesCount(clientes.length);
      setProductosCount(productos.length);
      setFacturasCount(facturasData.length);

      const pendientes = facturasData.filter(
        (f) => f.estado === "Pendiente" || f.estado === "Emitida"
      ).length;
      setFacturasPendientes(pendientes);

      const total = facturasData.reduce((sum, f) => sum + (f.totalFactura || 0), 0);
      setTotalVentas(total);

      const años = calcularAñosDisponibles(facturasData);
      setAñosDisponibles(años);

      const ventasAgrupadas = agruparPorMesYAño(facturasData, añoSeleccionado);
      setVentasPorMes(ventasAgrupadas);

    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [añoSeleccionado]);

  const recargarDatos = () => {
    cargarDatos();
  };

  return {
    clientesCount,
    productosCount,
    facturasCount,
    facturasPendientes,
    totalVentas,
    ventasPorMes,
    facturas,
    añosDisponibles, 
    loading,
    error,
    recargarDatos,
  };
};


const calcularAñosDisponibles = (facturas) => {
  if (!facturas || facturas.length === 0) {
    return [new Date().getFullYear()];
  }

  const añosSet = new Set();

  facturas.forEach((factura) => {
    if (!factura.fechaEmision) return;

    const fechaNormalizada = factura.fechaEmision.replace(" ", "T");
    const fecha = new Date(fechaNormalizada);

    if (!isNaN(fecha.getTime())) {
      añosSet.add(fecha.getFullYear());
    }
  });

  const añosArray = Array.from(añosSet).sort((a, b) => a - b);

  if (añosArray.length > 0) {
    const añoMinimo = Math.min(...añosArray);
    const añoMaximo = Math.max(...añosArray);
    
    const rangoCompleto = [];
    for (let año = añoMinimo; año <= añoMaximo; año++) {
      rangoCompleto.push(año);
    }
    
    return rangoCompleto;
  }

  return [new Date().getFullYear()];
};

const agruparPorMesYAño = (facturas, añoSeleccionado) => {
  const meses = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0,
  };

  facturas.forEach((f) => {
    if (!f.fechaEmision) return;

    const fechaNormalizada = f.fechaEmision.replace(" ", "T");
    const fecha = new Date(fechaNormalizada);

    if (isNaN(fecha.getTime())) {
      console.warn("Fecha inválida:", f.fechaEmision);
      return;
    }

    const year = fecha.getFullYear();
    const month = fecha.getMonth();

    if (year === añoSeleccionado) {
      meses[month] += f.totalFactura || 0;
    }
  });

  return Object.keys(meses).map((mesIndex) => {
    const fecha = new Date(añoSeleccionado, parseInt(mesIndex));

    return {
      mes: fecha.toLocaleString("es-CO", { month: "short" }).replace(".", ""),
      mesCompleto: fecha.toLocaleString("es-CO", { month: "long" }),
      mesNumero: parseInt(mesIndex) + 1,
      total: meses[mesIndex],
    };
  });
};
