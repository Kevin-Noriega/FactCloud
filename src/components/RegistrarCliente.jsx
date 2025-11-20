import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegistrarCliente() {
  const navigate = useNavigate();

  // 🔹 Tomamos el usuario en sesión del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.id_Usuario;

  const [cliente, setCliente] = useState({
    Id_Usuario: idUsuario || null,
    TipoPersona: "",
    TipoDocumento: "",
    NumeroDocumento: "",
    DvNit: "",
    NombreCliente: "",
    NombreComercial: "",
    CorreoCliente: "",
    TelefonoCliente: "",
    DireccionCliente: "",
    CiudadCliente: "",
    DepartamentoCliente: "",
    PaisCliente: "CO",
    TipoResponsabilidad: "",
    TipoRegimen: "",
    FechaRegistro: new Date().toISOString(),
    EstadoCliente: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Datos del cliente:", cliente);

    try {
      const response = await fetch("http://localhost:5119/api/Clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        const data = await response.json();
        alert("✅ Cliente registrado con éxito");
        console.log("Nuevo cliente:", data);
        navigate("/clientes");
      } else {
        const errorData = await response.json();
        console.error("❌ Error al registrar cliente:", errorData);
        alert("Error al registrar el cliente. Revisa los datos.");
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
      maxWidth: "950px",
      boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
    },
    titulo: {
      textAlign: "center",
      fontSize: "2rem",
      color: "#1d4ed8",
      marginBottom: "30px",
      fontWeight: "bold",
    },
    subtitulo: {
      color: "#1d4ed8",
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
      backgroundColor: "#1d4ed8",
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
        <h2 style={estilos.titulo}>Registro de Cliente</h2>
        <form onSubmit={handleSubmit}>
          <h3 style={estilos.subtitulo}>Datos Generales</h3>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Tipo de Persona</label>
              <select
                name="TipoPersona"
                value={cliente.TipoPersona}
                onChange={handleChange}
                style={estilos.select}
                required
              >
                <option value="">Selecciona...</option>
                <option value="Natural">Natural</option>
                <option value="Jurídica">Jurídica</option>
              </select>
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Tipo de Documento</label>
              <select
                name="TipoDocumento"
                value={cliente.TipoDocumento}
                onChange={handleChange}
                style={estilos.select}
                required
              >
                <option value="">Selecciona...</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
              </select>
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Número de Documento / NIT</label>
              <input
                type="text"
                name="NumeroDocumento"
                value={cliente.NumeroDocumento}
                onChange={handleChange}
                style={estilos.input}
                required
              />
            </div>
            <div style={{ width: "120px" }}>
              <label style={estilos.label}>DV</label>
              <input
                type="number"
                name="DvNit"
                value={cliente.DvNit}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Nombre o Razón Social</label>
            <input
              type="text"
              name="NombreCliente"
              value={cliente.NombreCliente}
              onChange={handleChange}
              style={estilos.input}
              required
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Nombre Comercial (opcional)</label>
            <input
              type="text"
              name="NombreComercial"
              value={cliente.NombreComercial}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <h3 style={estilos.subtitulo}>Contacto</h3>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Correo Electrónico</label>
              <input
                type="email"
                name="CorreoCliente"
                value={cliente.CorreoCliente}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Teléfono</label>
              <input
                type="text"
                name="TelefonoCliente"
                value={cliente.TelefonoCliente}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Dirección</label>
            <input
              type="text"
              name="DireccionCliente"
              value={cliente.DireccionCliente}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Ciudad</label>
              <input
                type="text"
                name="CiudadCliente"
                value={cliente.CiudadCliente}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Departamento</label>
              <input
                type="text"
                name="DepartamentoCliente"
                value={cliente.DepartamentoCliente}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <h3 style={estilos.subtitulo}>Información Tributaria</h3>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Responsabilidad Tributaria</label>
              <input
                type="text"
                name="TipoResponsabilidad"
                value={cliente.TipoResponsabilidad}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Tipo de Régimen</label>
              <select
                name="TipoRegimen"
                value={cliente.TipoRegimen}
                onChange={handleChange}
                style={estilos.select}
              >
                <option value="">Selecciona...</option>
                <option value="Simplificado">Simplificado</option>
                <option value="Común">Común</option>
              </select>
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Estado</label>
            <select
              name="EstadoCliente"
              value={cliente.EstadoCliente}
              onChange={(e) =>
                setCliente({ ...cliente, EstadoCliente: e.target.value === "true" })
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
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          >
            Guardar Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrarCliente;
