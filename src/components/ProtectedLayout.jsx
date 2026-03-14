import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // ✅ Bloquea NuevaFactura hasta que restaurarSesion() termine
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
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
        <p style={{ marginTop: "1rem", color: "#6c757d" }}>
          Restaurando sesión...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
