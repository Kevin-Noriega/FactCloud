import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de autenticación exitosa
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-header bg-info text-white text-center">
          <h3 className="mb-0">FACTCLOUD</h3>
          <small>Acceso al Sistema de Gestión</small>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                defaultValue="admin"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                defaultValue="password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
 