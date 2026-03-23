// components/tienda/TarjetaPlan.jsx
import { useState } from "react";

export default function TarjetaPlan({
  plan,
  periodoAnual,
  esActual,
  onSeleccionar,
  calcularPrecio,
}) {
  const [tooltipActivo, setTooltipActivo] = useState(null);

  const precio         = calcularPrecio(plan);
  const precioFmt      = (precio ?? 0).toLocaleString("es-CO");
  const precioAnualFmt = (plan.precioAnual ?? 0).toLocaleString("es-CO");

  const hasDiscount      = plan.descuentoActivo && plan.descuentoPorcentaje > 0;
  const precioOriginalFmt = hasDiscount
    ? Math.round(plan.precioAnual / (1 - plan.descuentoPorcentaje / 100)).toLocaleString("es-CO")
    : null;

  const features = (plan.caracteristicas ?? []).map((item) =>
    typeof item === "object" && item.text ? item : { text: item, tooltip: null }
  );

  const badge = esActual ? "actual" : plan.destacado ? "popular" : null;

  return (
    <div className={`plan-card ${plan.destacado ? "featured" : ""} ${esActual ? "es-actual" : ""}`}>

      {/* Badge */}
      {badge && (
        <div className={`plan-card-badge ${badge}`}>
          {badge === "actual" ? "Tu plan actual" : "Más popular"}
        </div>
      )}

      {/* Nombre y descripción */}
      <p className="plan-card-nombre">{plan.nombre}</p>
      <p className="plan-card-desc">{plan.descripcion}</p>

      {/* Precio */}
      <div className="plan-precio-principal">
        <span className="plan-precio-currency">$</span>
        <span className="plan-precio-amount">{precioFmt}</span>
        <span className="plan-precio-period">/{periodoAnual ? "año" : "mes"}</span>
      </div>

      {periodoAnual && (
        <div className="plan-precio-anual">${precioAnualFmt} facturado anualmente</div>
      )}

      {hasDiscount && periodoAnual && (
        <>
          <span className="plan-descuento-badge">Ahorras {plan.descuentoPorcentaje}%</span>
          <div className="plan-precio-tachado">${precioOriginalFmt} /año sin descuento</div>
        </>
      )}

      {/* Botón */}
      <button
        className={`plan-card-btn ${
          esActual ? "actual" : plan.destacado ? "primary" : "secondary"
        }`}
        onClick={() => !esActual && onSeleccionar(plan)}
        disabled={esActual}
      >
        {esActual ? "Plan actual" : "Seleccionar plan"}
      </button>

      <hr className="plan-divider" />

      {/* Características */}
      <ul className="plan-features">
        {features.map((feature, idx) => (
          <li key={idx} className="plan-feature-item">
            <svg className="plan-feature-icon" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span style={{ flex: 1 }}>{feature.text}</span>
            {feature.tooltip && (
              <span
                style={{ cursor: "help", color: "#9ca3af", fontSize: "0.7rem" }}
                onMouseEnter={() => setTooltipActivo(idx)}
                onMouseLeave={() => setTooltipActivo(null)}
              >
                ⓘ
                {tooltipActivo === idx && (
                  <span style={{
                    position: "absolute", left: "1rem", right: "1rem",
                    background: "#1a1a2e", color: "#fff", borderRadius: "6px",
                    padding: "6px 10px", fontSize: "0.72rem", zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}>
                    {feature.tooltip}
                  </span>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}