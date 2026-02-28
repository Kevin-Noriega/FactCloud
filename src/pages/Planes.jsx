import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PlanCard from "../components/PlanCard";
import CountdownBanner from "../components/CountdownBanner";
import Stepper from "../components/Stepper";
import faqsPlan from "../utils/FAQS";
import "../styles/PLanes.css";
import { usePlanes } from "../hooks/usePlanes";

export default function Planes() {
  const navigate = useNavigate();
  const { data: planes, isLoading, error, refetch } = usePlanes();
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleSelectPlan = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify({
      ...plan,
      timestamp: new Date().toISOString()
    }));
    navigate("/registro");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const faqs = faqsPlan.filter((faq) => faq.seccion === "planes");

    if (isLoading) return <div className="loading">Cargando planes...</div>;
  if (error) return (
    <div className="error">
      Error: {error.message}
      <button onClick={refetch}>Reintentar</button>
    </div>
  );
  return (
    <div className="planCards-page">
      <CountdownBanner />
      <section className="planCards-hero">
        <div className="container">
          <h1>Encuentra el plan perfecto para tu negocio</h1>
          <p>Todos los planes incluyen 14 días de prueba gratis.</p>
        </div>
      </section>

      <Stepper currentStep={1} />

      <section id="planes" className="planCards-section">
        <span className="section-label">Facturacion electronica</span>
        <div className="pricing-cards">
          {planes.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onCheckout={handleSelectPlan} />
          ))}
        </div>
        <section className="pricing-footer-page">
          <h3>¿Necesitas un plan personalizado?</h3>
          <div className="princing-footer-content">
            <p>
              Contáctanos para cotizaciones empresariales o necesidades
              especiales.
            </p>
            <a href="/contacto" className="btn-contact-sales">
              Hablar con ventas
            </a>
          </div>
        </section>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <p className="section-intro">
            Encuentra respuestas rápidas a las consultas más comunes sobre
            nuestros planes.
          </p>
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
