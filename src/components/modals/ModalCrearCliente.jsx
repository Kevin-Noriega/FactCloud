// src/components/modals/ModalCrearCliente.jsx
import React from "react";
import Select from "../StyledSelect";
import ModalBase from "./ModalBase";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import actividadesCIIU from "../../utils/ActividadesEconomicasCIIU.json";
import regimenTributarioDIAN from "../../utils/RegimenTributario.json";
import regimenFiscalDIAN from "../../utils/RegimenFiscal.json";
import {
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../../utils/Helpers";
import { useCliente } from "../../hooks/useCliente";
import FloatingInput from "../Clientes/FloatingInput";
// Reutiliza los estilos de NuevoClienteEmpresa — no necesita CSS propio
import "../../styles/pages/NuevoClienteEmpresa.css"; // Solo para estilos compartidos, no específicos del modal
import "../../styles/modals/ModalCrearCliente.css"; // Solo para ajustes específicos del modal


// ── Helpers de campo (idénticos a NuevoClienteEmpresa) ──────────────────────
const RSField = ({ label, children }) => (
  <div className="pc2-rs-wrapper">
    <span className="pc2-rs-label">{label}</span>
    {children}
  </div>
);

const NativeSelectField = ({ label, children, ...props }) => (
  <div className="fs-wrapper">
    <label className="fs-label">{label}</label>
    <select className="fs-select" {...props}>
      {children}
    </select>
  </div>
);

// Responsabilidades fiscales (mismo array que NuevoClienteEmpresa)
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

// ── Componente ───────────────────────────────────────────────────────────────
function ModalCrearCliente({ open, onClose, clienteEditando, onSuccess }) {
  const {
    cliente,
    guardando,
    handleChange,
    handleSelectChange,
    handleDepartamentoChange,
    handleCiudadChange,
    handleSubmit,
    handleClose,
    agregarContacto,
    handleContactoChange,
    eliminarContacto,
  } = useCliente({ clienteEditando, open, onSuccess, onClose });

  // Opciones de selects
  const tipoIdOpts = tipoIdentificacion.map((ti) => ({
    value: ti.nombre,
    label: `${ti.codigo} - ${ti.nombre}`,
  }));
  const regimenTribOpts = regimenTributarioDIAN.map((rt) => ({
    value: rt.descripcion,
    label: `${rt.codigo} - ${rt.descripcion}`,
  }));
  const regimenFiscOpts = regimenFiscalDIAN.map((rf) => ({
    value: rf.descripcion,
    label: `${rf.codigo} - ${rf.descripcion}`,
  }));
  const actCIIUOpts = actividadesCIIU.map((act) => ({
    value: act.codigo,
    label: `${act.codigo} - ${act.descripcion}`,
  }));
  const ciudadesOpts = ciudadesOptionsPorDepartamento(cliente.departamento);

  const esEmpresa = cliente.tipoPersona === "Juridica";

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      title={clienteEditando ? "Editar cliente" : "Crear cliente"}
      size="mc-modal"
    >
      <form onSubmit={handleSubmit} className="mc-form">
        {/* ── Layout dos columnas ─────────────────────────────────────────── */}
        <div className="pc2-two-col">
          {/* ── IZQUIERDA: Datos básicos ──────────────────────────────────── */}
          <div className="pc2-card">
            <p className="pc2-section-label-asterisk">* Datos básicos</p>

            {/* Tipo + Tipo de identificación */}
            <div className="pc2-grid-2">
              <NativeSelectField
                label="Tipo"
                name="tipoPersona"
                value={cliente.tipoPersona}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="Juridica">1 - Persona Jurídica</option>
                <option value="Natural">2 - Persona Natural</option>
              </NativeSelectField>

              <RSField label="Tipo de identificación">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
                  options={tipoIdOpts}
                  value={
                    tipoIdOpts.find(
                      (o) => o.value === cliente.tipoIdentificacion,
                    ) ?? null
                  }
                  onChange={(o) =>
                    handleSelectChange("tipoIdentificacion", o?.value ?? "")
                  }
                  isClearable
                  placeholder={esEmpresa ? "NIT" : "Cédula de ciudadanía"}
                />
              </RSField>
            </div>

            {/* Identificación + DV */}
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
                onClick={(e) => e.preventDefault()}
              >
                Autocompletar datos <span className="pc2-help-icon">?</span>
              </button>
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
                  />
                </>
              )}
            </div>

            {/* Departamento + Ciudad */}
            <div className="pc2-grid-2 mt-3">
              <RSField label="Departamento">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
                  options={departamentosOptions}
                  value={
                    departamentosOptions.find(
                      (o) =>
                        String(o.departamentoCodigo) ===
                        String(cliente.departamentoCodigo),
                    ) ?? null
                  }
                  onChange={handleDepartamentoChange}
                  placeholder="Seleccionar"
                  isClearable
                />
              </RSField>

              <RSField label="Ciudad">
                <Select
                  className="pc2-react-select"
                  classNamePrefix="pc2rs"
                  options={ciudadesOpts}
                  value={
                    ciudadesOpts.find(
                      (o) =>
                        String(o.ciudadCodigo) === String(cliente.ciudadCodigo),
                    ) ?? null
                  }
                  onChange={handleCiudadChange}
                  placeholder="Seleccionar"
                  isClearable
                  isDisabled={!cliente.departamento}
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
              />
            </div>

            {/* Teléfonos (contactos) */}
            <div className="mt-3">
              {(cliente.contactos || []).map((c, i) => (
                <div className="pc2-tel-row" key={i}>
                  <FloatingInput
                    label={i === 0 ? "Indicativo" : ""}
                    type="text"
                    placeholder="605"
                    value={c.indicativo}
                    onChange={(e) =>
                      handleContactoChange(i, "indicativo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label={i === 0 ? "# de Teléfono" : ""}
                    type="text"
                    value={c.telefono}
                    onChange={(e) =>
                      handleContactoChange(i, "telefono", e.target.value)
                    }
                  />
                  <FloatingInput
                    label={i === 0 ? "Extensión" : ""}
                    type="text"
                    value={c.cargo}
                    onChange={(e) =>
                      handleContactoChange(i, "cargo", e.target.value)
                    }
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      className="pc2-link-danger pc2-tel-del"
                      onClick={() => eliminarContacto(i)}
                    >
                      🗑 Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="pc2-link-success mt-2"
                onClick={agregarContacto}
              >
                + Agregar otro número de teléfono
              </button>
            </div>
          </div>

          {/* ── DERECHA: Datos para facturación ──────────────────────────── */}
          <div className="pc2-card">
            <p className="pc2-section-label-plain">
              Datos para facturación y envío{" "}
              <span className="pc2-help-icon">?</span>
            </p>

            <div className="pc2-grid-billing">
              {/* Columna izquierda: campos de contacto */}
              <div>
                <FloatingInput
                  label="Nombres del contacto"
                  type="text"
                  value={cliente.contactos?.[0]?.nombre ?? ""}
                  onChange={(e) =>
                    handleContactoChange(0, "nombre", e.target.value)
                  }
                />
                <div className="mt-3">
                  <FloatingInput
                    label="Apellidos del contacto"
                    type="text"
                    value={cliente.contactos?.[0]?.apellido ?? ""}
                    onChange={(e) =>
                      handleContactoChange(0, "apellido", e.target.value)
                    }
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
                      options={regimenTribOpts}
                      value={
                        regimenTribOpts.find(
                          (o) => o.value === cliente.regimenTributario,
                        ) ?? null
                      }
                      onChange={(o) =>
                        handleSelectChange("regimenTributario", o?.value ?? "")
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
                    placeholder="+57"
                    value={cliente.contactos?.[0]?.indicativo ?? ""}
                    onChange={(e) =>
                      handleContactoChange(0, "indicativo", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="# de Teléfono"
                    type="text"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleChange}
                  />
                </div>

                {/* Campos adicionales: Nombre comercial, CIIU, Responsabilidad */}
                <div className="mt-3">
                  <FloatingInput
                    label="Nombre Comercial"
                    type="text"
                    name="nombreComercial"
                    value={cliente.nombreComercial}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3">
                  <RSField label="Actividad Económica CIIU">
                    <Select
                      className="pc2-react-select"
                      classNamePrefix="pc2rs"
                      options={actCIIUOpts}
                      value={
                        actCIIUOpts.find(
                          (o) => o.value === cliente.actividadEconomicaCIIU,
                        ) ?? null
                      }
                      onChange={(o) =>
                        handleSelectChange(
                          "actividadEconomicaCIIU",
                          o?.value ?? "",
                        )
                      }
                      isClearable
                      placeholder="Seleccionar"
                    />
                  </RSField>
                </div>
                <div className="mt-3">
                  <RSField label="Tipo de responsabilidad">
                    <Select
                      className="pc2-react-select"
                      classNamePrefix="pc2rs"
                      options={regimenFiscOpts}
                      value={
                        regimenFiscOpts.find(
                          (o) => o.value === cliente.regimenFiscal,
                        ) ?? null
                      }
                      onChange={(o) =>
                        handleSelectChange("regimenFiscal", o?.value ?? "")
                      }
                      isClearable
                      placeholder="Seleccionar"
                    />
                  </RSField>
                </div>
              </div>

              {/* Columna derecha: Responsabilidad fiscal */}
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
                      id={`mc-${name}`}
                      name={name}
                      checked={!!cliente[name]}
                      onChange={handleChange}
                    />
                    <label htmlFor={`mc-${name}`} className="pc2-check-label">
                      <span className="pc2-codigo">{codigo}</span>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="mc-modal-footer">
          <button
            type="button"
            className="pc2-btn-cancel"
            onClick={handleClose}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button type="submit" className="pc2-btn-save" disabled={guardando}>
            {guardando
              ? "Guardando..."
              : clienteEditando
                ? "Actualizar cliente"
                : "Guardar"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default ModalCrearCliente;
