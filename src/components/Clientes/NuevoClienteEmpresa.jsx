// src/pages/NuevoClienteEmpresa.jsx
import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { PersonPlus, PencilSquare } from "react-bootstrap-icons";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import regimenTributarioDIAN from "../../utils/RegimenTributario.json";
import axiosClient from "../../api/axiosClient";
import {
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../../utils/Helpers";
import { useCliente } from "../../hooks/useCliente";
import "../../styles/PageCrear.css";

// Opciones de responsabilidad fiscal DIAN
const RESPONSABILIDADES_FISCALES = [
  { name: "granContribuyente", codigo: "O-13", label: "Gran contribuyente" },
  { name: "autoretenedorRenta", codigo: "O-15", label: "Autorretenedor" },
  { name: "retenedorIVA", codigo: "O-23", label: "Agente de retención IVA" },
  {
    name: "regimenSimple",
    codigo: "O-47",
    label: "Régimen simple de tributación",
  },
  { name: "noAplica", codigo: "R-99-PN", label: "No aplica - Otros" },
];

function NuevoClienteEmpresa() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const clienteEditando = state?.clienteEditando || null;
  const [autocompletando, setAutocompletando] = useState(false);
  const [errorAutocompletar, setErrorAutocompletar] = useState("");

  const {
    cliente,
    guardando,
    handleChange,
    handleSelectChange,
    handleDepartamentoChange,
    handleCiudadChange,
    handleSubmit: hookSubmit,
    agregarContacto,
    handleContactoChange,
    eliminarContacto,
  } = useCliente({
    clienteEditando,
    open: true,
    onSuccess: (msg) => navigate("/clientes", { state: { mensajeExito: msg } }),
    onClose: () => navigate(-1),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    hookSubmit();
  };

  // Handler autocompletar desde RUT/DIAN
  const handleAutocompletar = async () => {
    if (!cliente.numeroIdentificacion) return;
    setAutocompletando(true);
    setErrorAutocompletar("");
    try {
      // Reemplaza esta URL con tu endpoint real
      const { data } = await axiosClient.get(
        `/rut/consultar/${cliente.numeroIdentificacion}`,
      );
      // Mapea los campos que devuelva tu API
      handleSelectChange("tipoIdentificacion", data.tipoIdentificacion || "");
      handleSelectChange("regimenTributario", data.regimenTributario || "");
      // handleChange simulado para varios campos
      ["nombre", "apellido", "nombreComercial", "direccion"].forEach(
        (campo) => {
          if (data[campo]) {
            handleChange({
              target: { name: campo, value: data[campo], type: "text" },
            });
          }
        },
      );
    } catch {
      setErrorAutocompletar("No se encontraron datos para este número.");
    } finally {
      setAutocompletando(false);
    }
  };

  // Handlers para teléfonos dinámicos
  const handleTelefonoChange = (index, campo, valor) => {
    const nuevos = [...(cliente.telefonos || [])];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    handleChange({
      target: { name: "telefonos", value: nuevos, type: "custom" },
    });
  };
  const agregarTelefono = () => {
    const nuevos = [
      ...(cliente.telefonos || []),
      { indicativo: "", numero: "", extension: "" },
    ];
    handleChange({
      target: { name: "telefonos", value: nuevos, type: "custom" },
    });
  };
  const eliminarTelefono = (index) => {
    const nuevos = (cliente.telefonos || []).filter((_, i) => i !== index);
    handleChange({
      target: { name: "telefonos", value: nuevos, type: "custom" },
    });
  };

  const esEmpresa = cliente.tipoPersona === "Juridica";

  return (
    <div className="page-crear">
      {/* ── Banner ── */}
      <div className="page-crear-header">
        <button
          className="btn btn-volver btn-sm mb-3"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        <div className="page-crear-banner">
          <div className="page-crear-banner-content">
            <div className="page-crear-banner-text">
              <h2 className="page-crear-banner-title">
                {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
              </h2>
              <p className="page-crear-banner-subtitle">
                {clienteEditando
                  ? "Modifica la información del cliente seleccionado."
                  : "Completa el formulario para registrar un nuevo cliente."}
              </p>
            </div>
            <div className="page-crear-banner-icon">
              {clienteEditando ? (
                <PencilSquare size={70} />
              ) : (
                <PersonPlus size={70} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="page-crear-wrapper">
        <div className="page-crear-body">
          <form onSubmit={handleSubmit}>
            {/* ══════════════════════════════════════
                SECCIÓN 1 — INFORMACIÓN DE IDENTIFICACIÓN
            ══════════════════════════════════════ */}
            {/* ══════════════════════════════════════
    SECCIÓN 1 — INFORMACIÓN DE IDENTIFICACIÓN
══════════════════════════════════════ */}
            <h6 className="section-title-primary">
              Información de Identificación
            </h6>

            {/* Fila 1 — Tipo de persona + Tipo de identificación */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Tipo *</label>
                <select
                  name="tipoPersona"
                  className="form-select"
                  value={cliente.tipoPersona}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Natural">Es persona</option>
                  <option value="Juridica">Es empresa</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Tipo de Identificación *</label>
                <Select
                  options={tipoIdentificacion.map((ti) => ({
                    value: ti.nombre,
                    label: `${ti.codigo} - ${ti.nombre}`,
                  }))}
                  value={
                    tipoIdentificacion
                      .map((ti) => ({
                        value: ti.nombre,
                        label: `${ti.codigo} - ${ti.nombre}`,
                      }))
                      .find(
                        (opt) => opt.value === cliente.tipoIdentificacion,
                      ) ?? null
                  }
                  onChange={(opt) =>
                    handleSelectChange("tipoIdentificacion", opt?.value ?? "")
                  }
                  isClearable
                  placeholder={esEmpresa ? "NIT" : "Cédula de ciudadanía"}
                />
              </div>
            </div>

            {/* Fila 2 — Identificación + Dv + Autocompletar */}
            <div className="row mb-1">
              <div className="col-md-10">
                <label className="form-label">* Identificación</label>
                <input
                  type="text"
                  name="numeroIdentificacion"
                  className="form-control"
                  value={cliente.numeroIdentificacion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Dv</label>
                <input
                  type="number"
                  name="digitoVerificacion"
                  className="form-control"
                  value={cliente.digitoVerificacion}
                  onChange={handleChange}
                  min="0"
                  max="9"
                />
              </div>
            </div>

            {/* Link Autocompletar */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-link p-0 text-primary small"
                style={{ fontSize: "0.85rem" }}
                onClick={handleAutocompletar}
                disabled={!cliente.numeroIdentificacion || autocompletando}
              >
                {autocompletando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      style={{ width: "0.7rem", height: "0.7rem" }}
                    />
                    Buscando...
                  </>
                ) : (
                  "Autocompletar datos ?"
                )}
              </button>
              {errorAutocompletar && (
                <span className="text-danger small ms-3">
                  {errorAutocompletar}
                </span>
              )}
            </div>

            {/* Fila 5 — Campos dinámicos por tipo: Nombres / Razón Social */}
            <div className="row mb-3">
              {esEmpresa ? (
                <div className="col-md-6">
                  <label className="form-label">* Razón Social</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={cliente.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="col-md-6">
                    <label className="form-label">* Nombres</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={cliente.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">* Apellidos</label>
                    <input
                      type="text"
                      name="apellido"
                      className="form-control"
                      value={cliente.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Fila 6 — Nombre Comercial + Ciudad */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre Comercial</label>
                <input
                  type="text"
                  name="nombreComercial"
                  className="form-control"
                  value={cliente.nombreComercial}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ciudad *</label>
                <Select
                  options={ciudadesOptionsPorDepartamento(cliente.departamento)}
                  value={
                    ciudadesOptionsPorDepartamento(cliente.departamento).find(
                      (opt) =>
                        String(opt.ciudadCodigo) ===
                        String(cliente.ciudadCodigo),
                    ) ?? null
                  }
                  onChange={handleCiudadChange}
                  placeholder="Seleccionar ciudad"
                  isClearable
                  isDisabled={!cliente.departamento}
                />
              </div>
            </div>

            {/* Fila 7 — Departamento + Dirección */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Departamento *</label>
                <Select
                  options={departamentosOptions}
                  value={
                    departamentosOptions.find(
                      (opt) =>
                        String(opt.departamentoCodigo) ===
                        String(cliente.departamentoCodigo),
                    ) ?? null
                  }
                  onChange={handleDepartamentoChange}
                  placeholder="Seleccionar departamento"
                  isClearable
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-control"
                  value={cliente.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Fila 3 — Código sucursal */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Código de la sucursal</label>
                <input
                  type="text"
                  name="codigoSucursal"
                  className="form-control"
                  value={cliente.codigoSucursal || "0"}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Fila 4 — Teléfonos (bloque dinámico) */}
            {(
              cliente.telefonos || [
                { indicativo: "", numero: "", extension: "" },
              ]
            ).map((tel, i) => (
              <div className="row mb-2 align-items-end" key={i}>
                <div className="col-md-2">
                  {i === 0 && <label className="form-label">Indicativo</label>}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="605"
                    value={tel.indicativo}
                    onChange={(e) =>
                      handleTelefonoChange(i, "indicativo", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-5">
                  {i === 0 && (
                    <label className="form-label"># de Teléfono</label>
                  )}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Número de teléfono"
                    value={tel.numero}
                    onChange={(e) =>
                      handleTelefonoChange(i, "numero", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  {i === 0 && <label className="form-label">Extensión</label>}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Extensión"
                    value={tel.extension}
                    onChange={(e) =>
                      handleTelefonoChange(i, "extension", e.target.value)
                    }
                  />
                </div>
                {i > 0 && (
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => eliminarTelefono(i)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-link text-success p-0 mb-3"
              onClick={agregarTelefono}
            >
              + Agregar otro Teléfono
            </button>

            {/* ══════════════════════════════════════
                SECCIÓN 2 — DATOS PARA FACTURACIÓN Y ENVÍO
            ══════════════════════════════════════ */}
            <hr className="my-4" />
            <h6 className="section-title-primary">
              Datos para facturación y envío
            </h6>

            <div className="row mb-3">
              {/* Columna izquierda */}
              <div className="col-md-6">
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label">Nombres del contacto</label>
                    <input
                      type="text"
                      name="nombreContactoFacturacion"
                      className="form-control"
                      value={cliente.nombreContactoFacturacion || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label">Apellidos del contacto</label>
                    <input
                      type="text"
                      name="apellidoContactoFacturacion"
                      className="form-control"
                      value={cliente.apellidoContactoFacturacion || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label">
                      Correo electrónico cuando aplique
                    </label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      value={cliente.correo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label className="form-label">Tipo de régimen IVA</label>
                    <Select
                      options={regimenTributarioDIAN.map((rt) => ({
                        value: rt.descripcion,
                        label: `${rt.codigo} - ${rt.descripcion}`,
                      }))}
                      value={
                        regimenTributarioDIAN
                          .map((rt) => ({
                            value: rt.descripcion,
                            label: `${rt.codigo} - ${rt.descripcion}`,
                          }))
                          .find(
                            (opt) => opt.value === cliente.regimenTributario,
                          ) ?? null
                      }
                      onChange={(opt) =>
                        handleSelectChange(
                          "regimenTributario",
                          opt?.value ?? "",
                        )
                      }
                      isClearable
                      placeholder="Seleccionar régimen"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Indicativo</label>
                    <input
                      type="text"
                      name="indicativoFacturacion"
                      className="form-control"
                      placeholder="+57"
                      value={cliente.indicativoFacturacion || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label"># de Teléfono</label>
                    <input
                      type="text"
                      name="telefonoFacturacion"
                      className="form-control"
                      value={cliente.telefonoFacturacion || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      className="form-control"
                      value={cliente.codigoPostal}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Columna derecha — Responsabilidad fiscal */}
              <div className="col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#0d6efd" }}
                >
                  Responsabilidad fiscal
                </label>
                <p className="text-muted small mb-3">
                  Verifica la responsabilidad en el RUT de tu cliente, mínimo
                  asignar R-99-PN
                </p>
                {RESPONSABILIDADES_FISCALES.map(({ name, codigo, label }) => (
                  <div className="form-check mb-2" key={name}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={name}
                      name={name}
                      checked={cliente[name] || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={name}>
                      <span className="text-muted me-2">{codigo}</span>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════
                SECCIÓN 3 — CONTACTOS
            ══════════════════════════════════════ */}
            <hr className="my-4" />
            <h6 className="section-title-primary">Contactos</h6>
            <p className="text-muted small mb-3">
              Agrega los contactos asociados a este cliente.
            </p>

            {(cliente.contactos || []).map((c, i) => (
              <div className="row mb-3 align-items-end" key={i}>
                <div className="col-md-2">
                  <label className="form-label">Nombre *</label>
                  <input
                    className="form-control"
                    placeholder="Nombre"
                    value={c.nombre}
                    onChange={(e) =>
                      handleContactoChange(i, "nombre", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Apellido</label>
                  <input
                    className="form-control"
                    placeholder="Apellido"
                    value={c.apellido}
                    onChange={(e) =>
                      handleContactoChange(i, "apellido", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Correo</label>
                  <input
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={c.correo}
                    onChange={(e) =>
                      handleContactoChange(i, "correo", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Cargo</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Gerente"
                    value={c.cargo}
                    onChange={(e) =>
                      handleContactoChange(i, "cargo", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Indicativo</label>
                  <input
                    className="form-control"
                    placeholder="+57"
                    value={c.indicativo}
                    onChange={(e) =>
                      handleContactoChange(i, "indicativo", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Teléfono</label>
                  <input
                    className="form-control"
                    placeholder="# Tel"
                    value={c.telefono}
                    onChange={(e) =>
                      handleContactoChange(i, "telefono", e.target.value)
                    }
                  />
                </div>
                {i > 0 && (
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => eliminarContacto(i)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-link text-success p-0 mt-1 mb-4"
              onClick={agregarContacto}
            >
              + Agregar otro contacto
            </button>

            {/* ── Footer ── */}
            <div className="page-crear-footer">
              <div className="footer-acciones">
                <button
                  type="button"
                  className="btn btn-footer-secundario"
                  disabled={guardando}
                  onClick={() => navigate("/clientes")}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-footer-primario"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Guardando...
                    </>
                  ) : clienteEditando ? (
                    "Actualizar Cliente"
                  ) : (
                    "Guardar Cliente"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoClienteEmpresa;
