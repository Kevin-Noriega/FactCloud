import React from "react";
import Select from "react-select";
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
    handleOverlayClick,
  } = useCliente({ clienteEditando, open, onSuccess, onClose });

  if (!open) return null;

  return (
    <div className="modal-crearNuevo-overlay" onClick={handleOverlayClick}>
      <div className="modal-crearNuevo-content" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-crearNuevo-header">
          <h5>{clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}</h5>
          <button type="button" className="btn-close" onClick={handleClose} aria-label="Cerrar" />
        </div>

        {/* ── Body ── */}
        <div className="modal-crearNuevo-body">
          <form onSubmit={handleSubmit}>

            {/* ─── Identificación ─── */}
            <h6 className="section-title-cliente">Información de Identificación</h6>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Tipo de contribuyente *</label>
                <select
                  name="tipoPersona"
                  className="form-select"
                  value={cliente.tipoPersona}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Juridica">1 - Persona Jurídica y asimiladas</option>
                  <option value="Natural">2 - Persona Natural y asimiladas</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Tipo de Identificación *</label>
                <Select
                  options={tipoIdentificacion.map((ti) => ({
                    value: ti.nombre,
                    label: `${ti.codigo} - ${ti.nombre}`,
                  }))}
                  value={
                    cliente.tipoIdentificacion
                      ? tipoIdentificacion
                          .map((ti) => ({ value: ti.nombre, label: `${ti.codigo} - ${ti.nombre}` }))
                          .find((opt) => opt.value === cliente.tipoIdentificacion) ?? null
                      : null
                  }
                  onChange={(opt) => handleSelectChange("tipoIdentificacion", opt ? opt.value : "")}
                  isClearable
                  placeholder="Seleccionar tipo"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Responsabilidad tributaria *</label>
                <Select
                  options={regimenTributarioDIAN.map((rt) => ({
                    value: rt.descripcion,
                    label: `${rt.codigo} - ${rt.descripcion}`,
                  }))}
                  value={
                    cliente.regimenTributario
                      ? regimenTributarioDIAN
                          .map((rt) => ({ value: rt.descripcion, label: `${rt.codigo} - ${rt.descripcion}` }))
                          .find((opt) => opt.value === cliente.regimenTributario) ?? null
                      : null
                  }
                  onChange={(opt) => handleSelectChange("regimenTributario", opt ? opt.value : "")}
                  isClearable
                  placeholder="Seleccionar régimen"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Número de Identificación *</label>
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
                <label className="form-label">Dígito Verificación</label>
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
              <div className="col-md-6">
                <label className="form-label">Tipo de responsabilidad *</label>
                <Select
                  options={regimenFiscalDIAN.map((rf) => ({
                    value: rf.descripcion,
                    label: `${rf.codigo} - ${rf.descripcion}`,
                  }))}
                  value={
                    cliente.regimenFiscal
                      ? regimenFiscalDIAN
                          .map((rf) => ({ value: rf.descripcion, label: `${rf.codigo} - ${rf.descripcion}` }))
                          .find((opt) => opt.value === cliente.regimenFiscal) ?? null
                      : null
                  }
                  onChange={(opt) => handleSelectChange("regimenFiscal", opt ? opt.value : "")}
                  isClearable
                  placeholder="Seleccionar"
                />
              </div>
            </div>

            {/* ─── Datos comerciales ─── */}
            <h6 className="section-title-cliente">Datos Comerciales</h6>
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
                <label className="form-label">Actividad Económica CIIU</label>
                <Select
                  options={actividadesCIIU.map((act) => ({
                    value: act.codigo,
                    label: `${act.codigo} - ${act.descripcion}`,
                  }))}
                  value={
                    cliente.actividadEconomicaCIIU
                      ? actividadesCIIU
                          .map((act) => ({ value: act.codigo, label: `${act.codigo} - ${act.descripcion}` }))
                          .find((opt) => opt.value === cliente.actividadEconomicaCIIU) ?? null
                      : null
                  }
                  onChange={(opt) => handleSelectChange("actividadEconomicaCIIU", opt ? opt.value : "")}
                  isClearable
                  placeholder="Seleccionar actividad"
                />
              </div>
            </div>

            {/* ─── Información Personal ─── */}
            <h6 className="section-title-cliente">Información Personal</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre o Razón Social *</label>
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
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={cliente.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ─── Contacto ─── */}
            <h6 className="section-title-cliente">Información de Contacto</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  value={cliente.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  className="form-control"
                  value={cliente.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ─── Ubicación ─── */}
            <h6 className="section-title-cliente">Información de Ubicación</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Departamento *</label>
                <Select
                  options={departamentosOptions}
                  value={
                    cliente.departamentoCodigo
                      ? departamentosOptions.find(
                          (opt) => String(opt.departamentoCodigo) === String(cliente.departamentoCodigo)
                        ) ?? null
                      : null
                  }
                  onChange={handleDepartamentoChange}
                  placeholder="Seleccionar departamento"
                  isClearable
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ciudad o Municipio *</label>
                <Select
                  options={ciudadesOptionsPorDepartamento(cliente.departamento)}
                  value={
                    cliente.ciudadCodigo
                      ? ciudadesOptionsPorDepartamento(cliente.departamento).find(
                          (opt) => String(opt.ciudadCodigo) === String(cliente.ciudadCodigo)
                        ) ?? null
                      : null
                  }
                  onChange={handleCiudadChange}
                  placeholder="Seleccionar ciudad"
                  isClearable
                  isDisabled={!cliente.departamento}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-10">
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
              <div className="col-md-2">
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

            {/* ─── Retenciones ─── */}
            <h6 className="section-title-cliente">Retenciones</h6>
            <div className="row mb-3">
              {[
                { name: "retenedorIVA", label: "Retenedor de IVA" },
                { name: "retenedorRenta", label: "Retenedor de Renta" },
                { name: "autoretenedorRenta", label: "Autoretenedor" },
                { name: "retenedorICA", label: "Retenedor de ICA" },
              ].map(({ name, label }) => (
                <div className="col-md-3" key={name}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name={name}
                      className="form-check-input"
                      checked={cliente[name]}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{label}</label>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Footer ─── */}
            <div className="modal-cliente-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : clienteEditando
                  ? "Actualizar Cliente"
                  : "Guardar Cliente"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearCliente;
