import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/DetalleReporte.css";
import { 
  FiArrowLeft, 
  FiStar, 
  FiSearch, 
  FiCalendar, 
  FiChevronUp, 
  FiDownload, 
  FiFilter,
  FiPrinter
} from "react-icons/fi";

const DetalleReporteVentas = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  
  // Estados para Filtros
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("Este Mes");

  // Datos de ejemplo (Simulación de API)
  const [data, setData] = useState([
    { id: "101", fecha: "2024-04-10", cliente: "Inversiones Lopez S.A.", cantidad: 3, bruto: 1250000, impuestos: 237500, total: 1487500 },
    { id: "102", fecha: "2024-04-12", cliente: "Ferreteria El Clavo", cantidad: 1, bruto: 450000, impuestos: 85500, total: 535500 },
    { id: "103", fecha: "2024-04-15", cliente: "Restaurante Delicias", cantidad: 5, bruto: 3200000, impuestos: 608000, total: 3808000 },
    { id: "104", fecha: "2024-04-18", cliente: "Papeleria Central", cantidad: 2, bruto: 180000, impuestos: 34200, total: 214200 },
    { id: "105", fecha: "2024-04-20", cliente: "TecnoMundo", cantidad: 4, bruto: 5600000, impuestos: 1064000, total: 6664000 },
  ]);

  // Cálculos dinámicos de periodos
  useEffect(() => {
    const hoy = new Date();
    let desde = new Date();
    
    if (periodoSeleccionado === "Este Mes") {
      desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    } else if (periodoSeleccionado === "Año Actual") {
      desde = new Date(hoy.getFullYear(), 0, 1);
    } else if (periodoSeleccionado === "Últimos 3 Meses") {
      desde.setMonth(hoy.getMonth() - 3);
    }

    setFechaDesde(desde.toISOString().split('T')[0]);
    setFechaHasta(hoy.toISOString().split('T')[0]);
  }, [periodoSeleccionado]);

  // Filtrado de datos
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
    );
  }, [data, filtroCliente]);

  // Cálculos de Totales
  const totales = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      bruto: acc.bruto + curr.bruto,
      impuestos: acc.impuestos + curr.impuestos,
      total: acc.total + curr.total,
      cantidad: acc.cantidad + curr.cantidad
    }), { bruto: 0, impuestos: 0, total: 0, cantidad: 0 });
  }, [filteredData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getReportTitle = () => {
    const titles = {
      "ventas-por-cliente": "Ventas por Cliente",
      "ventas-por-producto": "Ventas por Producto",
      "ventas-por-vendedor": "Ventas por Vendedor"
    };
    return titles[reportId] || "Detalle de Reporte";
  };

  return (
    <div className="detalle-reporte-container">
      {/* Navegación Superior */}
      <div className="reporte-header-nav">
        <Link to="/reportes" className="btn-volver">
          <FiArrowLeft /> Volver a Reportes
        </Link>
      </div>

      {/* Título y Acciones */}
      <div className="reporte-title-section">
        <div>
          <h1>{getReportTitle()}</h1>
          <p className="text-muted mt-1">Análisis detallado de movimientos para NUBEE S.A.S</p>
        </div>
        <div className="reporte-actions">
          <button className="btn-report-action"><FiPrinter /> Imprimir</button>
          <button className="btn-report-action btn-report-primary"><FiDownload /> Exportar Excel</button>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="filtros-card">
        <div className="filtros-grid">
          <div className="filter-group">
            <label>Periodo</label>
            <select 
              className="filter-control"
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            >
              <option>Hoy</option>
              <option>Este Mes</option>
              <option>Año Actual</option>
              <option>Últimos 3 Meses</option>
              <option>Personalizado</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Desde</label>
            <input 
              type="date" 
              className="filter-control" 
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Hasta</label>
            <input 
              type="date" 
              className="filter-control" 
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Buscar Cliente</label>
            <div className="position-relative">
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Nombre del cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="tabla-container">
        <table className="nubee-table">
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Cliente</th>
              <th className="text-right">Comprobantes</th>
              <th className="text-right">Valor Bruto</th>
              <th className="text-right">Impuestos</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td><strong>{item.cliente}</strong></td>
                <td className="text-right">{item.cantidad}</td>
                <td className="text-right">{formatCurrency(item.bruto)}</td>
                <td className="text-right">{formatCurrency(item.impuestos)}</td>
                <td className="text-right"><strong>{formatCurrency(item.total)}</strong></td>
              </tr>
            ))}
            {/* Fila de Totales */}
            <tr className="total-row">
              <td colSpan="2">TOTAL GENERAL</td>
              <td className="text-right">{totales.cantidad}</td>
              <td className="text-right">{formatCurrency(totales.bruto)}</td>
              <td className="text-right">{formatCurrency(totales.impuestos)}</td>
              <td className="text-right">{formatCurrency(totales.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleReporteVentas;