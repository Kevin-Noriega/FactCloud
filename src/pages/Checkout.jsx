import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wompiService } from "../Service/wompiService";
import Stepper from "../components/Stepper";
import "../styles/Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isFlipped, setIsFlipped] = useState(false);
  
  // ← AGREGAR ESTOS ESTADOS
  const [acceptanceToken, setAcceptanceToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    cuotas: "1",
    banco: "",
    // Titular tarjeta:
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    email: "",
    celular: "",
    pais: "",
    ciudad: "",
    direccion: "",
    // Facturación:
    razonSocial: "",
    nit: "",
    digitoVerificacion: "",
    emailFacturacion: "",
    celularFacturacion: "",
    departamento: "",
    ciudadFacturacion: "",
    direccionFacturacion: "",
  });

  useEffect(() => {
    const planData = localStorage.getItem("selectedPlan");
    const userData = localStorage.getItem("userData");

    if (!planData || !userData) {
      navigate("/planes");
      return;
    }

    setPlan(JSON.parse(planData));
    setUser(JSON.parse(userData));
    
    // ← CARGAR ACCEPTANCE TOKEN
    loadAcceptanceToken();
  }, [navigate]);

  // ← FUNCIÓN PARA CARGAR ACCEPTANCE TOKEN
  const loadAcceptanceToken = async () => {
    try {
      const response = await wompiService.getAcceptanceToken();
      setAcceptanceToken(response.data.presignedAcceptance.acceptanceToken);
    } catch (error) {
      console.error('Error cargando acceptance token:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ← REEMPLAZAR ESTA FUNCIÓN COMPLETA
  const handlePay = async () => {
    // Validar campos requeridos
    if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
      alert('Por favor completa todos los datos de la tarjeta');
      return;
    }

    if (!formData.nombres || !formData.apellidos || !formData.tipoDocumento || !formData.numeroDocumento) {
      alert('Por favor completa la información del propietario');
      return;
    }

    setLoading(true);
    
    try {
      // 1. TOKENIZAR TARJETA (convierte número en token seguro)
      console.log('Tokenizando tarjeta...');
      const cardToken = await wompiService.tokenizeCard({
        number: formData.cardNumber.replace(/\s/g, ''), // Quita espacios
        cvc: formData.cvv,
        expMonth: formData.expiry.split('/')[0], // MM
        expYear: '20' + formData.expiry.split('/')[1], // 20YY
        cardHolder: formData.cardName
      });

      console.log('Token generado:', cardToken);

      // 2. CREAR TRANSACCIÓN EN WOMPI
      console.log('Creando transacción...');
      const transaction = await wompiService.createTransaction({
        amountInCents: plan.planPrice * 100, // Convertir a centavos
        currency: 'COP',
        reference: `ORDER-${Date.now()}-${user.id}`, // Referencia única
        customerEmail: formData.email || user.email,
        acceptanceToken: acceptanceToken,
        paymentMethod: {
          type: 'CARD',
          token: cardToken,
          installments: parseInt(formData.cuotas) || 1
        },
        customerData: {
          fullName: `${formData.nombres} ${formData.apellidos}`,
          phoneNumber: formData.celular,
          legalId: {
            type: formData.tipoDocumento.toUpperCase(), // CC, CE, NIT
            number: formData.numeroDocumento
          }
        }
      });

      console.log('Transacción creada:', transaction);

      // 3. VERIFICAR ESTADO Y REDIRIGIR
      if (transaction.data.status === 'APPROVED') {
        alert('¡Pago exitoso! 🎉');
        localStorage.setItem('transactionId', transaction.data.id);
        navigate('/confirmacion');
      } else if (transaction.data.status === 'PENDING') {
        alert('Pago pendiente de confirmación. Te notificaremos por email.');
        navigate('/confirmacion');
      } else if (transaction.data.status === 'DECLINED') {
        alert('❌ Pago rechazado. Intenta con otra tarjeta o método de pago.');
      } else {
        alert('Estado desconocido. Contacta soporte.');
      }

    } catch (error) {
      console.error('Error procesando pago:', error);
      
      // Mostrar error específico
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error.reason}`);
      } else {
        alert('Error procesando el pago. Verifica tus datos e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!plan || !user) return null;

  return (
    <div className="checkout-page">
      <Stepper currentStep={3} />
      <div className="checkout-container">
        <button onClick={() => navigate("/Registro")} className="btn-back">
          ← Regresar
        </button>

        <h1>Finaliza tu compra</h1>
        <p className="registro-subtitle">
          Es rápido y sencillo, ingresa los siguientes datos y explora todas las
          herramientas.
        </p>

        <div className="checkout-content">
          <div className="checkout-form">
            <h4>Formas de pago</h4>

            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={() => setPaymentMethod("CARD")}
                />
                Tarjeta de crédito
              </label>

              <label>
                <input
                  type="radio"
                  value="PSE"
                  checked={paymentMethod === "PSE"}
                  onChange={() => setPaymentMethod("PSE")}
                />
                PSE
              </label>
            </div>

            {paymentMethod === "CARD" && (
              <>
                <div className="payment-container">
                  <div className="card-form">
                    <h3>Datos de la tarjeta</h3>

                    <input
                      type="text"
                      name="cardNumber"
                      maxLength={19}
                      placeholder="Número de la tarjeta"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />

                    <input
                      type="text"
                      name="cardName"
                      placeholder="Nombre completo"
                      value={formData.cardName}
                      onChange={handleChange}
                    />

                    <div className="row">
                      <div>
                        <label>Fecha expiración</label>
                        <input 
                          type="text" 
                          name="expiry"
                          placeholder="MM/AA" 
                          maxLength={5}
                          value={formData.expiry}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>CVV</label>
                        <input
                          name="cvv"
                          placeholder="CVV"
                          type="password"
                          maxLength={4}
                          value={formData.cvv}
                          onChange={handleChange}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                        />
                      </div>
                    </div>

                    <select 
                      name="cuotas"
                      value={formData.cuotas}
                      onChange={handleChange}
                    >
                      <option value="1">1 cuota</option>
                      <option value="2">2 cuotas</option>
                      <option value="3">3 cuotas</option>
                      <option value="6">6 cuotas</option>
                      <option value="12">12 cuotas</option>
                    </select>
                  </div>

                  {/* TARJETA VISUAL */}
                  <div
                    className={`credit-card ${isFlipped ? "flipped" : ""}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="card-front">
                      <div className="card-chip" />
                      <div className="card-number">
                        {formData.cardNumber || "0000 0000 0000 0000"}
                      </div>
                      <div className="card-name">
                        {formData.cardName || "NOMBRE APELLIDO"}
                      </div>
                    </div>

                    <div className="card-back">
                      <div className="magnetic-strip" />
                      <div className="cvv-box">CVV</div>
                    </div>
                  </div>

                  {/* INFORMACIÓN DEL PROPIETARIO */}
                  <div className="card-owner">
                    <h3>Información del propietario de la tarjeta</h3>

                    <div className="form-grid">
                      <input 
                        type="text" 
                        name="nombres"
                        placeholder="Nombres *"
                        value={formData.nombres}
                        onChange={handleChange}
                      />
                      <input 
                        type="text" 
                        name="apellidos"
                        placeholder="Apellidos *"
                        value={formData.apellidos}
                        onChange={handleChange}
                      />

                      <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                      >
                        <option value="">Tipo de documento *</option>
                        <option value="CC">Cédula de ciudadanía</option>
                        <option value="CE">Cédula de extranjería</option>
                        <option value="NIT">NIT</option>
                      </select>

                      <input 
                        type="text" 
                        name="numeroDocumento"
                        placeholder="Número de documento *"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                      />

                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <input 
                        type="tel" 
                        name="celular"
                        placeholder="Celular *"
                        value={formData.celular}
                        onChange={handleChange}
                      />

                      <select
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                      >
                        <option value="">País *</option>
                        <option value="CO">Colombia</option>
                      </select>

                      <select
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                      >
                        <option value="">Ciudad *</option>
                        <option value="Bogotá">Bogotá</option>
                        <option value="Medellín">Medellín</option>
                        <option value="Cali">Cali</option>
                      </select>

                      <input
                        type="text"
                        name="direccion"
                        className="full"
                        placeholder="Dirección *"
                        value={formData.direccion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* PSE */}
            {paymentMethod === "PSE" && (
              <>
                <h4>Pago con PSE</h4>
                <select
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                >
                  <option value="">Selecciona tu banco</option>
                  <option>Bancolombia</option>
                  <option>Davivienda</option>
                  <option>BBVA</option>
                  <option>Banco de Bogotá</option>
                </select>
              </>
            )}

            {/* DATOS DE FACTURACIÓN */}
            <h3>Datos de Facturación</h3>
            <div className="checkbox-group">
              <input type="checkbox" id="same-as-owner" />
              <label htmlFor="same-as-owner">
                Los datos de facturación son los mismos suministrados previamente
              </label>
            </div>

            <div className="form-grid">
              <input
                type="text"
                name="razonSocial"
                className="full"
                placeholder="Nombre o Razón Social *"
                value={formData.razonSocial}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="nit"
                placeholder="Nit o cédula*"
                value={formData.nit}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="digitoVerificacion"
                placeholder="Dígito de verificación"
                value={formData.digitoVerificacion}
                onChange={handleChange}
              />
              <input 
                type="email" 
                name="emailFacturacion"
                placeholder="Email *"
                value={formData.emailFacturacion}
                onChange={handleChange}
              />
              <input 
                type="tel" 
                name="celularFacturacion"
                placeholder="Celular *"
                value={formData.celularFacturacion}
                onChange={handleChange}
              />
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
              >
                <option value="">Departamento *</option>
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Antioquia">Antioquia</option>
              </select>
              <select
                name="ciudadFacturacion"
                value={formData.ciudadFacturacion}
                onChange={handleChange}
              >
                <option value="">Ciudad *</option>
                <option value="Bogotá">Bogotá</option>
              </select>
              <input 
                type="text" 
                name="direccionFacturacion"
                className="full" 
                placeholder="Dirección *"
                value={formData.direccionFacturacion}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* RESUMEN DE COMPRA */}
          <div className="resumen-compra">
            <h2>Resumen de compra</h2>

            <div className="resumen-producto">
              <h3>Producto</h3>
              <h3>
                <strong>Referencia: {plan.planReference}</strong>
              </h3>

              <div className="producto-item">
                <div className="producto-info">
                  <span className="producto-nombre">Plan {plan.planName}</span>
                </div>

                <span className="producto-precio">
                  ${plan.planPrice.toLocaleString("es-CO")}
                </span>
              </div>

              <div className="impuestos">
                <span>Impuestos</span>
                <span>$0</span>
              </div>
              <div className="impuestos">
                <span>Descuento</span>
                <span>$0</span>
              </div>

              <div className="total">
                <strong>Total a pagar</strong>
                <strong className="total-precio">
                  ${plan.planPrice.toLocaleString("es-CO")}
                </strong>
              </div>

              {/* BOTÓN CON LOADING */}
              <button 
                className="btn-pay" 
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar y pagar'}
              </button>

              <p className="terms">
                Al finalizar la compra, aceptas nuestros Términos de servicio y
                confirmas que has leído nuestra Política de privacidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
