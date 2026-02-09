import { ExclamationTriangleFill, XCircle } from "react-bootstrap-icons";
import "../../styles/ModalPerfilDesactivar.css";

function ModalPerfilDesactivar({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-desactivar" onClick={onClose}>
      <div className="modal-container-desactivar" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content-desactivar">
          <button
            className="modal-close-desactivar"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <XCircle size={24} />
          </button>

          <div className="modal-icon-desactivar">
            <ExclamationTriangleFill size={48} />
          </div>

          <h2 className="modal-title-desactivar">¿Desactivar tu cuenta?</h2>
          
          <p className="modal-description-desactivar">
            Tu cuenta será desactivada inmediatamente y tendrás 30 días para reactivarla antes de que sea eliminada permanentemente.
          </p>

          <div className="warning-card-desactivar">
            <h4 className="warning-card-title-desactivar">
              <ExclamationTriangleFill size={20} className="me-2" />
              Consecuencias de la desactivación
            </h4>
            <ul className="warning-list-desactivar">
              <li>No podrás acceder a tu cuenta ni a tus datos</li>
              <li>Todas tus facturas y registros quedarán inaccesibles</li>
              <li>Tienes exactamente 30 días para reactivar tu cuenta</li>
              <li>Después de 30 días, todos tus datos serán eliminados permanentemente</li>
            </ul>
          </div>

          <div className="info-card-desactivar">
            <p className="mb-0">
              <strong>Nota:</strong> Puedes reactivar tu cuenta en cualquier momento durante los próximos 30 días simplemente volviendo a iniciar sesión.
            </p>
          </div>

          <div className="modal-actions-desactivar">
            <button 
              className="btn-cancel-desactivar" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              className="btn-danger-desactivar" 
              onClick={onConfirm}
            >
              Sí, desactivar mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPerfilDesactivar;
