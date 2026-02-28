import { useState } from "react";
import { XCircle, Key, CheckCircleFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useSeguridad } from "../../hooks/useSeguridad";
import "../../styles/perfil/ModalCambiarContraseña.css";

function ModalCambiarContraseña({ isOpen, onClose }) {
  const { cambiarContrasena, cambiarContrasenaLoading } = useSeguridad();
  
  const [formData, setFormData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await cambiarContrasena(formData);
      alert("Contraseña actualizada correctamente");
      onClose();
      setFormData({
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-seguridad" onClick={onClose}>
      <div className="modal-content-seguridad" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-seguridad" onClick={onClose}>
          <XCircle size={24} />
        </button>

        <div className="modal-header-seguridad">
          <h2>Cambiar Contraseña</h2>
          <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
        </div>

        <form onSubmit={handleSubmit} className="form-seguridad">
          {error && (
            <div className="alert-error-seguridad">
              <XCircle className="me-2" />
              {error}
            </div>
          )}

          <div className="form-group-seguridad">
            <label>Contraseña Actual *</label>
            <div className="input-password-wrapper">
              <input
                type={showPasswords.actual ? "text" : "password"}
                name="contrasenaActual"
                value={formData.contrasenaActual}
                onChange={handleChange}
                required
                className="form-control-seguridad"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => toggleShowPassword("actual")}
              >
                {showPasswords.actual ? <EyeSlashFill /> : <EyeFill />}
              </button>
            </div>
          </div>

          <div className="form-group-seguridad">
            <label>Nueva Contraseña *</label>
            <div className="input-password-wrapper">
              <input
                type={showPasswords.nueva ? "text" : "password"}
                name="nuevaContrasena"
                value={formData.nuevaContrasena}
                onChange={handleChange}
                required
                minLength={6}
                className="form-control-seguridad"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => toggleShowPassword("nueva")}
              >
                {showPasswords.nueva ? <EyeSlashFill /> : <EyeFill />}
              </button>
            </div>
          </div>

          <div className="form-group-seguridad">
            <label>Confirmar Nueva Contraseña *</label>
            <div className="input-password-wrapper">
              <input
                type={showPasswords.confirmar ? "text" : "password"}
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
                className="form-control-seguridad"
                placeholder="Repite la nueva contraseña"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => toggleShowPassword("confirmar")}
              >
                {showPasswords.confirmar ? <EyeSlashFill /> : <EyeFill />}
              </button>
            </div>
          </div>

          <div className="form-actions-seguridad">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-seguridad"
              disabled={cambiarContrasenaLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary-seguridad"
              disabled={cambiarContrasenaLoading}
            >
              {cambiarContrasenaLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Actualizando...
                </>
              ) : (
                <>
                  Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCambiarContraseña;
