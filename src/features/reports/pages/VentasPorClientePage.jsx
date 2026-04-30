import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiCalendar, FiX } from "react-icons/fi";
import { FaFileExcel, FaStar } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";
import "../../../styles/Reportes.css";

export default function VentasPorClientePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      // We don't have exact text search in this endpoint yet for client name, so we fetch and filter locally or use what we have.
      // Wait, the API endpoint didn't have string search for cliente, but I can filter the result.
      
      const res = await axiosClient.get(`/Reportes/ventas/detalle?${params.toString()}`);
      let filteredData = res.data;

      if (cliente) {
        const lowerC = cliente.toLowerCase();
        filteredData = filteredData.filter(d => 
          d.cliente.toLowerCase().includes(lowerC) || 
          d.identificacion.includes(lowerC)
        );
      }

      // Vendedor filtering is not returned in the basic /ventas/detalle unless I modified it to return it.
      // Since it's by client, we aggregate. We will just set data.
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setFechaInicio("");
    setFechaFin("");
    setCliente("");
    setVendedor("");
    // Re-fetch after clearing will happen if we call fetchData, but state updates are async.
    setTimeout(fetchData, 100);
  };

  return (
    <div className="reportes-page p-4 bg-white min-vh-100">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <Link to="/reportes" className="text-primary me-3 text-decoration-none">
          <FiArrowLeft size={24} />
        </Link>
        <h2 className="text-primary m-0 fw-bold d-flex align-items-center">
          Ventas por cliente <FaStar className="text-secondary ms-2 fs-5" />
        </h2>
      </div>

      <button 
        className="btn btn-link text-decoration-none p-0 mb-3 text-muted"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "^ Ocultar criterios de búsqueda" : "v Mostrar criterios de búsqueda"}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-light p-3 rounded mb-4 border">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small">Vendedor</label>
              <div className="input-group input-group-sm">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar" 
                  value={vendedor}
                  onChange={e => setVendedor(e.target.value)}
                />
                <span className="input-group-text bg-white"><FiSearch /></span>
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small d-block">Fecha de elaboración</label>
              <div className="d-flex gap-2 align-items-center">
                <select className="form-select form-select-sm w-auto">
                  <option>2026</option>
                  <option>2025</option>
                </select>
                <select className="form-select form-select-sm w-auto">
                  <option>Este mes</option>
                  <option>Mes anterior</option>
                </select>
                <input type="date" className="form-control form-control-sm w-auto" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                <input type="date" className="form-control form-control-sm w-auto" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small">Cliente</label>
              <div className="input-group input-group-sm">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar"
                  value={cliente}
                  onChange={e => setCliente(e.target.value)} 
                />
                <span className="input-group-text bg-white"><FiSearch /></span>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small">Incluye nota crédito</label>
              <select className="form-select form-select-sm w-100">
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm px-4 fw-bold me-3" onClick={fetchData}>Buscar</button>
            <button className="btn btn-link text-primary btn-sm text-decoration-none fw-bold" onClick={handleClearFilters}>Limpiar filtros</button>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-light border btn-sm">
          <FaFileExcel className="text-dark" />
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive border rounded">
        <table className="table table-hover table-sm m-0" style={{fontSize: "0.85rem"}}>
          <thead className="table-primary" style={{backgroundColor: "#0078D4", color: "white"}}>
            <tr>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>Identificación</th>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>Sucursal</th>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>Cliente</th>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>Número de comprobantes</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Valor bruto</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Descuentos por item</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Subtotal</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Impuesto cargo</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Impuesto retención</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-4">Cargando datos...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-4 text-muted">No se encontraron resultados</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3">{row.identificacion}</td>
                  <td className="py-2 px-3">{row.sucursal}</td>
                  <td className="py-2 px-3 text-primary">{row.cliente}</td>
                  <td className="py-2 px-3">{row.comprobantes}</td>
                  <td className="py-2 px-3 text-end">{row.bruto?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-2 px-3 text-end">{row.descuentos?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-2 px-3 text-end">{row.subtotal?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-2 px-3 text-end">{row.impuestoCargo?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-2 px-3 text-end">{row.retenciones?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-2 px-3 text-end fw-bold">{row.total?.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
