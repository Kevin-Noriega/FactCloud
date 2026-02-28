import {ArrowRight,BoxSeamFill,CashStack, CheckCircleFill,ExclamationTriangleFill,FileEarmarkText,GraphUpArrow,People,} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { LineChart,Line,XAxis, YAxis, Tooltip, CartesianGrid,ResponsiveContainer} from "recharts";
import "../../styles/Dashboard/Estadisticas.css";
import { useState } from "react";

export const Estadisticas = () => {
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear(),);

  const { clientesCount, productosCount, totalVentas, facturasCount, facturasPendientes, añosDisponibles, ventasPorMes } = useDashboard(añoSeleccionado);

  const totalAñoSeleccionado = ventasPorMes.reduce(
    (sum, m) => sum + m.total,
    0,
  );

  return (
    <div>
      {facturasPendientes > 0 && (
        <div className="alert-pendientes">
          <div className="alert-icon">
            <ExclamationTriangleFill size={28} />
          </div>
          <div className="alert-content">
            <h4 className="alert-title">
              Tienes {facturasPendientes}{" "}
              {facturasPendientes === 1
                ? "factura pendiente"
                : "facturas pendientes"}
            </h4>
            <p className="alert-text">
              Recuerda enviarlas a la DIAN dentro de las 48 horas para cumplir
              con la normativa.
            </p>
          </div>
          <Link to="/facturas" className="alert-button">
            Ver pendientes
          </Link>
        </div>
      )}

      <div className="stats-content">
        <div className="stats-grafic">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Ventas mensuales
            </h5>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={añoSeleccionado}
              onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
            >
              {añosDisponibles.map((año) => (
                <option key={año} value={año}>
                  {año}
                </option>
              ))}
            </select>
          </div>

          {añosDisponibles.length === 0 && (
            <div className="alert alert-info">
              No hay facturas registradas aún
            </div>
          )}

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="mes" />

              <YAxis />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                }}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-grid">

          <div className="stat-mensual">
            <div className="stat-card stat-card-mensual">
            <div className="stat-header">
              <div className="stat-icon">
                <CashStack size={22} />
              </div>
               <p className="stat-label">Ventas Anuales</p>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  ${totalAñoSeleccionado.toLocaleString("es-CO")}
                </h3>
                <div className="stat-badge">
                  <GraphUpArrow size={14} className="me-1" />
                  En {añoSeleccionado}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-generales">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">
                <FileEarmarkText size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Facturas</p>
                <h3 className="stat-value">{facturasCount}</h3>
                <div className="stat-badge">
                  <CheckCircleFill size={14} className="me-1" />
                  Activas
                </div>
              </div>
              <Link to="/facturas" className="stat-link">
                Ver todas
                <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>

            <div className="stat-card stat-card-success">
              <div className="stat-icon">
                <People size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Clientes</p>
                <h3 className="stat-value">{clientesCount}</h3>
                <div className="stat-badge">
                  <People size={14} className="me-1" />
                  Registrados
                </div>
              </div>
              <Link to="/clientes" className="stat-link">
                Gestionar
                <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>

            <div className="stat-card stat-card-warning">
              <div className="stat-icon">
                <BoxSeamFill size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Productos</p>
                <h3 className="stat-value">{productosCount}</h3>
                <div className="stat-badge">
                  <BoxSeamFill size={14} className="me-1" />
                  En inventario
                </div>
              </div>
              <Link to="/productos" className="stat-link">
                Ver inventario
                <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>

            <div className="stat-card stat-card-info">
              <div className="stat-icon">
                <CashStack size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Ventas totales</p>
                <h3 className="stat-value">
                  ${totalVentas.toLocaleString("es-CO")}
                </h3>
                <div className="stat-badge">
                  <GraphUpArrow size={14} className="me-1" />
                  Calculado
                </div>
              </div>
              <Link to="/reportes" className="stat-link">
                Ver reportes
                <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
