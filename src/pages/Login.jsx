import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { Eye, EyeSlash, EnvelopeFill, LockFill } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export default function login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError("");

    try {
      await login(correo, contrasena); 
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 423) {
        setError(
          `Cuenta desactivada. ${err.response.data.diasRestantes} días para reactivar.`,
        );
      } else if (err.response?.status === 401) {
        setError("Credenciales incorrectas");
      } else if (err.response?.status === 500) {
        setError("Error del servidor. Intenta más tarde.");
      } else {
        setError(err.response?.data?.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };
  // ... JSX

  const estiloAnimacion = document.createElement("style");
  estiloAnimacion.innerHTML = `
@keyframes moverFondo {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
  document.head.appendChild(estiloAnimacion);

  return (
    <main className="login-layout">
      <section className="login-visual">
        <div className="login-visual-overlay">
          <div className="login-visual-content">
            <img
              src="/img/LogoWhite_sinFondo.png"
              alt="FactCloud"
              className="login-visual-logo"
            />

            <h2 className="login-visual-title">
              Bienvenido de nuevo
            </h2>

            <p className="login-visual-subtitle">
              Nos alegra verte otra vez. Accede a tu cuenta y continúa
              gestionando tu facturación de forma segura y sencilla.
            </p>
          </div>
        </div>
        <img
          src="/img/img_login.webp"
          alt="Background"
          className="login-visual-bg"
        />
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Inicio de sesion</h1>
            <p className="login-subtitle">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {error && (
            <div className="login-alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="correo" className="login-label">
                Correo electrónico
              </label>
              <div className="login-input-wrapper">
                <EnvelopeFill className="login-input-icon" />
                <input
                  id="correo"
                  type="email"
                  placeholder="tucorreo@empresa.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  autoComplete="email"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="contrasena" className="login-label">
                Contraseña
              </label>
              <div className="login-input-wrapper">
                <LockFill className="login-input-icon" />
                <input
                  id="contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="login-input"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  tabIndex="-1"
                >
                  {mostrarContrasena ? <EyeSlash /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="login-form-options">
              <label className="login-checkbox-wrapper">
                <input type="checkbox" className="login-checkbox" />
                <span>Recordarme</span>
              </label>
              <button type="button" className="login-link-button">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="login-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>¿No tienes cuenta?</span>
          </div>

          <button
            type="button"
            className="login-btn-register"
            onClick={() => navigate("/planes")}
          >
            Crear cuenta
          </button>

          <footer className="login-footer">
            <div className="login-footer-links">
              <a href="/terminos">Términos</a>
              <span>•</span>
              <a href="/privacidad">Privacidad</a>
              <span>•</span>
              <a href="/soporte">Soporte</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}