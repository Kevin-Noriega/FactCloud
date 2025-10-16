import React from "react";
import { Outlet } from "react-router-dom"; 
import Sidebar from "./Sidebar";
import "./MainLayout.css"; 

function MainLayout() {
  return (
    <div className="d-flex layout-wrapper"> 
      
      {/* 1. Sidebar Fijo */}
      <Sidebar />

      {/* 2. Contenido Principal con Header y Footer */}
      <div className="content-wrapper flex-grow-1">
        
        <header className="navbar navbar-light bg-white shadow-sm sticky-top px-4 py-3 border-bottom">
          <div className="container-fluid">
            <h5 className="mb-0 text-secondary">
                Panel de Control
            </h5>
            <span className="badge bg-success me-3">Online</span>
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
      </div>
    </div>
  );
}

export default MainLayout;
