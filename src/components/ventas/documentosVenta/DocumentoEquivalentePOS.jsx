import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../../api/axiosClient";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import { Receipt, FileEarmarkExcel } from "react-bootstrap-icons";
import DataTable from "../../shared/DataTable";

const YEAR_OPTIONS = [{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }];
const CAJA_OPTIONS = [{ value: "", label: "Todas las cajas" }, { value: "caja1", label: "Caja Principal" }, { value: "caja2", label: "Caja Express" }];

export default function DocumentoEquivalentePOS() {
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [yearSel, setYearSel] = useState(YEAR_OPTIONS[0]);
  const [cajaSel, setCajaSel] = useState(CAJA_OPTIONS[0]);
  const [cliente, setCliente] = useState("");
  const [consecutivo, setConsecutivo] = useState("");

  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cliente) params.append("cliente", cliente);
      if (consecutivo) params.append("consecutivo", consecutivo);
      if (cajaSel.value) params.append("caja", cajaSel.value);
      if (yearSel.value) params.append("year", yearSel.value);

      const res = await axiosClient.get(`/DocumentoEquivalente?${params.toString()}`);
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching Documento Equivalente data", error);
    } finally {
      setLoading(false);
    }
  }, [cliente, consecutivo, cajaSel, yearSel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { key: "consecutivo", label: "Tiquete", render: (r) => <strong>{r.prefijo}-{r.numero}</strong> },
    { key: "fecha", label: "Fecha y Hora" },
    { key: "cliente", label: "Cliente", highlight: true, render: (r) => <div>{r.cliente}<br /><small className="text-muted">NIT: {r.nit}</small></div> },
    { key: "caja", label: "Caja" },
    { key: "total", label: "Total", align: "right", bold: true, render: (r) => "$" + r.total.toLocaleString("es-CO") },
    {
      key: "estadoDian", label: "Estado DIAN", align: "center", render: (r) => (
        <span style={{
          background: r.estadoDian === 'aceptado' ? '#d4edda' : '#fff3cd',
          color: r.estadoDian === 'aceptado' ? '#155724' : '#856404',
          padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600"
        }}>
          {r.estadoDian === 'aceptado' ? 'Aceptado' : 'Enviando...'}
        </span>
      )
    },
  ];

  return (
    <div style={{ padding: "0 10px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h4 style={{ fontWeight: 700, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            Documentos Equivalentes POS Electrónico
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem", marginTop: 4 }}>
            Tiquetes de máquina registradora POS transmitidos electrónicamente a la DIAN (Res. 165).
          </p> */}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-export">
            <FileEarmarkExcel size={16} /> Exportar
          </button>
          <button className="btn btn-crear">
            <Receipt size={16} className="me-1" /> Nuevo Tiquete POS
          </button>
        </div>
      </div>

      <button className={`rpt-filters-toggle ${showFilters ? "open" : ""}`} onClick={() => setShowFilters(!showFilters)} style={{ marginBottom: "1rem" }}>
        <FiChevronDown /> {showFilters ? "Ocultar criterios de búsqueda" : "Mostrar criterios de búsqueda"}
      </button>

      {showFilters && (
        <div className="rpt-filters" style={{ marginBottom: "1.5rem" }}>
          <div className="rpt-filters-grid">
            <div>
              <label className="rpt-filter-label">Cliente</label>
              <input type="text" className="rpt-filter-input" placeholder="Buscar cliente..." value={cliente} onChange={e => setCliente(e.target.value)} />
            </div>
            <div>
              <label className="rpt-filter-label">Número Tiquete</label>
              <input type="text" className="rpt-filter-input" placeholder="Ej: POS-1001" value={consecutivo} onChange={e => setConsecutivo(e.target.value)} />
            </div>
            <div>
              <label className="rpt-filter-label">Caja</label>
              <Select options={CAJA_OPTIONS} value={cajaSel} onChange={setCajaSel} isSearchable={false} />
            </div>
            <div>
              <label className="rpt-filter-label">Año Fiscal</label>
              <Select options={YEAR_OPTIONS} value={yearSel} onChange={setYearSel} isSearchable={false} />
            </div>
          </div>
          <div className="rpt-filters-actions" style={{ marginTop: "1rem" }}>
            <button className="btn btn-filtros" onClick={fetchData}><i className="bi bi-search"></i> Buscar Tiquetes</button>
            <button className="btn btn-outline-secondary" onClick={() => { setCliente(""); setConsecutivo(""); setCajaSel(CAJA_OPTIONS[0]); setYearSel(YEAR_OPTIONS[0]); }} style={{ borderRadius: 10 }}>Limpiar filtros</button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="No hay tiquetes POS emitidos en esta fecha." />
    </div>
  );
}
