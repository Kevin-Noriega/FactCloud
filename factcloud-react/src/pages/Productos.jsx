import React from 'react';
import useData from '../hooks/useData'

function Productos() {
  const { records: productos, loading, handleAction } = useData('productos');
  const recordType = 'Producto';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div><p>Cargando Productos...</p></div>;
  }

  // Se filtran los productos activos e archivados para mostrarlos por separado
  const productosActivos = productos.filter(p => p.activo);
  const productosArchivados = productos.filter(p => !p.activo);

  // Función para renderizar la tabla, recibe la lista y si es el grupo de archivados
  const renderTable = (list, isArchived = false) => (
    <div className="table-responsive">
      <table className="table table-hover table-striped mb-0">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio Unitario</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map((producto) => (
            <tr key={producto.id} className={isArchived ? 'table-warning' : ''}>
              <td>{producto.id}</td>
              <td className="fw-medium">{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{producto.stock} uds</td>
              <td className="fw-bold text-success">{formatCurrency(producto.precio)}</td>
              <td className="text-center">
                <button 
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => handleAction(producto.id, 'Detalle', recordType)}
                >
                  Ver Detalle
                </button>
                {isArchived ? (
                  // Botón para Desarchivar (cuando el producto está inactivo)
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleAction(producto.id, 'Desarchivar', recordType)}
                  >
                    Desarchivar
                  </button>
                ) : (
                  // Botón para Archivar (cuando el producto está activo)
                  <button 
                    className="btn btn-sm btn-warning text-dark"
                    onClick={() => handleAction(producto.id, 'Archivar', recordType)}
                  >
                    Archivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="productos-page">
      <h2 className="mb-4 text-success border-bottom pb-2">Inventario de Productos</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-success shadow-sm"
          onClick={() => handleAction('NUEVO', 'Registrar', recordType)}
        >
          Nuevo Producto
        </button>
      </div>

      {/* Productos Activos */}
      <h4 className="mt-4 mb-3 text-success">Productos Activos ({productosActivos.length})</h4>
      <div className="card shadow-sm mb-5">
        <div className="card-body p-0">
          {productosActivos.length > 0 ? renderTable(productosActivos, false) : <p className="p-3 text-muted mb-0">No hay productos activos.</p>}
        </div>
      </div>

      {/* Productos Archivados */}
      <h4 className="mt-4 mb-3 text-secondary">Productos Archivados ({productosArchivados.length})</h4>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {productosArchivados.length > 0 ? renderTable(productosArchivados, true) : <p className="p-3 text-muted mb-0">No hay productos archivados.</p>}
        </div>
      </div>
    </div>
  );
}

export default Productos;
