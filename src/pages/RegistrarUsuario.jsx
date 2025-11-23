import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { API_URL } from "../api/config";
import logo from "../img/logoFC.png";
import {
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../utils/Helpers";
import tipoIdentificacion from "../utils/TiposDocumentos.json";
import actividadesCIIU from "../utils/ActividadesEconomicasCIIU.json";
import regimenTributarioDIAN from "../utils/RegimenTributario.json";
import regimenFiscalDIAN from "../utils/RegimenFiscal.json";
import ambienteDIAN from "../utils/AmbienteDIAN.json";

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
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    codigoPostal: "",
    ciudadCodigo: "",
    departamentoCodigo: "",
    telefonoNegocio: "",
    actividadEconomicaCIIU: "",
    regimenFiscal: "",
    regimenTributario: "",
    pais: "CO",
    softwareProveedor: "FACTCLOUD",
    softwarePIN: "109990",
    prefijoAutorizadoDIAN: "",
    numeroResolucionDIAN: "",
    fechaResolucionDIAN: "",
    rangoNumeracionDesde: "",
    rangoNumeracionHasta: "",
    ambienteDIAN: "",
  });

  const opcionesTipoRegimen = [
    { label: "Simplificado", value: "Simplificado" },
    { label: "Común", value: "Común" },
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
      tipoIdentificacion: usuario.tipoIdentificacion,
      numeroIdentificacion: usuario.numeroIdentificacion,
      codigoPostal: usuario.codigoPostal,
      ciudadCodigo: usuario.ciudadCodigo,
      departamentoCodigo: usuario.departamentoCodigo,
      telefonoNegocio: usuario.telefonoNegocio,
      actividadEconomicaCIIU: usuario.actividadEconomicaCIIU,
      regimenFiscal: usuario.regimenFiscal,
      regimenTributario: usuario.regimenTributario || "NO_APLICA",
      pais: "CO",
      softwareProveedor: usuario.softwareProveedor,
      softwarePIN: usuario.softwarePIN,
      prefijoAutorizadoDIAN: usuario.prefijoAutorizadoDIAN,
      numeroResolucionDIAN: usuario.numeroResolucionDIAN,
      fechaResolucionDIAN: usuario.fechaResolucionDIAN,
      rangoNumeracionDesde: usuario.rangoNumeracionDesde,
      rangoNumeracionHasta: usuario.rangoNumeracionHasta,
      ambienteDIAN: usuario.ambienteDIAN,
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
        const text = await response.text();
        let errorData = null;

        try {
          errorData = text ? JSON.parse(text) : null;
        } catch {
          errorData = text;
        }

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
          {/* ----------- DATOS PERSONALES ----------- */}
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
                name="departamentoNegocio"
                options={departamentosOptions}
                value={
                  usuario.departamentoCodigo
                    ? departamentosOptions.find(
                        (o) =>
                          o.departamentoCodigo === usuario.departamentoCodigo
                      ) || null
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    departamentoNegocio: opt ? opt.value : "",
                    departamentoCodigo: opt ? opt.departamentoCodigo : "",
                    ciudadNegocio: "",
                    ciudadCodigo: "",
                  }))
                }
                placeholder="Seleccionar departamento"
                isClearable
                required
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Ciudad o Municipio</label>
              <Select
                name="ciudadNegocio"
                options={ciudadesOptionsPorDepartamento(
                  usuario.departamentoNegocio
                )}
                value={
                  usuario.ciudadCodigo
                    ? ciudadesOptionsPorDepartamento(
                        usuario.departamentoNegocio
                      ).find((opt) => opt.ciudadCodigo === usuario.ciudadCodigo)
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    ciudadNegocio: opt ? opt.value : "",
                    ciudadCodigo: opt ? opt.ciudadCodigo : "",
                  }))
                }
                placeholder="Seleccionar ciudad"
                isClearable
                isDisabled={!usuario.departamentoNegocio}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Código Postal</label>
            <input
              type="text"
              name="codigoPostal"
              value={usuario.codigoPostal}
              onChange={handleChange}
              style={estilos.input}
            />
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Departamento Código</label>
              <input
                type="text"
                name="departamentoCodigo"
                value={usuario.departamentoCodigo}
                readOnly
                onChange={handleChange}
                style={estilos.input}
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Municipio Código</label>
              <input
                type="text"
                name="ciudadCodigo"
                value={usuario.ciudadCodigo}
                readOnly
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Teléfono del negocio</label>
            <input
              type="text"
              name="telefonoNegocio"
              value={usuario.telefonoNegocio}
              onChange={handleChange}
              style={estilos.input}
            />
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

          <h3 style={estilos.subtitulo}>Información Tributaria</h3>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Tipo de Identificación</label>
              <Select
                name="tipoIdentificacion"
                options={tipoIdentificacion.map((ti) => ({
                  value: ti.nombre,
                  label: `${ti.codigo} - ${ti.nombre}`,
                }))}
                value={
                  usuario.tipoIdentificacion
                    ? tipoIdentificacion
                        .map((ti) => ({
                          value: ti.nombre,
                          label: `${ti.codigo} - ${ti.nombre}`,
                        }))
                        .find((opt) => opt.value === usuario.tipoIdentificacion)
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    tipoIdentificacion: opt ? opt.value : "",
                    tipoIdentificacionNombre: opt ? opt.nombre : "",
                  }))
                }
                isClearable
                placeholder="Seleccionar tipo de identificacion"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Número de Identificación</label>
              <input
                type="text"
                name="numeroIdentificacion"
                className="form-control"
                value={usuario.numeroIdentificacion}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Régimen Fiscal</label>

              <Select
                name="regimenFiscal"
                options={regimenFiscalDIAN.map((rf) => ({
                  value: rf.descripcion,
                  label: `${rf.codigo} - ${rf.descripcion}`,
                }))}
                value={
                  usuario.regimenFiscal
                    ? regimenFiscalDIAN
                        .map((rf) => ({
                          value: rf.descripcion,
                          label: `${rf.codigo} - ${rf.descripcion}`,
                        }))
                        .find((opt) => opt.value === usuario.regimenFiscal)
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    regimenFiscal: opt ? opt.value : "",
                  }))
                }
                isClearable
                placeholder="Seleccionar Regimen fiscal"
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Actividad Económica (CIIU)</label>
              <Select
                name="actividadEconomicaCIIU"
                options={actividadesCIIU.map((act) => ({
                  value: act.codigo,
                  label: `${act.codigo} - ${act.descripcion}`,
                }))}
                value={
                  usuario.actividadEconomicaCIIU
                    ? actividadesCIIU
                        .map((act) => ({
                          value: act.codigo,
                          label: `${act.codigo} - ${act.descripcion}`,
                        }))
                        .find(
                          (opt) => opt.value === usuario.actividadEconomicaCIIU
                        )
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    actividadEconomicaCIIU: opt ? opt.value : "",
                  }))
                }
                isClearable
                placeholder="Seleccionar actividad CIIU"
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Regimen Tributario</label>
              <Select
                name="regimenTributario"
                options={regimenTributarioDIAN.map((rt) => ({
                  value: rt.descripcion,
                  label: `${rt.codigo} - ${rt.descripcion}`,
                }))}
                value={
                  usuario.regimenTributario
                    ? regimenTributarioDIAN
                        .map((rt) => ({
                          value: rt.descripcion,
                          label: `${rt.codigo} - ${rt.descripcion}`,
                        }))
                        .find((opt) => opt.value === usuario.regimenTributario)
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    regimenTributario: opt ? opt.value : "",
                  }))
                }
                isClearable
                placeholder="Seleccionar Regimen tributario"
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Prefijo Autorizado DIAN</label>
              <input
                type="text"
                name="prefijoAutorizadoDIAN"
                value={usuario.prefijoAutorizadoDIAN}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Número de Resolución DIAN</label>
              <input
                type="text"
                name="numeroResolucionDIAN"
                value={usuario.numeroResolucionDIAN}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Fecha Resolución DIAN</label>
              <input
                type="date"
                name="fechaResolucionDIAN"
                value={usuario.fechaResolucionDIAN}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Ambiente DIAN</label>
              <Select
                name="ambienteDIAN"
                options={ambienteDIAN.map((rf) => ({
                  value: rf.descripcion,
                  label: `${rf.codigo} - ${rf.descripcion}`,
                }))}
                value={
                  usuario.ambienteDIAN
                    ? ambienteDIAN
                        .map((rf) => ({
                          value: rf.descripcion,
                          label: `${rf.codigo} - ${rf.descripcion}`,
                        }))
                        .find((opt) => opt.value === usuario.ambienteDIAN)
                    : null
                }
                onChange={(opt) =>
                  setUsuario((prev) => ({
                    ...prev,
                    ambienteDIAN: opt ? opt.value : "",
                  }))
                }
                isClearable
                placeholder="Seleccionar ambiente DIAN"
              />
            </div>
          </div>

          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Rango Numeración - Desde</label>
              <input
                type="text"
                name="rangoNumeracionDesde"
                value={usuario.rangoNumeracionDesde}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>

            <div style={estilos.campo}>
              <label style={estilos.label}>Rango Numeración - Hasta</label>
              <input
                type="text"
                name="rangoNumeracionHasta"
                value={usuario.rangoNumeracionHasta}
                onChange={handleChange}
                style={estilos.input}
              />
            </div>
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
