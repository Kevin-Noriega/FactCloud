import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FactCloudLogo from '../img/logo2.png';
import "../styles/Sidebar.css"; 

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clientes", label: "Clientes" },
  { to: "/productos", label: "Productos" },
  { to: "/facturas", label: "Facturación" },
  { to: "/reportes", label: "Reportes" },
  { to: "/perfil", label: "Perfil" }]

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate("/"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("clientes");
  localStorage.removeItem("productos");
  localStorage.removeItem("facturas");
    navigate("/");
  };

  return (
    <div className="sidebar p-3 d-flex flex-column">

      {/* LOGO + TÍTULO */}
        <img 
          id="sidebar-logo"
          src={FactCloudLogo} 
          alt="logoFactCloud"
          className=" mb-4 border-bottom border-secondary pb-3"
           style={{ width: "100%" }} 
        />


      {/* NAVEGACIÓN */}
      <nav id="sidebar-nav" className="flex-grow-1">
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                id={`sidebar-link-${item.label.toLowerCase()}`}
                to={item.to}
                className={`nav-link ${
                  location.pathname === item.to ? "active shadow-sm" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* USUARIO LOGUEADO */}
      {usuario && (
        <div id="sidebar-user" className="mt-auto pt-3 border-top border-secondary text-center">
          
          <div id="sidebar-online" className="d-flex align-items-center mb-4 pb-4 justify-content-center gap-2 mt-3">
          <p id="sidebar-username" className="mb-1 fw-semibold">
            {usuario.nombreNegocioUsuario || usuario.nombreNegocio || "Usuario"}
          </p>
           <span className="badge bg-success me-3">Online</span>
      </div>
          

          <button
            id="sidebar-logout"
            className="btn w-100"
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
