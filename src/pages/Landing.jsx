// Landing.jsx - Con Header Completo + Top Bar
import { useEffect, useState } from "react";
import "./Landing.css";
import FactCloudLogo from "../img/logoFC.png";
import FactCloudLogoFooter from "../img/logoFCWhite.png";

export default function Landing() {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    document.body.style.background = "var(--bg-dark)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="landing-wrapper">
      {/* TOP BAR - Info superior */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <a href="#contacto" className="top-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              soporte@factcloud.com
            </a>
            <a href="tel:+573216878825" className="top-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              +57 321 687 8825
            </a>
          </div>

          <div className="top-bar-right">
            <div className="country-selector">
              <img
                src="https://flagcdn.com/w20/co.png"
                alt="Colombia"
                width="20"
                height="15"
                style={{ marginRight: "8px" }}
              />
              <spanv>🇨🇴 Colombia</spanv>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            <a href="/portal" className="portal-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Portal de Clientes
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPAL */}
      <nav className="navbar">
        <div className="nav-content">
          <img src={FactCloudLogo} alt="FactCloud" className="logo" />

          <div className={`nav-links ${menuMobileOpen ? "active" : ""}`}>
            <a href="#producto">Producto</a>
            <a href="#precios">Precios</a>
            <a href="#recursos">Recursos</a>
            <a href="#contacto">Contacto</a>
            <div className="nav-divider"></div>
            <a href="/register" className="btn-cta-nav">
              Empezar gratis
            </a>
            <a href="/login" className="btn-login">
              Ingresar
            </a>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Facturación electrónica
            <br />
            <span className="gradient-text">simple y poderosa</span>
          </h1>

          <p className="hero-description">
            La plataforma más intuitiva para PYMES colombianas. Emite facturas
            <br className="hide-mobile" />
            ilimitadas con cumplimiento DIAN automático.
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary-hero"
              onClick={() => (window.location.href = "/register")}
            >
              Probar gratis 14 días
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 4l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="btn-secondary-hero"
              onClick={() => document.getElementById("demo").scrollIntoView()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM8 10l4-2-4-2v4z" />
              </svg>
              Ver demo en vivo
            </button>
          </div>
          <div className="floating-card card-1">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                class="bi bi-check2-circle"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
              </svg>
            </div>
            <div className="card-text">
              <strong>Factura enviada</strong>
              <span>$297.500</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                class="bi bi-graph-up-arrow"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
            <div className="card-text">
              <strong>Ventas del mes</strong>
              <span>+28% vs anterior</span>
            </div>
          </div>
        </div>
      </section>
      {/* PRICING - CON TOOLTIPS INTERACTIVOS */}
      <section id="precios" className="pricing-section">
        <div className="section-header">
          <span className="section-label">Precios Transparentes</span>
          <h2>Planes que se ajustan a tu crecimiento</h2>
          <p>Sin sorpresas. Sin costos ocultos. Cancela cuando quieras.</p>
        </div>

        <div className="pricing-cards">
          {/* PLAN BÁSICO */}
          <div className="price-card">
            <h3>Básico</h3>
            <div className="price-display">
              <div className="price-main">
                <span className="currency">$</span>
                <span className="amount">12.900</span>
                <span className="period">/mes</span>
              </div>
              <div className="price-annual">$154.800 / año</div>
              <div className="discount-badge">-15%</div>
              <div className="price-before">$182.000 / año</div>
            </div>
            <button className="btn-price">Empezar ahora</button>
    <p className="payment-note">
              *El pago es anual. Descuento aplicado automáticamente.
            </p>
            <ul className="price-features">
              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>1 Usuario</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "basico-1" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("basico-1")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "basico-1" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Cuenta individual perfecta para emprendedores y negocios
                      unipersonales. Acceso completo a todas las funciones.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>240 Documentos electrónicos al mes</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "basico-2" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("basico-2")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "basico-2" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Facturas, notas débito y crédito incluidas. Perfecto para
                      negocios que emiten hasta 8 documentos diarios.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Envío automático por email</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "basico-3" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("basico-3")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "basico-3" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      PDF y XML llegan al instante al correo de tus clientes con
                      tu logo empresarial personalizado.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Soporte por email</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "basico-4" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("basico-4")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "basico-4" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Respuesta en 24 horas. Equipo de soporte técnico
                      disponible de lunes a viernes 8am-6pm.
                    </p>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* PLAN PROFESIONAL*/}
          <div className="price-card featured">
            <div className="popular-tag">MÁS POPULAR</div>
            <h3>Profesional</h3>
            <div className="price-display">
              <div className="price-main">
                <span className="currency">$</span>
                <span className="amount">24.900</span>
                <span className="period">/mes</span>
              </div>
              <div className="price-annual">$298.800 / año</div>
              <div className="discount-badge">-20%</div>
              <div className="price-before">$373.500 / año</div>
            </div>
           
            <button className="btn-price primary">Empezar ahora</button>
                 <p className="payment-note">
              *El pago es anual. Descuento aplicado automáticamente.
            </p>
            <ul className="price-features">
              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Facturas ilimitadas</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "pro-1" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("pro-1")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "pro-1" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Emite todas las facturas que necesites. Sin límites
                      diarios ni mensuales. Ideal para alto volumen de ventas.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>POS incluido</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "pro-2" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("pro-2")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "pro-2" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Punto de venta completo en celular o tablet. Vende,
                      factura e imprime desde cualquier lugar con conexión.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>3 usuarios</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "pro-3" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("pro-3")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "pro-3" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Trabajo colaborativo para tu equipo. Permisos y roles
                      personalizables para cada usuario.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Soporte WhatsApp prioritario</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "pro-4" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("pro-4")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "pro-4" && (
                  <div className="tooltip-popup highlighted">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Línea directa con soporte técnico experto. Respuestas en
                      menos de 1 hora en horario laboral.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Reportes avanzados</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "pro-5" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("pro-5")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "pro-5" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Dashboard inteligente con analytics de ventas, productos
                      más vendidos y clientes frecuentes en tiempo real.
                    </p>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* PLAN EMPRESARIAL */}
          <div className="price-card">
            <h3>Empresarial</h3>
            <div className="price-display">
              <div className="price-main">
                <span className="currency">$</span>
                <span className="amount">49.900</span>
                <span className="period">/mes</span>
              </div>
              <div className="price-annual">$598.800 / año</div>
              <div className="discount-badge">-25%</div>
              <div className="price-before">$798.400 / año</div>
            </div>
            
            <button className="btn-price">Empezar ahora</button>
                <p className="payment-note">
              *El pago es anual. Descuento aplicado automáticamente.
            </p>
            <ul className="price-features">
              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Todo ilimitado</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-1" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-1")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-1" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Usuarios, documentos, sucursales y almacenamiento
                      ilimitados. Sin restricciones de ningún tipo.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Nómina electrónica</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-2" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-2")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-2" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Genera y envía nómina electrónica a tus empleados. Cumple
                      100% con normativa laboral colombiana vigente.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Usuarios ilimitados</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-3" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-3")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-3" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Sin límite de usuarios. Perfecto para empresas con
                      múltiples departamentos y sucursales en todo el país.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Soporte 24/7</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-4" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-4")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-4" && (
                  <div className="tooltip-popup highlighted">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Equipo de soporte técnico exclusivo disponible las 24
                      horas, los 7 días de la semana. Respuesta inmediata.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>API acceso</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-5" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-5")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-5" && (
                  <div className="tooltip-popup">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Integra FactCloud con tu ERP, CRM o ecommerce vía API
                      REST. Documentación completa y soporte técnico incluido.
                    </p>
                  </div>
                )}
              </li>

              <li className="feature-item-tooltip">
                <div className="feature-content">
                  <svg
                    className="check-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  <span>Cuenta gerente dedicado</span>
                  <button
                    className={`info-icon-btn ${
                      activeTooltip === "enterprise-6" ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveTooltip("enterprise-6")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      />
                    </svg>
                  </button>
                </div>
                {activeTooltip === "enterprise-6" && (
                  <div className="tooltip-popup highlighted">
                    <div className="tooltip-arrow"></div>
                    <p>
                      Ejecutivo exclusivo para tu empresa. Capacitación
                      personalizada, onboarding y soporte estratégico continuo.
                    </p>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="social-proof">
        <p className="social-text">Confiado por empresas en toda Colombia</p>
        <div className="trust-badges">
          <div className="badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="bi bi-check2-circle"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>{" "}
            Autorizado DIAN
          </div>
          <div className="badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="bi bi-person-lock"
              viewBox="0 0 16 16"
            >
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
            </svg>{" "}
            Datos encriptados
          </div>
          <div className="badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="bi bi-cloud"
              viewBox="0 0 16 16"
            >
              <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
            </svg>{" "}
            100% en la nube
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="producto" className="features-section">
        <div className="section-header">
          <span className="section-label">Características</span>
          <h2>Todo lo que necesitas en un solo lugar</h2>
          <p>Potencia tu negocio con herramientas profesionales</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="icon-gradient blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  style={{ color: "#ffffffff" }}
                  class="bi bi-lightning-charge"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z" />
                </svg>
              </div>
            </div>
            <h3>Emisión instantánea</h3>
            <p>
              Genera y envía facturas en menos de 30 segundos. PDF y XML
              automáticos.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="icon-gradient green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  style={{ color: "#ffffffff" }}
                  class="bi bi-envelope-at"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                  <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                </svg>
              </div>
            </div>
            <h3>Email automático</h3>
            <p>
              Envío directo al cliente con tu branding. Seguimiento de entregas
              en tiempo real.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="icon-gradient orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  style={{ color: "#ffffffff" }}
                  class="bi bi-shield-lock"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                  <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
                </svg>
              </div>
            </div>
            <h3>DIAN certificado</h3>
            <p>
              Cumplimiento 100% Resolución 165. CUFE y numeración automáticos.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="icon-gradient pink">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  style={{ color: "#ffffffff" }}
                  class="bi bi-credit-card-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1" />
                </svg>
              </div>
            </div>
            <h3>Múltiples métodos</h3>
            <p>
              Efectivo, tarjetas, PSE, Nequi. Conciliación bancaria automática.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <span className="section-label">Contacto</span>
            <h2>¿Necesitas ayuda?</h2>
            <p>
              Nuestro equipo está listo para responder tus preguntas y
              acompañarte en el proceso.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <strong>Teléfono</strong>
                  <p>+57 321 687 8825</p>
                  <span>Lun - Vie: 8am - 6pm</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>soporte@factcloud.com</p>
                  <span>Respuesta en 24h</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon whatsapp">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <strong>WhatsApp</strong>
                  <p>Chat directo</p>
                  <a
                    href="https://wa.me/573216878825"
                    className="whatsapp-link"
                  >
                    Iniciar conversación →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h3>Envíanos un mensaje</h3>
            <form>
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" placeholder="Juan Pérez" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="juan@empresa.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="+57 300 123 4567" />
                </div>
              </div>

              <div className="form-group">
                <label>Empresa</label>
                <input type="text" placeholder="Mi Empresa SAS" />
              </div>

              <div className="form-group">
                <label>¿En qué podemos ayudarte?</label>
                <textarea
                  rows="4"
                  placeholder="Cuéntanos sobre tu negocio y necesidades..."
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img
              src={FactCloudLogoFooter}
              alt="FactCloud"
              className="footer-logo"
            />
            <p>
              Facturación electrónica simple y poderosa para PYMES colombianas.
            </p>
            <div className="footer-country">Operando en Colombia</div>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="#" aria-label="Twitter">
                Twitter
              </a>
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Producto</h4>
              <a href="#producto">Características</a>
              <a href="#precios">Precios</a>
              <a href="#">Integraciones</a>
            </div>

            <div className="footer-column">
              <h4>Recursos</h4>
              <a href="#">Blog</a>
              <a href="#">Centro de ayuda</a>
            </div>

            <div className="footer-column">
              <h4>Empresa</h4>
              <a href="#">Nosotros</a>
              <a href="#contacto">Contacto</a>
              <a href="/portal">Portal Clientes</a>
              <a href="#">Términos</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <small className="footer-copy">
            © {new Date().getFullYear()} FACTCLOUD
          </small>
        </div>
      </footer>
    </div>
  );
}
