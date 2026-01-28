import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import ModalProducto from "../components/ModalProductos";
import "../styles/Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoVer, setProductoVer] = useState(null);
  const [buscador, setBuscador] = useState("");
  const [filtro, setFiltro] = useState("recientes");

  const filtrados = productos
    .filter((prod) => {
      const query = buscador.trim().toLowerCase();
      return (
        !query ||
        prod.nombre?.toLowerCase().includes(query) ||
        prod.codigoBarras?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (filtro) {
        case "recientes":
          return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
        case "antiguos":
          return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
        case "caros":
          return b.precioUnitario - a.precioUnitario;
        case "baratos":
          return a.precioUnitario - b.precioUnitario;
        default:
          return 0;
      }
    });

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Productos`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setProductos(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleNuevoProducto = () => {
    setProductoEditando(null);
    setMostrarModal(true);
  };

  const handleEditarProducto = (prod) => {
    setProductoEditando(prod);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  const handleGuardadoExitoso = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchProductos();
    handleCerrarModal();
  };

  const eliminarProducto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Productos/desactivar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: false }),
      });

      if (!response.ok) {
        const errorTxt = await response.text();
        throw new Error(errorTxt);
      }

      setMensajeExito("Producto eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto: " + error.message);
    }
    setProductoAEliminar(null);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar productos</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchProductos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="text-success mb-4">Inventario de Productos</h2>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <span>{mensajeExito}</span>
          <button
            className="btn-close"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      <div className="productos-header">
        <button className="btn btn-success" onClick={handleNuevoProducto}>
          Nuevo Producto
        </button>
        <div className="productos-filters">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o código de barras…"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
          />
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="caros">Más caros</option>
            <option value="baratos">Más baratos</option>
          </select>
        </div>
      </div>

      {productoVer && (
        <div className="modal-overlay" onClick={() => setProductoVer(null)}>
          <div className="modal-ver-producto" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close position-absolute top-0 end-0 mt-2 me-2"
              onClick={() => setProductoVer(null)}
            />
            <h5 className="mb-3">Información del Producto</h5>
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th>Nombre</th>
                  <td>{productoVer.nombre}</td>
                </tr>
                <tr>
                  <th>Descripción</th>
                  <td>{productoVer.descripcion}</td>
                </tr>
                <tr>
                  <th>Precio</th>
                  <td>$ {productoVer.precioUnitario.toLocaleString("es-CO")}</td>
                </tr>
                <tr>
                  <th>Categoría</th>
                  <td>{productoVer.categoria}</td>
                </tr>
                <tr>
                  <th>Código de barras</th>
                  <td>{productoVer.codigoBarras}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {productoAEliminar && (
        <div className="modal-overlay">
          <div className="modal-eliminar">
            <h5 className="mb-3">¿Está seguro de eliminar este producto?</h5>
            <div className="modal-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setProductoAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => eliminarProducto(productoAEliminar)}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModal && (
        <ModalProducto
          productoEditando={productoEditando}
          onClose={handleCerrarModal}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      )}

      <div className="card mt-3">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">No hay productos registrados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio Unitario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.id}</td>
                      <td>{prod.nombre}</td>
                      <td>{prod.categoria || "Sin categoría"}</td>
                      <td>{prod.cantidadDisponible}</td>
                      <td>${prod.precioUnitario.toLocaleString("es-CO")}</td>
                      <td>
                        <div className="btn-group-acciones">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setProductoVer(prod)}
                          >
                            Ver
                          </button>
                          <button
                            className="btn btn-sm btn-info text-white"
                            onClick={() => handleEditarProducto(prod)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setProductoAEliminar(prod.id)}
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
    </div>
  );
}

export default Productos;
