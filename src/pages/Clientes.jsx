import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { obtenerSiglas } from "../utils/Helpers";
import ModalCliente from "../components/ModalCrearCliente"; 
import {People} from 'react-bootstrap-icons';
import "../styles/sharedPage.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [buscador, setBuscador] = useState("");
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteVer, setClienteVer] = useState(null);
  const [filtro, setFiltro] = useState("recientes");

  const filtrados = clientes
    .filter((cli) => {
      const query = buscador.trim().toLowerCase();
      return (
        !query ||
        cli.nombre?.toLowerCase().includes(query) ||
        cli.numeroIdentificacion?.toLowerCase().includes(query)

      );
    })
    .sort((a, b) => {
      switch (filtro) {
        case "recientes":
          return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
        case "antiguos":
          return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
        default:
          return 0;
      }
    });

  async function fetchClientes() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/Clientes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const datos = await res.json();
      setClientes(datos);
      setError(null);
    } catch (error) {
      setError(error.message || "Error desconocido al cargar clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const abrirModalNuevo = () => {
    setClienteEditando(null);
    setMostrarFormulario(true);
  };

  const editarCliente = (cli) => {
    setClienteEditando(cli);
    setMostrarFormulario(true);
  };

  const handleClienteGuardado = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchClientes();
  };

  const eliminarCliente = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(`${API_URL}/Clientes/desactivar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!respuesta.ok) throw new Error("Error al eliminar cliente");

      setMensajeExito("Cliente eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);
      fetchClientes();
    } catch {
      alert("Error al eliminar cliente");
    }
    setClienteAEliminar(null);
  };

  if (loading)
    return (
     <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container-error mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar clientes</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchClientes}>
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="container-fluid mt-4 px-4">
            <div className="header-card">
                      <div className="header-content">
                        <div className="header-text">
                         <h2 className="header-title mb-4">Gestión de Clientes</h2>
                          <p className="header-subtitle">
                           Administra, actualiza y mantén organizada la información de tus clientes.
                          </p>
            
                        </div>
                        <div className="header-icon">
                          <People size={80} />
                        </div>
                      </div>
                    </div>
      
      {mensajeExito && (
        <div className="alert alert-success d-flex justify-content-between align-items-center" role="alert">
          <span>{mensajeExito}</span>
          <button
            className="btn-close"
            onClick={() => setMensajeExito("")}
          />
        </div>
      )}

      {clienteVer && (
        <div className="modal-overlay" onClick={() => setClienteVer(null)}>
          <div className="modal-ver" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close position-absolute top-0 end-0 mt-2 me-2"
              onClick={() => setClienteVer(null)}
            />
            <h5 className="mb-3">Información del Cliente</h5>
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th>Nombre</th>
                  <td>{clienteVer.nombre} {clienteVer.apellido}</td>
                </tr>
                <tr>
                  <th>Identificación</th>
                  <td>
                    {obtenerSiglas(clienteVer.tipoIdentificacion)} - {clienteVer.numeroIdentificacion}
                  </td>
                </tr>
                <tr>
                  <th>Correo</th>
                  <td>{clienteVer.correo}</td>
                </tr>
                <tr>
                  <th>Teléfono</th>
                  <td>{clienteVer.telefono}</td>
                </tr>
                <tr>
                  <th>Departamento</th>
                  <td>{clienteVer.departamento}</td>
                </tr>
                <tr>
                  <th>Ciudad</th>
                  <td>{clienteVer.ciudad}</td>
                </tr>
                <tr>
                  <th>Dirección</th>
                  <td>{clienteVer.direccion}</td>
                </tr>
                <tr>
                  <th>Código Postal</th>
                  <td>{clienteVer.codigoPostal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="opcions-header">
        <button className="btn-crear" onClick={abrirModalNuevo}>
          Nuevo Cliente
        </button>
        <div className="filters">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o ID"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ width: "148px" }}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>
      </div>

      {clienteAEliminar && (
        <div className="modal-overlay">
          <div className="modal-eliminar">
            <h5 className="mb-3">¿Está seguro de eliminar este cliente?</h5>
            <div className="modal-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setClienteAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => eliminarCliente(clienteAEliminar)}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card mt-3">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">No hay clientes registrados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Identificación</th>
                    <th>Tipo</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((cli) => (
                    <tr key={cli.id}>
                      <td>{cli.id}</td>
                      <td>{cli.nombre} {cli.apellido}</td>
                      <td>{cli.numeroIdentificacion}</td>
                      <td>{cli.tipoIdentificacion}</td>
                      <td>{cli.correo}</td>
                      <td>{cli.telefono || "N/A"}</td>
                      <td>
                        <div className="btn-group-acciones">
                        <button
                          className="btn btn-ver btn-sm"
                          onClick={() => setClienteVer(cli)}
                        >
                          Ver
                        </button>
                        <button
                          className="btn btn-editar btn-sm"
                          onClick={() => editarCliente(cli)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-eliminar btn-sm "
                          onClick={() => setClienteAEliminar(cli.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModalCliente
        open={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setClienteEditando(null);
        }}
        clienteEditando={clienteEditando}
        onSuccess={handleClienteGuardado}
      />
    </div>
  );
}

export default Clientes;
