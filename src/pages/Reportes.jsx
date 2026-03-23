import React, { useState, useEffect } from "react";
import { API_URL } from "../api/config";
import "../styles/Reportes.css";
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiTrendingUp,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPieChart,
} from "react-icons/fi";

function Reportes() {
  // Estados de Navegación
  const [activeSection, setActiveSection] = useState("dashboard"); // dashboard, ventas, clientes, productos, impuestos
  
  // Estados de Filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  // Estados de Datos
  const [datosVentas, setDatosVentas] = useState(null);
  const [topClientes, setTopClientes] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Helper para descargar CSV
  const descargarCsv = (ruta, nombreArchivo) => {
    fetch(`${API_URL}${ruta}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error CSV:", err);
        alert("No se pudo descargar el reporte.");
      });
  };

  // Cargar Datos (Simulado o API dependiendo de la sección)
  const fetchReporteGeneral = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/Facturas/Reportes/Ventas`;
      if (fechaInicio || fechaFin) {
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin) params.append("fechaFin", fechaFin);
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error cargando reporte general");
      const data = await res.json();
      setDatosVentas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/Facturas/Reportes/TopClientes?top=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTopClientes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/Facturas/Reportes/ProductosMasVendidos?top=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTopProductos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "dashboard" || activeSection === "ventas") fetchReporteGeneral();
    if (activeSection === "clientes") fetchTopClientes();
    if (activeSection === "productos") fetchTopProductos();
  }, [activeSection]);

  // Renderizado Condicional de Secciones
  const renderDashboard = () => (
    <div className="section-dashboard">
      <div className="reportes-header">
        <div className="reportes-title-group">
          <h2 className="reportes-title">Resumen Ejecutivo</h2>
        </div>
      </div>

      {datosVentas && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon blue"><FiFileText /></div>
            <div className="kpi-info">
              <span className="kpi-label">Facturas Emitidas</span>
              <span className="kpi-value">{datosVentas.totalFacturas}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon green"><FiCheckCircle /></div>
            <div className="kpi-info">
              <span className="kpi-label">Cobros Realizados</span>
              <span className="kpi-value">${datosVentas.totalVentasPagadas.toLocaleString("es-CO")}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon orange"><FiClock /></div>
            <div className="kpi-info">
              <span className="kpi-label">Por Recaudar</span>
              <span className="kpi-value">${datosVentas.totalVentasPendientes.toLocaleString("es-CO")}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon cyan"><FiTrendingUp /></div>
            <div className="kpi-info">
              <span className="kpi-label">Ventas Totales</span>
              <span className="kpi-value">${datosVentas.totalVentas.toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mini tabla o gráfico en dashboard si hubiera... */}
      <div className="data-table-card">
         <div className="table-header">
           <h3 className="table-title"><FiPieChart /> Estado de Cartera</h3>
         </div>
         <div className="p-4 text-muted text-center">
            Próximamente: Gráficos dinámicos de ventas mensuales.
         </div>
      </div>
    </div>
  );

  const renderVentas = () => (
    <div className="section-ventas">
      <div className="reportes-header">
        <div className="reportes-title-group">
          <h2 className="reportes-title">Detalle de Ventas</h2>
        </div>
      </div>

      <div className="reportes-filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <label><FiCalendar /> Fecha Inicio</label>
            <input type="date" className="filter-input" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><FiCalendar /> Fecha Fin</label>
            <input type="date" className="filter-input" value={fechaFin} onChange={e=>setFechaFin(e.target.value)} />
          </div>
          <button className="btn-filter" onClick={fetchReporteGeneral}><FiFilter /> Filtrar</button>
        </div>
      </div>

      {datosVentas && (
        <div className="data-table-card">
          <div className="table-header">
            <h3 className="table-title">Histórico de Documentos</h3>
            <button className="btn-export" onClick={() => descargarCsv("/reportes/ventas/csv", "ReporteVentas.csv")}>
              <FiDownload /> Descargar Excel
            </button>
          </div>
          <div className="reportes-table-wrapper">
            <table className="reportes-table">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th className="text-right">Monto Total</th>
                  <th className="text-center">Estado</th>
                  <th>Pago</th>
                </tr>
              </thead>
              <tbody>
                {datosVentas.facturas.map(f => (
                  <tr key={f.id}>
                    <td className="fw-bold">{f.numeroFactura}</td>
                    <td>{new Date(f.fechaEmision).toLocaleDateString()}</td>
                    <td>{f.cliente?.nombre} {f.cliente?.apellido}</td>
                    <td className="text-right fw-bold text-primary">${f.totalFactura.toLocaleString()}</td>
                    <td className="text-center">
                      <span className={`badge-status ${f.estado === "Pagada" ? "success" : "warning"}`}>
                        {f.estado}
                      </span>
                    </td>
                    <td>{f.medioPago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderClientes = () => (
    <div className="section-clientes">
      <div className="reportes-header">
        <h2 className="reportes-title">Ventas por Cliente</h2>
      </div>

      <div className="data-table-card">
        <div className="table-header">
          <h3 className="table-title">Ranking de Compras Clientes</h3>
          <button className="btn-export" onClick={() => descargarCsv("/reportes/top-clientes/csv", "VentasPorCliente.csv")}>
            <FiDownload /> Exportar Excel
          </button>
        </div>
        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th style={{width: "60px"}}>Pos.</th>
                <th>Nombre del Cliente</th>
                <th className="text-center">Operaciones</th>
                <th className="text-right">Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((c, idx) => (
                <tr key={idx}>
                  <td><div className="rank-badge">{idx + 1}</div></td>
                  <td className="fw-bold">{c.nombreCliente}</td>
                  <td className="text-center">{c.totalFacturas}</td>
                  <td className="text-right fw-bold text-success">${c.totalCompras.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProductos = () => (
    <div className="section-productos">
      <div className="reportes-header">
        <h2 className="reportes-title">Rotación de Productos</h2>
      </div>

      <div className="data-table-card">
        <div className="table-header">
          <h3 className="table-title">Productos Más Vendidos</h3>
          <button className="btn-export" onClick={() => descargarCsv("/reportes/productos-mas-vendidos/csv", "VentasPorProducto.csv")}>
            <FiDownload /> Exportar Excel
          </button>
        </div>
        <div className="reportes-table-wrapper">
          <table className="reportes-table">
            <thead>
              <tr>
                <th style={{width: "60px"}}>Pos.</th>
                <th>Descripción</th>
                <th className="text-center">Cant. Vendida</th>
                <th className="text-right">Ingresos Generados</th>
              </tr>
            </thead>
            <tbody>
              {topProductos.map((p, idx) => (
                <tr key={idx}>
                  <td><div className="rank-badge">{idx + 1}</div></td>
                  <td className="fw-bold">{p.nombreProducto}</td>
                  <td className="text-center">
                    <span className="badge-status success">{p.cantidadVendida} uds</span>
                  </td>
                  <td className="text-right fw-bold text-primary">${p.totalVentas.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderImpuestos = () => (
    <div className="section-impuestos">
      <div className="reportes-header">
        <h2 className="reportes-title">Reporte de Impuestos</h2>
      </div>
      
      <div className="kpi-grid">
         <div className="kpi-card">
            <div className="kpi-icon orange"><FiAlertCircle /></div>
            <div className="kpi-info">
               <span className="kpi-label">IVA General (19%)</span>
               <span className="kpi-value">${datosVentas ? (datosVentas.totalVentas * 0.19).toLocaleString() : 0}</span>
            </div>
         </div>
      </div>
      
      <div className="data-table-card">
         <div className="table-header">
            <h3 className="table-title">Discriminación de Impuestos</h3>
         </div>
         <div className="p-4 text-center text-muted">
            Vista detallada de retenciones en la fuente e IVA por periodo.
         </div>
      </div>
    </div>
  );

  return (
    <div className="reportes-wrapper">
      {/* SIDEBAR INTERNO TIPO SIIGO */}
      <aside className="reportes-sidebar">
        <div className="sidebar-category">
          <span className="sidebar-label">Global</span>
          <div className={`sidebar-nav-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={()=>setActiveSection("dashboard")}>
            <FiGrid /> Dashboard Inicio
          </div>
        </div>

        <div className="sidebar-category">
          <span className="sidebar-label">Ventas</span>
          <div className={`sidebar-nav-item ${activeSection === "ventas" ? "active" : ""}`} onClick={()=>setActiveSection("ventas")}>
            <FiFileText /> Detalle de Facturas
          </div>
          <div className="sidebar-nav-item"><FiFileText /> Notas Crédito (NC)</div>
          <div className="sidebar-nav-item"><FiFileText /> Notas Débito (ND)</div>
        </div>

        <div className="sidebar-category">
          <span className="sidebar-label">Terceros</span>
          <div className={`sidebar-nav-item ${activeSection === "clientes" ? "active" : ""}`} onClick={()=>setActiveSection("clientes")}>
            <FiUsers /> Ventas por Cliente
          </div>
          <div className="sidebar-nav-item"><FiUsers /> Estado de Cuenta</div>
        </div>

        <div className="sidebar-category">
          <span className="sidebar-label">Inventario</span>
          <div className={`sidebar-nav-item ${activeSection === "productos" ? "active" : ""}`} onClick={()=>setActiveSection("productos")}>
            <FiBox /> Ventas por Producto
          </div>
        </div>

        <div className="sidebar-category">
          <span className="sidebar-label">Legal y Fiscal</span>
          <div className={`sidebar-nav-item ${activeSection === "impuestos" ? "active" : ""}`} onClick={()=>setActiveSection("impuestos")}>
            <FiDollarSign /> Informe de Impuestos
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="reportes-content">
        {loading && <div className="loading-spinner"></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {!loading && activeSection === "dashboard" && renderDashboard()}
        {!loading && activeSection === "ventas" && renderVentas()}
        {!loading && activeSection === "clientes" && renderClientes()}
        {!loading && activeSection === "productos" && renderProductos()}
        {!loading && activeSection === "impuestos" && renderImpuestos()}
      </main>
    </div>
  );
}

export default Reportes;
