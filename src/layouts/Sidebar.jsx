import { Link, useLocation } from "react-router-dom";
import * as Icons from 'react-bootstrap-icons';
import { useAuth } from "../hooks/useAuth";
import { isAdmin } from "../components/AdminRoute";
import "../styles/Sidebar.css";

const navItems = [
  { to: "/Dashboard", label: "Inicio", icon: "HouseFill" },
  { to: "/ventas", label: "Ventas", icon: "FileEarmarkTextFill" },
  { to: "/compras-gastos", label: "Compras y Gastos", icon: "BagDashFill" },
  { to: "/productos", label: "Productos Y Servicios", icon: "BoxSeamFill" },
  { to: "/reportes", label: "Reportes", icon: "ClipboardDataFill" },
  { to: "/nomina", label: "Nómina", icon: "PeopleFill" },
  { to: "/tienda", label: "Tienda", icon: "CartFill" },
];

function Sidebar() {
  const location = useLocation();
  const { usuario } = useAuth();
  const esAdmin = isAdmin(usuario);

  return (
    <div className="sidebar">
      <nav id="sidebar-nav" className="flex-grow-1">
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <li className="nav-item" key={item.to}>
                <Link
                  to={item.to}
                  className={`nav-link-sb ${location.pathname === item.to ? "active" : ""}`}
                  title={item.label}
                >
                  {Icon && <Icon className="nav-icon" size={20} />}
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Acceso al panel de administración (solo para admins) */}
      {esAdmin && (
        <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 8 }}>
          <Link
            to="/admin"
            className={`nav-link-sb ${location.pathname.startsWith("/admin") ? "active" : ""}`}
            title="Panel Admin"
            style={{
              background: location.pathname.startsWith("/admin")
                ? "rgba(96, 165, 250, 0.2)"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Icons.ShieldFillCheck className="nav-icon" size={20} style={{ color: "#60a5fa" }} />
            <span className="nav-label" style={{ color: "#93c5fd", fontWeight: 600 }}>
              Panel Admin
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
