import { Calendar, GraphUpArrow } from "react-bootstrap-icons";
import QuickActions from "./QuickActions";
import "../../styles/Dashboard/HeroBanner.css";

import { useAuth } from "../../hooks/useAuth";

export const HeroBanner = () => {
  const { usuario } = useAuth();

  const nombre = usuario?.nombre ?? "";
  const apellido = usuario?.apellido ?? "";
  const nombreCompleto = `${nombre} ${apellido}`.trim();
  const esAdmin = usuario?.rol === "admin";
  const saludo = `¡Bienvenido ${nombreCompleto ? nombreCompleto : "a Nubee"}!`;

  return (
    <div className={`dashboard-header-card ${esAdmin ? "dashboard-header-card-admin" : "dashboard-header-card"
      }`}>
      <div className="dashboard-header-content">
        <div className="dashboard-header-text">
          <h1 className="dashboard-header-title">{esAdmin ? "Dashboard Administrativo" : saludo}</h1>

          <p className="dashboard-header-subtitle">
            {esAdmin ? "Visión global del sistema" : "Sistema de Facturación Electrónica - Cumplimiento DIAN"}
          </p>

          <div className="dashboard-header-date">
            <Calendar className="me-2" size={16} />

            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="dashboard-header-icon d-none d-md-block">
          <GraphUpArrow size={120} />
        </div>
      </div>

      {usuario?.rol !== "admin" && (
        <div className="dashboard-header-actions">
          <QuickActions />
        </div>
      )}
    </div>
  );
};