import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegistrarUsuario() {
    const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombreUsuario: "",
    apellidoUsuario: "",
    correoUsuario: "",
    telefonoUsuario: "",
    contraseñaUsuario: "", // si quieres, cambia a "contrasenaUsuario"
    nitNegocioUsuario: "",
    dvNitUsuario: "",
    nombreNegocioUsuario: "",
    tipoRegimen: "",
    // CORRECCIÓN: una sola "r"
    direccionNegocioUsuario: "",
    ciudadNegocioUsuario: "",
    departamentoNegocioUsuario: "",
    correoFacturacionUsuario: "",
    logoNegocioUsuario: "",
    // CORRECCIÓN: propiedad en minúscula
    estado: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Datos enviados:", usuario);
    // Aquí puedes integrar tu API

    try {
      const response = await fetch("http://localhost:5119/api/Usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Aquí envío las mismas claves que están en el estado
          nombreUsuario: usuario.nombreUsuario,
          apellidoUsuario: usuario.apellidoUsuario,
          correoUsuario: usuario.correoUsuario,
          telefonoUsuario: usuario.telefonoUsuario,
          contraseñaUsuario: usuario.contraseñaUsuario,
          nitNegocioUsuario: usuario.nitNegocioUsuario,
          dvNitUsuario: usuario.dvNitUsuario,
          nombreNegocioUsuario: usuario.nombreNegocioUsuario,
          tipoRegimen: usuario.tipoRegimen,
          direccionNegocioUsuario: usuario.direccionNegocioUsuario,
          ciudadNegocioUsuario: usuario.ciudadNegocioUsuario,
          departamentoNegocioUsuario: usuario.departamentoNegocioUsuario,
          correoFacturacionUsuario: usuario.correoFacturacionUsuario,
          logoNegocioUsuario: usuario.logoNegocioUsuario,
          estado: usuario.estado,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Usuario registrado correctamente:", data);
        alert("Usuario registrado con éxito 🎉");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("❌ Error al registrar usuario:", errorData);
        alert("Error al registrar usuario. Revisa los datos ingresados.");
      }
    } catch (error) {
      console.error("⚠️ Error de conexión con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const estilos = {
    fondo: {
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
      padding: "40px 20px",
    },
    contenedor: {
      background: "#f9fafb",
      borderRadius: "15px",
      padding: "40px 50px",
      width: "100%",
      maxWidth: "900px",
      boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
    },
    titulo: {
      textAlign: "center",
      fontSize: "2rem",
      color: "#15803d",
      marginBottom: "30px",
      fontWeight: "bold",
    },
    subtitulo: {
      color: "#15803d",
      fontSize: "1.3rem",
      marginBottom: "25px",
      borderBottom: "1px solid #d1d5db",
      paddingBottom: "8px",
    },
    fila: {
      display: "flex",
      gap: "20px",
      marginBottom: "15px",
    },
    campo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#334155",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "1rem",
      outline: "none",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "1rem",
      outline: "none",
    },
    boton: {
      backgroundColor: "#15803d",
      color: "#ffffff",
      border: "none",
      padding: "12px",
      width: "100%",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "20px",
      transition: "background 0.3s",
    },
  };

  return (
    <div style={estilos.fondo}>
      <div style={estilos.contenedor}>
        <h2 style={estilos.titulo}>
          Fact<span style={{ color: "#22c55e" }}>Cloud</span>
        </h2>

        <h3 style={estilos.subtitulo}>Registro de Usuario / Emisor</h3>

        <form onSubmit={handleSubmit}>
          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Nombre</label>
              <input
                type="text"
                name="nombreUsuario"
                value={usuario.nombreUsuario}
                onChange={handleChange}
                style={estilos.input}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Apellido</label>
              <input
                type="text"
                name="apellidoUsuario"
                value={usuario.apellidoUsuario}
                onChange={handleChange}
                style={estilos.input}
                required
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Correo</label>
              <input
                type="email"
                name="correoUsuario"
                value={usuario.correoUsuario}
                onChange={handleChange}
                style={estilos.input}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Teléfono</label>
              <input
                type="text"
                name="telefonoUsuario"
                value={usuario.telefonoUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input
              type="password"
              name="contraseñaUsuario"
              value={usuario.contraseñaUsuario}
              onChange={handleChange}
              style={estilos.input}
              required
            />
          </div>

          <hr style={{ margin: "25px 0" }} />

          <h3 style={estilos.subtitulo}>Información del Negocio</h3>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>NIT del negocio</label>
              <input
                type="text"
                name="nitNegocioUsuario"
                value={usuario.nitNegocioUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
            <div style={{ width: "200px" }}>
              <label style={estilos.label}>DV</label>
              <input
                type="number"
                name="dvNitUsuario"
                value={usuario.dvNitUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Nombre del negocio</label>
            <input
              type="text"
              name="nombreNegocioUsuario"
              value={usuario.nombreNegocioUsuario}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Tipo de régimen</label>
              <select
                name="tipoRegimen"
                value={usuario.tipoRegimen}
                onChange={handleChange}
                style={estilos.select}
              >
                <option value="">Selecciona...</option>
                <option value="Simplificado">Simplificado</option>
                <option value="Común">Común</option>
              </select>
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Dirección</label>
              <input
                type="text"
                name="direccionNegocioUsuario"
                value={usuario.direccionNegocioUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Ciudad</label>
              <input
                type="text"
                name="ciudadNegocioUsuario"
                value={usuario.ciudadNegocioUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Departamento</label>
              <input
                type="text"
                name="departamentoNegocioUsuario"
                value={usuario.departamentoNegocioUsuario}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Correo de facturación</label>
            <input
              type="email"
              name="correoFacturacionUsuario"
              value={usuario.correoFacturacionUsuario}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Logo del negocio (URL)</label>
            <input
              type="text"
              name="logoNegocioUsuario"
              value={usuario.logoNegocioUsuario}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Estado</label>
            <select
              name="estado"
              value={usuario.estado}
              onChange={(e) =>
                setUsuario({ ...usuario, estado: e.target.value === "true" })
              }
              style={estilos.select}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <button
            type="submit"
            style={estilos.boton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#166534")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#15803d")}
          >
            Guardar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrarUsuario;
