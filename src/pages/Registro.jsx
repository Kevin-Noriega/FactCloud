import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import "../styles/Registro.css";

export default function Registro() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombreCompleto: "",
    celular: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const plan = localStorage.getItem("selectedPlan");
    if (plan) {
      setSelectedPlan(JSON.parse(plan));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      localStorage.setItem("userData", JSON.stringify({
        email: formData.email,
        nombre: formData.nombreCompleto, 
        documento: formData.numeroDocumento
      }));

      navigate("/checkout");

    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error al crear la cuenta. Intenta nuevamente.");
    }
  };

  return (
    <div className="registro-page">
      <Stepper currentStep={2} />

      <div className="registro-container">

        {selectedPlan && (
          <div className="plan-banner">
            <div className="plan-banner-content">
              <p className="plan-banner-title">
                ¡COMPRA HOY! el plan {selectedPlan.planName}, y te{" "}
                <strong>regalamos el doble de documento</strong>
              </p>
            </div>
          </div>
        )}

        <div className="registro-content">
          <div className="registro-form-section">
            <button 
              onClick={() => navigate("/planes")} 
              className="btn-back"
            >
              ← Regresar
            </button>

            <h1>Crea tu cuenta</h1>
            <p className="registro-subtitle">
              Es rápido y sencillo, ingresa los siguientes datos y explora todas las herramientas.
            </p>

            <form onSubmit={handleSubmit} className="registro-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo Documento *</label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de documento *</label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    placeholder="123456789"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombres y apellidos *</label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Celular *</label>
                  <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    placeholder="3001234567"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirmar e-mail *</label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirmar contraseña *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
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
                  Al hacer clic, autorizo a que Siigo trate mis datos conforme a lo descrito en la{" "}
                  <a href="/politica-privacidad" target="_blank">
                    Política de Privacidad
                  </a>
                  , cree una cuenta con mis datos en www.siigo.com y me ofrezca servicios propios y/o de terceros.
                </label>
              </div>

              <button type="submit" className="btn-crear-cuenta">
                Crear tu cuenta
              </button>

              <p className="login-link">
                ¿Ya tienes cuenta?{" "}
                <a href="/login">Inicia sesión</a>
              </p>
            </form>
          </div>

          {selectedPlan && (
            <div className="resumen-compra">
              <h2>Resumen de compra</h2>

              <div className="resumen-producto">
                <h3>Producto</h3>
                <div className="producto-item">
                  <div className="producto-info">
                    <span className="producto-nombre">
                      Plan {selectedPlan.planName}
                    </span>
                    <button className="ver-detalle">Ver detalle</button>
                  </div>
                  <span className="producto-precio">
                    ${selectedPlan.planPrice.toLocaleString("es-CO")}
                  </span>
                </div>

                <div className="descuento-item">
                  <span>↓ Descuento {selectedPlan.planDiscount}</span>
                  <span className="descuento-valor">
                    -${(selectedPlan.planPrice * 0.09).toLocaleString("es-CO")}
                  </span>
                </div>

                <div className="subtotal">
                  <span>Subtotal</span>
                  <span>
                    ${(selectedPlan.planPrice * 0.91).toLocaleString("es-CO")}
                  </span>
                </div>

                <div className="impuestos">
                  <span>Impuestos</span>
                  <span>$0</span>
                </div>

                <div className="codigo-descuento">
                  <input 
                    type="text" 
                    placeholder="Código de descuento"
                  />
                  <button className="btn-validar">Validar</button>
                </div>

                <div className="total">
                  <strong>Total a pagar / año</strong>
                  <strong className="total-precio">
                    ${(selectedPlan.planPrice * 0.91).toLocaleString("es-CO")}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
