import PlanCard from "../components/PlanCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { planes } from "../utils/Planes";
import canalesAtencion from "../components/CanalesAtencion";
import caracteristicas from "../utils/Home/Caracteristicas";
import faqsHome from "../utils/FAQS"
import Stepper from "../components/Stepper";
import "../Styles/Home.css";
import {
  CheckCircle,
  GraphUpArrow,
  PlayCircle,
  PersonLock,
  ArrowRight, 
  Cloud
} from "react-bootstrap-icons";

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
              <ArrowRight size={20} />

            </button>
            <button
              className="btn-secondary-hero"
              onClick={() => document.getElementById("demo").scrollIntoView()}
            >
              <PlayCircle size={20} />

              Ver demo en vivo
            </button>
          </div>
          <div className="floating-card card-1">
            <div className="card-icon">
              <CheckCircle size={30} />

            </div>
            <div className="card-text">
              <strong>Factura enviada</strong>
              <span>$297.500</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">
              <GraphUpArrow size={30} />

            </div>
            <div className="card-text">
              <strong>Ventas del mes</strong>
              <span>+28% vs anterior</span>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="pricing-section">
        <div className="container">
          <span className="section-label">Precios Transparentes</span>
          <h2>Planes que se ajustan a tu crecimiento</h2>
          <p className="section-header-planes">Sin sorpresas. Sin costos ocultos. Cancela cuando quieras.
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

      <section className="social-proof">
        <p className="social-text">Confiado por empresas en toda Colombia</p>
        <div className="trust-badges">
          <div className="badge">
            <CheckCircle size={18} /> Autorizado DIAN
          </div>
          <div className="badge">
            <PersonLock size={18} /> Datos encriptados
          </div>
          <div className="badge">
           <Cloud size={18} /> 100% en la nube

          </div>
        </div>
      </section>

      <section id="producto" className="features-section">
        <div className="container">
          <h2>Todo lo que necesitas en un solo lugar</h2>
          <p className="section-header-producto">
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
