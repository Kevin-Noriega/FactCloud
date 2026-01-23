import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";
import logo from "../img/logoFC.png";
import "../styles/Login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        const error = await res.json();
        alert(error.message || "Credenciales incorrectas");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/dashboard");
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <img src={logo} alt="FactCloud" className="login-logo" />

        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">
          Accede a tu plataforma de facturación electrónica
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Correo electrónico
            <input
              type="email"
              placeholder="correo@empresa.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-actions">
          <span>¿No tienes cuenta?</span>
          <button onClick={() => navigate("/planes")}>
            Regístrate
          </button>
        </div>
        <footer className="login-footer">
          © 2025 FACTCLOUD
        </footer>
      </section>
    </main>
  );
}
