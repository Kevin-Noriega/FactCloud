// components/tienda/TarjetaAddon.jsx
export default function TarjetaAddon({ addon, seleccionado, onToggle }) {
  const yaContratado = addon.contratado;
  const activo       = seleccionado && !yaContratado;

  const colorMap = {
    "#1a73e8": { bg: "#e8f0fe", text: "#1a73e8" },
    "#0f6e56": { bg: "#e6f4f0", text: "#0f6e56" },
    "#7c3aed": { bg: "#f3f0fe", text: "#7c3aed" },
    "#b45309": { bg: "#fef9ec", text: "#b45309" },
  };
  const colores = colorMap[addon.color] ?? { bg: "#f3f4f6", text: "#374151" };

  return (
    <div
      className={`addon-card ${activo ? "selected" : ""} ${yaContratado ? "contratado" : ""}`}
      onClick={() => !yaContratado && onToggle(addon.id)}
      role="checkbox"
      aria-checked={activo}
      aria-disabled={yaContratado}
      tabIndex={yaContratado ? -1 : 0}
      onKeyDown={(e) => !yaContratado && e.key === " " && onToggle(addon.id)}
      style={{ cursor: yaContratado ? "default" : "pointer" }}
    >
      {/* Checkbox / check contratado */}
      <div className={`addon-card-check ${yaContratado ? "contratado" : ""}`}>
        {(activo || yaContratado) && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Badge tipo */}
      <div style={{
        display:       "inline-flex",
        alignItems:    "center",
        background:    colores.bg,
        color:         colores.text,
        fontSize:      "0.62rem",
        fontWeight:    700,
        padding:       "2px 8px",
        borderRadius:  "999px",
        marginBottom:  "6px",
        width:         "fit-content",
      }}>
        {addon.tipo}
      </div>

      <p className="addon-card-nombre">{addon.nombre}</p>

      {addon.descripcion && (
        <p className="addon-card-desc">{addon.descripcion}</p>
      )}

      <p className="addon-card-precio">
        ${(addon.precio ?? 0).toLocaleString("es-CO")}
        {addon.unidad && (
          <span className="addon-card-unidad"> / {addon.unidad}</span>
        )}
      </p>

      {yaContratado && (
        <span style={{
          fontSize:     "0.68rem",
          fontWeight:   600,
          color:        "#0f6e56",
          background:   "#e6f4f0",
          padding:      "2px 8px",
          borderRadius: "999px",
          marginTop:    "4px",
          width:        "fit-content",
        }}>
          ✓ Ya contratado
        </span>
      )}
    </div>
  );
}