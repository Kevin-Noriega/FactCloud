import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { GraphUpArrow } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axiosClient from "../../../api/axiosClient";
import "../../../styles/Reportes.css";
import "../../../styles/SharedPage.css";

const fmtCurrency = (v) => "$" + v.toLocaleString("es-CO", { minimumFractionDigits: 0 });

const YEAR_OPTIONS = [{ value: 2026, label: "2026" }, { value: 2025, label: "2025" }, { value: 2024, label: "2024" }];

const BAR_COLORS = [
  "#0066FF", "#0088FF", "#00AAFF", "#00C48C", "#34D399",
  "#6EE7B7", "#FCD34D", "#FBBF24", "#F97316", "#EF4444",
  "#A78BFA", "#8B5CF6",
];

export default function ComparativoVentasMesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [yearSel, setYearSel] = useState(YEAR_OPTIONS[0]);
  const [incluyeImpuesto, setIncluyeImpuesto] = useState(false);
  const [incluyeNotaCredito, setIncluyeNotaCredito] = useState(true);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("reportes-favoritos") || "[]");
    setIsFav(favs.includes("comparativo-mensual"));
  }, []);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("reportes-favoritos") || "[]");
    const next = isFav ? favs.filter(id => id !== "comparativo-mensual") : [...favs, "comparativo-mensual"];
    localStorage.setItem("reportes-favoritos", JSON.stringify(next));
    setIsFav(!isFav);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/Reportes/comparativo-mensual?year=${yearSel.value}`);
      const chartData = res.data.map(item => ({
        name: item.nombreMes,
        value: incluyeImpuesto ? item.total : item.subtotal,
      }));
      setData(chartData);
    } catch { toast.error("Error al cargar el comparativo mensual."); }
    finally { setLoading(false); }
  }, [yearSel, incluyeImpuesto]);

  useEffect(() => { fetchData(); }, [yearSel, incluyeImpuesto, incluyeNotaCredito]);

  const handleClear = () => { setYearSel(YEAR_OPTIONS[0]); setIncluyeImpuesto(false); setIncluyeNotaCredito(true); };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: "rgba(255,255,255,0.97)", border: "1px solid #e3e8f0",
          borderRadius: 12, padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}>
          <p style={{ margin: 0, fontWeight: 700, color: "#1a2b4a", fontSize: "0.95rem" }}>{label}</p>
          <p style={{ margin: "4px 0 0", color: "#0066FF", fontWeight: 800, fontSize: "1.1rem" }}>{fmtCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid px-4">
      <div className="header-card mb-3 px-4">
        <div className="header-content">
          <div>
            <h2 className="header-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              Comparativo de ventas por mes
              <button onClick={toggleFav} style={{ background: "none", border: "none", color: isFav ? "#f5a623" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.1rem" }}>
                {isFav ? <FaStar /> : <FaRegStar />}
              </button>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "0.9rem" }}>
              <Link to="/reportes" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Reportes</Link> / Comparativo mensual
            </p>
          </div>
          <div className="header-icon"><GraphUpArrow size={50} /></div>
        </div>
      </div>

      <button className={`rpt-filters-toggle ${showFilters ? "open" : ""}`} onClick={() => setShowFilters(!showFilters)} style={{ marginBottom: "1rem" }}>
        <FiChevronDown /> {showFilters ? "Ocultar criterios de busqueda" : "Mostrar criterios de busqueda"}
      </button>

      {showFilters && (
        <div className="rpt-filters" style={{ marginBottom: "1.5rem" }}>
          <div className="rpt-filters-grid">
            <div>
              <label className="rpt-filter-label">Año</label>
              <div style={{ maxWidth: 180 }}>
                <Select options={YEAR_OPTIONS} value={yearSel} onChange={setYearSel} isSearchable={false} />
              </div>
            </div>
            <div>
              <label className="rpt-filter-label">Opciones</label>
              <div className="rpt-check-group" style={{ paddingTop: 8 }}>
                <label className="rpt-check">
                  <input type="checkbox" checked={incluyeImpuesto} onChange={e => setIncluyeImpuesto(e.target.checked)} />
                  Incluye impuesto
                </label>
                <label className="rpt-check">
                  <input type="checkbox" checked={incluyeNotaCredito} onChange={e => setIncluyeNotaCredito(e.target.checked)} />
                  Incluye nota credito
                </label>
              </div>
            </div>
          </div>
          <div className="rpt-filters-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-filtros" onClick={fetchData}><i className="bi bi-search"></i> Buscar</button>
            <button className="btn btn-outline-secondary" onClick={handleClear} style={{ borderRadius: 10 }}>Limpiar filtros</button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rpt-chart-card">
        <div className="rpt-chart-title">Ventas / Mes — {yearSel.label}</div>
        {loading ? (
          <div className="rpt-loading"><div className="rpt-loading-spinner" /><p>Cargando grafico...</p></div>
        ) : (
          <div style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edf5" />
                <XAxis dataKey="name" axisLine={{ stroke: "#d0d7e2" }} tickLine={false} tick={{ fill: "#6b7a99", fontSize: 13, fontWeight: 600 }} />
                <YAxis tickFormatter={v => { if (v >= 1e6) return (v / 1e6).toFixed(1) + "M"; if (v >= 1e3) return (v / 1e3).toFixed(0) + "K"; return v; }} axisLine={false} tickLine={false} tick={{ fill: "#6b7a99", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,102,255,0.04)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {data.map((_, i) => (<Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
