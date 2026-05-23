export default function PlanBadges({ esActual, destacado, activo }) {
  if (esActual)   return <div className="plan-card-badge actual">Tu plan actual</div>;
  if (!activo)    return <div className="plan-card-badge inactivo">Inactivo</div>;
  if (destacado)  return <div className="plan-card-badge popular">Más popular</div>;
  return null;
}
