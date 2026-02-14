import { useState } from "react";
import {
  XCircle,
  ClockHistory,
  Laptop,
  Phone,
  Tablet,
  GeoAltFill,
  TrashFill,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { useSeguridad } from "../../hooks/useSeguridad";
import "../../styles/perfil/ModalHistorialSesiones.css";

function ModalHistorialSesiones({ isOpen, onClose }) {
  const {
  sesiones,
  sesionesLoading,
  cerrarSesion,
  cerrarTodasSesiones,
  cerrarTodasSesionesLoading,
} = useSeguridad();

  const [showConfirmAll, setShowConfirmAll] = useState(false);

  const getDeviceIcon = (dispositivo) => {
    if (dispositivo.toLowerCase().includes("mobile") || dispositivo.toLowerCase().includes("phone"))
      return <Phone size={20} />;
    if (dispositivo.toLowerCase().includes("tablet"))
      return <Tablet size={20} />;
    return <Laptop size={20} />;
  };
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCerrarSesion = async (sesionId) => {
    if (window.confirm("¿Cerrar esta sesión?")) {
      try {
        await cerrarSesion(sesionId);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleCerrarTodas = async () => {
    try {
      await cerrarTodasSesiones();
      setShowConfirmAll(false);
      alert("Todas las sesiones han sido cerradas");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-historial" onClick={onClose}>
      <div className="modal-content-historial" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-historial" onClick={onClose}>
          <XCircle size={24} />
        </button>

        <div className="modal-header-historial">
          <h2>Historial de Sesiones</h2>
          <p>Administra tus sesiones activas y revisa el historial de acceso</p>
        </div>

        <div className="modal-body-historial">
          {sesionesLoading ? (
            <div className="loading-sesiones">
              <div className="spinner-border text-primary"></div>
              <p>Cargando sesiones...</p>
            </div>
          ) : !sesiones || sesiones.length === 0 ? (
            <div className="empty-sesiones">
              <ClockHistory size={48} />
              <p>No hay sesiones registradas</p>
            </div>
          ) : (
            <>
              <div className="sesiones-actions">
                <button
                  className="btn-cerrar-todas"
                  onClick={() => setShowConfirmAll(true)}
                  disabled={cerrarTodasSesionesLoading}
                >
                  Cerrar todas las sesiones
                </button>
              </div>

              <div className="sesiones-list">
                {sesiones.map((sesion) => (
                  <div
                    key={sesion.id}
                    className={`sesion-card ${sesion.sesionActual ? "sesion-actual" : ""}`}
                  >
                    <div className="sesion-icon">
                      {getDeviceIcon(sesion.dispositivo)}
                    </div>
                    <div className="sesion-info">
                      <div className="sesion-header">
                        <h4>
                          {sesion.navegador}
                          {sesion.sesionActual && (
                            <span className="badge-actual">Sesión Actual</span>
                          )}
                        </h4>
                        {!sesion.sesionActual && (
                          <button
                            className="btn-cerrar-sesion"
                            onClick={() => handleCerrarSesion(sesion.id)}
                            title="Cerrar sesión"
                          >
                            <TrashFill size={16} />
                          </button>
                        )}
                      </div>
                      <p className="sesion-sistema">{sesion.sistemaOperativo}</p>
                      <div className="sesion-detalles">
                        <span>
                          <ClockHistory size={14} className="me-1" />
                          {formatFecha(sesion.fechaHora)}
                        </span>
                        <span>
                          <GeoAltFill size={14} className="me-1" />
                          {sesion.ciudad || "Desconocida"}, {sesion.pais || "N/A"}
                        </span>
                      </div>
                      <p className="sesion-ip">IP: {sesion.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showConfirmAll && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <ExclamationTriangleFill size={48} className="text-warning mb-3" />
              <h3>¿Cerrar todas las sesiones?</h3>
              <p>
                Esto cerrará todas las sesiones excepto la actual. Tendrás que iniciar
                sesión nuevamente en otros dispositivos.
              </p>
              <div className="confirm-actions">
                <button
                  onClick={() => setShowConfirmAll(false)}
                  className="btn-cancel-confirm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCerrarTodas}
                  className="btn-confirm-danger"
                  disabled={cerrarTodasSesionesLoading}
                >
                  {cerrarTodasSesionesLoading ? "Cerrando..." : "Sí, cerrar todas"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalHistorialSesiones;
