import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FileEarmarkBarGraph } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import DataTable from "../../../components/shared/DataTable";
import "../../../styles/Reportes.css";
import "../../../styles/SharedPage.css";

const fmt = (v) =>
  v != null
    ? v.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "0.00";

const YEAR_OPTIONS = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

const PERIODO_OPTIONS = [
  { value: "mes", label: "Este mes" },
  { value: "anterior", label: "Mes anterior" },
  { value: "anual", label: "Todo el año" },
];

const NOTA_CREDITO_OPTIONS = [
  { value: "si", label: "Si" },
  { value: "no", label: "No" },
];

export default function VentasPorClientePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [yearSel, setYearSel] = useState(YEAR_OPTIONS[0]);
  const [periodoSel, setPeriodoSel] = useState(PERIODO_OPTIONS[0]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("reportes-favoritos") || "[]");
    setIsFav(favs.includes("ventas-cliente"));
  }, []);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("reportes-favoritos") || "[]");
    const next = isFav
      ? favs.filter((id) => id !== "ventas-cliente")
      : [...favs, "ventas-cliente"];
    localStorage.setItem("reportes-favoritos", JSON.stringify(next));
    setIsFav(!isFav);
  };

  useEffect(() => {
    const now = new Date();
    const y = parseInt(yearSel.value);
    let start, end;
    if (periodoSel.value === "mes") {
      start = new Date(y, now.getMonth(), 1);
      end = new Date(y, now.getMonth() + 1, 0);
    } else if (periodoSel.value === "anterior") {
      start = new Date(y, now.getMonth() - 1, 1);
      end = new Date(y, now.getMonth(), 0);
    } else {
      start = new Date(y, 0, 1);
      end = new Date(y, 11, 31);
    }
    setFechaInicio(start.toISOString().split("T")[0]);
    setFechaFin(end.toISOString().split("T")[0]);
  }, [yearSel, periodoSel]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      const res = await axiosClient.get(`/Reportes/ventas/detalle?${params}`);
      let filtered = res.data;
      if (cliente) {
        const lc = cliente.toLowerCase();
        filtered = filtered.filter(
          (d) => d.cliente?.toLowerCase().includes(lc) || d.identificacion?.includes(lc)
        );
      }
      setData(filtered);
    } catch {
      toast.error("Error al cargar el reporte. Verifica tu conexion.");
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, cliente]);

  useEffect(() => { fetchData(); }, []);

  const handleClear = () => {
    setCliente("");
    setVendedor("");
    setYearSel(YEAR_OPTIONS[0]);
    setPeriodoSel(PERIODO_OPTIONS[0]);
  };

  const totals = data.reduce(
    (acc, r) => ({
      bruto: acc.bruto + (r.bruto || 0),
      descuentos: acc.descuentos + (r.descuentos || 0),
      subtotal: acc.subtotal + (r.subtotal || 0),
      impuestoCargo: acc.impuestoCargo + (r.impuestoCargo || 0),
      retenciones: acc.retenciones + (r.retenciones || 0),
      total: acc.total + (r.total || 0),
    }),
    { bruto: 0, descuentos: 0, subtotal: 0, impuestoCargo: 0, retenciones: 0, total: 0 }
  );

  const columns = [
    { key: "identificacion", label: "Identificacion" },
    { key: "sucursal", label: "Sucursal" },
    { key: "cliente", label: "Cliente", highlight: true },
    { key: "comprobantes", label: "N. comprobantes", align: "center" },
    { key: "bruto", label: "Valor bruto", align: "right", bold: true, render: (r) => fmt(r.bruto) },
    { key: "descuentos", label: "Descuentos", align: "right", render: (r) => fmt(r.descuentos) },
    { key: "subtotal", label: "Subtotal", align: "right", bold: true, render: (r) => fmt(r.subtotal) },
    { key: "impuestoCargo", label: "Imp. cargo", align: "right", render: (r) => fmt(r.impuestoCargo) },
    { key: "retenciones", label: "Imp. retencion", align: "right", render: (r) => fmt(r.retenciones) },
    { key: "total", label: "Total", align: "right", bold: true, cellStyle: { fontWeight: 800 }, render: (r) => fmt(r.total) },
  ];

  return (
    <div className="container-fluid px-4">
      {/* ── Banner Header ── */}
      <div className="header-card mb-3 px-4">
        <div className="header-content">
          <div>
            <h2 className="header-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              Ventas por cliente
              <button onClick={toggleFav} style={{ background: "none", border: "none", color: isFav ? "#f5a623" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.1rem" }}>
                {isFav ? <FaStar /> : <FaRegStar />}
              </button>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "0.9rem" }}>
              <Link to="/reportes" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Reportes</Link> / Ventas por cliente
            </p>
          </div>
          <div className="header-icon">
            <FileEarmarkBarGraph size={50} />
          </div>
        </div>
      </div>

      {/* ── Filters Toggle ── */}
      <button
        className={`rpt-filters-toggle ${showFilters ? "open" : ""}`}
        onClick={() => setShowFilters(!showFilters)}
        style={{ marginBottom: "1rem" }}
      >
        <FiChevronDown /> {showFilters ? "Ocultar criterios de busqueda" : "Mostrar criterios de busqueda"}
      </button>

      {/* ── Filters ── */}
      {showFilters && (
        <div className="rpt-filters" style={{ marginBottom: "1.5rem" }}>
          <div className="rpt-filters-grid">
            <div>
              <label className="rpt-filter-label">Vendedor</label>
              <div className="rpt-input-icon-wrap">
                <input type="text" className="rpt-filter-input" placeholder="Buscar vendedor..." value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
                <FiSearch />
              </div>
            </div>
            <div>
              <label className="rpt-filter-label">Periodo</label>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ minWidth: 120 }}>
                  <Select options={YEAR_OPTIONS} value={yearSel} onChange={setYearSel} isSearchable={false} />
                </div>
                <div style={{ minWidth: 160 }}>
                  <Select options={PERIODO_OPTIONS} value={periodoSel} onChange={setPeriodoSel} isSearchable={false} />
                </div>
              </div>
            </div>
            <div>
              <label className="rpt-filter-label">Cliente</label>
              <div className="rpt-input-icon-wrap">
                <input type="text" className="rpt-filter-input" placeholder="Buscar cliente..." value={cliente} onChange={(e) => setCliente(e.target.value)} />
                <FiSearch />
              </div>
            </div>
            <div>
              <label className="rpt-filter-label">Incluye nota credito</label>
              <Select options={NOTA_CREDITO_OPTIONS} defaultValue={NOTA_CREDITO_OPTIONS[0]} isSearchable={false} />
            </div>
          </div>
          <div className="rpt-filters-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-filtros" onClick={fetchData}>
              <i className="bi bi-search"></i> Buscar
            </button>
            <button className="btn btn-outline-secondary" onClick={handleClear} style={{ borderRadius: 10 }}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* ── Export ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <button className="btn btn-export">
          <i className="bi bi-file-earmark-excel-fill"></i> Exportar Excel
        </button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        totals={{
          label: "Total general",
          values: {
            bruto: fmt(totals.bruto),
            descuentos: fmt(totals.descuentos),
            subtotal: fmt(totals.subtotal),
            impuestoCargo: fmt(totals.impuestoCargo),
            retenciones: fmt(totals.retenciones),
            total: fmt(totals.total),
          },
        }}
      />
    </div>
  );
}
