import React from "react";
import { Link, useLocation } from "react-router-dom";

// Sin iconos, solo texto para una apariencia profesional
const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clientes", label: "Clientes" },
  { to: "/productos", label: "Productos" },
  { to: "/facturas", label: "Facturación" },
  { to: "/reportes", label: "Reportes" },
];

function Sidebar() {
  const location = useLocation();

  return (
    // Sidebar: bg-dark (gris oscuro) para la estética sobria
    <div className="sidebar bg-dark text-white p-3 d-flex flex-column"> 
      
      {/* Título/Marca Fijo: text-info (azul) */}
      <h4 className="fw-bold text-center text-info mb-4 border-bottom pb-3">FACTCLOUD</h4> 
      
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link text-white ${
                  // Elemento activo: bg-info (azul institucional)
                  location.pathname === item.to ? "active bg-info shadow-sm" : "" 
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sección de usuario/logout */}
      <div className="mt-auto pt-3 border-top border-secondary">
        <p className="text-light small mb-1">Usuario: Admin</p>
        <button className="btn btn-sm btn-outline-info w-100">Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Sidebar;
