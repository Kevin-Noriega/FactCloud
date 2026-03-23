

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "../components/PlanCard";
import Stepper from "../components/Stepper";
import CountdownBanner from "../components/CountdownBanner";
import { usePlanes } from "../hooks/usePlanes";
import faqsPlan from "../utils/FAQS";
import "../styles/PlanesPage.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function PlanesPage() {
  const navigate = useNavigate();
  const { data: planes, isLoading, error, refetch } = usePlanes();
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSelectPlan = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify({
      ...plan,
      timestamp: new Date().toISOString(),
    }));
    navigate("/registro");
  };

  const faqs = faqsPlan.filter((faq) => faq.seccion === "planes");

  if (isLoading) return (
    <div className="planes-page-loading">
      <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
      Cargando planes...
    </div>
  );

  if (error) return (
    <div className="planes-page-error">
      <p>Error al cargar los planes: {error.message}</p>
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={refetch}>
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="planes-page">

      {/* Banner countdown fijo — z-index 9990, top calculado en CSS */}
      <CountdownBanner />

      {/* Hero de la página — compensa topbar + navbar + banner */}
      <section className="planes-page-hero" style={{ marginTop: 146 }}>
        <h1>Encuentra el plan perfecto para tu negocio</h1>
        <p>Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta requerida.</p>
      </section>

      {/* Stepper */}
      <Stepper currentStep={1} />

      {/* Planes */}
      <section className="planes-page-section">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span className="section-label">Facturación electrónica</span>
        </div>

        <div className="planes-page-grid">
          {(planes ?? []).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onCheckout={handleSelectPlan}
            />
          ))}
        </div>

        <div className="planes-page-footer">
          <div>
            <h3>¿Necesitas un plan personalizado?</h3>
            <p>Contáctanos para cotizaciones empresariales o necesidades especiales.</p>
          </div>
          <a href="/contacto" className="btn-contact-sales">
            Hablar con ventas
          </a>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="planes-faq-section">
          <h2>Preguntas frecuentes</h2>
          <p className="planes-faq-intro">
            Encuentra respuestas rápidas sobre nuestros planes.
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
                  type="button"
                >
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-toggle">{openFAQ === idx ? <FiChevronUp /> : <FiChevronDown />}</span>
                </button>
                {openFAQ === idx && (
                  <div className="faq-answer">
                    <p>{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}