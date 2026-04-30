import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import { InboxFill, EnvelopePaper, Check2Circle, XCircle } from "react-bootstrap-icons";
import DataTable from "../shared/DataTable";

const YEAR_OPTIONS = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
];
const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente Acuse" },
  { value: "acuse", label: "Acuse Recibido" },
  { value: "recibo", label: "Bienes Recibidos" },
  { value: "aceptada", label: "Aceptación Expresa" },
  { value: "rechazada", label: "Rechazada" },
];

export default function BuzonTributario() {
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [yearSel, setYearSel] = useState(YEAR_OPTIONS[0]);
  const [estadoSel, setEstadoSel] = useState(ESTADO_OPTIONS[0]);
  const [proveedor, setProveedor] = useState("");
  const [facturaId, setFacturaId] = useState("");

  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (proveedor) params.append("proveedor", proveedor);
      if (facturaId) params.append("factura", facturaId);
      if (estadoSel.value) params.append("estado", estadoSel.value);
      if (yearSel.value) params.append("year", yearSel.value);

      const res = await axiosClient.get(`/BuzonTributario?${params.toString()}`);
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching Buzon Tributario data", error);
    } finally {
      setLoading(false);
    }
  }, [proveedor, facturaId, estadoSel, yearSel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadge = (estado) => {
    switch (estado) {
      case "aceptada": return <span style={{ background: "#d4edda", color: "#155724", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 5 }}><Check2Circle /> Aceptación Expresa</span>;
      case "recibo": return <span style={{ background: "#cce5ff", color: "#004085", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>Bienes Recibidos</span>;
      case "acuse": return <span style={{ background: "#e2e3e5", color: "#383d41", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>Acuse Emitido</span>;
      case "pendiente": return <span style={{ background: "#fff3cd", color: "#856404", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>Pendiente Acuse</span>;
      case "rechazada": return <span style={{ background: "#f8d7da", color: "#721c24", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: 5 }}><XCircle /> Rechazada</span>;
      default: return null;
    }
  };

  const columns = [
    { key: "emisor", label: "Emisor", highlight: true, render: (r) => <div><strong>{r.emisor}</strong><br /><small className="text-muted">NIT: {r.nit}</small></div> },
    { key: "factura", label: "Factura", render: (r) => <strong>{r.prefijo}-{r.numero}</strong> },
    { key: "fechaEmision", label: "Fecha Emisión" },
    { key: "total", label: "Total", align: "right", bold: true, render: (r) => "$" + r.total.toLocaleString("es-CO") },
    { key: "estadoDian", label: "Estado Eventos DIAN", align: "center", render: (r) => getStatusBadge(r.estadoDian) },
    {
      key: "acciones", label: "Acciones RADIAN", align: "center", render: (r) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button className="btn btn-sm" style={{ background: "var(--primary-super-light)", color: "var(--primary)", border: "none", fontWeight: 600, fontSize: "0.75rem" }}>
            Emitir Evento
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: "0 10px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h4 style={{ fontWeight: 700, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
             Recepción de Facturas y Eventos RADIAN
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem", marginTop: 4 }}>
            Gestiona los eventos título valor para deducir costos y gastos. (Res. 085 DIAN)
          </p> */}
        </div>
        <button className="btn btn-filtros" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <InboxFill size={16} /> Sincronizar Buzón DIAN
        </button>
      </div>

      <button className={`rpt-filters-toggle ${showFilters ? "open" : ""}`} onClick={() => setShowFilters(!showFilters)} style={{ marginBottom: "1rem" }}>
        <FiChevronDown /> {showFilters ? "Ocultar criterios de búsqueda" : "Mostrar criterios de búsqueda"}
      </button>

      {showFilters && (
        <div className="rpt-filters" style={{ marginBottom: "1.5rem" }}>
          <div className="rpt-filters-grid">
            <div>
              <label className="rpt-filter-label">Proveedor</label>
              <input type="text" className="rpt-filter-input" placeholder="Buscar por NIT o Razón Social..." value={proveedor} onChange={e => setProveedor(e.target.value)} />
            </div>
            <div>
              <label className="rpt-filter-label">Número Factura / CUFE</label>
              <input type="text" className="rpt-filter-input" placeholder="Prefijo, Número o CUFE..." value={facturaId} onChange={e => setFacturaId(e.target.value)} />
            </div>
            <div>
              <label className="rpt-filter-label">Estado Evento</label>
              <Select options={ESTADO_OPTIONS} value={estadoSel} onChange={setEstadoSel} isSearchable={false} />
            </div>
            <div>
              <label className="rpt-filter-label">Año Fiscal</label>
              <Select options={YEAR_OPTIONS} value={yearSel} onChange={setYearSel} isSearchable={false} />
            </div>
          </div>
          <div className="rpt-filters-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-filtros" onClick={fetchData}><i className="bi bi-search"></i> Buscar Facturas</button>
            <button className="btn btn-outline-secondary" onClick={() => { setProveedor(""); setFacturaId(""); setEstadoSel(ESTADO_OPTIONS[0]); setYearSel(YEAR_OPTIONS[0]); }} style={{ borderRadius: 10 }}>Limpiar filtros</button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="No hay facturas en el buzón tributario para estos filtros." />
    </div>
  );
}
