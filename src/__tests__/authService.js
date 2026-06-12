// src/services/authService.js
import axiosClient from '../api/axiosClient';

const AUTH_URL = '/Auth';

/**
 * Registro de nuevo usuario
 * POST /api/Auth/register
 */
export async function registerUser(data) {
  const payload = {
    tipoDocumento:    data.documentType,
    numeroDocumento:  data.documentNumber,
    nombre:           data.fullName.split(' ').slice(0, -1).join(' ') || data.fullName,
    apellido:         data.fullName.split(' ').slice(-1)[0] || '',
    telefono:         data.phone,
    correo:           data.email,
    contrasena:       data.password,
    aceptaTerminos:   data.acceptTerms,
    codigoDescuento:  data.discountCode ?? null,
  };

  const response = await axiosClient.post(`${AUTH_URL}/register`, payload);
  return response.data;
}

/**
 * Login
 * POST /api/Auth/login
 */
export async function loginUser({ correo, contrasena }) {
  const response = await axiosClient.post(`${AUTH_URL}/login`, { correo, contrasena });
  return response.data; // { accessToken, usuario: { id, nombre, apellido, correo, plan: { id, nombre, incluyePOS }, ... } }
}

/**
 * Refresh token (usa cookie HttpOnly automáticamente)
 * POST /api/Auth/refresh
 */
export async function refreshToken() {
  const response = await axiosClient.post(`${AUTH_URL}/refresh`);
  return response.data; // { accessToken }
}

/**
 * Logout — revoca refresh token en backend
 * POST /api/Auth/logout
 */
export async function logoutUser() {
  const response = await axiosClient.post(`${AUTH_URL}/logout`);
  return response.data;
}

/**
 * Validar código de descuento
 * POST /api/Auth/validar-descuento
 */
export async function validateDiscountCode(codigo) {
  const response = await axiosClient.post(`${AUTH_URL}/validar-descuento`, { codigo });
  return response.data; // { valido: true, porcentaje: 10 }
}