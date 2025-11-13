import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";


function Dashboard() {
  const [clientesCount, setClientesCount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/clientes`)
      .then(res => {
        if (!res.ok) throw new Error("Error al conectar con la API");
        return res.json();
      })
      .then(data => {
        console.log("Datos de clientes:", data);
        setClientesCount(data.length); 
      })
      .catch(err => console.error("Error:", err));
  }, []);
  
  const [productosCount, setProductosCount] = useState(0);
  
  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => {
        if (!res.ok) throw new Error("Error al conectar con la API");
        return res.json();
      }
      )
      .then(data => {
        console.log("Datos de productos:", data);
        setProductosCount(data.length); 
      }
      )
      .catch(err => console.error("Error:", err));
  }
, []);
 
const [facturasCount, setFacturasCount] = useState(0);

useEffect(() => {
  fetch(`${API_URL}/facturas`)
    .then(res => {
      if (!res.ok) throw new Error("Error al conectar con la API");
      return res.json();
    })
    .then(data => {
      console.log("Datos de facturas:", data);
      setFacturasCount(data.length); 
    })
    .catch(err => console.error("Error:", err));
}, []);

  return (
    <div className="dashboard-page">
      <h2 className="mb-4 text-secondary border-bottom pb-2">Resumen General del Sistema</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Facturas registradas</h5>
              <p className="card-text fs-3 fw-bold">{facturasCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-dark bg-warning shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Productos registrados</h5>
              <p className="card-text fs-3 fw-bold">{productosCount} </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm p-3">
            <div className="card-body">
              <h5 className="card-title">Clientes Registrados</h5>
              <p className="card-text fs-3 fw-bold">{clientesCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-light rounded shadow-sm">
        <h4 className="text-info">Bienvenido a FACTCLOUD</h4>
        <p>
          Esta es la versión final del sistema, conectada a la API real.
          Puedes probar las acciones de "Ver Detalle", "Archivar" y "Generar PDF" en las secciones de Clientes, Productos y Facturación.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

