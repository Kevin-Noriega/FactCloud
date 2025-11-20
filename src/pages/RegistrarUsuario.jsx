import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { API_URL } from "../api/config";
import ciudades from "../utils/Ciudades.json";
import logo from "../img/logoFC.png";

function RegistrarUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombreUsuario: "",
    apellidoUsuario: "",
    correoUsuario: "",
    telefonoUsuario: "",
    contraseñaUsuario: "",
    nitNegocioUsuario: "",
    dvNit: "",
    nombreNegocioUsuario: "",
    tipoRegimen: "",
    direccionNegocio: "",
    ciudadNegocio: "",
    departamentoNegocio: "",
    correoNegocio: "",
    logoNegocioUsuario: "",
    estado: true,

    //faltante
    tipoIdentificacion: "",
    codigoPostal: "",
    municipioCodigo: "",
    departamentoCodigo: "",
    telefonoNegocio: "",
    actividadEconomicaCIIU: "",
    regimenFiscal: "",
    responsabilidadesRUT: "",
    pais: "CO",
    softwareProveedor: "",
    softwarePIN: "",
    prefijoAutorizadoDIAN: "",
    numeroResolucionDIAN: "",
    fechaResolucionDIAN: "",
    rangoNumeracionDesde: "",
    rangoNumeracionHasta: "",
    ambienteDIAN: "",
  });

  const opcionesDepartamentos = Object.keys(ciudades).map((dep) => ({
    label: dep,
    value: dep,
  }));

  const opcionesCiudades = usuario.departamentoNegocio
    ? ciudades[usuario.departamentoNegocio].map((c) => ({
        label: c,
        value: c,
      }))
    : [];

  const opcionesTipoRegimen = [
    { label: "Simplificado", value: "Simplificado" },
    { label: "Común", value: "Común" },
  ];

  const opcionesEstado = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    setUsuario({
      ...usuario,
      [field]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleDepartamentoChangeSelect = (selectedOption) => {
    const depto = selectedOption ? selectedOption.value : "";
    setUsuario({
      ...usuario,
      departamentoNegocio: depto,
      ciudadNegocio: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: usuario.nombreUsuario,
      apellido: usuario.apellidoUsuario,
      correo: usuario.correoUsuario,
      telefono: usuario.telefonoUsuario,
      contrasenaHash: usuario.contraseñaUsuario,
      nitNegocio: usuario.nitNegocioUsuario,
      dvNitNegocio: usuario.dvNit,
      nombreNegocio: usuario.nombreNegocioUsuario,
      tipoRegimen: usuario.tipoRegimen,
      direccionNegocio: usuario.direccionNegocio,
      departamentoNegocio: usuario.departamentoNegocio,
      ciudadNegocio: usuario.ciudadNegocio,
      correoNegocio: usuario.correoNegocio,
      logoNegocio: usuario.logoNegocioUsuario,
      estado: usuario.estado,
    };

    try {
      const response = await fetch(`${API_URL}/Usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Error al registrar usuario:", errorData);
        alert("Error al registrar usuario. Revisa los datos ingresados.");
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
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
        "linear-gradient(135deg, #0b1522, #0f1e32, #113a56, #31607bff)",
      backgroundSize: "600% 600%",
      animation: "moverFondo 15s ease infinite",
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
      color: "#00a2ff",
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
      color: "#0f1e32",
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
      backgroundColor: "#00a2ff",
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
        <div style={{ textAlign: "center" }}>
          <img src={logo} alt="logo FactCloud" className="pb-5" />
        </div>

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
                name="dvNit"
                value={usuario.dvNit}
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
              <Select
                options={opcionesTipoRegimen}
                value={
                  usuario.tipoRegimen
                    ? opcionesTipoRegimen.find(
                        (o) => o.value === usuario.tipoRegimen
                      )
                    : null
                }
                onChange={(opt) => handleSelectChange("tipoRegimen", opt)}
                isClearable
                placeholder="Selecciona..."
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Dirección</label>
              <input
                type="text"
                name="direccionNegocio"
                value={usuario.direccionNegocio}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Departamento</label>
              <Select
                options={opcionesDepartamentos}
                value={
                  usuario.departamentoNegocio
                    ? {
                        label: usuario.departamentoNegocio,
                        value: usuario.departamentoNegocio,
                      }
                    : null
                }
                onChange={handleDepartamentoChangeSelect}
                isClearable
                placeholder="Seleccionar departamento"
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Ciudad o Municipio</label>
              <Select
                options={opcionesCiudades}
                value={
                  usuario.ciudadNegocio
                    ? {
                        label: usuario.ciudadNegocio,
                        value: usuario.ciudadNegocio,
                      }
                    : null
                }
                onChange={(opt) => handleSelectChange("ciudadNegocio", opt)}
                isClearable
                isDisabled={!usuario.departamentoNegocio}
                placeholder="Seleccionar ciudad"
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Correo de facturación</label>
            <input
              type="email"
              name="correoNegocio"
              value={usuario.correoNegocio}
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
            <Select
              options={opcionesEstado}
              value={
                usuario.estado !== undefined
                  ? opcionesEstado.find((o) => o.value === usuario.estado)
                  : null
              }
              onChange={(opt) =>
                setUsuario({ ...usuario, estado: opt ? opt.value : true })
              }
              placeholder="Selecciona estado"
            />
          </div>

          <button
            type="submit"
            style={estilos.boton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#047fc6ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00a2ff")}
          >
            Registrarse
          </button>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                marginTop: "15px",
                color: "#475569",
                alignContent: "center",
              }}
            >
              ¿Ya tienes cuenta?{" "}
              <span
                style={{
                  color: "#16a34a",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                Ingresa aquí
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarUsuario;
