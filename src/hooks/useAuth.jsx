// src/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient, { setAccessToken, clearTokens } from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restaurarSesion = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");

      // No hay usuario guardado → nada que restaurar
      if (!usuarioGuardado) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(usuarioGuardado);
      console.log(
        "AuthProvider.restaurarSesion - usuario localStorage:",
        parsed
      );

      try {
        // Intentar refrescar token usando cookie HttpOnly
        const { data } = await axiosClient.post("/Auth/refresh");
        setAccessToken(data.token);

        // Restaurar el mismo usuario que ya teníamos (incluye tienePos)
        setUsuario(parsed);
      } catch (error) {
        console.warn("Refresh token inválido, limpiando sesión");
        // En producción: sesión inválida → limpiar todo
        clearTokens();
        setUsuario(null);
        localStorage.removeItem("usuario");
      } finally {
        setLoading(false);
      }
    };

    restaurarSesion();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUsuario(null);
      clearTokens();
      localStorage.removeItem("usuario");
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (correo, contrasena) => {
    const { data } = await axiosClient.post("/Auth/login", {
      correo,
      contrasena,
    });

    // Enriquecer usuario con flag tienePos a partir del plan del backend
    const usuarioConPlan = {
      ...data.usuario,
      tienePos: !!data.usuario.plan?.incluyePOS,
    };

    console.log(
      "AuthProvider.login - guardando usuario:",
      usuarioConPlan
    );

    // Guardar access token en memoria
    setAccessToken(data.token);

    // Guardar usuario (incluye plan y si tiene POS)
    setUsuario(usuarioConPlan);
    localStorage.setItem("usuario", JSON.stringify(usuarioConPlan));

    return { ...data, usuario: usuarioConPlan };
  };

  const logout = async () => {
    try {
      await axiosClient.post("/Auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      clearTokens();
      setUsuario(null);
      localStorage.removeItem("usuario");
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, loading, isAuthenticated: !!usuario }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <span>Cargando sesión...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};