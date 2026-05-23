import { Outlet } from "react-router-dom";
import { ShieldFillCheck } from "react-bootstrap-icons";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../hooks/useAuth";
import "../styles/AdminLayout.css";

function AdminLayout() {
  const { usuario } = useAuth();

  const initiales = usuario
    ? `${usuario.nombre?.[0] ?? ""}${usuario.apellido?.[0] ?? ""}`.toUpperCase()
    : "A";

  return (
    <div className="admin-layout-wrapper">
      <AdminSidebar />

      <div className="admin-content-wrapper">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">

            <span className="admin-topbar-title">Panel de Control del Sistema</span>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-topbar-badge">
              <ShieldFillCheck size={13} />
              Administrador
            </span>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="admin-main ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
