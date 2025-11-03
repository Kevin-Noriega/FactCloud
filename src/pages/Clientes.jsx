import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5119/api/Clientes";

  // 🔹 Obtener los clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los clientes");
        const data = await response.json();
        console.log("📦 Clientes obtenidos:", data);
        setClientes(data);
      } catch (error) {
        console.error("❌ Error al cargar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // 🔹 Acción temporal para los botones
  const handleAction = (id, action) => {
    console.log(`Acción: ${action} → Cliente ID: ${id}`);
    if (action === "Detalle") navigate(`/clientes/${id}`);
    if (action === "Editar") navigate(`/editar-cliente/${id}`);
    if (action === "Eliminar") {
      if (window.confirm("¿Deseas eliminar este cliente?")) {
        // Aquí podrías hacer un fetch DELETE a la API
        console.log("Cliente eliminado:", id);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Cargando Clientes...</p>
      </div>
    );
  }

  return (
    <div className="clientes-page">
      <h2 className="mb-4 text-primary border-bottom pb-2">Gestión de Clientes</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-primary shadow-sm"
          onClick={() => navigate("/registrar-cliente")}
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>N° Documento</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.numeroDocumento}>
                    <td>{cliente.numeroDocumento}</td>
                    <td className="fw-medium">{cliente.nombreCliente}</td>
                    <td>{cliente.correoCliente}</td>
                    <td>{cliente.telefonoCliente}</td>
                    <td>{cliente.ciudadCliente}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleAction(cliente.idCliente, "Detalle")}
                      >
                        Ver Detalle
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2 text-white"
                        onClick={() => handleAction(cliente.idCliente, "Editar")}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleAction(cliente.idCliente, "Eliminar")}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Clientes;
