import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wompiService } from "../Service/wompiService";
import { API_URL } from "../api/config";
import Stepper from "../components/Stepper";
import {
  CreditCard,
  Bank,
  ShieldCheck,
  CheckCircleFill,
} from "react-bootstrap-icons";
import "../styles/Checkout.css";

import { ModalDetalles } from "../components/checkout/ModalDetalles";
import CardPayment from "../components/checkout/CardPayment";
import PSEPayment from "../components/checkout/PSEPayment";
import {
  INITIAL_FORM_DATA,
  formatField,
  validateCheckoutForm,
  getTipoDocCodigo,
} from "../utils/checkoutUtils";

export default function Checkout() {
  const navigate = useNavigate();

  // ── State ──
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isFlipped, setIsFlipped] = useState(false);
  const [acceptanceToken, setAcceptanceToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sameAsOwner, setSameAsOwner] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [mostrarVerDetalles, setMostrarVerDetalles] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [psePersonType, setPsePersonType] = useState("0");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // ── Init ──
  useEffect(() => {
    window.scrollTo(0, 0);

    const data = localStorage.getItem("checkoutData");
    if (data) setCheckoutData(JSON.parse(data));

    const planData = localStorage.getItem("selectedPlan");
    const registroDataLocal = localStorage.getItem("registroData");

    if (!planData || !registroDataLocal) {
      alert("Datos incompletos. Inicia el proceso nuevamente.");
      navigate("/planes");
      return;
    }

    wompiService
      .getFinancialInstitutions()
      .then((banks) => setBankList(banks || []))
      .catch((err) => console.error("Error cargando bancos:", err));

    const parsedPlan = JSON.parse(planData);
    const parsedRegistro = JSON.parse(registroDataLocal);

    setPlan({ ...parsedPlan, planPrice: parsedPlan.precioAnual || 0 });
    setUser(parsedRegistro);

    setFormData((prev) => ({
      ...prev,
      email: parsedRegistro.email || "",
      nombres: parsedRegistro.nombre?.split(" ")[0] || "",
      apellidos: parsedRegistro.nombre?.split(" ").slice(1).join(" ") || "",
      tipoIdentificacion: parsedRegistro.tipoIdentificacion || "",
      numeroIdentificacion: parsedRegistro.numeroIdentificacion || "",
      telefono: parsedRegistro.telefono || "",
    }));

    loadAcceptanceToken();
  }, [navigate]);

  const loadAcceptanceToken = async () => {
    try {
      const token = await wompiService.getAcceptanceToken();
      setAcceptanceToken(token);
    } catch (error) {
      console.error("Error cargando token:", error);
    }
  };

  // ── Shared handlers (used by both CardPayment and PSEPayment) ──
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const formatted = formatField(name, value);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSameAsOwner = (checked) => {
    setSameAsOwner(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        razonSocial: `${prev.nombres} ${prev.apellidos}`,
        nit: prev.numeroIdentificacion,
        emailFacturacion: prev.email,
        telefonoFacturacion: prev.telefono,
        departamento: "",
        ciudadFacturacion: prev.ciudad,
        direccionFacturacion: prev.direccion,
      }));
    }
  };

  // ── Unified validation ──
  const runValidation = () => {
    const newErrors = validateCheckoutForm(formData, paymentMethod);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Pay handler ──
  const handlePay = async () => {
    if (!runValidation()) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    setLoading(true);

    try {
      if (!plan || !plan.planPrice) {
        alert("Error: No se ha seleccionado un plan válido");
        return;
      }

      const tipoDocCodigo = getTipoDocCodigo(formData.tipoIdentificacion);

      if (paymentMethod === "PSE") {
        await handlePSEPayment(tipoDocCodigo);
      } else {
        await handleCardPayment(tipoDocCodigo);
      }
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Response:", error.response?.data);
      alert(
        error.response?.data?.error ||
        error.message ||
        "Error procesando el pago"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── PSE payment flow ──
  const handlePSEPayment = async (tipoDocCodigo) => {
    const amountInCents = Math.round(parseFloat(plan.planPrice) * 100);
    const reference = `FACTCLOUD-PSE-${Date.now()}`;

    if (isNaN(amountInCents) || amountInCents <= 0) {
      alert("Error: Monto inválido");
      return;
    }

    const pseData = {
      amountInCents,
      currency: "COP",
      reference,
      customerEmail: formData.email,
      acceptanceToken,
      paymentMethod: {
        type: "PSE",
        user_type: parseInt(psePersonType),
        user_legal_id_type: tipoDocCodigo,
        user_legal_id: formData.numeroIdentificacion,
        financial_institution_code: formData.banco,
        payment_description: `Pago Plan ${plan.nombre} - FactCloud`,
      },
      customerData: {
        fullName: `${formData.nombres} ${formData.apellidos}`,
        phoneNumber: `+57${formData.telefono}`,
        legalId: {
          type: tipoDocCodigo,
          number: formData.numeroIdentificacion,
        },
      },
      datosRegistro: {
        nombre: user.nombre,
        telefono: user.telefono,
        correo: user.email,
        password: user.password,
        tipoIdentificacion: user.tipoIdentificacion,
        numeroIdentificacion: user.numeroIdentificacion,
      },
      datosNegocio: {
        nombreNegocio: formData.razonSocial,
        nit: formData.nit,
        dvNit: formData.digitoVerificacion,
        direccion: formData.direccionFacturacion || formData.direccion,
        ciudad: formData.ciudadFacturacion || formData.ciudad,
        departamento: formData.departamento,
        telefonoNegocio: formData.telefonoFacturacion || formData.telefono,
        correoNegocio: formData.emailFacturacion || formData.email,
      },
      datosPlan: {
        planFacturacionId: plan.id,
        tipoPago: "anual",
        precioPagado: plan.planPrice,
      },
    };

    const pseResponse = await wompiService.createPSETransaction(pseData);

    if (pseResponse.asyncPaymentUrl) {
      localStorage.setItem("pseTransactionId", pseResponse.transaccionId);
      localStorage.setItem("pseReference", reference);
      window.location.href = pseResponse.asyncPaymentUrl;
    } else {
      alert(
        "Error: No se recibió la URL de redirección del banco. Intenta nuevamente."
      );
    }
  };

  // ── Card payment flow ──
  const handleCardPayment = async (tipoDocCodigo) => {
    const [expMonth, expYear] = formData.expiry.split("/");

    const cardToken = await wompiService.tokenizeCard({
      number: formData.cardNumber.replace(/\s/g, ""),
      cvc: formData.cvv,
      expMonth,
      expYear,
      cardHolder: formData.cardName,
    });

    const amountInCents = Math.round(parseFloat(plan.planPrice) * 100);
    const reference = `FACTCLOUD-${Date.now()}`;

    if (isNaN(amountInCents) || amountInCents <= 0) {
      alert("Error: Monto inválido");
      return;
    }

    const transaction = await wompiService.createTransaction({
      amountInCents,
      currency: "COP",
      reference,
      customerEmail: formData.email,
      acceptanceToken,
      paymentMethod: {
        type: "CARD",
        token: cardToken,
        installments: parseInt(formData.cuotas),
      },
      customerData: {
        fullName: `${formData.nombres} ${formData.apellidos}`,
        phoneNumber: `+57${formData.telefono}`,
        legalId: {
          type: tipoDocCodigo,
          number: formData.numeroIdentificacion,
        },
      },
    });

    if (
      transaction.data.status === "APPROVED" ||
      transaction.data.status === "PENDING"
    ) {
      await crearYActivarUsuario(transaction.data.id);
      alert("¡Pago exitoso! Tu cuenta ha sido creada y activada 🎉");
      navigate("/dashboard");
    } else {
      alert("Pago rechazado. Verifica los datos e intenta nuevamente.");
    }
  };

  // ── Create & activate user (shared by both flows via webhook for PSE) ──
  const crearYActivarUsuario = async (transactionId) => {
    if (!user) throw new Error("Datos de usuario no disponibles");

    const response = await fetch(`${API_URL}/Usuarios/crear-y-activar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: user.nombre,
        telefono: user.telefono,
        correo: user.email,
        password: user.password,
        tipoIdentificacion: user.tipoIdentificacion,
        numeroIdentificacion: user.numeroIdentificacion,
        pais: "CO",
        nombreNegocio: formData.razonSocial,
        nit: formData.nit,
        dvNit: formData.digitoVerificacion
          ? parseInt(formData.digitoVerificacion)
          : null,
        direccion: formData.direccionFacturacion,
        ciudad: formData.ciudadFacturacion,
        departamento: formData.departamento,
        telefonoNegocio: formData.telefonoFacturacion,
        correoNegocio: formData.emailFacturacion,
        planFacturacionId: plan.id,
        transaccionId: transactionId,
        tipoPago: "anual",
        precioPagado: plan.planPrice,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error creando usuario");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        correo: data.usuario.correo,
        estado: data.usuario.estado,
        negocio: data.usuario.negocio,
        suscripcion: data.usuario.suscripcion,
      })
    );

    localStorage.removeItem("registroData");
    localStorage.removeItem("selectedPlan");
    return data;
  };

  // ── Guard ──
  if (!plan || !user) return null;

  // ── Render ──
  return (
    <div className="checkout-page">
      <Stepper currentStep={3} />
      <div className="plan-banner">
        <div className="plan-banner-content">
          <CheckCircleFill />
          <p className="plan-banner-title">
            ¡Último paso! Completa el pago del plan {plan.nombre}
          </p>
        </div>
      </div>


      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Finaliza tu compra</h1>
          <p className="checkout-subtitle">
            Completa los datos de forma segura y comienza a usar FactCloud
          </p>
        </div>

        <div className="checkout-content">
          {/* FORMULARIO */}
          <div className="checkout-form-section">
            <div className="checkout-form">
              {/* MÉTODOS DE PAGO */}
              <div className="payment-methods-section">
                <span className="payment-methods-label">Método de pago</span>
                <div className="payment-methods">
                  <label
                    className={`payment-option ${paymentMethod === "CARD" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                    />
                    <CreditCard size={16} />
                    <span>Tarjeta</span>
                  </label>

                  <label
                    className={`payment-option ${paymentMethod === "PSE" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      value="PSE"
                      checked={paymentMethod === "PSE"}
                      onChange={() => setPaymentMethod("PSE")}
                    />
                    <Bank size={16} />
                    <span>PSE</span>
                  </label>
                </div>
              </div>
              {/* ── CARD ── */}
              {paymentMethod === "CARD" && (
                <CardPayment
                  formData={formData}
                  errors={errors}
                  isFlipped={isFlipped}
                  sameAsOwner={sameAsOwner}
                  onFieldChange={handleFieldChange}
                  onSelectChange={handleSelectChange}
                  onFlip={setIsFlipped}
                  onSameAsOwner={handleSameAsOwner}
                />
              )}

              {/* ── PSE ── */}
              {paymentMethod === "PSE" && (
                <PSEPayment
                  formData={formData}
                  errors={errors}
                  bankList={bankList}
                  sameAsOwner={sameAsOwner}
                  psePersonType={psePersonType}
                  onFieldChange={handleFieldChange}
                  onSelectChange={handleSelectChange}
                  onSameAsOwner={handleSameAsOwner}
                  onPersonTypeChange={setPsePersonType}
                />
              )}
            </div>
          </div>

          {/* RESUMEN */}
          {plan && (
            <div>


              <div className="resumen-compra">
                <h5>Resumen de compra</h5>

                <div className="resumen-producto">
                  <h6>Producto</h6>
                  <div className="producto-item">
                    <div className="producto-info">
                      <span className="producto-nombre">
                        Plan {plan.nombre}
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
                      {plan.descuentoActivo
                        ? Math.round(
                          plan.precioAnual /
                          (1 - plan.descuentoPorcentaje / 100)
                        ).toLocaleString("es-CO")
                        : (plan.precioAnual ?? 0).toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="descuento-item">
                    <span>Descuento ({plan.descuentoPorcentaje}%)</span>
                    <span className="descuento-valor">
                      -${checkoutData?.descuentoPlan?.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span>
                      ${plan?.precioAnual?.toLocaleString("es-CO") ?? "0"}
                    </span>
                  </div>

                  {checkoutData?.descuentoCupon > 0 && (
                    <div className="cupon">
                      <span>Descuento cupón</span>
                      <span className="descuento-cupon">
                        -${checkoutData.descuentoCupon.toLocaleString("es-CO")}
                      </span>
                    </div>
                  )}

                  <div className="impuestos">
                    <span>Impuestos</span>
                    <span>$0</span>
                  </div>

                  <div className="total">
                    <strong>Total a pagar</strong>
                    <strong className="total-precio">
                      $
                      {checkoutData?.totalFinal?.toLocaleString("es-CO") ?? "0"}
                    </strong>
                  </div>

                  <button
                    className="btn-pagar"
                    onClick={handlePay}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        {paymentMethod === "PSE"
                          ? "Redirigiendo a PSE..."
                          : "Procesando..."}
                      </>
                    ) : (
                      <>
                        Confirmar y pagar
                      </>
                    )}
                  </button>
                  <button onClick={() => navigate("/registro")} className="btn-back">
                    Cancelar pago
                  </button>

                  <div className="security-badge">
                    <CheckCircleFill size={14} />
                    <span>Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ModalDetalles
            isOpen={mostrarVerDetalles}
            onClose={() => setMostrarVerDetalles(false)}
            plan={plan}
          />
        </div>
      </div>
    </div>
  );
}
