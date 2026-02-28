import React, { useState } from "react";
import faqsHome from "../../utils/FAQS"

export const Faq = () => {

  const [openFAQ, setOpenFAQ] = useState(null);
    const faqs = faqsHome.filter(faq => faq.seccion === 'home')
  return (
    <div className="faq-section">
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
    </div>
  );
};
