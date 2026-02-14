import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import "../styles/Registro.css";
import Select from "react-select";
import tipoIdentificacion from "../utils/TiposDocumentos.json";
import { ChevronLeft, CheckCircleFill } from "react-bootstrap-icons";
import { useCupones } from "../hooks/useCupones.JS";
import { ModalDetalles } from "../components/checkout/ModalDetalles";

export default function Registro() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarVerDetalles, setMostrarVerDetalles] = useState(false);

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

  const cupones = useCupones(selectedPlan?.id);
  useEffect(() => {
    window.scrollTo(0, 0);
    const plan = localStorage.getItem("selectedPlan");
    if (plan) {
      setSelectedPlan(JSON.parse(plan));
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!selectedPlan)
    return (
      <div className="no-plan">
        <h2>No hay plan seleccionado</h2>
        <button onClick={() => navigate("/planes")}>Ir a Planes</button>
      </div>
    );

  const descuentoPlan =
    (selectedPlan.originalAnnualPrice * selectedPlan.discountPercentage) / 100;
  const subtotal = selectedPlan.annualPrice;
  const descuentoCupon =
    subtotal - (cupones.coupon?.priceAfterDiscount || subtotal);
  const totalFinal = cupones.coupon ? cupones.total : subtotal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.email !== formData.confirmEmail) {
      alert("Los emails no coinciden");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!formData.aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const registroData = {
        tipoIdentificacion: formData.tipoIdentificacion,
        numeroIdentificacion: formData.numeroIdentificacion,
        nombre: formData.nombreCompleto,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
      };

      localStorage.setItem("registroData", JSON.stringify(registroData));

      navigate("/checkout");
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error procesando los datos. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Cargando plan seleccionado...</div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <Stepper currentStep={2} />
     

      <div className="registro-container">
         <button onClick={() => navigate("/planes")} className="btn-back">
        <ChevronLeft />
        Regresar
      </button>

        <div className="registro-content">
          <div className="registro-form-section">
            <h1>Crea tu cuenta</h1>
            <p className="registro-subtitle">
              Es rápido y sencillo, ingresa los siguientes datos y explora todas
              las herramientas.
            </p>

            <form onSubmit={handleSubmit} className="registro-form">
              <div className="form-row">
                <div className="form-group">
                  <Select
                    name="tipoIdentificacion"
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
                              (opt) =>
                                opt.value === formData.tipoIdentificacion,
                            )
                        : null
                    }
                    onChange={(opt) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipoIdentificacion: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar tipo"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    value={formData.numeroIdentificacion}
                    onChange={handleChange}
                    placeholder="Número de documento *"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Nombres y apellidos *"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="telefono *"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail *"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder="confirmar E-mail *"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Contraseña *"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmar contraseña *"
                    required
                  />
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="terminos"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terminos">
                  Al hacer clic, autorizo a que Factcloud trate mis datos
                  conforme a lo descrito en la{" "}
                  <a href="/politica-privacidad" target="_blank">
                    Política de Privacidad
                  </a>
                  , cree una cuenta con mis datos en www.factcloud.com y me
                  ofrezca servicios propios y/o de terceros.
                </label>
              </div>

              <button type="submit" className="btn-crear-cuenta">
                Continuar al pago
              </button>

              <p className="login-link">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </form>
          </div>

          {selectedPlan && (
            <div>
              <div className="plan-banner">
                <div className="plan-banner-content">
                  <CheckCircleFill />
                  <p className="plan-banner-title">
                    ¡COMPRA HOY! el plan {selectedPlan.name}, y te{" "}
                    <strong>regalamos el doble de documento</strong>
                  </p>
                </div>
              </div>
              <div className="resumen-compra">
                <h2>Resumen de compra</h2>

                <div className="resumen-producto">
                  <h3>Producto</h3>
                  <div className="producto-item">
                    <div className="producto-info">
                      <span className="producto-nombre">
                        Plan {selectedPlan.name}
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
                      {selectedPlan.originalAnnualPrice.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="descuento-item">
                    <span>Descuento ({selectedPlan.discountPercentage}%) </span>
                    <span className="descuento-valor">
                      -${descuentoPlan.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span>
                      ${selectedPlan.annualPrice.toLocaleString("es-CO")}
                    </span>
                  </div>
                  {cupones.coupon && (
                    <div className="cupon">
                      <span>
                        Descuento cupon ({cupones.coupon.discountPercent}%){" "}
                      </span>
                      <span className = "descuento-cupon">-${descuentoCupon.toLocaleString("es-CO")}</span>
                    </div>
                  )}

                  <div className="impuestos">
                    <span>Impuestos</span>
                    <span>$0</span>
                  </div>

                  <div className="codigo-descuento">
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={cupones.couponCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        cupones.setCouponCode(value);

                        if (!value.trim()) {
                          cupones.clearCoupon();
                        }
                      }}
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
