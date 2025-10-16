export default function Dashboard() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "220px" }}>
        <h4 className="text-info mb-4">FactCloud</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Dashboard</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Facturas</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Clientes</a></li>
          <li className="nav-item mb-2"><a href="#" className="nav-link text-white">Inventario</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Reportes</a></li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Panel principal</h3>
          <button className="btn btn-outline-dark">Cerrar sesión</button>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="card p-3">
              <h6>Facturas</h6>
              <h4>0</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3">
              <h6>Clientes</h6>
              <h4>10</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3">
              <h6>Ingresos (COP)</h6>
              <h4>$0</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3">
              <h6>Productos con stock bajo</h6>
              <h4>0</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
