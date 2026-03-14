import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;
export const clearTokens = () => {
  accessToken = null;
};

// Interceptor REQUEST
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

// Interceptor RESPONSE
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    if (
      error.response?.status === 401 &&
      !url.includes("/Auth/login") &&
      !url.includes("/Auth/refresh") &&
      !accessToken
    ) {
      clearTokens();

      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
