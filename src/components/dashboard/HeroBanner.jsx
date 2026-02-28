

import { Calendar, GraphUpArrow } from "react-bootstrap-icons";
import QuickActions from "./QuickActions";
import "../../styles/Dashboard/HeroBanner.css"

export const HeroBanner = () => {
  return (
     <div className="dashboard-header-card">
          <div className="dashboard-header-content">
            <div className="dashboard-header-text">
              <h1 className="dashboard-header-title">¡Bienvenido a FactCloud!</h1>
              <p className="dashboard-header-subtitle">
                Sistema de Facturación Electrónica - Cumplimiento DIAN
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
          <div className="dashboard-header-actions">
              <QuickActions />
            </div>
           
        </div>
  )
}
