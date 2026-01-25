import {
  BellFill,
  GearFill,
  Plus,
  QuestionCircleFill,
  Search,
} from "react-bootstrap-icons";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import ModalDashboard from "../components/ModalDashboard";
import UserMenu from "../components/UserMenu";
import { useUsuarios } from "../hooks/useUsuarios";
import FactCloudLogo from "../img/logo.png";
import "../styles/MainLayout.css";

function MainLayout() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: usuarios, isLoading, isError, error } = useUsuarios();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Cargando...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger m-4">Error: {error?.message}</div>
    );
  }

  const nombreCompleto = `${usuarios?.nombre || ""} ${usuarios?.apellido || ""}`.trim() || "Usuario";

  return (
    <div className="d-flex layout-wrapper">
      <Sidebar />

      <div className="content-wrapper">
        <header className="navbarFact navbar-light bg-white shadow-sm header-fixed px-4 py-3 border-bottom">
          <div className="container-fluid d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <img
                src={FactCloudLogo}
                alt="FactCloud Logo"
                className="fc-logo"
              />
              <h5 className="mb-0 fw-bold d-none d-lg-block" style={{color:"var(--primary-dark)"}}>
                {usuarios?.nombreNegocio || "FactCloud"}
              </h5>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <div className="d-none d-md-block" style={{ width: "250px" }}>
              <div className="search-bar-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar en FactCloud"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
              <button className="fcButton" title="Notificaciones">
                <BellFill size={16} />
              </button>

              <Link to="/configuracion" className="fcButton" title="Configuración">
                <GearFill size={16} />
              </Link>

              <button className="fcButton" title="Ayuda">
                <QuestionCircleFill size={16} />
              </button>

              <button
                onClick={() => setMostrarModal(true)}
                className="fcButton btn-primary d-none d-sm-flex"
              >
                <Plus size={20} />
                <span>Crear</span>
              </button>

              <UserMenu
                userName={nombreCompleto}
                userEmail={usuarios?.correo || "hola@gmail.com"}
                userAvatar={usuarios?.logoNegocio}
              />
            </div>
          </div>
        </header>

        <main className="main-content-area">
          <Outlet />
        </main>

        <footer className="bg-light text-center py-3 border-top mt-auto">
          <small className="text-muted">
            © {new Date().getFullYear()} FactCloud - Sistema de Facturación Electrónica
          </small>
        </footer>

        <ModalDashboard
          open={mostrarModal}
          onClose={() => setMostrarModal(false)}
        />
      </div>
    </div>
  );
}

export default MainLayout;
