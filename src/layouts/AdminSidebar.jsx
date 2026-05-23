import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";
import "../styles/AdminLayout.css";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: "ColumnsGap", exact: true },
  { to: "/admin/usuarios", label: "Usuarios", icon: "PeopleFill" },
  { to: "/admin/clientes", label: "Clientes", icon: "PersonLinesFill" },
  { to: "/admin/facturas", label: "Facturas", icon: "FileEarmarkTextFill" },
  { to: "/admin/productos", label: "Productos", icon: "BoxSeamFill" },
  { to: "/admin/planes", label: "Planes", icon: "LayoutTextSidebarReverse" },
  { to: "/admin/suscripciones", label: "Suscripciones", icon: "CreditCard2FrontFill" },
  { to: "/admin/auditoria", label: "Auditoría", icon: "ClockHistory" },
  { to: "/admin/configuracion", label: "Configuración", icon: "GearFill" },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="admin-sidebar">

      <nav className="admin-sidebar-nav" style={{ marginTop: '50px' }}>
        <ul>
          {adminNavItems.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`admin-nav-link ${isActive(item) ? "active" : ""}`}
                  title={item.label}
                >
                  {Icon && <Icon className="admin-nav-icon" size={20} />}
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <button
          className="admin-back-btn"
          onClick={() => navigate("/login")}
          title="cerrar sesion"
        >
          <Icons.ArrowLeftCircleFill size={20} />
          <span className="admin-nav-label">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
