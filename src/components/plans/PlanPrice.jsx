export default function PlanPrice({ plan, periodoAnual, esActual, onCheckout }) {
  // periodoAnual === null  → landing: siempre muestra precio mensual + referencia anual debajo
  // periodoAnual === true  → muestra precio anual con etiqueta /año
  // periodoAnual === false → muestra precio mensual con etiqueta /mes
  const precio      = periodoAnual === true ? plan.precioAnual : plan.precioMensual;
  const precioFmt   = precio.toLocaleString("es-CO");
  const annualFmt   = plan.precioAnual.toLocaleString("es-CO");
  const hasDiscount = plan.descuentoActivo && plan.descuentoPorcentaje > 0;
  const originalAnualFmt = hasDiscount
    ? Math.round(plan.precioAnual / (1 - plan.descuentoPorcentaje / 100)).toLocaleString("es-CO")
    : null;

  const etiquetaPeriodo = periodoAnual === true ? "/año" : "/mes";

  const btnClass = [
    "btn-price",
    esActual               ? "es-actual" : "",
    plan.destacado && !esActual ? "featured"  : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="price-display">
      <div className="price-main">
        <span className="currency">$</span>
        <span className="amount">{precioFmt}</span>
        <span className="period">{etiquetaPeriodo}</span>
      </div>

      {periodoAnual == null && plan.precioAnual > 0 && (
        <p className="price-annual">${annualFmt} /año</p>
      )}

      {hasDiscount && (
        <>
          <div className="discount-badge">Ahorras {plan.descuentoPorcentaje}%</div>
          <p className="price-before">${originalAnualFmt} /año sin descuento</p>
        </>
      )}

      <button
        className={btnClass}
        onClick={() => !esActual && onCheckout?.(plan)}
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
  );
}
