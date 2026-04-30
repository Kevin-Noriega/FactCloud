import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * FilterPanel reutilizable — muestra/oculta filtros con animacion.
 *
 * @param {boolean}  visible    - Si los filtros estan visibles
 * @param {function} onToggle   - Callback para alternar visibilidad
 * @param {function} onSearch   - Callback al hacer click en "Buscar"
 * @param {function} onClear    - Callback al hacer click en "Limpiar filtros"
 * @param {React.ReactNode} children - Contenido de los filtros (inputs, selects, etc)
 */
export default function FilterPanel({
  visible = true,
  onToggle,
  onSearch,
  onClear,
  children,
}) {
  return (
    <>
      <button
        className={`rpt-filters-toggle ${visible ? "open" : ""}`}
        onClick={onToggle}
      >
        <FiChevronDown />
        {visible ? "Ocultar criterios de busqueda" : "Mostrar criterios de busqueda"}
      </button>

      {visible && (
        <div className="rpt-filters">
          <div className="rpt-filters-grid">
            {children}
          </div>
          <div className="rpt-filters-actions">
            <button className="rpt-btn-search" onClick={onSearch}>Buscar</button>
            <button className="rpt-btn-clear" onClick={onClear}>Limpiar filtros</button>
          </div>
        </div>
      )}
    </>
  );
}
