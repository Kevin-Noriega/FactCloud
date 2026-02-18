import { createContext, useContext, useState, useEffect } from "react";
import axiosClient, { setAccessToken, clearTokens } from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Estado del usuario: recupera desde localStorage si existe
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // Iniciar en true para esperar la restauración
  const [loading, setLoading] = useState(true);

  //Restaurar token al cargar la app
  useEffect(() => {
    const restaurarSesion = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");

      // Si hay usuario guardado, intentar restaurar el token
      if (usuarioGuardado) {
        try {
          // Usar el refresh token (cookie HttpOnly) para obtener un nuevo access token
          const { data } = await axiosClient.post("/Auth/refresh");
          setAccessToken(data.token); // ✅ Restaurar token en memoria
        } catch (error) {
          // Si falla el refresh, limpiar todo (sesión expiró)
          console.error("Error al restaurar sesión:", error);
          clearTokens();
          setUsuario(null);
          localStorage.removeItem("usuario");
        }
      }

      // ✅ Terminar estado de carga
      setLoading(false);
    };

    restaurarSesion();
  }, []); // Solo se ejecuta una vez al montar

  // Listener para evento de logout global
  useEffect(() => {
    const handleLogout = () => {
      setUsuario(null);
      clearTokens();
      localStorage.removeItem("usuario");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  // Función de login
  const login = async (correo, contrasena) => {
    const { data } = await axiosClient.post("/Auth/login", {
      correo,
      contrasena,
    });

    // Guardar token en memoria y usuario en localStorage
    setAccessToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    return data;
  };

  // Función de logout
  const logout = async () => {
    try {
      await axiosClient.post("/Auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión en servidor:", error);
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

  // ✅ Mostrar pantalla de carga mientras restaura sesión
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p style={{ marginTop: "1rem", color: "#6c757d" }}>
          Restaurando sesión...
        </p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
