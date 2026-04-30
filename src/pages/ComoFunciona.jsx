import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUserPlus, FiFilePlus, FiSend, FiCheckCircle,
  FiZap, FiShield, FiCpu, FiChevronDown, FiChevronUp, FiArrowRight
} from "react-icons/fi";
import pasos from "../utils/ComoFunciona/Pasos";
import caracteristicas from "../utils/ComoFunciona/Caracteristicas";
import planes from "../utils/ComoFunciona/Planes";
import tecnologias from "../utils/ComoFunciona/Tecnologias";
import proceso from "../utils/ComoFunciona/Proceso";
import faqsFuncionamiento from "../utils/FAQS";
import "../styles/ComoFunciona.css";

const faqs = faqsFuncionamiento.filter(f => f.seccion === "como-funciona");

const ComoFunciona = () => {
  const [selectedPlan, setSelectedPlan] = useState("basico");
  const [openFAQ, setOpenFAQ] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="como-funciona-page">

      {/* Hero — usa clases globales de index.css */}
      <section className="hero-section">
        <img
          src="/img/img_hero_comoFunciona.webp"
          alt="Empresario usando Nubee"
          className="hero-image"
        />
        <div className="container">
          <span className="hero-badge">Aprende cómo funciona</span>
          <h1>¿Cómo funciona Nubee?</h1>
          <p className="hero-description">
            Desde el registro hasta tu primera factura electrónica validada por
            DIAN en solo 10 minutos. Sin complicaciones técnicas ni configuraciones complejas.
          </p>
        </div>
      </section>

      {/* Pasos */}
      <section className="pasos-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-subtitle">Simplicidad total</span>
            <h2>4 pasos para facturar electrónicamente</h2>
            <p>Hemos diseñado el proceso más fluido del mercado para que te enfoques en vender, no en tramitar.</p>
          </div>
          <div className="pasos-timeline">
            {pasos.map((paso, idx) => {
              const icons = [<FiUserPlus />, <FiFilePlus />, <FiSend />, <FiCheckCircle />];
              return (
                <div key={idx} className="paso-item">
                  <div className="paso-visual">
                    <div className="paso-icon-wrapper">{icons[idx]}</div>
                    <div className="paso-line" />
                  </div>
                  <div className="paso-content">
                    <span className="paso-number-label">Paso {paso.numero}</span>
                    <h3>{paso.titulo}</h3>
                    <p className="paso-descripcion">{paso.descripcion}</p>
                    <ul className="paso-detalles">
                      {paso.detalles.map((d, i) => (
                        <li key={i}><FiCheckCircle className="detail-check" />{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="caracteristicas-section">
        <div className="container">
          <h2>Funcionalidades por plan</h2>
          <div className="planes-selector">
            {planes.map((plan) => (
              <button
                key={plan.id}
                className={`plan-tab ${selectedPlan === plan.id ? "active" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
                type="button"
              >
                {plan.nombre}
              </button>
            ))}
          </div>
          <div className="caracteristicas-lista">
            {caracteristicas.map((cat, idx) => (
              <div key={idx} className="categoria-block">
                <h3 className="categoria-titulo">{cat.categoria}</h3>
                <div className="items-grid">
                  {cat.items.map((item, i) => {
                    const disponible = item.planes.includes(selectedPlan);
                    return (
                      <div key={i} className={`item-card ${disponible ? "disponible" : "no-disponible"}`}>
                        <div className="item-header">
                          <span className={`item-check ${disponible ? "activo" : ""}`}>
                            {disponible ? "✓" : "−"}
                          </span>
                          <h4>{item.nombre}</h4>
                        </div>
                        <p>{item.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="planes-cta">
            <Link to="/planes" className="btn-ver-planes">Ver planes y precios completos</Link>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section id="tecnologias" className="tecnologia-section">
        <div className="tecnologia-container">
          <h2>Tecnología detrás de Nubee</h2>
          <p className="section-intro">
            Plataforma construida con las mejores prácticas de desarrollo y tecnologías enterprise probadas en producción.
          </p>
          <div className="tecnologia-grid">
            {tecnologias.map((tec, idx) => (
              <div key={idx} className="tech-card">
                <div className="tech-icon">{tec.icono}</div>
                <h3>{tec.titulo}</h3>
                <p>{tec.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="proceso-facturacion">
        <div className="container">
          <div className="section-header-center">
            <h2>El proceso técnico detrás de cada factura</h2>
            <p>Automatizamos la comunicación con la DIAN en milisegundos.</p>
          </div>
          <div className="proceso-flow">
            {proceso.map((proc, idx) => {
              const procIcons = [<FiZap />, <FiShield />, <FiCpu />, <FiCheckCircle />];
              return (
                <div key={idx} className="flow-step">
                  <div className="flow-icon-container">{procIcons[idx]}</div>
                  <h4>{proc.titulo}</h4>
                  <p>{proc.descripcion}</p>
                  {idx < proceso.length - 1 && <FiArrowRight className="flow-arrow" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Preguntas frecuentes</h2>
          <p className="section-intro">Encuentra respuestas rápidas a las consultas más comunes.</p>
          <div className="faq-lista">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFAQ === idx ? "open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}>
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-toggle">{openFAQ === idx ? <FiChevronUp /> : <FiChevronDown />}</span>
                </button>
                {openFAQ === idx && <div className="faq-answer"><p>{faq.respuesta}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ComoFunciona;