import { useRef } from "react";
import {
  BellFill,
  GearFill,
  Plus,
  QuestionCircleFill,
  Search,
} from "react-bootstrap-icons";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import ModalCrear from "../components/dashboard/ModalCrear";
import ModalConfiguracion from "../components/dashboard/ModalConfiguracion";
import ModalNotificaciones from "../components/dashboard/ModalNotificaciones";
import ModalAyuda from "../components/dashboard/ModalAyuda";
import UserMenu from "../components/dashboard/UserMenu";
import { useUsuarios } from "../hooks/useUsuarios";
import { useNotificacionesNoLeidas } from "../hooks/useNotificaciones";
import "../styles/MainLayout.css";

function MainLayout() {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifButtonRef = useRef(null);
  
  const { data: usuarios, isLoading, isError, error } = useUsuarios();
  const { data: noLeidas = 0 } = useNotificacionesNoLeidas();

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
console.log(useUsuarios);
  const nombreCompleto = `${usuarios?.nombre || ""} ${usuarios?.apellido || ""}`.trim() || "Usuario";

  return (
    <div className="d-flex layout-wrapper">
      <Sidebar />

      <div className="content-wrapper">
        <header className="navbarFact navbar-light bg-white shadow-sm header-fixed px-4 py-3 border-bottom">
          <div className="container-fluid d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <img
                src="/img/Logo.png"
                alt="FactCloud Logo"
                className="fc-logo"
              />
              <h5 className="mb-0 fw-bold d-none d-lg-block" style={{color:"var(--primary-dark)"}}>
                {usuarios?.nombreNegocio || "FactCloud"}
              </h5>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <div className="d-none d-md-block" style={{ width: "300px" }}>
                <div className="search-bar-container">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar en FactCloud"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => setSearchQuery("")}
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="notif-container-wrapper">
                <button 
                  ref={notifButtonRef}
                  className="fcButton notif-btn" 
                  title="Notificaciones"
                  onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                >
                  <BellFill size={18} />
                  {noLeidas > 0 && (
                    <span className="header-notif-badge">{noLeidas}</span>
                  )}
                </button>

                <ModalNotificaciones
                  isOpen={mostrarNotificaciones}
                  onClose={() => setMostrarNotificaciones(false)}
                  buttonRef={notifButtonRef}
                />
              </div>

              <button 
                className="fcButton" 
                title="Configuración"
                onClick={() => setMostrarConfiguracion(true)}
              >
                <GearFill size={18} />
              </button>

              <button 
                className="fcButton" 
                title="Ayuda"
                onClick={() => setMostrarAyuda(true)}
              >
                <QuestionCircleFill size={18} />
              </button>

              <button
                onClick={() => setMostrarCrear(true)}
                className="fcButton fc-btn-primary d-none d-sm-flex"
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

        <ModalCrear
          open={mostrarCrear}
          onClose={() => setMostrarCrear(false)}
        />

        <ModalConfiguracion
          isOpen={mostrarConfiguracion}
          onClose={() => setMostrarConfiguracion(false)}
        />

        <ModalAyuda
          isOpen={mostrarAyuda}
          onClose={() => setMostrarAyuda(false)}
        />
      </div>
    </div>
  );
}

export default MainLayout;
