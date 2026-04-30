import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const DetalleFactura = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
      >
        <FiArrowLeft /> Volver
      </button>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Detalle de Factura #{id}</h2>
          <p className="text-muted">Información detallada de la transacción en NUBEE S.A.S</p>
          <hr />
          <div className="alert alert-info">
            Vista en desarrollo. Aquí se mostrarán los ítems, impuestos y totales de la factura.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleFactura;
