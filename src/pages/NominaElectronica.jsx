import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import { PersonBadge, FileEarmarkExcel, CurrencyDollar } from "react-bootstrap-icons";
import DataTable from "../components/shared/DataTable";
import "../styles/Reportes.css";
import "../styles/SharedPage.css";

const YEAR_OPTIONS = [{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }];
const MES_OPTIONS = [
  { value: "01", label: "Enero" }, { value: "02", label: "Febrero" }, { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" }, { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
];

export default function NominaElectronica() {
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [yearSel, setYearSel] = useState(YEAR_OPTIONS[0]);
  const [mesSel, setMesSel] = useState(MES_OPTIONS[3]);
  const [empleado, setEmpleado] = useState("");

  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (empleado) params.append("empleado", empleado);
      if (mesSel.value) params.append("mes", mesSel.value);
      if (yearSel.value) params.append("year", yearSel.value);

      const res = await axiosClient.get(`/NominaElectronica?${params.toString()}`);
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching Nomina Electronica data", error);
    } finally {
      setLoading(false);
    }
  }, [empleado, mesSel, yearSel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { key: "identificacion", label: "Identificación" },
    { key: "empleado", label: "Empleado", highlight: true, render: (r) => <strong>{r.empleado}</strong> },
    { key: "devengos", label: "Devengos", align: "right", render: (r) => "$" + r.devengos.toLocaleString("es-CO") },
    { key: "deducciones", label: "Deducciones", align: "right", render: (r) => "$" + r.deducciones.toLocaleString("es-CO") },
    { key: "total", label: "Neto a Pagar", align: "right", bold: true, render: (r) => "$" + r.total.toLocaleString("es-CO") },
    {
      key: "estadoDian", label: "Estado DIAN", align: "center", render: (r) => (
        <span style={{
          background: r.estadoDian === 'aceptado' ? '#d4edda' : '#fff3cd',
          color: r.estadoDian === 'aceptado' ? '#155724' : '#856404',
          padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600"
        }}>
          {r.estadoDian === 'aceptado' ? 'Aceptado' : 'Sin Emitir'}
        </span>
      )
    },
  ];

  return (
    <div className="container-fluid px-4" style={{ minHeight: "100vh" }}>
      <div className="header-card mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center">
          <h2 className="header-title">Nómina Electrónica</h2>
          <div className="header-icon"><PersonBadge size={50} /></div>
        </div>
      </div>

      <div className="tab-content p-4" style={{ background: "white", borderRadius: "12px", boxShadow: "var(--rpt-shadow-sm)" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            {/* <h4 style={{ fontWeight: 700, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              Emisión de Documentos Soporte de Pago de Nómina
            </h4>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem", marginTop: 4 }}>
              Cumple con la resolución 000013 de la DIAN para deducción de gastos de nómina.
            </p> */}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-export">
              <FileEarmarkExcel size={16} /> Exportar Excel
            </button>
            <button className="btn btn-crear">
              <CurrencyDollar size={16} className="me-1" /> Liquidar Nómina
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
                <label className="rpt-filter-label">Empleado</label>
                <input type="text" className="rpt-filter-input" placeholder="Buscar por nombre o cédula..." value={empleado} onChange={e => setEmpleado(e.target.value)} />
              </div>
              <div>
                <label className="rpt-filter-label">Mes a Liquidar</label>
                <Select options={MES_OPTIONS} value={mesSel} onChange={setMesSel} isSearchable={false} />
              </div>
              <div>
                <label className="rpt-filter-label">Año</label>
                <Select options={YEAR_OPTIONS} value={yearSel} onChange={setYearSel} isSearchable={false} />
              </div>
            </div>
            <div className="rpt-filters-actions" style={{ marginTop: "1rem" }}>
              <button className="btn btn-filtros" onClick={fetchData}><i className="bi bi-search"></i> Filtrar Empleados</button>
              <button className="btn btn-outline-secondary" onClick={() => { setEmpleado(""); setMesSel(MES_OPTIONS[3]); setYearSel(YEAR_OPTIONS[0]); }} style={{ borderRadius: 10 }}>Limpiar</button>
              <button className="btn btn-export ms-auto" style={{ background: "#f39c12", borderColor: "#e67e22" }}>
                Transmitir Nómina Masiva a DIAN
              </button>
            </div>
          </div>
        )}

        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No hay empleados para liquidar en este periodo." />
      </div>
    </div>
  );
}
