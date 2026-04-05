/**
 * Shared checkout utilities — validation, formatting, styles
 * Used by both CardPayment and PSE components
 */

// ── Initial form data (shared shape) ──
export const INITIAL_FORM_DATA = {
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
};

// ── Tipo documento → código Wompi ──
export const TIPO_DOCUMENTO_MAP = {
  "Cédula de Ciudadanía": "CC",
  "Cédula de Extranjería": "CE",
  NIT: "NIT",
  Pasaporte: "passport",
  CC: "CC",
  CE: "CE",
  RC: "CC",
  TI: "TI",
  TE: "CE",
  PP: "passport",
  PE: "CE",
  PEP: "CC",
  NUIP: "CC",
  NITEX: "NIT",
};

// ── Input formatters ──
export function formatField(name, value) {
  switch (name) {
    case "cardNumber":
      return value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .substr(0, 19);
    case "expiry":
      return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substr(0, 5);
    case "cvv":
      return value.replace(/\D/g, "").substr(0, 4);
    case "telefono":
    case "telefonoFacturacion":
      return value.replace(/\D/g, "").substr(0, 10);
    case "cardName":
      return value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    case "digitoVerificacion":
      return value.replace(/\D/g, "").substr(0, 1);
    case "nit":
    case "numeroIdentificacion":
      return value.replace(/\D/g, "");
    default:
      return value;
  }
}

// ── Card type detector ──
export function getCardType(number) {
  const cleaned = number.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "VISA";
  if (/^5[1-5]/.test(cleaned)) return "MASTERCARD";
  if (/^3[47]/.test(cleaned)) return "AMEX";
  return "";
}

// ── Expiry validator ──
export function validateExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [month, year] = expiry.split("/").map(Number);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

// ── Shared validators (common fields for both CARD and PSE) ──
export function validateCommonFields(formData) {
  const errors = {};

  if (!formData.nombres) errors.nombres = "Nombres requeridos";
  if (!formData.apellidos) errors.apellidos = "Apellidos requeridos";
  if (!formData.tipoIdentificacion)
    errors.tipoIdentificacion = "Tipo de documento requerido";
  if (!formData.numeroIdentificacion)
    errors.numeroIdentificacion = "Número requerido";
  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Email inválido";
  if (!formData.telefono || formData.telefono.length !== 10)
    errors.telefono = "Teléfono debe tener 10 dígitos";
  if (!formData.ciudad) errors.ciudad = "Ciudad requerida";
  if (!formData.direccion) errors.direccion = "Dirección requerida";

  return errors;
}

export function validateBillingFields(formData) {
  const errors = {};
  if (!formData.razonSocial) errors.razonSocial = "Razón social requerida";
  if (!formData.nit) errors.nit = "NIT requerido";
  return errors;
}

export function validateCardFields(formData) {
  const errors = {};
  const cleanCard = formData.cardNumber.replace(/\s/g, "");
  if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 19)
    errors.cardNumber = "Número de tarjeta inválido";
  if (!formData.cardName || formData.cardName.length < 3)
    errors.cardName = "Nombre del titular requerido";
  if (!validateExpiry(formData.expiry))
    errors.expiry = "Fecha inválida o expirada";
  if (!formData.cvv || formData.cvv.length < 3) errors.cvv = "CVV inválido";
  return errors;
}

export function validatePSEFields(formData) {
  const errors = {};
  if (!formData.banco) errors.banco = "Selecciona un banco";
  if (!formData.tipoIdentificacion)
    errors.tipoIdentificacion = "Tipo de documento requerido";
  if (!formData.numeroIdentificacion)
    errors.numeroIdentificacion = "Número de documento requerido";
  return errors;
}

// ── Full form validation ──
export function validateCheckoutForm(formData, paymentMethod) {
  const commonErrors = validateCommonFields(formData);
  const billingErrors = validateBillingFields(formData);
  const methodErrors =
    paymentMethod === "CARD"
      ? validateCardFields(formData)
      : validatePSEFields(formData);

  return { ...commonErrors, ...billingErrors, ...methodErrors };
}

// ── Resolve tipoDoc code for Wompi ──
export function getTipoDocCodigo(tipoIdentificacion) {
  return TIPO_DOCUMENTO_MAP[tipoIdentificacion] || "CC";
}

export const pseSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "10px",
    border: state.isFocused ? "2px solid #0055A5" : "2px solid #d1d9e6",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(0, 85, 165, 0.12)"
      : "none",
    padding: "0",
    fontSize: "14px",
    minHeight: "50px", // 50 + 4 (borders) = 54px total
    height: "50px",
    backgroundColor: "#fff",
    transition: "all 0.2s ease",
    "&:hover": { borderColor: "#0055A5" },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
    height: "50px",
    display: "flex",
    alignItems: "center",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "50px",
  }),
  placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "14px", margin: 0 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0055A5"
      : state.isFocused
        ? "#e8f4fd"
        : "#fff",
    color: state.isSelected ? "#fff" : "#1f2937",
    fontSize: "14px",
    padding: "10px 14px",
    cursor: "pointer",
    "&:active": { backgroundColor: "#0055A5", color: "#fff" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    zIndex: 10,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: 500,
    margin: 0,
    padding: 0,
    lineHeight: "50px", // Explicitly match control inner height
    display: "flex",
    alignItems: "center",
  }),
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};
