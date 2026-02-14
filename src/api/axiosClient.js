import axios from "axios";
import { API_URL } from "./config";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Variable en memoria para el access token
let accessToken = null;

export const setAccessToken = (token) => {
  console.log(
    "🔧 setAccessToken llamado con:",
    token ? "Token válido" : "null",
  );
  accessToken = token;
};

export const getAccessToken = () => {
  console.log(
    "🔧 getAccessToken devuelve:",
    accessToken ? "Token válido" : "null",
  );
  return accessToken;
};

export const clearTokens = () => {
  console.log("🔧 clearTokens llamado");
  accessToken = null;
};

// Interceptor REQUEST: agrega el access token a cada petición
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`📤 Request a ${config.url}`);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(`📤 Token agregado al header de ${config.url}`);
    } else {
      console.warn(`⚠️ No hay token disponible para ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Error en request interceptor:", error);
    return Promise.reject(error);
  },
);

// Interceptor RESPONSE: maneja 401 y renueva automáticamente
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response OK de ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(
      `❌ Response error de ${error.config?.url}:`,
      error.response?.status,
    );

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/Auth/refresh" &&
      originalRequest.url !== "/Auth/login"
    ) {
      console.log("🔄 Intento de renovar token con refresh...");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosClient.post("/Auth/refresh");
        const newToken = data.token;

        console.log("✅ Token renovado exitosamente");
        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Fallo al renovar token, redirigiendo a login");
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
