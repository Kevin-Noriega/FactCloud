import { useEffect, useState } from "react";
import { 
  XCircle, 
  Gear, 
  Bell,
  Envelope,
  Moon,
  Globe,
  Shield,
  Database,
  CheckCircleFill
} from "react-bootstrap-icons";
import "../../styles/ModalConfiguracion.css";

function ModalConfiguracion({ isOpen, onClose }) {
  const [config, setConfig] = useState({
    notificaciones: {
      email: true,
      push: true,
      facturas: true,
      clientes: false,
      productos: true,
    },
    apariencia: {
      modoOscuro: false,
      idioma: "es",
      tamanoFuente: "medium",
    },
    seguridad: {
      autenticacion2F: false,
      cerrarSesionAuto: true,
      tiempoCierre: 30,
    },
    facturacion: {
      envioAutomatico: true,
      recordatorios: true,
      diasRecordatorio: 3,
      copiaCCO: "",
    }
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (seccion, campo) => {
    setConfig(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: !prev[seccion][campo]
      }
    }));
  };

  const handleChange = (seccion, campo, valor) => {
    setConfig(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGuardando(false);
    setMensaje("Configuración guardada correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="modal-overlay-config" onClick={onClose}>
      <div className="modal-container-config" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-config">
          <div className="modal-title-config">
            <Gear size={24} className="me-2" />
            <h3>Configuración</h3>
          </div>
          <button className="modal-close-config" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>

        <div className="modal-body-config">
          {mensaje && (
            <div className="config-mensaje">
              <CheckCircleFill size={18} className="me-2" />
              {mensaje}
            </div>
          )}

          <div className="config-section">
            <div className="config-section-header">
              <Bell size={20} className="me-2" />
              <h4>Notificaciones</h4>
            </div>
            <div className="config-section-body">
              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Notificaciones por correo</p>
                  <span className="config-item-desc">Recibe alertas en tu email</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.email}
                    onChange={() => handleToggle('notificaciones', 'email')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Notificaciones push</p>
                  <span className="config-item-desc">Alertas en tiempo real</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.push}
                    onChange={() => handleToggle('notificaciones', 'push')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Alertas de facturas</p>
                  <span className="config-item-desc">Notificar sobre facturas pendientes</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.facturas}
                    onChange={() => handleToggle('notificaciones', 'facturas')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Alertas de clientes</p>
                  <span className="config-item-desc">Notificar nuevos clientes</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.notificaciones.clientes}
                    onChange={() => handleToggle('notificaciones', 'clientes')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <Moon size={20} className="me-2" />
              <h4>Apariencia</h4>
            </div>
            <div className="config-section-body">
              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Modo oscuro</p>
                  <span className="config-item-desc">Tema oscuro para la interfaz</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.apariencia.modoOscuro}
                    onChange={() => handleToggle('apariencia', 'modoOscuro')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Idioma</p>
                  <span className="config-item-desc">Selecciona el idioma de la aplicación</span>
                </div>
                <select
                  className="config-select"
                  value={config.apariencia.idioma}
                  onChange={(e) => handleChange('apariencia', 'idioma', e.target.value)}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Tamaño de fuente</p>
                  <span className="config-item-desc">Ajusta el tamaño del texto</span>
                </div>
                <select
                  className="config-select"
                  value={config.apariencia.tamanoFuente}
                  onChange={(e) => handleChange('apariencia', 'tamanoFuente', e.target.value)}
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <Shield size={20} className="me-2" />
              <h4>Seguridad</h4>
            </div>
            <div className="config-section-body">
              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Autenticación de dos factores</p>
                  <span className="config-item-desc">Seguridad adicional al iniciar sesión</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.seguridad.autenticacion2F}
                    onChange={() => handleToggle('seguridad', 'autenticacion2F')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Cerrar sesión automáticamente</p>
                  <span className="config-item-desc">Por inactividad</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.seguridad.cerrarSesionAuto}
                    onChange={() => handleToggle('seguridad', 'cerrarSesionAuto')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              {config.seguridad.cerrarSesionAuto && (
                <div className="config-item">
                  <div className="config-item-info">
                    <p className="config-item-title">Tiempo de cierre (minutos)</p>
                    <span className="config-item-desc">Minutos de inactividad</span>
                  </div>
                  <input
                    type="number"
                    className="config-input"
                    value={config.seguridad.tiempoCierre}
                    onChange={(e) => handleChange('seguridad', 'tiempoCierre', parseInt(e.target.value))}
                    min="5"
                    max="120"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <Envelope size={20} className="me-2" />
              <h4>Facturación</h4>
            </div>
            <div className="config-section-body">
              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Envío automático</p>
                  <span className="config-item-desc">Enviar facturas automáticamente</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.facturacion.envioAutomatico}
                    onChange={() => handleToggle('facturacion', 'envioAutomatico')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Recordatorios de pago</p>
                  <span className="config-item-desc">Enviar recordatorios a clientes</span>
                </div>
                <label className="config-toggle">
                  <input
                    type="checkbox"
                    checked={config.facturacion.recordatorios}
                    onChange={() => handleToggle('facturacion', 'recordatorios')}
                  />
                  <span className="config-toggle-slider"></span>
                </label>
              </div>

              {config.facturacion.recordatorios && (
                <div className="config-item">
                  <div className="config-item-info">
                    <p className="config-item-title">Días antes del vencimiento</p>
                    <span className="config-item-desc">Enviar recordatorio X días antes</span>
                  </div>
                  <input
                    type="number"
                    className="config-input"
                    value={config.facturacion.diasRecordatorio}
                    onChange={(e) => handleChange('facturacion', 'diasRecordatorio', parseInt(e.target.value))}
                    min="1"
                    max="15"
                  />
                </div>
              )}

              <div className="config-item">
                <div className="config-item-info">
                  <p className="config-item-title">Copia CCO</p>
                  <span className="config-item-desc">Email para copia oculta</span>
                </div>
                <input
                  type="email"
                  className="config-input"
                  placeholder="email@ejemplo.com"
                  value={config.facturacion.copiaCCO}
                  onChange={(e) => handleChange('facturacion', 'copiaCCO', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-config">
          <button className="btn-cancelar-config" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-guardar-config" 
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfiguracion;
