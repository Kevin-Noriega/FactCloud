import {
  BellFill,
  GearFill,
  Plus,
  QuestionCircleFill,
} from "react-bootstrap-icons";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import "../styles/MainLayout.css";
import FactCloudLogo from "../img/logo.png";
import { useUsuarios } from "../hooks/useUsuarios";
import { useState, useEffect } from "react";
import ModalDashboard from "../components/ModalDashboard";
import SearchBar from "../layouts/SearchBar";

function MainLayout() {
  const [mostrarModal, setMostrarModal] = useState(false);
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
  const LogoEmpresa = ({ url, nombreEmpresa, sizeNav = "26px" }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
      if (url && url.trim() !== "") {
        const img = new Image();
        img.onload = () => setError(false);
        img.onerror = () => setError(true);
        img.src = url;
      } else {
        setError(true);
      }
    }, [url]);

    if (!url || error) {
      const iniciales = nombreEmpresa
        ? nombreEmpresa
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "FC";

      return (
        <div
          style={{
            width: sizeNav,
            height: sizeNav,
            borderRadius: "50%",
            objectFit: "cover",
            background: "linear-gradient(135deg, #00a2ff, #025b8f)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `calc(${sizeNav} / 2.5)`,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {iniciales}
        </div>
      );
    }
    return (
      <img
        src={usuarios?.logoNegocio || usuarios?.foto}
        alt={usuarios?.nombre || "Usuario"}
        className="user-avatar"
        style={{
          width: sizeNav,
          height: sizeNav,
          borderRadius: "50%",
          objectFit: "cover",
        }}
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div className="d-flex layout-wrapper">
      <Sidebar />

      <div className="content-wrapper">
        <header className="navbarFact navbar-light bg-white shadow-sm header-fixed px-4 py-3 border-bottom">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img
                src={FactCloudLogo}
                alt="FactCloud Logo"
                style={{ width: "60px", height: "auto" }}
              />
              <h5 className="mb-0 text-secondary">
                {usuarios?.nombreNegocio || "FactCloud"}
              </h5>
            </div>

            <div className="flex-grow-1 mx-4" style={{ maxWidth: "500px" }}>
              <SearchBar />
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setMostrarModal(true)}
                className="fc-button btn-primary"
              >
                <Plus size={20} />
                <span>Crear</span>
              </button>

              <button
                onClick={() => setMostrarModal(true)}
                className="fc-button user-button"
                title="Notificaciones"
              >
                <BellFill size={20} />
              </button>

              <button
                onClick={() => setMostrarModal(true)}
                className="fc-button user-button"
                title="Ayuda"
              >
                <QuestionCircleFill size={20} />
              </button>

              <Link
                to="/configuracion"
                className="fc-button user-button"
                title="Configuración"
              >
                <GearFill size={20} />
              </Link>
              <Link to="/perfil" className="fc-button profile-button">
                <LogoEmpresa
                  url={usuarios?.logoNegocio}
                  nombreEmpresa={usuarios?.empresa}
                />
                <span>{usuarios?.nombre || "Yeimar"}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="main-content-area">
          <Outlet />
        </main>

        <footer className="bg-light text-center py-3 border-top mt-auto">
          <small className="text-muted">
            © {new Date().getFullYear()} FactCloud - Sistema de Facturación
            Electrónica
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
