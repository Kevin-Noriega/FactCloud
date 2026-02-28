import { useEffect } from "react";
import "../../styles/Registro/ModalVerDetalles.css";

export const ModalDetalles = ({ isOpen, onClose, plan }) => {  
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';  
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;  

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
    >
      <div 
        className="modal-detalles" 
        onClick={(e) => e.stopPropagation()}  
      >
        <div className="modal-header">
          <h3>Detalle Plan {plan?.name}</h3>
          <button 
            className="btn-close btn-close-crear" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="plan-features">
           <ul className="price-features">
        {plan.features.map((feature, index) => (
          <li key={index} className="feature-item-tooltip">
            <div className="feature-content">
              <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
              <span>{feature.text}</span>
            </div>

          </li>
        ))}
      </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
