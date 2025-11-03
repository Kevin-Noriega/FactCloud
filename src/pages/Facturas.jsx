import React from 'react';
import useData from '../hooks/useData'; 

function Facturas() {
  const { records: facturas, loading, handleAction } = useData('facturas'); 
  const recordType = 'Factura';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-info" role="status"></div><p>Cargando Facturas...</p></div>;
  }

  return (
    <div className="facturas-page">
      <h2 className="mb-4 text-info border-bottom pb-2">Resumen de Facturación</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-info shadow-sm text-white"
          onClick={() => handleAction('NUEVA', 'Generar', recordType)}
        >
          Nueva Factura
        </button>
      </div>

      <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th className="text-end">Total</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.id}</td>
                    <td className="fw-medium">{factura.cliente}</td>
                    <td>{factura.fecha}</td>
                    <td className="fw-bold text-end">{formatCurrency(factura.total)}</td>
                    <td className="text-center">
                      <span className={`badge ${factura.estado === 'Pagada' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {factura.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleAction(factura.id, 'Detalle', recordType)}
                      >
                        Ver Detalle
                      </button>
                      <button 
                        className="btn btn-sm btn-link"
                        onClick={() => handleAction(factura.id, 'Ver PDF', recordType)}
                      >
                        Generar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}

export default Facturas;
