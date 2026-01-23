import PlanCard from "../components/PlanCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { planes } from "../utils/Planes";
import canalesAtencion from "../components/CanalesAtencion";
import caracteristicas from "../utils/Home/Caracteristicas";
import faqsHome from "../utils/FAQS"
import Stepper from "../components/Stepper";
import "../Styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
   const [openFAQ, setOpenFAQ] = useState(null);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const featuredPlans = planes.filter(
    (plan) => plan.id === 1 || plan.id === 2 || plan.id === 3
  );
  const handleSelectPlan = (planName, planPrice, planDiscount) => {
    const selectedPlan = {
      planName,
      planDiscount,
      planPrice,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));

    navigate("/registro");
  };

  const faqs = faqsHome.filter(faq => faq.seccion === 'home')

  const canales = canalesAtencion.slice(1, 4);
   
  const next = () => {
    if (index < featuredPlans.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const plansToShow = isMobile
    ? [featuredPlans[index]]
    : featuredPlans;

  useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);
    useEffect(() => {

    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="landing-wrapper">
      <section className="home-hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Facturación electrónica
            <br />
            <span className="gradient-text">simple y poderosa</span>
          </h1>

          <p className="home-hero-description">
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
                className="bi bi-check2-circle"
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
                className="bi bi-graph-up-arrow"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
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

      {/* PLANES */}
      <section id="planes" className="pricing-section">
        <div className="container">
          <span className="section-label">Precios Transparentes</span>
          <h2>Planes que se ajustan a tu crecimiento</h2>
          <p className="section-header">Sin sorpresas. Sin costos ocultos. Cancela cuando quieras.

          </p>
              <Stepper currentStep={1} />
              
          {isMobile && index > 0 && (
            <button className="arrow-left" onClick={prev}>
              ‹
            </button>
          )}
        <div className="pricing-cards">
          {plansToShow.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onCheckout={handleSelectPlan} />
          ))}
             {isMobile && index < featuredPlans.length - 1 && (
            <button className="arrow-right" onClick={next}>
              ›
            </button>
          )}
        </div>
          </div>
        <section className="pricing-footer">
          <div className="princing-footer-content">
            <p>
              Tenemos los planes ideales para tu pyme. todos los planes anuales
              incluyen descuento.
            </p>
            <a href="/planes" className="btn-ver-planes">
              Ver todos los planes
            </a>
          </div>
        </section>
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
              className="bi bi-check2-circle"
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
              className="bi bi-person-lock"
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
              className="bi bi-cloud"
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
        <div className="container">
          <h2>Todo lo que necesitas en un solo lugar</h2>
          <p className="section-header">
            Potencia tu negocio con herramientas profesionales
          </p>

          <div className="features-grid">
            {caracteristicas.map((caracteristicas, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{caracteristicas.icono}</div>
                <h3>{caracteristicas.titulo}</h3>
                <p>{caracteristicas.descripcion}</p>
              </div>
            ))}
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
              {canales.map((canales, idx) => (
                <div key={idx} className="contact-method">
                  <div className="method-icon">{canales.icono}</div>
                  <div>
                    <p>{canales.descripcion}</p>
                    <a href={canales.href} className="contact-link">
                      {canales.accion}
                    </a>
                  </div>
                </div>
              ))}
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

      <section className="faq-section">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-lista">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item ${openFAQ === idx ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                >
                  
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-toggle">
                    {openFAQ === idx ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === idx && (
                  <div className="faq-answer">
                    <p>{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
