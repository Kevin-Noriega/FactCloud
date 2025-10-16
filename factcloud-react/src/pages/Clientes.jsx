import React from 'react';
import useData from '../hooks/useData'; 

function Clientes() {
  const { records: clientes, loading, handleAction } = useData('clientes'); 
  const recordType = 'Cliente';

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div><p>Cargando Clientes...</p></div>;
  }

  return (
    <div className="clientes-page">
      <h2 className="mb-4 text-primary border-bottom pb-2">Gestión de Clientes</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-primary shadow-sm"
          onClick={() => handleAction('NUEVO', 'Agregar', recordType)}
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td className="fw-medium">{cliente.nombre}</td>
                    <td>{cliente.correo}</td>
                    <td>{cliente.telefono}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleAction(cliente.id, 'Detalle', recordType)}
                      >
                        Ver Detalle
                      </button>
                      <button 
                        className="btn btn-sm btn-info me-2 text-white"
                        onClick={() => handleAction(cliente.id, 'Editar', recordType)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleAction(cliente.id, 'Eliminar', recordType)}
                      >
                        Eliminar
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

export default Clientes;
