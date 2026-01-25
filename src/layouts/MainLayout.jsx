import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./MainLayout.css";
import FactCloudLogo from "../img/logo.png";
import FactCloudFotoUsuario from "../img/FotoK.jpg";
import notificaciones from "../img/notificacion.png";
import { useUsuarios } from "../hooks/useUsuarios";
import { useState } from "react";
import ModalDashboard from "./ModalDashboard";
import SearchBar from "../components/SearchBar";
import "../styles/Botones.css";

function MainLayout() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const { data: usuarios = [], isLoading, isError, error } = useUsuarios();

  if (isLoading){
    return console.log("Cargando usuarios...");
  }
  if (isError){
    return console.log("Error al cargar usuarios:", error);
  }

  return (
    <div className="d-flex layout-wrapper">
      {/* 1. Sidebar Fijo */}
      <Sidebar />

      {/* 2. Contenido Principal con Header y Footer */}
      <div className="content-wrapper flex-grow-1">
        <header className="navbar navbar-light bg-white shadow-sm sticky-top px-4 py-3 border-bottom">
          <div className="container-fluid d-flex align-items-center">
            {/* IZQUIERDA - LOGO */}
            <div
              className="d-flex align-items-center"
              style={{ width: "63px" }}
            >
              <img
                src={FactCloudLogo}
                alt="logoFactCloud"
                style={{ width: "60px" }}
              />
            </div>

            {/* CENTRO - TÍTULO */}
            <div className="flex-grow-1">
              <h5 className="mb-0 text-secondary">{usuarios.nombreNegocio}</h5>
            </div>

            {/* DERECHA - ESPACIO (o acciones futuras) */}
            <div className="d-flex align-items-center justify-content-between px-3 py-2 ">
              {/* IZQUIERDA */}
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-bell fs-5 text-secondary" />
                <i className="bi bi-gear fs-5 text-secondary" />
              </div>

              {/* CENTRO */}
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <SearchBar />
                </div>
                {/* boton de notificaciones */}
                <button
                  onClick={() => setMostrarModal(true)}
                  className="fc-button user-button"
                >
                  <img
                    src={notificaciones}
                    alt="Usuario"
                    className="user-avatar"
                  />
                </button>
                {/* boton de crear */}
                <button
                  onClick={() => setMostrarModal(true)}
                  className="fc-button"
                >
                  <span>Crear</span>
                </button>
                {/* boton de Ayuda */}
                <div className="dropdown">
                  <button
                    onClick={() => setMostrarModal(true)}
                    className="fc-button"
                  >
                    <span>Ayuda</span>
                  </button>
                </div>

                {/* botonde perfil */}
                <div>
                  <a className=" d-flex align-items-center text-decoration-none"></a>
                  <button
                    className="fc-button user-button"
                  >
                    <link to="/perfil"/>
                    <img
                      src={FactCloudFotoUsuario}
                      alt="Usuario"
                      className="user-avatar"
                    />

                    <span>Kevin Noriega</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Área de Contenido de la Ruta */}
        <main className="container-fluid py-4 main-content-area">
          <Outlet /> {/* La ruta hija se renderiza aquí */}
        </main>

        {/* Footer */}
        <footer className="bg-light text-center py-3 border-top mt-auto">
          <small className="text-muted">
            © {new Date().getFullYear()} FACTCLOUD
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
