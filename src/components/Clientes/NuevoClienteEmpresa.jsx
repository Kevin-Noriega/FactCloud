import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "../StyledSelect";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import regimenTributarioDIAN from "../../utils/RegimenTributario.json";
import axiosClient from "../../api/axiosClient";
import {
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../../utils/Helpers";
import { useCliente } from "../../hooks/useCliente";
import FloatingInput from "./FloatingInput"; 
//import FloatingInput from "../FloatingInput"; // ← importa el nuevo componente

import "../../styles/pages/NuevoClienteEmpresa.css";

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

  const handleAutocompletar = async () => {
    if (!cliente.numeroIdentificacion) return;
    setAutocompletando(true);
    setErrorAutocompletar("");
    try {
      const { data } = await axiosClient.get(
        `/rut/consultar/${cliente.numeroIdentificacion}`,
      );
      handleSelectChange("tipoIdentificacion", data.tipoIdentificacion || "");
      handleSelectChange("regimenTributario", data.regimenTributario || "");
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

  /* ── Helper: wrapper de React-Select con label flotante fijo ── */
  const RSField = ({ label, children }) => (
    <div className="pc2-rs-wrapper">
      <span className="pc2-rs-label">{label}</span>
      {children}
    </div>
  );

  /* ── Helper: select nativo con label flotante fijo ── */
  const NativeSelectField = ({ label, ...props }) => (
    <div className="fs-wrapper">
      <label className="fs-label">{label}</label>
      <select className="fs-select" {...props} />
    </div>
  );

  return (
    <div className="pc2-root">
      {/* ── Top Bar ── */}
      <div className="header-card mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center">
          <div>
            <h2 className="header-title">
              {clienteEditando ? "Editar cliente" : "Crear cliente"}
            </h2>
            <p className="header-subtitle">
              Todos los campos marcados con * son obligatorios para la creación
              del tercero
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="pc2-btn-cancel"
              disabled={guardando}
              onClick={() => navigate("/clientes")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-cliente"
              className="pc2-btn-save"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      <form id="form-cliente" onSubmit={handleSubmit}>
        {/* ── Tipo de tercero ── */}
        <div className="pc2-card mb-3">
          <p className="pc2-section-label">Tipo de tercero</p>
          <div className="pc2-tercero-check">
            <input
              type="checkbox"
              id="chk-cliente"
              defaultChecked
              readOnly
              className="pc2-checkbox"
            />
            <div>
              <label htmlFor="chk-cliente" className="pc2-tercero-name">
                Clientes
              </label>
              <p className="pc2-tercero-desc">
                Personas o empresas a las cuales necesitas generarles una
                factura de venta
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="pc2-two-col">
          {/* ── LEFT: Datos básicos ── */}
          <div className="pc2-card pc2-card-left">
            <p className="pc2-section-label-asterisk">* Datos básicos</p>

            <div className="pc2-grid-2">
              {/* Tipo persona */}
              <NativeSelectField
                label="Tipo"
                name="tipoPersona"
                value={cliente.tipoPersona}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Natural">Es persona</option>
                <option value="Juridica">Es empresa</option>
              </NativeSelectField>

              {/* Tipo identificación */}
              <RSField label="* Tipo de identificación">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
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
              </RSField>
            </div>

            {/* Identificación + Dv */}
            <div className="pc2-grid-id">
              <FloatingInput
                label="* Identificación"
                type="text"
                name="numeroIdentificacion"
                value={cliente.numeroIdentificacion}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Dv"
                type="number"
                name="digitoVerificacion"
                value={cliente.digitoVerificacion}
                onChange={handleChange}
                min="0"
                max="9"
              />
            </div>

            {/* Autocompletar */}
            <div className="pc2-autocompletar">
              <button
                type="button"
                className="pc2-link"
                onClick={handleAutocompletar}
                disabled={!cliente.numeroIdentificacion || autocompletando}
              >
                {autocompletando ? "Buscando..." : "Autocompletar datos"}{" "}
                <span className="pc2-help-icon">?</span>
              </button>
              {errorAutocompletar && (
                <span className="pc2-error-msg">{errorAutocompletar}</span>
              )}
            </div>

            {/* Código sucursal */}
            <div style={{ maxWidth: 180, marginTop: 12 }}>
              <FloatingInput
                label="Código de la sucursal"
                type="text"
                name="codigoSucursal"
                value={cliente.codigoSucursal || "0"}
                onChange={handleChange}
              />
            </div>

            {/* Nombres / Razón Social + Apellidos */}
            <div className="pc2-grid-2 mt-3">
              {esEmpresa ? (
                <div style={{ gridColumn: "1 / -1" }}>
                  <FloatingInput
                    label="* Razón Social"
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <FloatingInput
                    label="* Nombres"
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="* Apellidos"
                    type="text"
                    name="apellido"
                    value={cliente.apellido}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
            </div>

            {/* Nombre Comercial */}
            <div className="mt-3">
              <FloatingInput
                label="Nombre comercial"
                type="text"
                name="nombreComercial"
                value={cliente.nombreComercial}
                onChange={handleChange}
              />
            </div>

            {/* Ciudad */}
            <div className="mt-3">
              <RSField label="Ciudad">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
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
              </RSField>
            </div>

            {/* Departamento */}
            <div className="mt-3">
              <RSField label="Departamento *">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
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
              </RSField>
            </div>

            {/* Dirección */}
            <div className="mt-3">
              <FloatingInput
                label="Dirección"
                type="text"
                name="direccion"
                value={cliente.direccion}
                onChange={handleChange}
                required
              />
            </div>

            {/* Teléfonos */}
            <div className="mt-3">
              {(
                cliente.telefonos || [
                  { indicativo: "", numero: "", extension: "" },
                ]
              ).map((tel, i) => (
                <div className="pc2-tel-row" key={i}>
                  <FloatingInput
                    label={i === 0 ? "Indicativo" : ""}
                    type="text"
                    placeholder="605"
                    value={tel.indicativo}
                    onChange={(e) =>
                      handleTelefonoChange(i, "indicativo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label={i === 0 ? "# de Teléfono" : ""}
                    type="text"
                    placeholder="Número de teléfono"
                    value={tel.numero}
                    onChange={(e) =>
                      handleTelefonoChange(i, "numero", e.target.value)
                    }
                  />
                  <FloatingInput
                    label={i === 0 ? "Extensión" : ""}
                    type="text"
                    placeholder="Ext."
                    value={tel.extension}
                    onChange={(e) =>
                      handleTelefonoChange(i, "extension", e.target.value)
                    }
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      className="pc2-link-danger pc2-tel-del"
                      onClick={() => eliminarTelefono(i)}
                    >
                      🗑 Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="pc2-link-success mt-2"
                onClick={agregarTelefono}
              >
                + Agregar otro Teléfono
              </button>
            </div>
          </div>

          {/* ── RIGHT: Datos para facturación y envío ── */}
          <div className="pc2-card pc2-card-right">
            <p className="pc2-section-label-plain">
              Datos para facturación y envío{" "}
              <span className="pc2-help-icon">?</span>
            </p>

            <div className="pc2-grid-billing">
              {/* Left billing */}
              <div>
                <FloatingInput
                  label="Nombres del contacto"
                  type="text"
                  name="nombreContactoFacturacion"
                  value={cliente.nombreContactoFacturacion || ""}
                  onChange={handleChange}
                />

                <div className="mt-3">
                  <FloatingInput
                    label="Apellidos del contacto"
                    type="text"
                    name="apellidoContactoFacturacion"
                    value={cliente.apellidoContactoFacturacion || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-3">
                  <FloatingInput
                    label="Correo electrónico cuando aplique"
                    type="email"
                    name="correo"
                    value={cliente.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-3">
                  <RSField label="Tipo de régimen IVA">
                    <Select
                      className="pc2-react-select"
                      classNamePrefix="pc2rs"
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
                  </RSField>
                </div>

                <div className="pc2-grid-2 mt-3">
                  <FloatingInput
                    label="Indicativo"
                    type="text"
                    name="indicativoFacturacion"
                    placeholder="+57"
                    value={cliente.indicativoFacturacion || ""}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="# de Teléfono"
                    type="text"
                    name="telefonoFacturacion"
                    value={cliente.telefonoFacturacion || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-3">
                  <FloatingInput
                    label="Código postal"
                    type="text"
                    name="codigoPostal"
                    value={cliente.codigoPostal}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Right billing: Responsabilidad fiscal */}
              <div className="pc2-responsabilidad">
                <p className="pc2-resp-title">Responsabilidad fiscal</p>
                <p className="pc2-resp-desc">
                  Verifica la responsabilidad en el RUT de tu cliente, mínimo
                  asignar R-99-PN
                </p>
                {RESPONSABILIDADES_FISCALES.map(({ name, codigo, label }) => (
                  <div className="pc2-check-row" key={name}>
                    <input
                      type="checkbox"
                      className="pc2-checkbox"
                      id={name}
                      name={name}
                      checked={cliente[name] || false}
                      onChange={handleChange}
                    />
                    <label htmlFor={name} className="pc2-check-label">
                      <span className="pc2-codigo">{codigo}</span>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Contactos ── */}
        <div className="pc2-card mt-3">
          <details open>
            <summary className="pc2-contacts-summary">
              <span className="pc2-contacts-title">
                Contactos <span className="pc2-help-icon">?</span>
              </span>
            </summary>
            <div className="mt-3">
              {(cliente.contactos || []).map((c, i) => (
                <div className="pc2-contacto-row" key={i}>
                  <FloatingInput
                    label="Nombre *"
                    value={c.nombre}
                    onChange={(e) =>
                      handleContactoChange(i, "nombre", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Apellido"
                    value={c.apellido}
                    onChange={(e) =>
                      handleContactoChange(i, "apellido", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Correo"
                    value={c.correo}
                    onChange={(e) =>
                      handleContactoChange(i, "correo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Cargo"
                    value={c.cargo}
                    onChange={(e) =>
                      handleContactoChange(i, "cargo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Indicativo"
                    placeholder="+57"
                    value={c.indicativo}
                    onChange={(e) =>
                      handleContactoChange(i, "indicativo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Teléfono"
                    value={c.telefono}
                    onChange={(e) =>
                      handleContactoChange(i, "telefono", e.target.value)
                    }
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      className="pc2-btn-remove-contact"
                      onClick={() => eliminarContacto(i)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="pc2-link-success mt-2"
                onClick={agregarContacto}
              >
                + Agregar otro contacto
              </button>
            </div>
          </details>
        </div>
      </form>
    </div>
  );
}

export default NuevoClienteEmpresa;
