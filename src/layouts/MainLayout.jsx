import { useEffect, useState, useRef } from "react";
import {
  BellFill,
  GearFill,
  Plus,
  QuestionCircleFill,
  Search,
  ArrowRightShort,
  FileEarmarkTextFill,
  PersonFill,
  BoxSeam,
  PlusCircleFill,
  FileText,
} from "react-bootstrap-icons";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";

import ModalCrear from "../components/modals/ModalCrear";
import ModalConfiguracion from "../components/modals/ModalConfiguracion";
import ModalNotificaciones from "../components/modals/ModalNotificaciones";
import ModalAyuda from "../components/modals/ModalAyuda";
import UserMenu from "../components/dashboard/UserMenu";

import { useUsuarios } from "../hooks/useUsuarios";
import { useNotificacionesNoLeidas } from "../hooks/useNotificaciones";
import { ACCESOS_RAPIDOS } from "../utils/AccesosRapidos";
import "../styles/MainLayout.css";

function MainLayout() {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const notifButtonRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setShowResults(true);

        const res = await fetch(
          `/api/search/global?query=${encodeURIComponent(searchQuery)}`,
        );

        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchQuery]);

  const handleSelect = (item) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(item.route);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setShowResults(true);

        const query = searchQuery.trim().toLowerCase();

        // ── Accesos rápidos locales ──
        const locales = ACCESOS_RAPIDOS.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.some((k) => k.includes(query)),
        );

        // ── Resultados del backend ──
        const res = await fetch(
          `/api/search/global?query=${encodeURIComponent(searchQuery)}`,
        );
        const remotos = await res.json();

        setResults([...remotos, ...locales]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchQuery]);

  // Este se queda igual, no lo toques
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { data: usuarios, isLoading, isError, error } = useUsuarios();
  const { data: noLeidas = 0 } = useNotificacionesNoLeidas();

  if (isLoading)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        Cargando...
      </div>
    );
  if (isError)
    return <div className="alert alert-danger m-4">{error?.message}</div>;

  const nombreCompleto =
    `${usuarios?.nombre || ""} ${usuarios?.apellido || ""}`.trim() || "Usuario";

  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const labels = {
    factura: " Facturas",
    cliente: "Clientes",
    producto: "Productos",
    pagina: "Accesos rápidos",
  };

  const iconByType = {
    factura: <FileEarmarkTextFill size={16} />,
    cliente: <PersonFill size={16} />,
    producto: <BoxSeam size={16} />,
    pagina: <FileText size={16} />,
    accion: <PlusCircleFill size={16} />,
    modal: <GearFill size={16} />,
  };

  return (
    <div className="d-flex layout-wrapper">
      <Sidebar />

      <div className="content-wrapper">
        <header className="navbarFact bg-white shadow-sm px-4 py-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            {/* LOGO */}
            <div className="d-flex align-items-center gap-2">
              <img src="/img/IconoBlue_sinFondo.png" className="fc-logo" />
              <h5 className="fw-bold d-none d-lg-block">
                {usuarios?.nombreNegocio || "FactCloud"}
              </h5>
            </div>

            {/* SEARCH */}
            <div className="d-flex align-items-center gap-2">
              <div
                ref={containerRef}
                className="position-relative d-none d-md-block"
                style={{ width: "300px" }}
              >
                <div className="search-bar-container">
                  <Search size={16} className="search-icon" />

                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    className="search-input"
                  />

                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  )}
                </div>

                {showResults && (
                  <div className="search-results">
                    {loading && <div className="search-state">Buscando...</div>}

                    {!loading && results.length === 0 && (
                      <div className="search-state">Sin resultados</div>
                    )}

                    {!loading &&
                      Object.keys(grouped).map((group) => (
                        <div key={group}>
                          <div className="search-group-title">
                            {labels[group]}
                          </div>

                          {grouped[group].map((item, i) => (
                            <div
                              key={i}
                              className="search-item"
                              onClick={() => handleSelect(item)}
                            >
                              <div className="search-icon-box">
                                {iconByType[item.type]}
                              </div>

                              <div className="search-text">
                                <div className="search-title">{item.title}</div>
                                <div className="search-sub">
                                  {item.subtitle}
                                </div>
                              </div>

                              <div className="search-go">
                                <ArrowRightShort />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* BOTONES */}
              <div className="notif-container-wrapper">
                <button
                  ref={notifButtonRef}
                  className="fcButton notif-btn"
                  title="Notificaciones"
                  onClick={() =>
                    setMostrarNotificaciones(!mostrarNotificaciones)
                  }
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
                onClick={() => setMostrarConfiguracion(true)}
              >
                <GearFill size={18} />
              </button>

              <button
                className="fcButton"
                onClick={() => setMostrarAyuda(true)}
              >
                <QuestionCircleFill size={18} />
              </button>

              <button
                onClick={() => setMostrarCrear(true)}
                className="fcButton fc-btn-primary"
              >
                <Plus size={18} />
                <span>Crear</span>
              </button>

              <UserMenu
                userName={nombreCompleto}
                userEmail={usuarios?.correo}
                userAvatar={usuarios?.logoNegocio}
              />
            </div>
          </div>
        </header>

        <main className="main-content-area">
          <Outlet />
        </main>
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
        <ModalNotificaciones
          isOpen={mostrarNotificaciones}
          onClose={() => setMostrarNotificaciones(false)}
          buttonRef={notifButtonRef}
        />
      </div>
    </div>
  );
}

export default MainLayout;
