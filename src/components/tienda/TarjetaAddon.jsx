import React from "react";

function TarjetaAddon({ addon, seleccionado, onToggle }) {
  return (
    <div
      className={`addon-card ${seleccionado ? "selected" : ""}`}
      onClick={() => onToggle(addon.id)}
    >
      <div className="addon-header" style={{ borderLeftColor: addon.color }}>
        <h5 className="addon-nombre">{addon.nombre}</h5>
        {seleccionado && <span className="addon-check">✓</span>}
      </div>

      <div className="addon-body">
        <p className="addon-descripcion">{addon.descripcion}</p>

        <div className="addon-precio">
          <span className="precio-valor">
            ${addon.precio.toLocaleString("es-CO")}
          </span>
          <span className="precio-unidad">/{addon.unidad}</span>
        </div>

        <div className="addon-tipo">
          <span className="badge bg-secondary">{addon.tipo}</span>
        </div>
      </div>
    </div>
  );
}

export default TarjetaAddon;
