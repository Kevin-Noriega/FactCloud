import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("📩 Verificando usuario...");
      const response = await fetch(`${API_URL}/Usuarios`);
      const usuarios = await response.json();

      console.log("📋 Usuarios obtenidos:", usuarios);

      // ✅ CORREGIDO: Usar los nombres correctos del modelo C#
      const usuarioEncontrado = usuarios.find(
        (u) => u.correo === correo && u.contrasenaHash === contraseña
      );

      if (usuarioEncontrado) {
        alert("✅ Inicio de sesión exitoso");
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
        navigate("/dashboard");
      } else {
        alert("❌ Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const estilos = {
    fondo: {
      backgroundColor: "#0f172a",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
    },
    tarjeta: {
      backgroundColor: "#ffffff",
      padding: "3rem 2.5rem",
      borderRadius: "1rem",
      width: "380px",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.35)",
      textAlign: "center",
    },
    titulo: {
      color: "#15803d",
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      letterSpacing: "1px",
    },
    subtitulo: {
      color: "#1e293b",
      fontSize: "1.2rem",
      marginBottom: "2rem",
    },
    campo: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "1.3rem",
    },
    label: {
      fontWeight: "600",
      marginBottom: "0.4rem",
      color: "#334155",
    },
    input: {
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      padding: "0.8rem",
      fontSize: "1rem",
      outline: "none",
    },
    boton: {
      backgroundColor: "#16a34a",
      color: "#ffffff",
      border: "none",
      padding: "0.9rem",
      width: "100%",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "0.5rem",
      transition: "background 0.3s",
    },
    botonRegistro: {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
      border: "none",
      padding: "0.9rem",
      width: "100%",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "0.8rem",
      transition: "background 0.3s",
    },
    footer: {
      marginTop: "2rem",
      color: "#64748b",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={estilos.fondo}>
      <div style={estilos.tarjeta}>
        <h1 style={estilos.titulo}>
          Fact<span style={{ color: "#22c55e" }}>Cloud</span>
        </h1>
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

          <button
            type="button"
            style={estilos.botonRegistro}
            onClick={() => navigate("/registrar-usuario")}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0284c7")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0ea5e9")}
          >
            Registrarse
          </button>
        </form>

        <p style={estilos.footer}>© 2025 FACTCLOUD</p>
      </div>
    </div>
  );
}

export default Login;
