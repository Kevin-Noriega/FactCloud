import React from "react";

function TarjetaPlan({
  plan,
  periodoAnual,
  esActual,
  onSeleccionar,
  calcularPrecio,
}) {
  return (
    <div className={`plan-card ${plan.recomendado ? "destacado" : ""} ${esActual ? "actual" : ""}`}>
      {plan.recomendado && <div className="plan-badge">Recomendado</div>}
      {esActual && <div className="plan-badge-actual">Plan Actual</div>}

      <div className="plan-header" style={{ background: plan.gradiente || plan.color }}>
        <h3 className="plan-nombre">{plan.nombre}</h3>
        <div className="plan-precio">
          <span className="precio-valor">${calcularPrecio(plan).toLocaleString("es-CO")}</span>
          <span className="precio-periodo">/{periodoAnual ? "año" : "mes"}</span>
        </div>
        {periodoAnual && plan.descuentoActivo && (
          <small className="text-white-50">
            Precio mensual: ${plan.precioMensual.toLocaleString("es-CO")}
          </small>
        )}
      </div>

      <div className="plan-body">
        <p className="plan-descripcion">{plan.descripcion}</p>

        <div className="plan-caracteristicas">
          <div className="caracteristica-item">
            <strong>Facturas/mes:</strong>
            <span>
              {plan.facturasMensuales === -1
                ? "Ilimitadas"
                : plan.facturasMensuales}
            </span>
          </div>
          <div className="caracteristica-item">
            <strong>Usuarios:</strong>
            <span>
              {plan.usuariosMax === -1 ? "Ilimitados" : plan.usuariosMax}
            </span>
          </div>

          {plan.caracteristicas && plan.caracteristicas.length > 0 && (
            <ul className="caracteristicas-list">
              {plan.caracteristicas.map((car, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {car}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className={`btn ${esActual ? "btn-secondary" : "btn-primary"} w-100`}
          onClick={() => onSeleccionar(plan)}
          disabled={esActual}
        >
          {esActual ? "Plan Actual" : plan.esUpgrade ? "Actualizar" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}

export default TarjetaPlan;
