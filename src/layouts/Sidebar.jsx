import { Link, useLocation } from "react-router-dom";
import * as Icons from 'react-bootstrap-icons';
import "../styles/Sidebar.css";

const navItems = [
  { to: "/Dashboard", label: "Inicio", icon: "HouseFill" }, // Casa para dashboard/inicio
  { to: "/ventas", label: "Ventas", icon: "FileEarmarkTextFill" }, // Recibo/factura cortado para ventas/facturas
  { to: "/compras-gastos", label: "Compras y Gastos", icon: "BagDashFill" }, // Bolsa con guión para compras/gastos
  { to: "/productos", label: "Productos Y Servicios", icon: "BoxSeamFill" }, // Caja para productos/inventario
  { to: "/reportes", label: "Reportes", icon: "ClipboardDataFill" }, // Portapapeles con datos para reportes
  { to: "/nomina", label: "Nómina", icon: "PeopleFill" }, // Nómina electrónica
  { to: "/tienda", label: "Tienda", icon: "CartFill" }, // Carrito para tienda
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
                  className={`nav-link-sb ${location.pathname === item.to ? "active" : ""
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
