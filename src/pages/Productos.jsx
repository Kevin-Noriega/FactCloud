import { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import ModalProducto from "../components/dashboard/ModalCrearProducto";
import "../styles/sharedPage.css";
import { BoxSeam } from "react-bootstrap-icons";
import axiosClient from "../api/axiosClient";

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
      const response = await axiosClient.get("/Productos");
      setProductos(response.data);
      setError(null);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar productos";
      console.error("Error al cargar productos:", error);
      setError(mensaje);
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
      await axiosClient.put(`/Productos/desactivar/${id}`, { estado: false });
      setMensajeExito("Producto eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar producto";
      alert("Error al eliminar producto: " + mensaje);
    } finally {
      setProductoAEliminar(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-error mt-5">
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
      <div className="header-card">
        <div className="header-content">
          <div className="header-text">
            <h2 className="header-title mb-4">Inventario de Productos</h2>
            <p className="header-subtitle">
              Gestiona, actualiza y controla tu inventario.
            </p>
          </div>
          <div className="header-icon">
            <BoxSeam size={80} />
          </div>
        </div>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <span>{mensajeExito}</span>
          <button
            className="btn-close"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      <div className="opcions-header">
        <button className="btn-crear" onClick={handleNuevoProducto}>
          Nuevo Producto
        </button>
        <div className="filters">
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
          <div className="modal-ver" onClick={(e) => e.stopPropagation()}>
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
                  <td className="fw-bold text-success">
                    $ {productoVer.precioUnitario.toLocaleString("es-CO")}
                  </td>
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
            <div className="alert alert-info">
              No hay productos registrados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-header">
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
                      <td className="text-end fw-bold text-success">
                        ${prod.precioUnitario.toLocaleString("es-CO")}
                      </td>
                      <td>
                        <div className="btn-group-acciones">
                          <button
                            className="btn btn-ver btn-sm"
                            onClick={() => setProductoVer(prod)}
                          >
                            Ver
                          </button>
                          <button
                            className="btn btn-editar btn-sm"
                            onClick={() => handleEditarProducto(prod)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-eliminar btn-sm"
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
