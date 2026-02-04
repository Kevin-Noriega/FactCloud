import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";
import "../styles/Login.css";
import { Eye, EyeSlash, EnvelopeFill, LockFill } from 'react-bootstrap-icons';

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo,
          contrasena,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Credenciales incorrectas");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-layout">
      <section className="login-visual">
        <div className="login-visual-overlay">
          <div className="login-visual-content">
  <img
    src="/img/LogoFC.png"
    alt="FactCloud"
    className="login-visual-logo"
  />

  <h2 className="login-visual-title">
    Bienvenido de nuevo a FactCloud
  </h2>

  <p className="login-visual-subtitle">
    Nos alegra verte otra vez. Accede a tu cuenta y continúa gestionando
    tu facturación de forma segura y sencilla.
  </p>

</div>

        </div>
        <img src="/img/img_login.webp" alt="Background" className="login-visual-bg" />
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <div className="login-header">

            <h1 className="login-title">Inicio de sesion</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="login-alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="correo" className="login-label">Correo electrónico</label>
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
              <label htmlFor="contrasena" className="login-label">Contraseña</label>
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

            <button type="submit" className="login-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Ingresando...
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
            onClick={() => navigate("/registro")}
          >
            Crear cuenta gratis
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
