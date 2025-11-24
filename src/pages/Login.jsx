import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";
import logo from "../img/logoFC.png";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    console.log(
      "JSON enviado:",
      JSON.stringify({
        Correo: correo,
        Contrasena: contraseña,
      })
    );

    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Correo: correo,
          Contrasena: contraseña,
        }),
      });

      if (!response.ok) {
        alert("❌ Correo o contraseña incorrectos");
        return;
      }

      const data = await response.json(); 

      // data = { token: "...", usuario: {...} }
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      alert("✅ Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error login:", error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  const estiloAnimacion = document.createElement("style");
  estiloAnimacion.innerHTML = `
@keyframes moverFondo {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
  document.head.appendChild(estiloAnimacion);

  const estilos = {
    fondo: {
      background:
        "linear-gradient(135deg, #0b1522, #0f1e32, #113a56, #2f78a2ff)",
      backgroundSize: "600% 600%",
      animation: "moverFondo 10s ease infinite",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
      color: "white",
    },
    tarjeta: {
      backgroundColor: "#ffffff",
      padding: "25px 40px",
      borderRadius: "16px",
      width: "380px",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.35)",
      textAlign: "center",
    },
    subtitulo: {
      color: "#1e293b",
      fontSize: "19px",
      marginBottom: "32px",
    },
    campo: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "21px",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6.4px",
      color: "#000000ff",
    },
    input: {
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      padding: "13px",
      fontSize: "16px",
      outline: "none",
    },
    boton: {
      backgroundColor: "#16a34a",
      color: "#ffffff",
      border: "none",
      padding: "14px",
      width: "100%",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "8px",
      transition: "background 300ms",
    },
    footer: {
      marginTop: "2px",
      color: "#64748b",
      fontSize: "14px",
    },
  };
  return (
    <div style={estilos.fondo}>
      <div style={estilos.tarjeta}>
        <img src={logo} alt="logo FactCloud" className="pb-3" />
        <h2 style={estilos.subtitulo}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div style={estilos.campo}>
            <label style={estilos.label}>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese su correo electronico"
              style={estilos.input}
              required
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingrese su contraseña"
              style={estilos.input}
              required
            />
          </div>

          <button
            type="submit"
            style={estilos.boton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
          >
            Ingresar
          </button>

          <p style={{ marginTop: "15px", color: "#475569" }}>
            ¿No tienes cuenta?{" "}
            <span
              style={{ color: "#00a2ff", fontWeight: "600", cursor: "pointer" }}
              onClick={() => navigate("/registrarUsuario")}
            >
              Regístrate aquí
            </span>
          </p>
        </form>

        <p style={estilos.footer}>© 2025 FACTCLOUD</p>
      </div>
    </div>
  );
}

export default Login;
