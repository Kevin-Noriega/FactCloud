import { useState } from "react";

const CheckIcon = () => (
  <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
  </svg>
);

export default function PlanFeatures({ caracteristicas }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <ul className="price-features">
      {caracteristicas.map((feature, idx) => (
        <li key={idx} className="feature-item-tooltip">
          <div className="feature-content">
            <CheckIcon />
            <span>{feature.texto}</span>
            {feature.tooltip && (
              <button
                className={`info-icon-btn ${activeTooltip === idx ? "active" : ""}`}
                onMouseEnter={() => setActiveTooltip(idx)}
                onMouseLeave={() => setActiveTooltip(null)}
                type="button"
                aria-label="Más información"
              >
                <InfoIcon />
              </button>
            )}
          </div>
          {activeTooltip === idx && feature.tooltip && (
            <div className="tooltip-popup">
              <div className="tooltip-arrow" />
              <p style={{ margin: 0 }}>{feature.tooltip}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
