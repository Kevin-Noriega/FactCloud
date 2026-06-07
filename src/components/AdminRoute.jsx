import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const isAdmin = (usuario) => {
  if (!usuario) return false;
  const rol = (usuario.rol || usuario.role || usuario.Rol || "").toLowerCase();
  return rol === "admin" || rol === "superadmin";
};

export const AdminRoute = () => {
  const { usuario, isAuthenticated, loading } = useAuth();

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
          <span className="visually-hidden">Verificando permisos...</span>
        </div>
        <p style={{ marginTop: "1rem", color: "#6c757d" }}>
          Verificando permisos de administrador...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin(usuario)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export { isAdmin };
