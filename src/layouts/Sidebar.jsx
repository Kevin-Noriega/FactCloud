import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clientes", label: "Clientes" },
  { to: "/productos", label: "Productos" },
  { to: "/facturas", label: "Facturación" },
  { to: "/reportes", label: "Reportes" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // 🔹 Cargar los datos del usuario guardados en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate("/"); // Si no hay usuario logueado, redirigir al login
    }
  }, [navigate]);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="sidebar bg-dark text-white p-3 d-flex flex-column">
      {/* Logo o título */}
      <h4 className="fw-bold text-center text-info mb-4 border-bottom pb-3">
        FACTCLOUD
      </h4>

      {/* Navegación */}
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link text-white ${
                  location.pathname === item.to ? "active bg-info shadow-sm" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🔹 Usuario logueado */}
      {usuario && (
        <div className="mt-auto pt-3 border-top border-secondary text-center">
          <p className="text-light mb-1 fw-semibold">
            {usuario.nombreUsuario || usuario.nombre || "Usuario"}
          </p>
          <small className="text-muted d-block mb-2">
            {usuario.correoUsuario || usuario.correo}
          </small>
          <button
            className="btn btn-sm btn-outline-info w-100"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
