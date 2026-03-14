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
      if (usuarioGuardado) {
        try {
          const { data } = await axiosClient.post("/Auth/refresh");
          setAccessToken(data.token);
        } catch (error) {
          console.error("Sesión expirada:", error);
          clearTokens();
          setUsuario(null);
          localStorage.removeItem("usuario");
        }
      }
      setLoading(false); // ✅ Solo aquí termina el loading
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
    setAccessToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    return data;
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

  // ✅ SIEMPRE renderiza el Provider — el spinner va en ProtectedLayout
  // AuthContext.jsx — solo cambia el return
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
          {/* o tu componente de spinner */}
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
