import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Variable en memoria ÚNICAMENTE (no localStorage)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("token", token);
};
export const getAccessToken = () => {
  return accessToken;
};

export const clearTokens = () => {
  accessToken = null;
};

// Interceptor REQUEST: agrega el access token a cada petición
axiosClient.interceptors.request.use(
  (config) => {
    // ✅ Solo agregar token si existe Y no es login/refresh
    if (
      accessToken &&
      !config.url?.includes("/Auth/login") &&
      !config.url?.includes("/Auth/refresh")
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ Solo intentar refresh si es 401, no es retry, y no es login/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/Auth/refresh") &&
      !originalRequest.url?.includes("/Auth/login")
    ) {
      // Sistema de cola para evitar múltiples refresh simultáneos
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
        // ✅ El refreshToken se envía automáticamente como cookie HttpOnly
        const { data } = await axiosClient.post("/Auth/refresh");
        const newToken = data.token;

        setAccessToken(newToken);
        processQueue(null, newToken);

        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Sesión expirada. Redirigiendo al login..."); // ✅ Log crítico
        processQueue(refreshError, null);
        clearTokens();

        // ✅ Limpiar también el usuario de localStorage
        localStorage.removeItem("usuario");

        // Redirigir al login
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