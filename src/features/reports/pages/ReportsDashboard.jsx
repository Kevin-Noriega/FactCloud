import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHelpCircle, FiStar, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { BarChartLine } from "react-bootstrap-icons";
import "../../../styles/Reportes.css";
import "../../../styles/SharedPage.css";

const REPORTS_LIST = [
  { id: "ventas-cliente", name: "Ventas por cliente", path: "/reportes/ventas-cliente", desc: "Consolidado de ventas agrupado por cliente" },
  { id: "ventas-producto", name: "Ventas por producto", path: "/reportes/ventas-producto", desc: "Rotacion e ingresos por producto" },
  { id: "ventas-vendedor", name: "Ventas por vendedor", path: "/reportes/ventas-vendedor", desc: "Rendimiento de ventas por vendedor" },
  { id: "ventas-cliente-producto", name: "Ventas por cliente por producto", path: "/reportes/ventas-cliente-producto", desc: "Cruce clientes y productos" },
  { id: "ventas-vendedor-producto", name: "Ventas por vendedor por producto", path: "/reportes/ventas-vendedor-producto", desc: "Cruce vendedores y productos" },
  { id: "comparativo-mensual", name: "Comparativo de ventas por mes", path: "/reportes/comparativo-mensual", desc: "Grafico de barras mensual" },
];

export default function ReportsDashboard() {
  const [favorites, setFavorites] = useState([]);
  const [openSections, setOpenSections] = useState({ favoritos: true, ventas: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("accesos");

  useEffect(() => {
    const savedFavs = localStorage.getItem("reportes-favoritos");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const toggleFavorite = (e, reportId) => {
    e.preventDefault();
    e.stopPropagation();
    let newFavs = [...favorites];
    if (newFavs.includes(reportId)) {
      newFavs = newFavs.filter(id => id !== reportId);
    } else {
      newFavs.push(reportId);
    }
    setFavorites(newFavs);
    localStorage.setItem("reportes-favoritos", JSON.stringify(newFavs));
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const favoriteReports = REPORTS_LIST.filter(r => favorites.includes(r.id));
  const filteredReports = searchTerm
    ? REPORTS_LIST.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : REPORTS_LIST;

  const tabs = [
    { id: "accesos", label: "Accesos directos" },
    { id: "indicadores", label: "Indicadores" },
    { id: "habilitaciones", label: "Habilitaciones electronicas" },
  ];

  const ReportItem = ({ report }) => (
    <div className="rpt-item">
      <Link to={report.path} className="rpt-item-link">
        {report.name}
      </Link>
      <div className="rpt-item-actions">
        <button className="rpt-btn-help" title="Informacion del reporte">
          <FiHelpCircle />
        </button>
        <button
          className={`rpt-btn-fav ${favorites.includes(report.id) ? "active" : ""}`}
          onClick={(e) => toggleFavorite(e, report.id)}
          title={favorites.includes(report.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {favorites.includes(report.id) ? <FaStar /> : <FiStar />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4">
      {/* ── Banner Header igual a Productos ── */}
      <div className="header-card mb-3 px-4">
        <div className="header-content">
          <h2 className="header-title">Reportes</h2>
          <div className="header-icon">
            <BarChartLine size={50} />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="menu-tabs px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`menu-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="tab-content p-4">
        <div className="container-fluid mt-2 px-2">
          {/* Search + Actions bar (same pattern as Productos) */}
          <div className="opcions-header">
            <div className="filters">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar reporte..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-filtros">
                <i className="bi bi-sliders2"></i> Filtros
              </button>
            </div>
            <div className="btns-group">
              <button className="btn btn-export">
                <i className="bi bi-file-earmark-excel-fill"></i> Exportar CSV
              </button>
            </div>
          </div>

          {/* Accordion */}
          <div className="rpt-accordion">
            {/* FAVORITOS */}
            <div>
              <button className="rpt-accordion-header" onClick={() => toggleSection("favoritos")}>
                <div className={`chevron ${openSections.favoritos ? "open" : ""}`}>
                  <FiChevronRight />
                </div>
                <span className="section-name">
                  <FaStar style={{ color: "#f5a623", marginRight: 8, fontSize: "0.9rem" }} />
                  Favoritos
                </span>
                <span className="section-count">{favoriteReports.length} reportes</span>
              </button>

              {openSections.favoritos && (
                <div className="rpt-accordion-body">
                  {favoriteReports.length === 0 ? (
                    <div className="rpt-empty-fav">
                      <FiStar />
                      Marca reportes como favoritos para acceder rapidamente
                    </div>
                  ) : (
                    favoriteReports.map(report => (
                      <ReportItem key={`fav-${report.id}`} report={report} />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* VENTAS */}
            <div>
              <button className="rpt-accordion-header" onClick={() => toggleSection("ventas")}>
                <div className={`chevron ${openSections.ventas ? "open" : ""}`}>
                  <FiChevronRight />
                </div>
                <span className="section-name">
                  <BarChartLine style={{ color: "var(--primary)", marginRight: 8 }} />
                  Ventas
                </span>
                <span className="section-count">{filteredReports.length} reportes</span>
              </button>

              {openSections.ventas && (
                <div className="rpt-accordion-body">
                  <div className="rpt-sub-header">Ventas</div>
                  {filteredReports.map(report => (
                    <ReportItem key={report.id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
