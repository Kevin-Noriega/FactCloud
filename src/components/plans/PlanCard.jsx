import PlanBadges from "./PlanBadges";
import PlanPrice from "./PlanPrice";
import PlanFeatures from "./PlanFeatures";
import PlanAdminActions from "./PlanAdminActions";
import "../../styles/PlanCard.css";

export default function PlanCard({
  plan,
  onCheckout,
  esActual  = false,
  periodoAnual = null,
  adminMode = false,
  onEditar,
  onEliminar,
  onToggle,
}) {
  const cardClass = [
    "plan-card",
    plan.destacado && !esActual ? "featured"  : "",
    esActual                    ? "es-actual" : "",
    adminMode && !plan.activo   ? "inactivo"  : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClass}>
      <PlanBadges esActual={esActual} destacado={plan.destacado} activo={plan.activo} />

      <h3>{plan.nombre}</h3>
      <p className="plan-description">{plan.descripcion}</p>

      {adminMode ? (
        <div className="price-display">
          <div className="price-main">
            <span className="currency">$</span>
            <span className="amount">{plan.precioMensual.toLocaleString("es-CO")}</span>
            <span className="period">/mes</span>
          </div>
          <p className="price-annual">${plan.precioAnual.toLocaleString("es-CO")} /año</p>
          {plan.descuentoActivo && plan.descuentoPorcentaje > 0 && (
            <div className="discount-badge">Descuento {plan.descuentoPorcentaje}%</div>
          )}
        </div>
      ) : (
        <PlanPrice
          plan={plan}
          periodoAnual={periodoAnual}
          esActual={esActual}
          onCheckout={onCheckout}
        />
      )}

      <hr className="plan-divider" />
      <PlanFeatures caracteristicas={plan.caracteristicas} />

      {adminMode && (
        <PlanAdminActions
          plan={plan}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
