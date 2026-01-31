import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  FileEarmarkText,
  People,
  BoxSeamFill,
  CashStack,
  ExclamationTriangleFill,
  FileEarmarkPdf,
  Clock,
  BookmarkCheck,
  QuestionCircle,
  Headset,
  PlayBtn,
  Megaphone,
  ArrowRight,
  GraphUpArrow,
  Calendar,
  CheckCircleFill,
} from "react-bootstrap-icons";
import "../styles/Dashboard.css";
import QuickActions from "../components/AccesosDirectos";

function Dashboard() {
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [facturasCount, setFacturasCount] = useState(0);
  const [facturasPendientes, setFacturasPendientes] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const [resClientes, resProductos, resFacturas] = await Promise.all([
        fetch(`${API_URL}/clientes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/productos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/facturas`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const [dataClientes, dataProductos, dataFacturas] = await Promise.all([
        resClientes.json(),
        resProductos.json(),
        resFacturas.json(),
      ]);

      setClientesCount(dataClientes.length);
      setProductosCount(dataProductos.length);
      setFacturasCount(dataFacturas.length);

      const pendientes = dataFacturas.filter(
        (f) => f.estado === "Pendiente" || f.estado === "Emitida",
      ).length;
      setFacturasPendientes(pendientes);

      const total = dataFacturas.reduce((sum, f) => sum + f.totalFactura, 0);
      setTotalVentas(total);

      return pendientes;
    } catch (error) {
      console.error("Error al cargar datos:", error);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-dashboard">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-card">
          <div className="dashboard-header-content">
            <div className="dashboard-header-text">
              <h1 className="dashboard-header-title">¡Bienvenido a FactCloud!</h1>
              <p className="dashboard-header-subtitle">
                Sistema de Facturación Electrónica - Cumplimiento DIAN 2025
              </p>
              <div className="dashboard-header-date">
                <Calendar className="me-2" size={16} />
                {new Date().toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

            </div>
            <div className="dashboard-header-icon">
              <GraphUpArrow size={120} />
            </div>
            <div className="dashboard-header-actions">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <FileEarmarkText size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Facturas</p>
            <h3 className="stat-value">{facturasCount}</h3>
            <div className="stat-badge">
              <CheckCircleFill size={14} className="me-1" />
              Activas
            </div>
          </div>
          <Link to="/facturas" className="stat-link">
            Ver todas
            <ArrowRight size={16} className="ms-2" />
          </Link>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <People size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Clientes</p>
            <h3 className="stat-value">{clientesCount}</h3>
            <div className="stat-badge">
              <People size={14} className="me-1" />
              Registrados
            </div>
          </div>
          <Link to="/clientes" className="stat-link">
            Gestionar
            <ArrowRight size={16} className="ms-2" />
          </Link>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <BoxSeamFill size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Productos</p>
            <h3 className="stat-value">{productosCount}</h3>
            <div className="stat-badge">
              <BoxSeamFill size={14} className="me-1" />
              En inventario
            </div>
          </div>
          <Link to="/productos" className="stat-link">
            Ver inventario
            <ArrowRight size={16} className="ms-2" />
          </Link>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <CashStack size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Ventas Totales</p>
            <h3 className="stat-value">
              ${totalVentas.toLocaleString("es-CO")}
            </h3>
            <div className="stat-badge">
              <GraphUpArrow size={14} className="me-1" />
              Este mes
            </div>
          </div>
          <Link to="/reportes" className="stat-link">
            Ver reportes
            <ArrowRight size={16} className="ms-2" />
          </Link>
        </div>
      </div>

      {facturasPendientes > 0 && (
        <div className="alert-pendientes">
          <div className="alert-icon">
            <ExclamationTriangleFill size={28} />
          </div>
          <div className="alert-content">
            <h4 className="alert-title">
              Tienes {facturasPendientes}{" "}
              {facturasPendientes === 1
                ? "factura pendiente"
                : "facturas pendientes"}
            </h4>
            <p className="alert-text">
              Recuerda enviarlas a la DIAN dentro de las 48 horas para cumplir
              con la normativa.
            </p>
          </div>
          <Link to="/facturas" className="alert-button">
            Ver pendientes
          </Link>
        </div>
      )}

      <div className="content-grid">
        <div className="tutorials-section">
          <div className="section-card">
            <div className="section-header">
              <h5 className="section-title">Tutoriales Rápidos</h5>
            </div>
            <div className="tutorials-grid">
              <div className="tutorial-card">
                <div className="tutorial-icon tutorial-icon-primary">
                  <FileEarmarkText size={24} />
                </div>
                <div className="tutorial-content">
                  <h6 className="tutorial-title">
                    Cómo crear tu primera factura
                  </h6>
                  <p className="tutorial-description">
                    Aprende a generar facturas electrónicas cumpliendo con la
                    normativa DIAN.
                  </p>
                  <a href="#" className="tutorial-link">
                    Ver tutorial
                    <ArrowRight size={14} className="ms-2" />
                  </a>
                </div>
              </div>

              <div className="tutorial-card">
                <div className="tutorial-icon tutorial-icon-success">
                  <People size={24} />
                </div>
                <div className="tutorial-content">
                  <h6 className="tutorial-title">Enviar facturas a clientes</h6>
                  <p className="tutorial-description">
                    Configura el envío automático de facturas por correo
                    electrónico.
                  </p>
                  <a href="#" className="tutorial-link">
                    Ver tutorial
                    <ArrowRight size={14} className="ms-2" />
                  </a>
                </div>
              </div>

              <div className="tutorial-card">
                <div className="tutorial-icon tutorial-icon-warning">
                  <GraphUpArrow size={24} />
                </div>
                <div className="tutorial-content">
                  <h6 className="tutorial-title">Generar reportes de ventas</h6>
                  <p className="tutorial-description">
                    Consulta estadísticas y reportes detallados de tu negocio.
                  </p>
                  <a href="#" className="tutorial-link">
                    Ver tutorial
                    <ArrowRight size={14} className="ms-2" />
                  </a>
                </div>
              </div>

              <div className="tutorial-card">
                <div className="tutorial-icon tutorial-icon-info">
                  <BookmarkCheck size={24} />
                </div>
                <div className="tutorial-content">
                  <h6 className="tutorial-title">Configurar tu perfil</h6>
                  <p className="tutorial-description">
                    Personaliza la información de tu empresa y datos fiscales.
                  </p>
                  <a href="#" className="tutorial-link">
                    Ver tutorial
                    <ArrowRight size={14} className="ms-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="normativa-section">
          <div className="section-card">
            <div className="section-header">
              <h5 className="section-title">Normatividad DIAN</h5>
            </div>
            <div className="normativa-list">
              <a
                href="https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000165%20de%2001-11-2023.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <FileEarmarkPdf size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Resolución 000165 de 2023</p>
                  <small className="normativa-subtitle">
                    Facturación electrónica obligatoria
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://www.dian.gov.co/Prensa/Paginas/NG-Comunicado-de-Prensa-026-2025.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <Clock size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Plazo de 48 horas</p>
                  <small className="normativa-subtitle">
                    Para envío a la DIAN
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://www.dian.gov.co/impuestos/factura-electronica/Documents/Abece-FE-Facturador.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <BookmarkCheck size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Artículo 617 E.T.</p>
                  <small className="normativa-subtitle">
                    Requisitos de factura
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0051929_2000.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <FileEarmarkText size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Conservación 5 años</p>
                  <small className="normativa-subtitle">
                    Archivo de documentos
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>
            </div>

            <a
              href="https://www.dian.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className="normativa-button"
            >
              Ver más en DIAN.gov.co
              <ArrowRight size={16} className="ms-2" />
            </a>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="help-card">
          <div className="help-icon">
            <QuestionCircle size={32} />
          </div>
          <div className="help-content">
            <h6 className="help-title">¿Necesitas ayuda?</h6>
            <p className="help-description">
              Consulta nuestra documentación completa o contacta con soporte
              técnico.
            </p>
          </div>
          <div className="help-buttons">
            <button className="help-button">
              <FileEarmarkText size={18} className="me-2" />
              Documentación
            </button>
            <button className="help-button">
              <Headset size={18} className="me-2" />
              Soporte
            </button>
            <button className="help-button">
              <PlayBtn size={18} className="me-2" />
              Tutoriales
            </button>
          </div>
        </div>

        <div className="news-card">
          <div className="news-icon">
            <Megaphone size={32} />
          </div>
          <div className="news-content">
            <h6 className="news-title">Novedades de FactCloud</h6>
            <ul className="news-list">
              <li className="news-item">
                <CheckCircleFill size={16} className="me-2" />
                Integración con DIAN automática
              </li>
              <li className="news-item">
                <CheckCircleFill size={16} className="me-2" />
                Envío masivo de facturas por email
              </li>
              <li className="news-item">
                <CheckCircleFill size={16} className="me-2" />
                Reportes avanzados en tiempo real
              </li>
              <li className="news-item">
                <CheckCircleFill size={16} className="me-2" />
                Backup automático en la nube
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
