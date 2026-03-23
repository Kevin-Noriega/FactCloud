import { useState } from "react";
import "../styles/PlanCard.css";

export default function PlanCard({
  plan,
  onCheckout,
  esActual       = false,
  periodoAnual   = null,
  calcularPrecio = null,
}) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Precio a mostrar: usa calcularPrecio si viene (Tienda), sino precioMensual (Landing)
  const precio    = calcularPrecio ? calcularPrecio(plan) : plan.precioMensual ?? 0;
  const precioFmt = precio.toLocaleString("es-CO");

  const annualFmt        = (plan.precioAnual ?? 0).toLocaleString("es-CO");
  const hasDiscount      = plan.descuentoActivo && plan.descuentoPorcentaje > 0;
  const originalAnualFmt = hasDiscount
    ? Math.round(plan.precioAnual / (1 - plan.descuentoPorcentaje / 100)).toLocaleString("es-CO")
    : null;

  const features = (plan.caracteristicas ?? []).map((item) =>
    typeof item === "object" && item.text ? item : { text: item, tooltip: null }
  );

  // Clase y badge según estado
  const cardClass = [
    "plan-card",
    plan.destacado && !esActual ? "featured" : "",
    esActual ? "es-actual" : "",
  ].filter(Boolean).join(" ");

  const badge = esActual
    ? { cls: "actual",  label: "Tu plan actual" }
    : plan.destacado
    ? { cls: "popular", label: "Más popular" }
    : null;

  // Clase del botón CTA
  const btnClass = [
    "btn-price",
    esActual         ? "es-actual" : "",
    plan.destacado && !esActual ? "featured" : "",
  ].filter(Boolean).join(" ");

  // Etiqueta del período
  const etiquetaPeriodo = periodoAnual === null
    ? "/mes"
    : periodoAnual
    ? "/año"
    : "/mes";

  return (
    <div className={cardClass}>

      {/* Badge */}
      {badge && (
        <div className={`plan-card-badge ${badge.cls}`}>{badge.label}</div>
      )}

      {/* Nombre y descripción */}
      <h3>{plan.nombre}</h3>
      <p className="plan-description">{plan.descripcion}</p>

      {/* Precio */}
      <div className="price-display">
        <div className="price-main">
          <span className="currency">$</span>
          <span className="amount">{precioFmt}</span>
          <span className="period">{etiquetaPeriodo}</span>
        </div>

        {/* Precio anual referencial (solo en Landing) */}
        {periodoAnual === null && plan.precioAnual > 0 && (
          <p className="price-annual">${annualFmt} /año</p>
        )}

        {hasDiscount && (
          <>
            <div className="discount-badge">
              Ahorras {plan.descuentoPorcentaje}%
            </div>
            <p className="price-before">${originalAnualFmt} /año sin descuento</p>
          </>
        )}

        {/* CTA */}
        <button
          className={btnClass}
          onClick={() => !esActual && onCheckout(plan)}
          disabled={esActual}
          type="button"
        >
          {esActual ? "Plan actual" : "Empezar ahora"}
        </button>

        <p className="payment-note">
          {esActual
            ? "Este es tu plan activo actualmente."
            : plan.precioAnual > 0
            ? "Pago anual. Descuento aplicado automáticamente."
            : "Sin tarjeta requerida. Paga por documento."}
        </p>
      </div>

      <hr className="plan-divider" />

      {/* Características */}
      <ul className="price-features">
        {features.map((feature, idx) => (
          <li key={idx} className="feature-item-tooltip">
            <div className="feature-content">
              <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              <span>{feature.text}</span>
              {feature.tooltip && (
                <button
                  className={`info-icon-btn ${activeTooltip === idx ? "active" : ""}`}
                  onMouseEnter={() => setActiveTooltip(idx)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  type="button"
                  aria-label="Más información"
                >
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                  </svg>
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
    </div>
  );
}