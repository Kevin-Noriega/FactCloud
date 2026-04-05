import { useState } from "react";
import Select from "../StyledSelect";
import FloatingInput from "../FloatingInput";
import {
  ExclamationCircleFill,
  PersonFill,
  BuildingFill,
  Bank,
  ShieldLockFill,
  InfoCircleFill,
  ArrowRight,
} from "react-bootstrap-icons";
import BankList from "../../utils/Bancos.json";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import ciudades from "../../utils/Ciudades.json";

export default function PSEPayment({
  formData,
  errors,
  sameAsOwner,
  onFieldChange,
  onSelectChange,
  onSameAsOwner,
  psePersonType,
  onPersonTypeChange,
}) {
  return (
    <div className="pse-siigo-wrapper">

      {/* ── TIPO DE PERSONA ── */}
      <div className="pse-persona-section">
        <label className="pse-field-label">
          Tipo de persona <span className="required">*</span>
        </label>
        <div className="pse-persona-toggle">
          <button
            type="button"
            className={`pse-persona-btn ${psePersonType === "0" ? "active" : ""}`}
            onClick={() => onPersonTypeChange("0")}
          >
            <PersonFill size={18} />
            <div className="pse-persona-btn-text">
              <span className="pse-persona-btn-title">Persona Natural</span>
              <span className="pse-persona-btn-desc">Ciudadano particular</span>
            </div>
          </button>

          <button
            type="button"
            className={`pse-persona-btn ${psePersonType === "1" ? "active" : ""}`}
            onClick={() => onPersonTypeChange("1")}
          >
            <BuildingFill size={18} />
            <div className="pse-persona-btn-text">
              <span className="pse-persona-btn-title">Persona Jurídica</span>
              <span className="pse-persona-btn-desc">Empresa u organización</span>
            </div>
          </button>
        </div>
      </div>

      <div className="pse-bank-section">
        <Select
          label="Entidad bancaria *"
          name="banco"
          error={errors.banco}
          options={(BankList || []).map((b) => ({
            value: b.codigo,
            label: b.nombre,
          }))}
          formatOptionLabel={({ label, value }) => (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={`https://static.wompi.co/assets/img/pse/${value}.png`}
                alt=""
                style={{ width: "24px", height: "auto", objectFit: "contain" }}
                onError={(e) => (e.target.style.display = "none")}
              />
              <span>{label}</span>
            </div>
          )}
          value={
            formData.banco
              ? {
                value: formData.banco,
                label: (BankList || []).find(
                  (b) => b.codigo === formData.banco
                )?.nombre,
              }
              : null
          }
          onChange={(opt) => onSelectChange("banco", opt ? opt.value : "")}
          isClearable
          isSearchable
          placeholder="Buscar y seleccionar banco..."
          noOptionsMessage={() => "No se encontraron bancos"}
        />
      </div>

      {/* ── DATOS DEL TITULAR ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">
            {psePersonType === "0" ? "Datos del titular" : "Datos de la empresa"}
          </h4>
          <div className="pago-section-divider" />
        </div>

        <div className="pse-form-grid">
          <FloatingInput
            label={psePersonType === "0" ? "Nombres *" : "Razón social *"}
            name="nombres"
            value={formData.nombres}
            onChange={onFieldChange}
            error={errors.nombres}
          />

          <FloatingInput
            label={psePersonType === "0" ? "Apellidos *" : "Representante legal *"}
            name="apellidos"
            value={formData.apellidos}
            onChange={onFieldChange}
            error={errors.apellidos}
          />
        </div>

        <div className="pse-form-grid">
          <Select
            label="Tipo de documento *"
            name="tipoIdentificacion"
            error={errors.tipoIdentificacion}
            options={
              psePersonType === "0"
                ? tipoIdentificacion
                  .filter((ti) => ti.sigla !== "NIT")
                  .map((ti) => ({
                    value: ti.sigla,
                    label: `${ti.sigla} - ${ti.nombre}`,
                  }))
                : [
                  {
                    value: "NIT",
                    label: "NIT - Número de Identificación Tributaria",
                  },
                ]
            }
            value={
              formData.tipoIdentificacion
                ? {
                  value: formData.tipoIdentificacion,
                  label:
                    tipoIdentificacion.find(
                      (ti) =>
                        ti.sigla === formData.tipoIdentificacion ||
                        ti.nombre === formData.tipoIdentificacion
                    )?.nombre || formData.tipoIdentificacion,
                }
                : null
            }
            onChange={(opt) =>
              onSelectChange("tipoIdentificacion", opt ? opt.value : "")
            }
            isClearable
            placeholder="Seleccionar tipo"
          />

          <FloatingInput
            label={psePersonType === "0" ? "Número de documento *" : "NIT *"}
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={onFieldChange}
            error={errors.numeroIdentificacion}
          />
        </div>

        <div className="pse-form-grid">
          <FloatingInput
            label="Correo electrónico *"
            type="email"
            name="email"
            value={formData.email}
            onChange={onFieldChange}
            error={errors.email}
          />

          <FloatingInput
            label="Celular *"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={onFieldChange}
            error={errors.telefono}
            maxLength={10}
          />
        </div>
      </div>

      {/* ── DIRECCIÓN ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">Dirección</h4>
          <div className="pago-section-divider" />
        </div>

        <div className="pse-form-grid">
          <Select
            label="Ciudad *"
            name="ciudad"
            error={errors.ciudad}
            options={ciudades.map((ci) => ({
              value: ci.ciudad,
              label: `${ci.codigoCiudad} - ${ci.ciudad}`,
            }))}
            value={
              formData.ciudad
                ? ciudades
                  .map((ci) => ({
                    value: ci.ciudad,
                    label: `${ci.codigoCiudad} - ${ci.ciudad}`,
                  }))
                  .find((opt) => opt.value === formData.ciudad)
                : null
            }
            onChange={(opt) => onSelectChange("ciudad", opt ? opt.value : "")}
            isClearable
            isSearchable
            placeholder="Buscar ciudad..."
          />

          <FloatingInput
            label="Dirección *"
            name="direccion"
            value={formData.direccion}
            onChange={onFieldChange}
            error={errors.direccion}
          />
        </div>
      </div>

      {/* ── DATOS DE FACTURACIÓN ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">Datos de facturación</h4>
          <div className="pago-section-divider" />
        </div>

        <div className="form-checkbox pago-checkbox">
          <input
            type="checkbox"
            id="same-as-owner-pse"
            checked={sameAsOwner}
            onChange={(e) => onSameAsOwner(e.target.checked)}
          />
          <label htmlFor="same-as-owner-pse">
            Los datos de facturación son los mismos suministrados previamente
          </label>
        </div>

        <FloatingInput
          label="Nombre o razón social *"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={onFieldChange}
          error={errors.razonSocial}
        />

        <div className="pse-form-grid pt-3">
          <FloatingInput
            label="NIT o cédula *"
            name="nit"
            value={formData.nit}
            onChange={onFieldChange}
            error={errors.nit}
          />

          <FloatingInput
            label="Dígito de verificación"
            name="digitoVerificacion"
            value={formData.digitoVerificacion}
            onChange={onFieldChange}
            maxLength={1}
          />
        </div>
      </div>

      {/* ── AVISO DE REDIRECCIÓN ── */}
      <div className="pse-redirect-notice-siigo">
        <div className="pse-redirect-icon">
          <InfoCircleFill size={20} />
        </div>
        <div className="pse-redirect-content">
          <p className="pse-redirect-title">
            Serás redirigido a tu entidad bancaria
          </p>
          <p className="pse-redirect-text">
            Al hacer clic en <strong>"Confirmar y pagar"</strong>, serás
            dirigido al portal seguro de{" "}
            <strong>
              {formData.banco
                ? (BankList || []).find(
                  (b) => b.codigo === formData.banco
                )?.nombre || "tu banco"
                : "tu banco seleccionado"}
            </strong>{" "}
            para autorizar el débito de tu cuenta.
          </p>
        </div>
        <ArrowRight size={20} className="pse-redirect-arrow" />
      </div>
    </div>
  );
}
