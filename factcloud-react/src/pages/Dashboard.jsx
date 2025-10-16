import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <h2 className="mb-4 text-secondary border-bottom pb-2">Resumen General del Sistema</h2>
      
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Facturas Pendientes</h5>
              <p className="card-text fs-3 fw-bold">1</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-dark bg-warning shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Productos con Bajo Stock</h5>
              <p className="card-text fs-3 fw-bold">1</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Clientes Registrados</h5>
              <p className="card-text fs-3 fw-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-light rounded shadow-sm">
        <h4 className="text-info">Bienvenido a FACTCLOUD</h4>
        <p>Esta es la versión final del sistema, con todas las funcionalidades requeridas implementadas y simuladas usando el Custom Hook. Puedes probar las acciones de "Ver Detalle", "Archivar" y "Generar PDF" en las secciones de Clientes, Productos y Facturación.</p>
      </div>
    </div>
  );
}

export default Dashboard;
