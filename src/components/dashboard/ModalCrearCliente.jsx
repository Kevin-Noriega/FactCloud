import React, { useState, useEffect } from "react";
import { API_URL } from "../../api/config";
import Select from "react-select";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import actividadesCIIU from "../../utils/ActividadesEconomicasCIIU.json";
import regimenTributarioDIAN from "../../utils/RegimenTributario.json";
import regimenFiscalDIAN from "../../utils/RegimenFiscal.json";
import {
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../../utils/Helpers";
import "../../styles/ModalCrearCliente.css";

function ModalCrearCliente({ onClose, clienteEditando, onSuccess }) {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    digitoVerificacion: "",
    tipoPersona: "",
    regimenTributario: "",
    correo: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
    regimenFiscal: "",
    retenedorIVA: false,
    retenedorICA: false,
    retenedorRenta: false,
    autoretenedorRenta: false,
    estado: true,
    ciudadCodigo: "",
    departamentoCodigo: "",
    pais: "CO",
    nombreComercial: "",
    actividadEconomicaCIIU: "",
  });

  useEffect(() => {
    if (clienteEditando) {
      setCliente({
        nombre: clienteEditando.nombre || "",
        apellido: clienteEditando.apellido || "",
        tipoIdentificacion: clienteEditando.tipoIdentificacion || "",
        numeroIdentificacion: clienteEditando.numeroIdentificacion || "",
        digitoVerificacion: clienteEditando.digitoVerificacion || "",
        tipoPersona: clienteEditando.tipoPersona || "",
        regimenTributario: clienteEditando.regimenTributario || "",
        correo: clienteEditando.correo || "",
        telefono: clienteEditando.telefono || "",
        departamento: clienteEditando.departamento || "",
        ciudad: clienteEditando.ciudad || "",
        direccion: clienteEditando.direccion || "",
        codigoPostal: clienteEditando.codigoPostal || "",
        regimenFiscal: clienteEditando.regimenFiscal || "",
        retenedorIVA: !!clienteEditando.retenedorIVA,
        retenedorICA: !!clienteEditando.retenedorICA,
        retenedorRenta: !!clienteEditando.retenedorRenta,
        autoretenedorRenta: !!clienteEditando.autoretenedorRenta,
        estado: clienteEditando.estado ?? true,
        ciudadCodigo: clienteEditando.ciudadCodigo || "",
        departamentoCodigo: clienteEditando.departamentoCodigo || "",
        pais: clienteEditando.pais || "CO",
        nombreComercial: clienteEditando.nombreComercial || "",
        actividadEconomicaCIIU: clienteEditando.actividadEconomicaCIIU || "",
      });
    } else {
      limpiarFormulario();
    }
  }, [clienteEditando, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpiarFormulario = () => {
    setCliente({
      nombre: "",
      apellido: "",
      tipoIdentificacion: "",
      numeroIdentificacion: "",
      digitoVerificacion: "",
      tipoPersona: "",
      regimenTributario: "",
      regimenFiscal: "",
      correo: "",
      telefono: "",
      departamento: "",
      ciudad: "",
      ciudadCodigo: "",
      departamentoCodigo: "",
      direccion: "",
      codigoPostal: "",
      retenedorIVA: false,
      retenedorICA: false,
      retenedorRenta: false,
      autoretenedorRenta: false,
      estado: true,
      pais: "CO",
      nombreComercial: "",
      actividadEconomicaCIIU: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        return;
      }

      const payload = {
        ...(clienteEditando && { id: clienteEditando.id }),
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        tipoIdentificacion: cliente.tipoIdentificacion,
        numeroIdentificacion: cliente.numeroIdentificacion,
        digitoVerificacion: cliente.digitoVerificacion || null,
        tipoPersona: cliente.tipoPersona,
        regimenTributario: cliente.regimenTributario,
        regimenFiscal: cliente.regimenFiscal,
        correo: cliente.correo,
        telefono: cliente.telefono || "",
        departamento: cliente.departamento,
        ciudad: cliente.ciudad,
        direccion: cliente.direccion,
        codigoPostal: cliente.codigoPostal || "",
        retenedorIVA: !!cliente.retenedorIVA,
        retenedorICA: !!cliente.retenedorICA,
        retenedorRenta: !!cliente.retenedorRenta,
        autoretenedorRenta: !!cliente.autoretenedorRenta,
        estado: cliente.estado ?? true,
        ciudadCodigo: cliente.ciudadCodigo || "",
        departamentoCodigo: cliente.departamentoCodigo || "",
        pais: cliente.pais || "CO",
        nombreComercial: cliente.nombreComercial || "",
        actividadEconomicaCIIU: cliente.actividadEconomicaCIIU || "",
        usuarioId: usuarioGuardado.id,
      };

      const token = localStorage.getItem("token");
      const url = clienteEditando
        ? `${API_URL}/Clientes/${clienteEditando.id}`
        : `${API_URL}/Clientes`;
      const method = clienteEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(texto);
      }

      const mensaje = clienteEditando
        ? "Cliente modificado con éxito."
        : "Cliente agregado con éxito.";

      onSuccess(mensaje);
      limpiarFormulario();
      onClose();
    } catch (error) {
      alert("Error al guardar cliente: " + error.message);
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    limpiarFormulario();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div className="modal-crearNuevo-overlay" onClick={handleOverlayClick}>
      <div className="modal-crearNuevo-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-crearNuevo-header">
          <h5>{clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleClose}
            aria-label="Cerrar"
          />
        </div>

        <div className="modal-crearNuevo-body">
          <form onSubmit={handleSubmit}>
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
                  name="tipoIdentificacion"
                  options={tipoIdentificacion.map((ti) => ({
                    value: ti.nombre,
                    label: `${ti.codigo} - ${ti.nombre}`,
                  }))}
                  value={
                    cliente.tipoIdentificacion
                      ? tipoIdentificacion
                          .map((ti) => ({
                            value: ti.nombre,
                            label: `${ti.codigo} - ${ti.nombre}`,
                          }))
                          .find((opt) => opt.value === cliente.tipoIdentificacion)
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      tipoIdentificacion: opt ? opt.value : "",
                    }))
                  }
                  isClearable
                  placeholder="Seleccionar tipo"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Responsabilidad tributaria *</label>
                <Select
                  name="regimenTributario"
                  options={regimenTributarioDIAN.map((rt) => ({
                    value: rt.descripcion,
                    label: `${rt.codigo} - ${rt.descripcion}`,
                  }))}
                  value={
                    cliente.regimenTributario
                      ? regimenTributarioDIAN
                          .map((rt) => ({
                            value: rt.descripcion,
                            label: `${rt.codigo} - ${rt.descripcion}`,
                          }))
                          .find((opt) => opt.value === cliente.regimenTributario)
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      regimenTributario: opt ? opt.value : "",
                    }))
                  }
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
                  name="regimenFiscal"
                  options={regimenFiscalDIAN.map((rf) => ({
                    value: rf.descripcion,
                    label: `${rf.codigo} - ${rf.descripcion}`,
                  }))}
                  value={
                    cliente.regimenFiscal
                      ? regimenFiscalDIAN
                          .map((rf) => ({
                            value: rf.descripcion,
                            label: `${rf.codigo} - ${rf.descripcion}`,
                          }))
                          .find((opt) => opt.value === cliente.regimenFiscal)
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      regimenFiscal: opt ? opt.value : "",
                    }))
                  }
                  isClearable
                  placeholder="Seleccionar"
                />
              </div>
            </div>

            <h6 className="section-title-cliente">Datos comerciales</h6>
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
                  name="actividadEconomicaCIIU"
                  options={actividadesCIIU.map((act) => ({
                    value: act.codigo,
                    label: `${act.codigo} - ${act.descripcion}`,
                  }))}
                  value={
                    cliente.actividadEconomicaCIIU
                      ? actividadesCIIU
                          .map((act) => ({
                            value: act.codigo,
                            label: `${act.codigo} - ${act.descripcion}`,
                          }))
                          .find((opt) => opt.value === cliente.actividadEconomicaCIIU)
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      actividadEconomicaCIIU: opt ? opt.value : "",
                    }))
                  }
                  isClearable
                  placeholder="Seleccionar actividad"
                />
              </div>
            </div>

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

            <h6 className="section-title-cliente">Información de Ubicación</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Departamento *</label>
                <Select
                  name="departamento"
                  options={departamentosOptions}
                  value={
                    cliente.departamentoCodigo
                      ? departamentosOptions.find(
                          (opt) =>
                            String(opt.departamentoCodigo) ===
                            String(cliente.departamentoCodigo)
                        ) || null
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      departamento: opt ? opt.value : "",
                      departamentoCodigo: opt ? opt.departamentoCodigo : "",
                      ciudad: "",
                      ciudadCodigo: "",
                    }))
                  }
                  placeholder="Seleccionar departamento"
                  isClearable
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ciudad o Municipio *</label>
                <Select
                  name="ciudad"
                  options={ciudadesOptionsPorDepartamento(cliente.departamento)}
                  value={
                    cliente.ciudadCodigo
                      ? ciudadesOptionsPorDepartamento(cliente.departamento).find(
                          (opt) =>
                            String(opt.ciudadCodigo) === String(cliente.ciudadCodigo)
                        ) || null
                      : null
                  }
                  onChange={(opt) =>
                    setCliente((prev) => ({
                      ...prev,
                      ciudad: opt ? opt.value : "",
                      ciudadCodigo: opt ? opt.ciudadCodigo : "",
                    }))
                  }
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

            <h6 className="section-title-cliente">Retenciones</h6>
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="retenedorIVA"
                    className="form-check-input"
                    checked={cliente.retenedorIVA}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Retenedor de IVA</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="retenedorRenta"
                    className="form-check-input"
                    checked={cliente.retenedorRenta}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Retenedor de Renta</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="autoretenedorRenta"
                    className="form-check-input"
                    checked={cliente.autoretenedorRenta}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Autoretenedor</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="retenedorICA"
                    className="form-check-input"
                    checked={cliente.retenedorICA}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Retenedor de ICA</label>
                </div>
              </div>
            </div>

            <div className="modal-cliente-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {clienteEditando ? "Actualizar Cliente" : "Guardar Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearCliente;