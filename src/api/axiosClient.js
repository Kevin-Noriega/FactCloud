// src/api/axiosClient.js
import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearTokens = () => {
  accessToken = null;
  // NO borres usuario aquí; eso lo maneja AuthProvider/handleLogout
};

const axiosClient = axios.create({
  baseURL: "https://localhost:7149/api",
  withCredentials: true, // importante para enviar cookie refreshToken
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (
      accessToken &&
      !config.url?.includes("/Auth/login") &&
      !config.url?.includes("/Auth/refresh")
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const status = error.response?.status;

    if (
      status === 401 &&
      !url.includes("/Auth/login") &&
      !url.includes("/Auth/refresh")
    ) {
      // Sesión inválida → disparar logout global
  // Sesión inválida → disparar logout global
      clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
