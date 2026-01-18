import { useState } from "react";
import "../styles/PlanCard.css"

export default function PlanCard({ plan, onCheckout }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className={`plan-card ${plan.featured ? "featured" : ""}`}>
      {plan.tag && <div className="popular-tag">{plan.tag}</div>}

      <h3>{plan.name}</h3>
      <p className="plan-description">{plan.description}</p>

      <div className="price-display">
        <div className="price-main">
          <span className="currency">$</span>
          <span className="amount">{plan.monthlyPrice}</span>
          <span className="period">{plan.period || "/mes"}</span>
        </div>

        <div className="price-annual">
          {plan.annualText || `${plan.annualPrice.toLocaleString("es-CO")} /año`}
        </div>

        {plan.discount && (
          <>
            <div className="discount-badge">{plan.discount}</div>
            <div className="price-before">{plan.originalPrice}</div>
          </>
        )}
        <button
        className={`btn-price ${plan.featured ? "featured" : ""}`}
        onClick={() => onCheckout(plan.name, plan.annualPrice)}
      >
        {plan.buttonText || "Empezar ahora"}
      </button>
      </div>

      <p className="payment-note">
        {plan.annualPrice > 0 
          ? "El pago es anual. Descuento aplicado automáticamente."
          : "Sin tarjeta requerida. Paga por documento emitido."}
      </p>

      <ul className="price-features">
        {plan.features.map((feature, index) => (
          <li key={index} className="feature-item-tooltip">
            <div className="feature-content">
              <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              <span>{feature.text}</span>

              {feature.tooltip && (
                <button
                  className={`info-icon-btn ${activeTooltip === index ? "active" : ""}`}
                  onMouseEnter={() => setActiveTooltip(index)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                  </svg>
                </button>
              )}
            </div>

            {activeTooltip === index && feature.tooltip && (
              <div className="tooltip-popup">
                <div className="tooltip-arrow"></div>
                <p>{feature.tooltip}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
