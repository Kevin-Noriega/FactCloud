import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registro.css";
import Select from "../components/StyledSelect";
import FloatingInput from "../components/FloatingInput";
import tipoIdentificacion from "../utils/TiposDocumentos.json";
import {
  ChevronLeft,
  CheckCircleFill,
  ExclamationCircleFill,
  ShieldCheck,
  TagFill,
  InfoCircleFill,
  ArrowRight,
} from "react-bootstrap-icons";
import { useCupones } from "../hooks/useCupones.JS";
import { ModalDetalles } from "../components/checkout/ModalDetalles";
import Stepper from "../components/Stepper";

export default function Registro() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarVerDetalles, setMostrarVerDetalles] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    nombreCompleto: "",
    telefono: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });

  const tipoOptions = tipoIdentificacion.map((ti) => ({
    value: ti.nombre,
    label: `${ti.codigo} - ${ti.nombre}`,
  }));

  const DOC_RULES = {
    "Cédula de ciudadanía": { min: 6, max: 10, allowLeadingZeros: false },
    "Cédula de extranjería": { min: 6, max: 12, allowLeadingZeros: true },
    NIT: { min: 8, max: 12, allowLeadingZeros: false },
  };

  const onlyDigits = (s) => /^\d+$/.test(s);
  const isBlank = (s) => !s || !s.trim();
  const separarNombreApellido = (nombreCompleto) => {
    const partes = nombreCompleto.trim().split(" ");

    const nombre = partes.shift(); // primer nombre
    const apellido = partes.join(" "); // todo lo demás

    return { nombre, apellido };
  };

  const cupones = useCupones(selectedPlan?.id);
  useEffect(() => {
    window.scrollTo(0, 0);
    const plan = localStorage.getItem("selectedPlan");
    if (plan) {
      setSelectedPlan(JSON.parse(plan));
    }

    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const allowedTipos = new Set(tipoOptions.map((x) => x.value));

    // 1) Tipo documento
    if (isBlank(formData.tipoIdentificacion)) {
      newErrors.tipoIdentificacion = "Selecciona un tipo de documento";
    } else if (!allowedTipos.has(formData.tipoIdentificacion)) {
      newErrors.tipoIdentificacion = "Tipo de documento inválido";
    }

    // 2) Número documento
    const doc = (formData.numeroIdentificacion ?? "").trim();
    if (isBlank(doc))
      newErrors.numeroIdentificacion = "El documento es obligatorio";
    else if (!onlyDigits(doc))
      newErrors.numeroIdentificacion = "Solo se permiten números";
    else {
      const rules = DOC_RULES[formData.tipoIdentificacion];
      if (rules) {
        if (doc.length < rules.min || doc.length > rules.max) {
          newErrors.numeroIdentificacion = `Longitud inválida (${rules.min}-${rules.max})`;
        }
        if (!rules.allowLeadingZeros && doc.length > 1 && doc.startsWith("0")) {
          newErrors.numeroIdentificacion =
            "No se permiten ceros a la izquierda";
        }
      }
    }

    // 3) Nombre
    const nombre = (formData.nombreCompleto ?? "").trim();
    const { nombre: nombreSeparado, apellido } = separarNombreApellido(nombre);
    if (isBlank(nombre))
      newErrors.nombreCompleto = "Nombre completo es obligatorio";
    else {
      const okChars = /^[\p{L}\p{M} ]+$/u; // letras, tildes y espacios
      if (!okChars.test(nombre))
        newErrors.nombreCompleto = "Solo letras y espacios";
      if (nombre.length < 6) newErrors.nombreCompleto = "Muy corto (mínimo 6)";
      if (nombre.length > 80)
        newErrors.nombreCompleto = "Muy largo (máximo 80)";
    }
    // 4) Teléfono
    const tel = (formData.telefono ?? "").trim();
    if (isBlank(tel)) newErrors.telefono = "Teléfono es obligatorio";
    else if (!onlyDigits(tel)) newErrors.telefono = "Teléfono solo dígitos";
    else if (tel.length !== 10)
      newErrors.telefono = "Teléfono debe tener 10 dígitos";

    // 5) Email
    const email = (formData.email ?? "").trim();
    if (isBlank(email)) newErrors.email = "Email es obligatorio";
    else {
      if (/\s/.test(email)) newErrors.email = "Email no debe tener espacios";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Formato de email inválido";
      if (email.length > 254) newErrors.email = "Email demasiado largo";
    }

    // 6) Confirm email
    const confirmEmail = (formData.confirmEmail ?? "").trim();
    if (isBlank(confirmEmail)) newErrors.confirmEmail = "Confirma tu email";
    else if (!isBlank(email) && confirmEmail !== email)
      newErrors.confirmEmail = "Los emails no coinciden";

    // 7) Password
    const pass = formData.password ?? "";
    if (!pass) newErrors.password = "Contraseña es obligatoria";
    else {
      if (pass.length < 8 || pass.length > 64)
        newErrors.password = "Debe tener 8 a 64 caracteres";
      const complexity =
        /[a-z]/.test(pass) &&
        /[A-Z]/.test(pass) &&
        /\d/.test(pass) &&
        /[^A-Za-z0-9]/.test(pass);
      if (!complexity)
        newErrors.password = "Incluye mayúscula, minúscula, número y símbolo";
    }

    // 8) Confirm password
    const confirmPass = formData.confirmPassword ?? "";
    if (isBlank(confirmPass))
      newErrors.confirmPassword = "Confirma tu contraseña";
    else if (!isBlank(pass) && confirmPass !== pass)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    // 9) Términos
    if (!formData.aceptaTerminos)
      newErrors.aceptaTerminos = "Debes aceptar los términos";

    // Si hay errores, muéstralos y no sigas
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // OK: guarda y navega
    try {
      const registroData = {
        tipoIdentificacion: formData.tipoIdentificacion,
        numeroIdentificacion: doc,
        nombre: nombreSeparado,
        apellido: apellido,
        telefono: tel,
        email: email.toLowerCase(),
        password: pass,
      };

      const precioOriginal = selectedPlan.descuentoActivo
        ? Math.round(
          selectedPlan.precioAnual / (1 - selectedPlan.descuentoPorcentaje / 100),
        )
        : selectedPlan.precioAnual;

      const descuentoPlan = selectedPlan.descuentoActivo
        ? precioOriginal - selectedPlan.precioAnual
        : 0;

      const subtotal = selectedPlan.precioAnual;

      const descuentoCupon = cupones.coupon
        ? cupones.coupon.priceAfterDiscount != null
          ? subtotal - cupones.coupon.priceAfterDiscount
          : Math.round(subtotal * (cupones.coupon.discountPercent / 100))
        : 0;

      const totalFinal = cupones.coupon
        ? (cupones.total ?? subtotal - descuentoCupon)
        : subtotal;

      const checkoutData = {
        plan: selectedPlan,
        totalFinal: totalFinal,
        descuentoPlan: descuentoPlan,
        descuentoCupon: descuentoCupon,
        cupon: cupones.coupon,
      };

      localStorage.setItem("registroData", JSON.stringify(registroData));
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      navigate("/checkout");
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error procesando los datos. Intenta nuevamente.");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!selectedPlan)
    return (
      <div className="no-plan">
        <h2>No hay plan seleccionado</h2>
        <button onClick={() => navigate("/planes")}>Ir a Planes</button>
      </div>
    );

  const precioOriginal = selectedPlan.descuentoActivo
    ? Math.round(
      selectedPlan.precioAnual / (1 - selectedPlan.descuentoPorcentaje / 100),
    )
    : selectedPlan.precioAnual;

  const descuentoPlan = selectedPlan.descuentoActivo
    ? precioOriginal - selectedPlan.precioAnual
    : 0;

  const subtotal = selectedPlan.precioAnual;

  const descuentoCupon = cupones.coupon
    ? cupones.coupon.priceAfterDiscount != null
      ? subtotal - cupones.coupon.priceAfterDiscount
      : Math.round(subtotal * (cupones.coupon.discountPercent / 100))
    : 0;

  const totalFinal = cupones.coupon
    ? (cupones.total ?? subtotal - descuentoCupon)
    : subtotal;

  return (
    <div className="registro-page">
      <Stepper currentStep={2} />
      <div className="registro-container">
        <button onClick={() => navigate("/planes")} className="btn-back-register">
          <ChevronLeft />
          Regresar
        </button>
        {/* 
        <div className="plan-banner">
          <div className="plan-banner-content">
            <CheckCircleFill />
            <p className="plan-banner-title">
              ¡COMPRA HOY! el plan {selectedPlan.nombre}, y te{" "}
              <strong>regalamos el doble de documento</strong>
            </p>
          </div>
        </div> */}

        <div className="registro-content">
          <div className="registro-form-section">
            <h1>Crea tu cuenta</h1>
            <p className="registro-subtitle">
              Es rápido y sencillo, ingresa los siguientes datos y explora todas
              las herramientas.
            </p>

            <form onSubmit={handleSubmit} className="registro-form">
              <div className="form-row">
                <Select
                  label="Tipo de documento *"
                  name="tipoIdentificacion"
                  options={tipoOptions}
                  value={
                    tipoOptions.find(
                      (o) => o.value === formData.tipoIdentificacion,
                    ) || null
                  }
                  onChange={(opt) => {
                    setFormData((prev) => ({
                      ...prev,
                      tipoIdentificacion: opt ? opt.value : "",
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      tipoIdentificacion: undefined,
                    }));
                  }}
                  isClearable
                  placeholder="Seleccionar tipo"
                  error={errors.tipoIdentificacion}
                  className="input-with-icon"
                />

                <FloatingInput
                  label="Número de documento *"
                  name="numeroIdentificacion"
                  value={formData.numeroIdentificacion}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      numeroIdentificacion: onlyNums,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      numeroIdentificacion: undefined,
                    }));
                  }}
                  error={errors.numeroIdentificacion}
                  className="input-with-icon"
                  inputMode="numeric"
                  maxLength={12}
                />
              </div>

              <div className="form-row">
                <FloatingInput
                  label="Nombres y apellidos *"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+/g, "")
                      .replace(/\s{2,}/g, " ");
                    setFormData((prev) => ({ ...prev, nombreCompleto: value }));
                    setErrors((prev) => ({ ...prev, nombreCompleto: undefined }));
                  }}
                  error={errors.nombreCompleto}
                  className="input-with-icon"
                  maxLength={80}
                />

                <FloatingInput
                  label="Teléfono (Ej: 3001234567) *"
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, telefono: onlyNums }));
                    setErrors((prev) => ({ ...prev, telefono: undefined }));
                  }}
                  error={errors.telefono}
                  className="input-with-icon"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>

              <div className="form-row">
                <FloatingInput
                  label="Correo electrónico *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "").toLowerCase();
                    setFormData((prev) => ({ ...prev, email: value }));
                    setErrors((prev) => ({ ...prev, email: undefined, confirmEmail: undefined }));
                  }}
                  error={errors.email}
                  className="input-with-icon"
                  autoComplete="email"
                />

                <FloatingInput
                  label="Confirmar correo electrónico *"
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "").toLowerCase();
                    setFormData((prev) => ({ ...prev, confirmEmail: value }));
                    setErrors((prev) => ({ ...prev, confirmEmail: undefined }));
                  }}
                  error={errors.confirmEmail}
                  className="input-with-icon"
                />
              </div>

              <div className="form-row">
                <FloatingInput
                  label="Crear contraseña *"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange(e);
                    setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
                  }}
                  error={errors.password}
                  className="input-with-icon"
                  autoComplete="new-password"
                />

                <FloatingInput
                  label="Confirmar contraseña *"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  error={errors.confirmPassword}
                  className="input-with-icon"
                />
              </div>

              <div className="form-checkbox">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="terminos"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, aceptaTerminos: undefined }));
                    }}
                  />
                  <label htmlFor="terminos">
                    Autorizo el tratamiento de mis datos personales según la{" "}
                    <a href="/politica-privacidad" target="_blank">Política de Privacidad</a> y
                    acepto los términos y condiciones de Nubee.
                  </label>
                </div>
                {errors.aceptaTerminos && (
                  <div className="error-message" style={{ marginTop: "4px" }}>
                    <ExclamationCircleFill size={14} />
                    <span>{errors.aceptaTerminos}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-crear-cuenta">
                Crear cuenta
              </button>

              <p className="login-link">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </form>
          </div>

          {selectedPlan && (
            <div>

              <div className="resumen-compra">
                <h2>Resumen de compra</h2>

                <div className="resumen-producto">
                  <h3>Producto</h3>
                  <div className="producto-item">
                    <div className="producto-info">
                      <span className="producto-nombre">
                        Plan {selectedPlan.nombre}
                      </span>


                      <button
                        className="ver-detalle"
                        title="Detalles"
                        onClick={() => setMostrarVerDetalles(true)}
                      >
                        Ver detalle
                      </button>
                    </div>
                    <span className="producto-precio">
                      $
                      {selectedPlan.descuentoActivo
                        ? Math.round(
                          selectedPlan.precioAnual /
                          (1 - selectedPlan.descuentoPorcentaje / 100),
                        ).toLocaleString("es-CO")
                        : (selectedPlan.precioAnual ?? 0).toLocaleString(
                          "es-CO",
                        )}
                    </span>
                  </div>

                  {selectedPlan.descuentoActivo && (
                    <div className="descuento-item">
                      <span>
                        Descuento ({selectedPlan.descuentoPorcentaje}%)
                      </span>
                      <span className="descuento-valor">
                        -${descuentoPlan.toLocaleString("es-CO")}
                      </span>
                    </div>
                  )}

                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span>
                      ${(selectedPlan.precioAnual ?? 0).toLocaleString("es-CO")}
                    </span>
                  </div>
                  {cupones.coupon && (
                    <div className="cupon">
                      <span>
                        Descuento cupon ({cupones.coupon.discountPercent}%){" "}
                      </span>
                      <span className="descuento-cupon">
                        -${descuentoCupon.toLocaleString("es-CO")}
                      </span>
                    </div>
                  )}

                  <div className="impuestos">
                    <span>Impuestos</span>
                    <span>$0</span>
                  </div>

                  <div className="codigo-descuento">
                    <FloatingInput
                      label="Código de descuento"
                      name="couponCode"
                      value={cupones.couponCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        cupones.setCouponCode(value);
                        if (!value.trim()) {
                          cupones.clearCoupon();
                        }
                      }}
                      className="pago-input-group"
                      style={{ marginTop: 0, flex: 1 }}
                    />
                    <button
                      className="btn-validar"
                      onClick={cupones.validateCoupon}
                      disabled={cupones.loading}
                    >
                      {cupones.loading ? "..." : "Validar"}
                    </button>
                  </div>
                  {cupones.couponError && (
                    <p className="coupon-error text-danger samll mt-1">
                      {cupones.couponError}
                    </p>
                  )}
                  {cupones.coupon && (
                    <div className="coupon-success text-success small mt-1">
                      {cupones.coupon.message}
                    </div>
                  )}

                  <div className="total">
                    <strong>Total a pagar / año</strong>
                    <strong className="total-precio">
                      ${totalFinal.toLocaleString("es-CO")}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ModalDetalles
            isOpen={mostrarVerDetalles}
            onClose={() => setMostrarVerDetalles(false)}
            plan={selectedPlan}
          />
        </div>
      </div>
    </div>
  );
}
