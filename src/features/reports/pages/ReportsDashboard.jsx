import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiHelpCircle, FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "../../../styles/Reportes.css"; // We'll keep the styles there

const REPORTS_LIST = [
  { id: "ventas-cliente", name: "Ventas por cliente", path: "/reportes/ventas-cliente" },
  { id: "ventas-producto", name: "Ventas por producto", path: "/reportes/ventas-producto" },
  { id: "ventas-vendedor", name: "Ventas por vendedor", path: "/reportes/ventas-vendedor" },
  { id: "ventas-cliente-producto", name: "Ventas por cliente por producto", path: "/reportes/ventas-cliente-producto" },
  { id: "ventas-vendedor-producto", name: "Ventas por vendedor por producto", path: "/reportes/ventas-vendedor-producto" },
  { id: "comparativo-mensual", name: "Comparativo de ventas por mes", path: "/reportes/comparativo-mensual" }
];

export default function ReportsDashboard() {
  const [favorites, setFavorites] = useState([]);
  const [openSections, setOpenSections] = useState({ favoritos: true, ventas: true });

  useEffect(() => {
    const savedFavs = localStorage.getItem("reportes-favoritos");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleFavorite = (reportId) => {
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

  return (
    <div className="reportes-dashboard-container p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-3 text-dark">Inicio</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <span className="nav-link">Accesos directos</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Indicadores</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Habilitaciones electrónicas</span>
          </li>
        </ul>
      </div>

      <h3 className="fw-bold mb-4 text-dark" style={{color: "#2C3E50"}}>Reportes</h3>

      <div className="reports-accordion bg-white rounded shadow-sm border mb-4">
        {/* FAVORITOS SECTION */}
        <div className="border-bottom">
          <button 
            className="w-100 bg-white border-0 p-3 d-flex align-items-center fw-bold text-dark fs-5"
            onClick={() => toggleSection("favoritos")}
          >
            {openSections.favoritos ? <FiChevronDown className="me-2 text-primary" /> : <FiChevronRight className="me-2 text-primary" />}
            Favoritos
          </button>
          
          {openSections.favoritos && (
            <div className="p-0">
              {favoriteReports.length === 0 ? (
                <div className="p-3 text-muted ps-5">No tienes reportes favoritos aún.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {favoriteReports.map(report => (
                    <li key={`fav-${report.id}`} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom">
                      <Link to={report.path} className="text-decoration-none text-dark hover-primary">{report.name}</Link>
                      <div>
                        <FiHelpCircle className="text-primary me-3 cursor-pointer" size={18} />
                        <FaStar className="text-warning cursor-pointer" size={18} onClick={() => toggleFavorite(report.id)} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* VENTAS SECTION */}
        <div>
          <button 
            className="w-100 bg-white border-0 p-3 d-flex align-items-center fw-bold text-dark fs-5"
            onClick={() => toggleSection("ventas")}
          >
            {openSections.ventas ? <FiChevronDown className="me-2 text-primary" /> : <FiChevronRight className="me-2 text-primary" />}
            Ventas
          </button>
          
          {openSections.ventas && (
            <div className="p-0">
              <div className="px-4 py-2 fw-bold text-dark border-bottom">Ventas</div>
              <ul className="list-group list-group-flush">
                {REPORTS_LIST.map(report => (
                  <li key={report.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom">
                    <Link to={report.path} className="text-decoration-none text-dark">{report.name}</Link>
                    <div>
                      <FiHelpCircle className="text-primary me-3 cursor-pointer" size={18} />
                      {favorites.includes(report.id) ? (
                        <FaStar className="text-warning cursor-pointer" size={18} onClick={() => toggleFavorite(report.id)} />
                      ) : (
                        <FiStar className="text-secondary cursor-pointer" size={18} onClick={() => toggleFavorite(report.id)} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
