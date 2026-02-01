import { Link, useLocation } from "react-router-dom";
import * as Icons from 'react-bootstrap-icons';
import "../styles/Sidebar.css";

const navItems = [
  { to: "/Dashboard", label: "Inicio", icon: "HouseFill" },
  { to: "/clientes", label: "Clientes", icon: "PeopleFill" },
  { to: "/productos", label: "Inventario", icon: "BoxSeamFill" },
  { to: "/facturas", label: "Facturación", icon: "FileEarmarkTextFill" },
  { to: "/notaCredito", label: "Nota Credito", icon: "ArrowCounterclockwise" },
  { to: "/notaDebito", label: "Nota Debito", icon: "ArrowRepeat" },
  { to: "/reportes", label: "Reportes", icon: "ClipboardDataFill" },
  { to: "/tienda", label: "Tienda", icon: "CartFill" },
];

function Sidebar() {
  const location = useLocation();

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
                  className={`nav-link ${
                    location.pathname === item.to ? "active" : ""
                  }`}
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

    </div>
  );
}

export default Sidebar;
