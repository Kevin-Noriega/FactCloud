const DOC_RULES = {
  // Ajusta a tus tipos reales (value = ti.nombre en tu Select)
  CC: { min: 6, max: 10, allowLeadingZeros: false },
  CE: { min: 6, max: 12, allowLeadingZeros: true },
  NIT: { min: 8, max: 12, allowLeadingZeros: false }, // si manejas DV aparte, cambia
};

const COMMON_PASSWORDS = new Set([
  "12345678","123456789","password","qwerty123","11111111","abcdefg1"
]);

const onlyDigits = (s) => /^\d+$/.test(s);
const hasSpaces = (s) => /\s/.test(s);
const isBlank = (s) => !s || !s.trim();

function validateRegistro(formData, tipoIdentificacionOptions) {
  const errors = {};

  // 1) Tipo de documento
  const allowedTipos = new Set(tipoIdentificacionOptions.map((x) => x.value));
  if (!formData.tipoIdentificacion) {
    errors.tipoIdentificacion = "Selecciona un tipo de documento";
  } else if (!allowedTipos.has(formData.tipoIdentificacion)) {
    errors.tipoIdentificacion = "Tipo de documento inválido";
  }

  // 2) Número de documento
  const doc = (formData.numeroIdentificacion ?? "").trim();
  if (!doc) {
    errors.numeroIdentificacion = "El número de documento es obligatorio";
  } else if (!onlyDigits(doc)) {
    errors.numeroIdentificacion = "El documento debe contener solo números";
  } else {
    const rules = DOC_RULES[formData.tipoIdentificacion];
    if (rules) {
      if (doc.length < rules.min || doc.length > rules.max) {
        errors.numeroIdentificacion = `Longitud inválida (${rules.min}-${rules.max})`;
      }
      if (!rules.allowLeadingZeros && doc.length > 1 && doc.startsWith("0")) {
        errors.numeroIdentificacion = "No se permiten ceros a la izquierda";
      }
    }
  }
  // (10) "número que ya existe": esto debe validarse en backend (o async API)

  // 3) Nombres y apellidos
  const nombre = (formData.nombreCompleto ?? "");
  const nombreTrim = nombre.trim();
  if (!nombreTrim) {
    errors.nombreCompleto = "Nombre completo es obligatorio";
  } else {
    // permite espacios y tildes (Unicode letters)
    const okChars = /^[\p{L}\p{M} ]+$/u;
    if (!okChars.test(nombreTrim)) {
      errors.nombreCompleto = "Solo letras y espacios";
    }
    if (nombreTrim.length < 6) errors.nombreCompleto = "Muy corto (mínimo 6)";
    if (nombreTrim.length > 80) errors.nombreCompleto = "Muy largo (máximo 80)";
  }

  // 4) Teléfono
  const tel = (formData.telefono ?? "").trim();
  if (!tel) {
    errors.telefono = "Teléfono es obligatorio";
  } else if (!onlyDigits(tel)) {
    errors.telefono = "Teléfono debe contener solo dígitos";
  } else if (tel.length !== 10) {
    errors.telefono = "Teléfono debe tener 10 dígitos";
  }

  // 5) Email
  const email = (formData.email ?? "").trim();
  if (!email) {
    errors.email = "Email es obligatorio";
  } else {
    if (hasSpaces(email)) errors.email = "Email no debe contener espacios";
    // validación básica de estructura
    const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmail.test(email)) errors.email = "Formato de email inválido";
    if (email.length > 254) errors.email = "Email demasiado largo";
  }
  // (26) "email ya registrado": backend / async API

  // 6) Confirmar email
  const confirmEmail = (formData.confirmEmail ?? "").trim();
  if (!confirmEmail) {
    errors.confirmEmail = "Confirma tu email";
  } else if (email && confirmEmail !== email) {
    errors.confirmEmail = "Los emails no coinciden";
  }

  // 7) Contraseña
  const pass = formData.password ?? "";
  if (!pass) {
    errors.password = "Contraseña es obligatoria";
  } else {
    if (pass.length < 8 || pass.length > 64) {
      errors.password = "La contraseña debe tener 8 a 64 caracteres";
    }
    // complejidad: 1 mayúscula, 1 minúscula, 1 número, 1 especial (ajusta si quieres)
    const complexity =
      /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /\d/.test(pass) && /[^A-Za-z0-9]/.test(pass);
    if (!complexity) {
      errors.password = "Debe incluir mayúscula, minúscula, número y símbolo";
    }
    if (COMMON_PASSWORDS.has(pass)) {
      errors.password = "Contraseña muy común, elige otra";
    }
  }

  // 8) Confirmar contraseña
  const confirmPass = formData.confirmPassword ?? "";
  if (!confirmPass) {
    errors.confirmPassword = "Confirma tu contraseña";
  } else if (pass && confirmPass !== pass) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  // 9) Autorización
  if (!formData.aceptaTerminos) {
    errors.aceptaTerminos = "Debes aceptar términos y condiciones";
  }

  // 10) Código de descuento
  // En tu código ya normalizas a UPPERCASE y limpias si está vacío.
  // La validación real "existe y activo" la debe hacer validateCoupon (backend).
  // Aquí solo validamos forma básica si quieres:
  // const code = (cupones.couponCode ?? "").trim();
  // if (code && !/^[A-Z0-9-]{4,20}$/.test(code)) errors.couponCode = "Formato de cupón inválido";

  return errors;
}
