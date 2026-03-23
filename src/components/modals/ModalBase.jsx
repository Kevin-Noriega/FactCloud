// src/components/common/ModalBase.jsx
import React from "react";

/**
 * Shell reutilizable para cualquier modal.
 *
 * Props:
 *  - open       {boolean}    Controla visibilidad
 *  - onClose    {function}   Se llama al cerrar (X o click fuera)
 *  - title      {string}     Texto del header
 *  - children   {ReactNode}  Contenido del body
 *  - size       {string}     Clase extra de tamaño (opcional, ej: "modal-lg")
 *  - closeOnOverlay {boolean} Default true — cerrar al click en overlay
 */
function ModalBase({
  open,
  onClose,
  title,
  children,
  size = "",
  closeOnOverlay = true,
}) {
  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay) onClose();
  };

  return (
    <div className="modal-crearNuevo-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal-crearNuevo-content ${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-crearNuevo-header">
          <h5>{title}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>

        {/* Body */}
        <div className="modal-crearNuevo-body">{children}</div>
      </div>
    </div>
  );
}

export default ModalBase;
