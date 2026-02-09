import { useEffect, useRef } from "react";
import { 
  XCircle, 
  Bell, 
  CheckCircleFill, 
  ExclamationTriangleFill,
  InfoCircleFill,
  XCircleFill,
  Trash,
  Check2All,
  Clock
} from "react-bootstrap-icons";
import {
  useNotificaciones,
  useMarcarComoLeida,
  useMarcarTodasLeidas,
  useEliminarNotificacion,
} from "../../hooks/useNotificaciones";
import "../../styles/ModalNotificaciones.css";

function ModalNotificaciones({ isOpen, onClose, buttonRef }) {
  const dropdownRef = useRef(null);
  const { data: notificaciones = [], isLoading } = useNotificaciones();
  const marcarLeidaMutation = useMarcarComoLeida();
  const marcarTodasMutation = useMarcarTodasLeidas();
  const eliminarMutation = useEliminarNotificacion();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const getIcono = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "success":
        return <CheckCircleFill size={20} />;
      case "warning":
        return <ExclamationTriangleFill size={20} />;
      case "info":
        return <InfoCircleFill size={20} />;
      case "error":
        return <XCircleFill size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getTiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diferencia = ahora - fechaNotif;
    const minutos = Math.floor(diferencia / 1000 / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return "Ahora";
    if (minutos < 60) return `Hace ${minutos}m`;
    if (horas < 24) return `Hace ${horas}h`;
    return `Hace ${dias}d`;
  };

  const handleMarcarLeida = (id, leida) => {
    if (!leida) {
      marcarLeidaMutation.mutate(id);
    }
  };

  const handleMarcarTodas = () => {
    marcarTodasMutation.mutate();
  };

  const handleEliminar = (id, e) => {
    e.stopPropagation();
    eliminarMutation.mutate(id);
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="notificaciones-dropdown" ref={dropdownRef}>
      <div className="notificaciones-dropdown-header">
        <div className="notificaciones-title">
          <h3>Notificaciones</h3>
          {noLeidas > 0 && (
            <span className="notif-badge-header">{noLeidas}</span>
          )}
        </div>
        {noLeidas > 0 && (
          <button 
            className="btn-marcar-todas-dropdown" 
            onClick={handleMarcarTodas}
            disabled={marcarTodasMutation.isPending}
            title="Marcar todas como leídas"
          >
            <Check2All size={18} />
          </button>
        )}
      </div>

      <div className="notificaciones-dropdown-body">
        {isLoading ? (
          <div className="notif-empty">
            <div className="spinner-notif"></div>
            <p>Cargando...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="notif-empty">
            <Bell size={48} className="empty-icon" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="notif-list">
            {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item-dropdown ${notif.leida ? 'leida' : 'no-leida'} notif-${notif.tipo.toLowerCase()}`}
                onClick={() => handleMarcarLeida(notif.id, notif.leida)}
              >
                <div className={`notif-indicator notif-indicator-${notif.tipo.toLowerCase()}`}></div>
                <div className="notif-icon-dropdown">
                  {getIcono(notif.tipo)}
                </div>
                <div className="notif-content-dropdown">
                  <h4 className="notif-titulo">{notif.titulo}</h4>
                  <p className="notif-mensaje">{notif.mensaje}</p>
                  <div className="notif-fecha">
                    <Clock size={12} />
                    <span>{getTiempoTranscurrido(notif.fechaCreacion)}</span>
                  </div>
                </div>
                {!notif.leida && <div className="notif-dot"></div>}
                <button
                  className="notif-delete-dropdown"
                  onClick={(e) => handleEliminar(notif.id, e)}
                  disabled={eliminarMutation.isPending}
                  title="Eliminar"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {notificaciones.length > 5 && (
        <div className="notificaciones-dropdown-footer">
          <button className="btn-ver-todas">Ver todas las notificaciones</button>
        </div>
      )}
    </div>
  );
}

export default ModalNotificaciones;
