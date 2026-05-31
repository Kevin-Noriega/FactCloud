// src/pages/pos/PosLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash, EnvelopeFill, LockFill } from "react-bootstrap-icons";
import { useAuth } from "../../hooks/useAuth";
import "./PosLogin.css";

export default function PosLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setLoading(true);

    try {
      await login(correo, contrasena);
      navigate("/pos/ventas", { replace: true });
    } catch (err) {
      if (err?.response?.status === 423) {
        setError(
          `Cuenta desactivada. ${err.response?.data?.diasRestantes ?? ""} días para reactivar.`,
        );
      } else if (err?.response?.status === 401) {
        setError("Credenciales incorrectas.");
      } else if (err?.response?.status === 500) {
        setError("Error del servidor. Intenta nuevamente más tarde.");
      } else {
        setError(err?.response?.data?.message || "Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pos-login-layout">
      <section className="pos-login-left">
        <div className="pos-login-card">
          <div className="pos-login-brand">
            <img
              src="/img/IconoBlue_sinFondo.png"
              alt="Nubee POS"
              className="pos-login-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="pos-login-brand-text">
              <h1>Nubee POS</h1>
            </div>
          </div>
          <div className="pos-login-header">
            <h2>Inicio de sesión</h2>
            <p>Ingresa tus credenciales para acceder al punto de venta.</p>
          </div>

          {error && <div className="pos-login-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="pos-login-form">
            <div className="pos-login-field">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="pos-login-input-wrap">
                <EnvelopeFill className="pos-login-icon" />
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tucorreo@empresa.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="pos-login-field">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="pos-login-input-wrap">
                <LockFill className="pos-login-icon" />
                <input
                  id="contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="pos-login-toggle"
                  onClick={() => setMostrarContrasena((prev) => !prev)}
                  aria-label={
                    mostrarContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarContrasena ? <EyeSlash /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="pos-login-actions">
              <button
                type="button"
                className="pos-login-link"
                onClick={() => navigate("/recuperar-contrasena")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="pos-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="pos-login-spinner" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <p className="pos-login-legal">
            Al ingresar aceptas nuestros{" "}
            <a href="/terminos">Términos de servicio</a> y nuestra{" "}
            <a href="/privacidad">Política de privacidad</a>.
          </p>

          <p className="pos-login-version">Versión 2.6.15</p>
        </div>
      </section>

      <section className="pos-login-right">
        <div className="pos-login-visual-card">
          <img
            src="/img/img_login.webp"
            alt="FactCloud POS visual"
            className="pos-login-visual-image"
          />
          <div className="pos-login-visual-overlay" />
          <div className="pos-login-visual-content">
            <span className="pos-login-chip">Nubee POS</span>
            <h3>Vende más rápido y gestiona tu negocio sin complicaciones</h3>
            <p>
              Controla ventas, clientes y productos desde una sola plataforma,
              con una experiencia simple, moderna y segura.
            </p>
            <button
              type="button"
              className="pos-login-secondary"
              onClick={() => navigate("/")}
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
