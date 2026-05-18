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
import "../../styles/modals/ModalCrearCliente.css";

const underlineSelect = {
  control: (b, s) => ({
    ...b,
    border: "none",
    borderBottom: `1px solid ${s.isFocused ? "#1565c0" : "#bdbdbd"}`,
    borderRadius: 0,
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "30px",
    cursor: "pointer",
  }),
  valueContainer: (b) => ({ ...b, padding: "0" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, padding: "0 2px", color: "#9e9e9e" }),
  placeholder: (b) => ({ ...b, color: "#c5c5c5", fontSize: "0.85rem" }),
  singleValue: (b) => ({ ...b, fontSize: "0.88rem", color: "#212121" }),
  menu: (b) => ({ ...b, zIndex: 9999 }),
  option: (b, s) => ({
    ...b,
    fontSize: "0.88rem",
    backgroundColor: s.isSelected ? "#1976d2" : s.isFocused ? "#e3f2fd" : "white",
    color: s.isSelected ? "white" : "#212121",
  }),
};

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

  const ningunFiscal =
    !cliente.retenedorIVA &&
    !cliente.retenedorRenta &&
    !cliente.autoretenedorRenta &&
    !cliente.retenedorICA;

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      title={clienteEditando ? "Editar cliente" : "Crear cliente"}
      size="mc-modal"
    >
      <form onSubmit={handleSubmit} className="mc-form">

        <div className="mc-cards-row">

          {/* ── TARJETA IZQUIERDA: Datos básicos ── */}
          <div className="mc-card">
            <div className="mc-card-header">
              <span className="mc-red-dot">•</span>
              <span>Datos básicos</span>
            </div>

            {/* Tipo + Tipo de identificación */}
            <div className="mc-row-2col">
              <div className="mc-field">
                <label className="mc-label">Tipo</label>
                <select
                  name="tipoPersona"
                  className="mc-native-select"
                  value={cliente.tipoPersona}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="Juridica">1 - Persona Jurídica</option>
                  <option value="Natural">2 - Persona Natural</option>
                </select>
              </div>
              <div className="mc-field">
                <label className="mc-label">Tipo de identificación</label>
                <Select
                  styles={underlineSelect}
                  options={tipoIdOpts}
                  value={tipoIdOpts.find((o) => o.value === cliente.tipoIdentificacion) ?? null}
                  onChange={(o) => handleSelectChange("tipoIdentificacion", o?.value ?? "")}
                  isClearable
                  placeholder=""
                />
              </div>
            </div>

            {/* Identificación + DV + Autocompletar */}
            <div className="mc-row-id-dv">
              <div className="mc-field mc-field-identificacion">
                <label className="mc-label">
                  <span className="mc-req">*</span> Identificación
                </label>
                <div className="mc-id-dv-group">
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    className="mc-input"
                    value={cliente.numeroIdentificacion}
                    onChange={handleChange}
                    required
                  />
                  <span className="mc-dv-label">Dv</span>
                  <input
                    type="number"
                    name="digitoVerificacion"
                    className="mc-input mc-input-dv"
                    value={cliente.digitoVerificacion}
                    onChange={handleChange}
                    min="0"
                    max="9"
                  />
                </div>
              </div>
              <div className="mc-field mc-field-autocompletar">
                <a
                  href="#"
                  className="mc-link-autocompletar"
                  onClick={(e) => e.preventDefault()}
                >
                  Autocompletar datos{" "}
                  <span className="mc-help-inline">(?)</span>
                </a>
              </div>
            </div>

            {/* Nombres + Apellidos */}
            <div className="mc-row-2col">
              <div className="mc-field">
                <label className="mc-label">
                  <span className="mc-req">*</span> Nombres
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="mc-input"
                  value={cliente.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mc-field">
                <label className="mc-label">
                  <span className="mc-req">*</span> Apellidos
                </label>
                <input
                  type="text"
                  name="apellido"
                  className="mc-input"
                  value={cliente.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Departamento + Ciudad */}
            <div className="mc-row-2col">
              <div className="mc-field">
                <label className="mc-label">Departamento</label>
                <Select
                  styles={underlineSelect}
                  options={departamentosOptions}
                  value={
                    departamentosOptions.find(
                      (o) => String(o.departamentoCodigo) === String(cliente.departamentoCodigo)
                    ) ?? null
                  }
                  onChange={handleDepartamentoChange}
                  placeholder=""
                  isClearable
                />
              </div>
              <div className="mc-field">
                <label className="mc-label">Ciudad</label>
                <Select
                  styles={underlineSelect}
                  options={ciudadesOpts}
                  value={
                    ciudadesOpts.find(
                      (o) => String(o.ciudadCodigo) === String(cliente.ciudadCodigo)
                    ) ?? null
                  }
                  onChange={handleCiudadChange}
                  placeholder=""
                  isClearable
                  isDisabled={!cliente.departamento}
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="mc-field">
              <label className="mc-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                className="mc-input"
                value={cliente.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Filas de teléfono (contactos) */}
            {(cliente.contactos || []).map((c, i) => (
              <div className="mc-phone-row" key={i}>
                {i === 0 && (
                  <div className="mc-phone-labels">
                    <span className="mc-label" style={{ flex: "0 0 72px" }}>Indicativo</span>
                    <span className="mc-label" style={{ flex: 1 }}># de Teléfono</span>
                    <span className="mc-label" style={{ flex: "0 0 80px" }}>Extensión</span>
                  </div>
                )}
                <div className="mc-phone-inputs">
                  <input
                    className="mc-input mc-indicativo"
                    placeholder="605"
                    value={c.indicativo}
                    onChange={(e) => handleContactoChange(i, "indicativo", e.target.value)}
                  />
                  <input
                    className="mc-input mc-telefono"
                    value={c.telefono}
                    onChange={(e) => handleContactoChange(i, "telefono", e.target.value)}
                  />
                  <input
                    className="mc-input mc-extension"
                    value={c.cargo}
                    onChange={(e) => handleContactoChange(i, "cargo", e.target.value)}
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      className="mc-eliminar-btn"
                      onClick={() => eliminarContacto(i)}
                    >
                      🗑 Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="mc-agregar-link"
              onClick={agregarContacto}
            >
              + Agregar otro número de teléfono
            </button>
          </div>

          {/* ── TARJETA DERECHA: Datos para facturación ── */}
          <div className="mc-card">
            <div className="mc-card-header">
              <span>Datos para facturación y envío</span>
              <span className="mc-help-circle">?</span>
            </div>

            <div className="mc-billing-layout">

              {/* Columna izquierda: campos de contacto de facturación */}
              <div className="mc-billing-left">
                <div className="mc-field">
                  <label className="mc-label">Nombres del contacto</label>
                  <input
                    type="text"
                    className="mc-input"
                    value={cliente.contactos?.[0]?.nombre ?? ""}
                    onChange={(e) => handleContactoChange(0, "nombre", e.target.value)}
                  />
                </div>
                <div className="mc-field">
                  <label className="mc-label">Apellidos del contacto</label>
                  <input
                    type="text"
                    className="mc-input"
                    value={cliente.contactos?.[0]?.apellido ?? ""}
                    onChange={(e) => handleContactoChange(0, "apellido", e.target.value)}
                  />
                </div>
                <div className="mc-field">
                  <label className="mc-label">Correo electrónico cuando aplique</label>
                  <input
                    type="email"
                    name="correo"
                    className="mc-input"
                    value={cliente.correo}
                    onChange={handleChange}
                  />
                </div>
                <div className="mc-field">
                  <label className="mc-label">Tipo de régimen IVA</label>
                  <Select
                    styles={underlineSelect}
                    options={regimenTribOpts}
                    value={regimenTribOpts.find((o) => o.value === cliente.regimenTributario) ?? null}
                    onChange={(o) => handleSelectChange("regimenTributario", o?.value ?? "")}
                    isClearable
                    placeholder=""
                  />
                </div>
                <div className="mc-phone-row mc-phone-row-sm">
                  <div className="mc-phone-field">
                    <label className="mc-label">Indicativo</label>
                    <input
                      type="text"
                      className="mc-input mc-indicativo"
                      value={cliente.contactos?.[0]?.indicativo ?? ""}
                      onChange={(e) => handleContactoChange(0, "indicativo", e.target.value)}
                    />
                  </div>
                  <div className="mc-phone-field mc-phone-field-grow">
                    <label className="mc-label"># de Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      className="mc-input"
                      value={cliente.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Columna derecha: Responsabilidad fiscal */}
              <div className="mc-fiscal">
                <div className="mc-fiscal-title">Responsabilidad fiscal</div>
                <p className="mc-fiscal-help">
                  Verifica la responsabilidad en el RUT de tu cliente, mínimo
                  asignar R-99-PN
                </p>

                {[
                  { name: "retenedorIVA",      label: "O-13  Gran contribuyente" },
                  { name: "autoretenedorRenta", label: "O-15  Autorretenedor" },
                  { name: "retenedorRenta",     label: "O-23  Agente de retención IVA" },
                  { name: "retenedorICA",       label: "O-47  Régimen simple de tributación" },
                ].map(({ name, label }) => (
                  <div className="mc-check-item" key={name}>
                    <input
                      type="checkbox"
                      id={`mc-${name}`}
                      name={name}
                      className="mc-checkbox"
                      checked={!!cliente[name]}
                      onChange={handleChange}
                    />
                    <label htmlFor={`mc-${name}`}>{label}</label>
                  </div>
                ))}

                <div className="mc-check-item">
                  <input
                    type="checkbox"
                    id="mc-rNoAplica"
                    className="mc-checkbox"
                    checked={ningunFiscal}
                    readOnly
                  />
                  <label htmlFor="mc-rNoAplica">R-99-PN  No aplica - Otros</label>
                </div>
              </div>
            </div>

            {/* Campos adicionales */}
            <div className="mc-extra-row">
              <div className="mc-field">
                <label className="mc-label">Nombre Comercial</label>
                <input
                  type="text"
                  name="nombreComercial"
                  className="mc-input"
                  value={cliente.nombreComercial}
                  onChange={handleChange}
                />
              </div>
              <div className="mc-field">
                <label className="mc-label">Actividad Económica CIIU</label>
                <Select
                  styles={underlineSelect}
                  options={actCIIUOpts}
                  value={actCIIUOpts.find((o) => o.value === cliente.actividadEconomicaCIIU) ?? null}
                  onChange={(o) => handleSelectChange("actividadEconomicaCIIU", o?.value ?? "")}
                  isClearable
                  placeholder=""
                />
              </div>
              <div className="mc-field">
                <label className="mc-label">Tipo de responsabilidad</label>
                <Select
                  styles={underlineSelect}
                  options={regimenFiscOpts}
                  value={regimenFiscOpts.find((o) => o.value === cliente.regimenFiscal) ?? null}
                  onChange={(o) => handleSelectChange("regimenFiscal", o?.value ?? "")}
                  isClearable
                  placeholder=""
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="mc-footer">
          <button
            type="button"
            className="mc-btn-cancel"
            onClick={handleClose}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="mc-btn-guardar"
            disabled={guardando}
          >
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
