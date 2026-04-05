import Select from "../StyledSelect";
import FloatingInput from "../FloatingInput";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { getCardType } from "../../utils/checkoutUtils";
import tipoIdentificacion from "../../utils/TiposDocumentos.json";
import ciudades from "../../utils/Ciudades.json";

export default function CardPayment({
  formData,
  errors,
  isFlipped,
  sameAsOwner,
  onFieldChange,
  onSelectChange,
  onFlip,
  onSameAsOwner,
}) {
  const cardType = getCardType(formData.cardNumber);

  const cuotasOptions = [
    { value: "1", label: "1 cuota (sin interés)" },
    { value: "2", label: "2 cuotas" },
    { value: "3", label: "3 cuotas" },
    { value: "6", label: "6 cuotas" },
    { value: "12", label: "12 cuotas" },
  ];
  return (
    <>
      {/* ── DATOS DE LA TARJETA ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">
            Datos de la tarjeta
          </h4>
          <div className="pago-section-divider" />
        </div>

        <div className="payment-container">
          <div className="card-form-fields">
            <div className="form-row">
              <FloatingInput
                label="Número de tarjeta *"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={onFieldChange}
                error={errors.cardNumber}
                maxLength={19}
              />

              <FloatingInput
                label="Nombre del titular *"
                name="cardName"
                value={formData.cardName}
                onChange={onFieldChange}
                error={errors.cardName}
              />
            </div>

            <div className="form-row">
              <FloatingInput
                label="MM/AA *"
                name="expiry"
                value={formData.expiry}
                onChange={onFieldChange}
                error={errors.expiry}
                maxLength={5}
              />

              <FloatingInput
                label="CVV *"
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={onFieldChange}
                onFocus={() => onFlip(true)}
                onBlur={() => onFlip(false)}
                error={errors.cvv}
                maxLength={4}
              />
            </div>

            <Select
              label="Cuotas"
              name="cuotas"
              placeholder="Seleccionar cuotas"
              options={cuotasOptions}
              onChange={(selectedOption) =>
                onFieldChange({
                  target: {
                    name: "cuotas",
                    value: selectedOption?.value,
                  },
                })
              }
              value={
                cuotasOptions.find(
                  (opt) => String(opt.value) === String(formData.cuotas)
                ) ?? null
              }
            />
          </div>

          {/* TARJETA VISUAL */}
          <div
            className={`credit-card ${isFlipped ? "flipped" : ""}`}
            onClick={() => onFlip(!isFlipped)}
          >
            <div className="card-front">
              <div className="card-chip" />
              <div className="card-type">{cardType}</div>
              <div className="card-number">
                {formData.cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div className="card-details">
                <div>
                  <small>TITULAR</small>
                  <div>{formData.cardName || "NOMBRE"}</div>
                </div>
                <div>
                  <small>VENCE</small>
                  <div>{formData.expiry || "MM/AA"}</div>
                </div>
              </div>
            </div>

            <div className="card-back">
              <div className="magnetic-strip" />
              <div className="cvv-section">
                <small>CVV</small>
                <div className="cvv-box">{formData.cvv || "•••"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INFORMACIÓN DEL TITULAR ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">Información del propetario de la tarjeta de crédito</h4>
          <div className="pago-section-divider" />
        </div>

        <div className="form-row">
          <FloatingInput
            label="Nombres *"
            name="nombres"
            value={formData.nombres}
            onChange={onFieldChange}
            error={errors.nombres}
          />

          <FloatingInput
            label="Apellidos *"
            name="apellidos"
            value={formData.apellidos}
            onChange={onFieldChange}
            error={errors.apellidos}
          />
        </div>

        <div className="form-row">
          <Select
            label="Tipo de documento *"
            name="tipoIdentificacion"
            error={errors.tipoIdentificacion}
            options={tipoIdentificacion.map((ti) => ({
              value: ti.nombre,
              label: `${ti.codigo} - ${ti.nombre}`,
            }))}
            value={
              formData.tipoIdentificacion
                ? tipoIdentificacion
                  .map((ti) => ({
                    value: ti.nombre,
                    label: `${ti.codigo} - ${ti.nombre}`,
                  }))
                  .find(
                    (opt) => opt.value === formData.tipoIdentificacion
                  )
                : null
            }
            onChange={(opt) =>
              onSelectChange("tipoIdentificacion", opt ? opt.value : "")
            }
            isClearable
            placeholder="Seleccionar tipo"
          />

          <FloatingInput
            label="Número de documento *"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={onFieldChange}
            error={errors.numeroIdentificacion}
          />
        </div>

        <div className="form-row">
          <FloatingInput
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={onFieldChange}
            error={errors.email}
          />

          <FloatingInput
            label="Teléfono *"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={onFieldChange}
            error={errors.telefono}
            maxLength={10}
          />
        </div>

        <div className="form-row">
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
            onChange={(opt) =>
              onSelectChange("ciudad", opt ? opt.value : "")
            }
            isClearable
            placeholder="Seleccionar ciudad"
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

      {/* ── FACTURACIÓN ── */}
      <div className="pago-datos-section">
        <div className="pago-section-header">
          <h4 className="pago-section-title">Datos de facturación</h4>
          <div className="pago-section-divider" />
        </div>

        <div className="form-checkbox pago-checkbox">
          <input
            type="checkbox"
            id="same-as-owner-card"
            checked={sameAsOwner}
            onChange={(e) => onSameAsOwner(e.target.checked)}
          />
          <label htmlFor="same-as-owner-card">
            Los datos de facturación son los mismos suministrados previamente
          </label>
        </div>


        <FloatingInput
          label="Razón Social *"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={onFieldChange}
          error={errors.razonSocial}
        />

        <div className="form-row pt-3">
          <FloatingInput
            label="NIT *"
            name="nit"
            value={formData.nit}
            onChange={onFieldChange}
            error={errors.nit}
          />
          <FloatingInput
            label="Email facturación *"
            type="email"
            name="emailFacturacion"
            value={formData.emailFacturacion}
            onChange={onFieldChange}
          />

          <Select
            label="Ciudad facturación"
            name="ciudadFacturacion"
            options={ciudades.map((ci) => ({
              value: ci.ciudad,
              label: `${ci.codigoCiudad} - ${ci.ciudad}`,
            }))}
            value={
              formData.ciudadFacturacion
                ? ciudades
                  .map((ci) => ({
                    value: ci.ciudad,
                    label: `${ci.codigoCiudad} - ${ci.ciudad}`,
                  }))
                  .find(
                    (opt) => opt.value === formData.ciudadFacturacion
                  )
                : null
            }
            onChange={(opt) =>
              onSelectChange(
                "ciudadFacturacion",
                opt ? opt.value : ""
              )
            }
            isClearable
            placeholder="Seleccionar ciudad"
          />
        </div>
      </div>
    </>
  );
}
