import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

/**
 * PageHeader reutilizable para todas las vistas de reportes y detalle.
 *
 * @param {string}   title       - Titulo de la pagina
 * @param {string}   backTo      - Ruta para el boton de regreso (opcional)
 * @param {boolean}  isFav       - Si esta marcado como favorito
 * @param {function} onToggleFav - Callback al hacer click en la estrella
 * @param {string}   subtitle    - Subtitulo opcional
 * @param {React.ReactNode} actions - Botones extra a la derecha (opcional)
 */
export default function PageHeader({
  title,
  backTo,
  isFav,
  onToggleFav,
  subtitle,
  actions,
}) {
  return (
    <div className="rpt-detail-header">
      {backTo && (
        <Link to={backTo} className="rpt-back-btn">
          <FiArrowLeft />
        </Link>
      )}

      <div style={{ flex: 1 }}>
        <h2 className="rpt-detail-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {title}
          {onToggleFav && (
            <button
              className={`rpt-detail-fav ${isFav ? "active" : ""}`}
              onClick={onToggleFav}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              {isFav ? <FaStar /> : <FaRegStar />}
            </button>
          )}
        </h2>
        {subtitle && (
          <p style={{ margin: 0, color: "#6b7a99", fontSize: "0.85rem" }}>{subtitle}</p>
        )}
      </div>

      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}
