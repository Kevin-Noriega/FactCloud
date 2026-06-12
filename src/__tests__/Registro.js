// validators.js
export const DOCUMENT_TYPES = ['CC', 'CE', 'NIT', 'PP'];

export function validateDocumentType(type) {
  return DOCUMENT_TYPES.includes(type);
}

export function validateDocumentNumber(number) {
  if (!number || typeof number !== 'string') return false;
  const trimmed = number.trim();
  return trimmed.length >= 5 && trimmed.length <= 20 && /^\d+$/.test(trimmed);
}

export function validateFullName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 3 && trimmed.length <= 100;
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^3\d{9}$/.test(phone.trim());
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

export function validateRegisterForm(data) {
  const errors = {};

  if (!validateDocumentType(data.documentType))
    errors.documentType = 'Tipo de documento inválido';

  if (!validateDocumentNumber(data.documentNumber))
    errors.documentNumber = 'Número de documento inválido (5-20 dígitos)';

  if (!validateFullName(data.fullName))
    errors.fullName = 'Nombre debe tener entre 3 y 100 caracteres';

  if (!validatePhone(data.phone))
    errors.phone = 'Teléfono inválido (debe iniciar con 3 y tener 10 dígitos)';

  if (!validateEmail(data.email))
    errors.email = 'Correo electrónico inválido';

  if (data.email !== data.confirmEmail)
    errors.confirmEmail = 'Los correos no coinciden';

  if (!validatePassword(data.password))
    errors.password = 'Contraseña debe tener mínimo 8 caracteres, una mayúscula y un número';

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Las contraseñas no coinciden';

  if (!data.acceptTerms)
    errors.acceptTerms = 'Debe aceptar los términos y condiciones';

  return { valid: Object.keys(errors).length === 0, errors };
}