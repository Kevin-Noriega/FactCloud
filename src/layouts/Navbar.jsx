import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FactCloudLogo from "../img/logoFC.png";
import "../styles/NavBar.css";

export default function NavBar() {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  useEffect(() => {
    document.body.style.background = "var(--bg-dark)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    setMenuMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (menuMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuMobileOpen]);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/">
          <img
            src={FactCloudLogo}
            alt="FactCloud"
            className="logo"
            style={{ cursor: "pointer" }}
          />
        </Link>

        <div className={`nav-links ${menuMobileOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={
              isActive("/") && location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Inicio
          </Link>

          <Link
            to="/planes"
            className={isActive("/planes") ? "nav-link active" : "nav-link"}
          >
            Planes y precios
          </Link>
           <Link
            to="/comoFunciona"
            className={isActive("/comoFunciona") ? "nav-link active" : "nav-link"}
          >
            ¿Cómo funciona?
          </Link>

          <Link
            to="/dian"
            className={isActive("/dian") ? "nav-link active" : "nav-link"}
          >
            DIAN
          </Link>

          <Link
            to="/soporte"
            className={isActive("/soporte") ? "nav-link active" : "nav-link"}
          >
            Soporte
          </Link>
          

          <div className="nav-divider"></div>

          <Link to="/register" className="btn-cta-nav">
            Empezar gratis
          </Link>

          <Link to="/login" className="btn-login">
            Ingresar
          </Link>
        </div>

       <button
  className={`menu-toggle ${menuMobileOpen ? "active" : ""}`}
  onClick={() => setMenuMobileOpen(!menuMobileOpen)}
>
  <span></span>
  <span></span>
  <span></span>
</button>

      </div>
    </nav>
  );
}
