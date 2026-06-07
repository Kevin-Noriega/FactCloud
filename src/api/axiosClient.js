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

const isAuthUrl = (url = "") =>
  url.includes("/Auth/login") || url.includes("/Auth/refresh");

axiosClient.interceptors.request.use(
  (config) => {
    if (accessToken && !isAuthUrl(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Refresh de token con cola de peticiones ──────────────────────────────
// En vez de cerrar sesión ante cualquier 401, intentamos refrescar el access
// token (usando la cookie HttpOnly) UNA vez y reintentamos la petición original.
// Solo si el refresh falla se dispara el logout. Esto evita que el usuario sea
// expulsado al refrescar la página o cuando el access token expira.
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  pendingQueue = [];
};

const forzarLogout = (motivo = null) => {
  clearTokens();
  // Guardamos el motivo (p. ej. plan vencido) para que /login lo muestre.
  if (motivo) {
    try {
      sessionStorage.setItem("authMotivoCierre", JSON.stringify(motivo));
    } catch {
      /* sessionStorage no disponible */
    }
  }
  window.dispatchEvent(new Event("auth:logout"));
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = original?.url ?? "";
    const status = error.response?.status;

    // Si falla el propio refresh → sesión realmente inválida → logout
    if (status === 401 && url.includes("/Auth/refresh")) {
      forzarLogout();
      return Promise.reject(error);
    }

    // Plan vencido detectado al refrescar → cortar sesión con motivo
    if (status === 402 && url.includes("/Auth/refresh")) {
      forzarLogout(error.response?.data ?? { codigo: "PLAN_VENCIDO" });
      return Promise.reject(error);
    }

    // 401 en una petición normal → intentar refrescar y reintentar una vez
    if (status === 401 && !isAuthUrl(url) && !original?._retry) {
      original._retry = true;

      // Si ya hay un refresh en curso, esperamos a que termine
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axiosClient(original);
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axiosClient.post("/Auth/refresh");
        setAccessToken(data.token);
        processQueue(null, data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return axiosClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const motivo =
          refreshError.response?.status === 402
            ? refreshError.response.data
            : null;
        forzarLogout(motivo);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
