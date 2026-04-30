import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { FaFileExcel, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosClient from "../../../api/axiosClient";
import "../../../styles/Reportes.css";

export default function ComparativoVentasMesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [year, setYear] = useState(new Date().getFullYear());
  const [incluyeImpuesto, setIncluyeImpuesto] = useState(false);
  const [incluyeNotaCredito, setIncluyeNotaCredito] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/Reportes/comparativo-mensual?year=${year}`);
      
      // Transform data for recharts
      const chartData = res.data.map(item => ({
        name: item.nombreMes,
        value: incluyeImpuesto ? item.total : item.subtotal
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, incluyeImpuesto, incluyeNotaCredito]);

  const handleClearFilters = () => {
    setYear(new Date().getFullYear());
    setIncluyeImpuesto(false);
    setIncluyeNotaCredito(true);
  };

  // Custom tooltip to format currency
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="m-0 fw-bold">{label}</p>
          <p className="m-0 text-success">
            {payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="reportes-page p-4 bg-white min-vh-100">
      <div className="alert alert-warning py-2 mb-3 text-center" style={{fontSize: "0.85rem"}}>
        For evaluation purposes only. Redistribution prohibited. Please register an existing license or purchase a new license to continue use of DevExpress product libraries.
      </div>

      <div className="d-flex align-items-center mb-3">
        <Link to="/reportes" className="text-primary me-3 text-decoration-none">
          <FiArrowLeft size={24} />
        </Link>
        <h2 className="text-primary m-0 fw-bold d-flex align-items-center">
          Comparativo de ventas por mes <FaStar className="text-secondary ms-2 fs-5" />
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
          <div className="row g-3 align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label text-muted small me-3 mb-0" style={{minWidth: "40px"}}>Año</label>
              <select 
                className="form-select form-select-sm w-auto"
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            
            <div className="col-md-6 text-end">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="chkImpuesto" 
                  checked={incluyeImpuesto}
                  onChange={e => setIncluyeImpuesto(e.target.checked)}
                />
                <label className="form-check-label text-muted small" htmlFor="chkImpuesto">Incluye impuesto</label>
              </div>
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="chkNC"
                  checked={incluyeNotaCredito}
                  onChange={e => setIncluyeNotaCredito(e.target.checked)}
                />
                <label className="form-check-label text-muted small" htmlFor="chkNC">Incluye nota crédito</label>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm px-4 fw-bold me-3" onClick={fetchData}>Buscar</button>
            <button className="btn btn-link text-primary btn-sm text-decoration-none fw-bold" onClick={handleClearFilters}>Limpiar filtros</button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="border rounded p-4" style={{ height: "450px" }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            Cargando gráfico...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={true} tickLine={true} />
              <YAxis 
                tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)}
                axisLine={true} 
                tickLine={true} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#78D13F" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
