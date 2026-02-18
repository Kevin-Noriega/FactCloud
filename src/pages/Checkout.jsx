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
  ExclamationCircleFill,
  ChevronLeft,
} from "react-bootstrap-icons";
import "../styles/Checkout.css";
import Select from "react-select";
import tipoIdentificacion from "../utils/TiposDocumentos.json";

import ciudades from "../utils/Ciudades.json";

export default function Checkout() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isFlipped, setIsFlipped] = useState(false);
  const [acceptanceToken, setAcceptanceToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sameAsOwner, setSameAsOwner] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    cuotas: "1",
    banco: "",
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    email: "",
    telefono: "",
    pais: "CO",
    ciudad: "",
    direccion: "",
    razonSocial: "",
    nit: "",
    digitoVerificacion: "",
    emailFacturacion: "",
    telefonoFacturacion: "",
    departamento: "",
    ciudadFacturacion: "",
    direccionFacturacion: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const planData = localStorage.getItem("selectedPlan");
    const registroDataLocal = localStorage.getItem("registroData");

    console.log("📦 planData raw:", planData);
    console.log("📦 registroData raw:", registroDataLocal);

    if (!planData || !registroDataLocal) {
      alert("Datos incompletos. Inicia el proceso nuevamente.");
      navigate("/planes");
      return;
    }

    const parsedPlan = JSON.parse(planData);
    const parsedRegistro = JSON.parse(registroDataLocal);

    console.log("✅ Plan parseado:", parsedPlan);
    console.log("✅ Registro parseado:", parsedRegistro);

    // ✅ NORMALIZAR: Agregar planPrice desde annualPrice
    const normalizedPlan = {
      ...parsedPlan,
      planPrice: parsedPlan.precioAnual || 0,
    };

    console.log("✅ Plan normalizado:", normalizedPlan);

    setPlan(normalizedPlan);
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
      console.log("Token cargado");
    } catch (error) {
      console.error("Error cargando token:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "cardNumber":
        formattedValue = value
          .replace(/\D/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim()
          .substr(0, 19);
        break;
      case "expiry":
        formattedValue = value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "$1/$2")
          .substr(0, 5);
        break;
      case "cvv":
        formattedValue = value.replace(/\D/g, "").substr(0, 4);
        break;
      case "telefono":
      case "telefonoFacturacion":
        formattedValue = value.replace(/\D/g, "").substr(0, 10);
        break;
      case "cardName":
        formattedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
        break;
      case "digitoVerificacion":
        formattedValue = value.replace(/\D/g, "").substr(0, 1);
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "VISA";
    if (/^5[1-5]/.test(cleaned)) return "MASTERCARD";
    if (/^3[47]/.test(cleaned)) return "AMEX";
    return "";
  };

  const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "CARD") {
      const cleanCard = formData.cardNumber.replace(/\s/g, "");
      if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 16) {
        newErrors.cardNumber = "Número de tarjeta inválido";
      }
      if (!formData.cardName || formData.cardName.length < 3) {
        newErrors.cardName = "Nombre del titular requerido";
      }
      if (!validateExpiry(formData.expiry)) {
        newErrors.expiry = "Fecha inválida o expirada";
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = "CVV inválido";
      }
    } else if (paymentMethod === "PSE") {
      if (!formData.banco) newErrors.banco = "Selecciona un banco";
    }

    if (!formData.nombres) newErrors.nombres = "Nombres requeridos";
    if (!formData.apellidos) newErrors.apellidos = "Apellidos requeridos";
    if (!formData.tipoIdentificacion)
      newErrors.tipoIdentificacion = "Tipo de documento requerido";
    if (!formData.numeroIdentificacion)
      newErrors.numeroIdentificacion = "Número requerido";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefono || formData.telefono.length !== 10) {
      newErrors.telefono = "telefono debe tener 10 dígitos";
    }
    if (!formData.ciudad) newErrors.ciudad = "Ciudad requerida";
    if (!formData.direccion) newErrors.direccion = "Dirección requerida";
    if (!formData.razonSocial) newErrors.razonSocial = "Razón social requerida";
    if (!formData.nit) newErrors.nit = "NIT requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        departamento: prev.ciudad,
        ciudadFacturacion: prev.ciudad,
        direccionFacturacion: prev.direccion,
      }));
    }
  };
  const handlePay = async () => {
    if (!validateForm()) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    setLoading(true);

    try {
      const [expMonth, expYear] = formData.expiry.split("/");

      console.log("🔵 Plan seleccionado:", plan);
      console.log("🔵 Precio del plan:", plan.planPrice);

      // ✅ Verificar que plan.planPrice existe
      if (!plan || !plan.planPrice) {
        alert("Error: No se ha seleccionado un plan válido");
        return;
      }

      console.log("🔵 Iniciando pago...");
      console.log("📋 Datos de tarjeta:", {
        number: formData.cardNumber.replace(/\s/g, ""),
        expMonth,
        expYear,
        cardHolder: formData.cardName,
      });

      // ✅ Tokenizar tarjeta
      const cardToken = await wompiService.tokenizeCard({
        number: formData.cardNumber.replace(/\s/g, ""),
        cvc: formData.cvv,
        expMonth: expMonth,
        expYear: expYear,
        cardHolder: formData.cardName,
      });

      console.log("✅ Token de tarjeta obtenido:", cardToken);

      // ✅ Calcular monto (asegurar que sea número)
      const amountInCents = Math.round(parseFloat(plan.planPrice) * 100);
      const reference = `FACTCLOUD-${Date.now()}`;

      console.log("💰 Monto calculado:", {
        planPrice: plan.planPrice,
        amountInCents,
        tipo: typeof amountInCents,
      });

      // ✅ Verificar que amountInCents sea válido
      if (isNaN(amountInCents) || amountInCents <= 0) {
        alert("Error: Monto inválido");
        console.error("❌ Monto inválido:", {
          planPrice: plan.planPrice,
          amountInCents,
        });
        return;
      }

      console.log("📤 Datos de transacción:", {
        amountInCents,
        reference,
        acceptanceToken,
        cardToken,
      });

      // ✅ Mapear tipo de documento a código
      const tipoDocumentoMap = {
        "Cédula de Ciudadanía": "CC",
        "Cédula de Extranjería": "CE",
        NIT: "NIT",
        Pasaporte: "passport",
        CC: "CC",
        CE: "CE",
      };

      const tipoDocCodigo =
        tipoDocumentoMap[formData.tipoIdentificacion] || "CC";

      // ✅ Crear transacción
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
            type: tipoDocCodigo, // Usar código en lugar de texto completo
            number: formData.numeroIdentificacion,
          },
        },
      });

      console.log("✅ Respuesta transacción:", transaction);

      // ✅ Guardar registro pendiente (NO crear usuario todavía)
      //await guardarRegistroPendiente(
        //transaction.data.id,
        //transaction.data.status,
      //);

      if (transaction.data.status === "APPROVED" || transaction.data.status === "PENDING") {
        await crearYActivarUsuario(transaction.data.id);
        alert("¡Pago exitoso! Tu cuenta ha sido creada y activada 🎉");
        navigate("/dashboard");
     // } else if (transaction.data.status === "PENDING") {
        //alert("Pago pendiente. Te notificaremos cuando se confirme.");
        //navigate("/");
      } else {
        alert("Pago rechazado. Verifica los datos e intenta nuevamente.");
      }
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Response:", error.response?.data);
      alert(
        error.response?.data?.error ||
          error.message ||
          "Error procesando el pago",
      );
    } finally {
      setLoading(false);
    }
  };

   {/* función para guardar registro pendiente
  const guardarRegistroPendiente = async (transactionId, status) => {
    try {
      console.log("💾 Guardando registro pendiente...");
      console.log("📋 User:", user);
      console.log("📋 Plan:", plan);
      console.log("📋 FormData:", formData);

      // ✅ Validar que user existe
      if (!user) {
        console.error("❌ User es null");
        throw new Error("Datos de usuario no disponibles");
      }

      const datosCompletos = {
        transaccionId: transactionId,
        estado: status,
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
          direccion: formData.direccionFacturacion,
          ciudad: formData.ciudadFacturacion,
          departamento: formData.departamento,
          telefonoNegocio: formData.telefonoFacturacion,
          correoNegocio: formData.emailFacturacion,
        },
        datosPlan: {
          planFacturacionId: plan.id,
          tipoPago: "anual",
          precioPagado: plan.planPrice,
        },
      };

      console.log(
        "📤 Datos a enviar:",
        JSON.stringify(datosCompletos, null, 2),
      );

      const response = await fetch(
        `${API_URL}/payment/guardar-registro-pendiente`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosCompletos),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error guardando registro:", errorData);
        throw new Error(
          errorData.error || "Error guardando registro pendiente",
        );
      }

      const result = await response.json();
      console.log("✅ Registro pendiente guardado:", result);

      return true;
    } catch (error) {
      console.error("❌ Error en guardarRegistroPendiente:", error);
      throw error;
    }
  };*/}

  const crearYActivarUsuario = async (transactionId) => {
  try {
    console.log("🔵 Creando usuario...");
    console.log("📋 User:", user);
    console.log("📋 FormData:", formData);
    console.log("📋 Plan:", plan);

    // ✅ Validar que user existe
    if (!user) {
      throw new Error("Datos de usuario no disponibles");
    }

    const response = await fetch(`${API_URL}/Usuarios/crear-y-activar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Datos del usuario (usar 'user' en lugar de 'registroData')
        nombre: user.nombre, // ✅
        telefono: user.telefono, // ✅
        correo: user.email, // ✅
        password: user.password, // ✅
        tipoIdentificacion: user.tipoIdentificacion, // ✅
        numeroIdentificacion: user.numeroIdentificacion, // ✅
        pais: "CO",

        // Datos del negocio
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

        // Datos de suscripción
        planFacturacionId: plan.id,
        transaccionId: transactionId,
        tipoPago: "anual",
        precioPagado: plan.planPrice,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error del servidor:", error);
      throw new Error(error.error || "Error creando usuario");
    }

    const data = await response.json();
    console.log("✅ Usuario creado:", data);

    // Guardar token y usuario
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

    // Limpiar datos temporales
    localStorage.removeItem("registroData");
    localStorage.removeItem("selectedPlan");

    return data;
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
    throw error;
  }
};

  if (!plan || !user) return null;

  const cardType = getCardType(formData.cardNumber);

  return (
    <div className="checkout-page">
      <Stepper currentStep={3} />

      <div className="checkout-container">
        <button onClick={() => navigate("/registro")} className="btn-back">
          <ChevronLeft />
          Regresar
        </button>

        <div className="checkout-content">
          {/* FORMULARIO */}
          <div className="checkout-form-section">
            <h1>Finaliza tu compra</h1>
            <p className="checkout-subtitle">
              Completa los datos de forma segura y comienza a usar FactCloud
            </p>

            <div className="checkout-form">
              {/* MÉTODOS DE PAGO */}
              <div className="payment-methods-section">
                <h3>Método de pago</h3>
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
                    <CreditCard size={20} />
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
                    <Bank size={20} />
                    <span>PSE</span>
                  </label>
                </div>
              </div>

              {/* TARJETA */}
              {paymentMethod === "CARD" && (
                <>
                  <div className="card-section">
                    <h3>Datos de la tarjeta</h3>

                    <div className="payment-container">
                      <div className="card-form-fields">
                        <div className="form-row">
                          <div className="form-group">
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="Número de tarjeta *"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              className={errors.cardNumber ? "input-error" : ""}
                              maxLength={19}
                            />
                            {errors.cardNumber && (
                              <span className="error-msg">
                                <ExclamationCircleFill size={12} />
                                {errors.cardNumber}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              name="cardName"
                              placeholder="Nombre del titular *"
                              value={formData.cardName}
                              onChange={handleChange}
                              className={errors.cardName ? "input-error" : ""}
                            />
                            {errors.cardName && (
                              <span className="error-msg">
                                {errors.cardName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/AA *"
                              value={formData.expiry}
                              onChange={handleChange}
                              className={errors.expiry ? "input-error" : ""}
                              maxLength={5}
                            />
                            {errors.expiry && (
                              <span className="error-msg">{errors.expiry}</span>
                            )}
                          </div>

                          <div className="form-group">
                            <input
                              type="password"
                              name="cvv"
                              placeholder="CVV *"
                              value={formData.cvv}
                              onChange={handleChange}
                              onFocus={() => setIsFlipped(true)}
                              onBlur={() => setIsFlipped(false)}
                              className={errors.cvv ? "input-error" : ""}
                              maxLength={4}
                            />
                            {errors.cvv && (
                              <span className="error-msg">{errors.cvv}</span>
                            )}
                          </div>
                        </div>

                        <div className="form-group">
                          <select
                            name="cuotas"
                            value={formData.cuotas}
                            onChange={handleChange}
                          >
                            <option value="1">1 cuota (sin interés)</option>
                            <option value="2">2 cuotas</option>
                            <option value="3">3 cuotas</option>
                            <option value="6">6 cuotas</option>
                            <option value="12">12 cuotas</option>
                          </select>
                        </div>
                      </div>

                      {/* TARJETA VISUAL */}
                      <div
                        className={`credit-card ${isFlipped ? "flipped" : ""}`}
                        onClick={() => setIsFlipped(!isFlipped)}
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
                            <div className="cvv-box">
                              {formData.cvv || "•••"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROPIETARIO */}
                  <div className="owner-section">
                    <h3>Información del titular</h3>

                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          name="nombres"
                          placeholder="Nombres *"
                          value={formData.nombres}
                          onChange={handleChange}
                          className={errors.nombres ? "input-error" : ""}
                        />
                        {errors.nombres && (
                          <span className="error-msg">{errors.nombres}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="apellidos"
                          placeholder="Apellidos *"
                          value={formData.apellidos}
                          onChange={handleChange}
                          className={errors.apellidos ? "input-error" : ""}
                        />
                        {errors.apellidos && (
                          <span className="error-msg">{errors.apellidos}</span>
                        )}
                      </div>
                    </div>

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
                        {errors.tipoIdentificacion && (
                          <span className="error-msg">
                            {errors.tipoIdentificacion}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="numeroIdentificacion"
                          placeholder="Número de documento *"
                          value={formData.numeroIdentificacion}
                          onChange={handleChange}
                          className={
                            errors.numeroIdentificacion ? "input-error" : ""
                          }
                        />
                        {errors.numeroIdentificacion && (
                          <span className="error-msg">
                            {errors.numeroIdentificacion}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email *"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "input-error" : ""}
                        />
                        {errors.email && (
                          <span className="error-msg">{errors.email}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="tel"
                          name="telefono"
                          placeholder="telefono *"
                          value={formData.telefono}
                          onChange={handleChange}
                          className={errors.telefono ? "input-error" : ""}
                          maxLength={10}
                        />
                        {errors.telefono && (
                          <span className="error-msg">{errors.telefono}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <Select
                          name="ciudad"
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
                            setFormData((prev) => ({
                              ...prev,
                              ciudad: opt ? opt.value : "",
                            }))
                          }
                          isClearable
                          placeholder="Seleccionar ciudad"
                        />
                        {errors.ciudad && (
                          <span className="error-msg">{errors.ciudad}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="direccion"
                          placeholder="Dirección *"
                          value={formData.direccion}
                          onChange={handleChange}
                          className={errors.direccion ? "input-error" : ""}
                        />
                        {errors.direccion && (
                          <span className="error-msg">{errors.direccion}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FACTURACIÓN */}
                  <div className="billing-section">
                    <h3>Datos de facturación</h3>

                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="same-as-owner"
                        checked={sameAsOwner}
                        onChange={(e) => handleSameAsOwner(e.target.checked)}
                      />
                      <label htmlFor="same-as-owner">
                        Usar los mismos datos del titular
                      </label>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          name="razonSocial"
                          placeholder="Razón Social *"
                          value={formData.razonSocial}
                          onChange={handleChange}
                          className={errors.razonSocial ? "input-error" : ""}
                        />
                        {errors.razonSocial && (
                          <span className="error-msg">
                            {errors.razonSocial}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="nit"
                          placeholder="NIT *"
                          value={formData.nit}
                          onChange={handleChange}
                          className={errors.nit ? "input-error" : ""}
                        />
                        {errors.nit && (
                          <span className="error-msg">{errors.nit}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="email"
                          name="emailFacturacion"
                          placeholder="Email facturación *"
                          value={formData.emailFacturacion}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <Select
                          name="ciudad"
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
                            setFormData((prev) => ({
                              ...prev,
                              ciudad: opt ? opt.value : "",
                            }))
                          }
                          isClearable
                          placeholder="Seleccionar ciudad"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* PSE */}
              {paymentMethod === "PSE" && (
                <div className="pse-section">
                  <h3>Banco</h3>
                  <div className="form-group">
                    <select
                      name="banco"
                      value={formData.banco}
                      onChange={handleChange}
                      className={errors.banco ? "input-error" : ""}
                    >
                      <option value="">Selecciona tu banco</option>
                      <option value="1007">Bancolombia</option>
                      <option value="1051">Davivienda</option>
                      <option value="1013">BBVA</option>
                      <option value="1001">Banco de Bogotá</option>
                    </select>
                    {errors.banco && (
                      <span className="error-msg">{errors.banco}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RESUMEN */}
          {plan && (
            <div>
              <div className="plan-banner">
                <div className="plan-banner-content">
                  <CheckCircleFill />
                  <p className="plan-banner-title">
                    ¡Último paso! Completa el pago del plan {plan.planName}
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
                        Plan {plan.planName}
                      </span>
                    </div>
                    <span className="producto-precio">
                      ${plan?.planPrice?.toLocaleString("es-CO") ?? "0"}
                    </span>
                  </div>

                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span>
                      ${plan?.planPrice?.toLocaleString("es-CO") ?? "0"}
                    </span>
                  </div>

                  <div className="impuestos">
                    <span>Impuestos</span>
                    <span>$0</span>
                  </div>

                  <div className="total">
                    <strong>Total a pagar</strong>
                    <strong className="total-precio">
                      ${plan?.planPrice?.toLocaleString("es-CO") ?? "0"}
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
                        Procesando...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Confirmar y pagar
                      </>
                    )}
                  </button>

                  <div className="security-badge">
                    <CheckCircleFill size={14} />
                    <span>Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
