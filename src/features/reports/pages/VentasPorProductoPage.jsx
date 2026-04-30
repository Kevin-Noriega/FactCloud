import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiCalendar } from "react-icons/fi";
import { FaFileExcel, FaStar } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";
import "../../../styles/Reportes.css";

export default function VentasPorProductoPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      
      const res = await axiosClient.get(`/Reportes/ventas-por-producto?${params.toString()}`);
      setData(res.data);
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
    setTimeout(fetchData, 100);
  };

  return (
    <div className="reportes-page p-4 bg-white min-vh-100">
      <div className="d-flex align-items-center mb-3">
        <Link to="/reportes" className="text-primary me-3 text-decoration-none">
          <FiArrowLeft size={24} />
        </Link>
        <h2 className="text-primary m-0 fw-bold d-flex align-items-center">
          Ventas por producto <FaStar className="text-secondary ms-2 fs-5" />
        </h2>
      </div>

      <button 
        className="btn btn-link text-decoration-none p-0 mb-3 text-muted"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "^ Ocultar criterios de búsqueda" : "v Mostrar criterios de búsqueda"}
      </button>

      {showFilters && (
        <div className="bg-light p-3 rounded mb-4 border">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small d-block">Fecha de elaboración</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="date" className="form-control form-control-sm w-auto" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                <input type="date" className="form-control form-control-sm w-auto" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm px-4 fw-bold me-3" onClick={fetchData}>Buscar</button>
            <button className="btn btn-link text-primary btn-sm text-decoration-none fw-bold" onClick={handleClearFilters}>Limpiar filtros</button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-light border btn-sm">
          <FaFileExcel className="text-dark" />
        </button>
      </div>

      <div className="table-responsive border rounded">
        <table className="table table-hover table-sm m-0" style={{fontSize: "0.85rem"}}>
          <thead className="table-primary" style={{backgroundColor: "#0078D4", color: "white"}}>
            <tr>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>ID Producto</th>
              <th className="py-2 px-3 text-white" style={{backgroundColor: "#0088D4"}}>Producto</th>
              <th className="py-2 px-3 text-white text-center" style={{backgroundColor: "#0088D4"}}>Cantidad Vendida</th>
              <th className="py-2 px-3 text-white text-end" style={{backgroundColor: "#0088D4"}}>Total Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Cargando datos...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4 text-muted">No se encontraron resultados</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3">{row.id}</td>
                  <td className="py-2 px-3 text-primary">{row.producto}</td>
                  <td className="py-2 px-3 text-center">{row.cantidad}</td>
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
