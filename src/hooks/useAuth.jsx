import { createContext, useContext, useState } from "react";
import axiosClient, { setAccessToken, clearTokens } from "../api/axiosClient";

// 1. Crear el contexto
const AuthContext = createContext(null);

// 2. Provider del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    // Recuperar usuario de localStorage al cargar (si existe)
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  const [loading] = useState(false);

  // Función de login
  const login = async (correo, contrasena) => {
    console.log("🔵 useAuth.login iniciado");
    console.log("🔵 Correo:", correo);

    try {
      const { data } = await axiosClient.post("/Auth/login", {
        correo,
        contrasena,
      });

      console.log("✅ Respuesta del servidor:", data);
      console.log("✅ Token recibido:", data.token);
      console.log("✅ Usuario recibido:", data.usuario);

      setAccessToken(data.token);
      setUsuario(data.usuario);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      console.log("✅ Token guardado en memoria");
      console.log("✅ Usuario guardado en localStorage");

      return data;
    } catch (error) {
      console.error("❌ Error en login:");
      console.error("❌ Error completo:", error);
      console.error("❌ Response:", error.response);
      console.error("❌ Status:", error.response?.status);
      console.error("❌ Data:", error.response?.data);
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await axiosClient.post("/Auth/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      clearTokens();
      setUsuario(null);
      localStorage.removeItem("usuario");
    }
  };

  const value = {
    usuario,
    login,
    logout,
    loading,
    isAuthenticated: !!usuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
