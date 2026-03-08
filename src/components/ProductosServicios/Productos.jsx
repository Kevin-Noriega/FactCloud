import { useEffect, useState } from "react";
import { BoxSeam } from "react-bootstrap-icons";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import exportarProductosExcel from "./exportarProductosExcel";

function Productos() {
  const [activeTab, setActiveTab] = useState("productosServicios");

  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoVer, setProductoVer] = useState(null);
  const [buscador, setBuscador] = useState("");
  const [filtro] = useState("recientes");
  const [negocio, setNegocio] = useState(null);

  const filtrados = productos
    .filter((prod) => {
      // ← Solo productos, no servicios
      if (prod.esServicio) return false;

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

  const fetchNegocio = async () => {
    try {
      const response = await axiosClient.get("/Negocios/mio"); // ajusta el endpoint
      setNegocio(response.data);
    } catch (error) {
      console.error("Error al cargar negocio:", error);
    }
  };

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

  // ✅ useEffect de carga inicial
  useEffect(() => {
    fetchProductos();
    fetchNegocio();
  }, []);

  // ✅ useEffect separado para leer el mensaje al volver de CrearProductoPage
  useEffect(() => {
    if (location.state?.mensajeExito) {
      setMensajeExito(location.state.mensajeExito);
      setTimeout(() => setMensajeExito(""), 3000);
      fetchProductos();
      window.history.replaceState({}, "");
    }
  }, [location.state]);
  // NOMBRES LITERALES COMO SIIGO
  const tabs = [
    { id: "productosServicios", label: "Gestión de productos / servicios" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "productosServicios":
        return (
          <div className="tab-content p-4">
            <div className="container-fluid mt-4 px-4">
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
                <div className="filters">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Buscar producto o servicio..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                  />
                  <button className="btn btn-filtros">
                    <i className="bi bi-sliders2"></i> Filtros
                  </button>
                </div>
                <div className="btns-group">
                  <button
                    className="btn btn-crear"
                    onClick={handleNuevoProducto}
                  >
                    Crear / Importar
                  </button>
                  <button
                    className="btn btn-export"
                    onClick={() => exportarProductosExcel(filtrados, negocio)}
                  >
                    <i className="bi bi-file-earmark-excel-fill"></i> Exportar
                    Excel
                  </button>
                </div>
              </div>

              {productoVer && (
                <div
                  className="modal-overlay"
                  onClick={() => setProductoVer(null)}
                >
                  <div
                    className="modal-ver"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                            ${" "}
                            {productoVer.precioUnitario.toLocaleString("es-CO")}
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
                    <h5 className="mb-3">
                      ¿Está seguro de desactivar este producto?
                    </h5>
                    <p className="text-muted small">
                      El producto quedará inactivo y no podrá ser editado.
                    </p>
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
                        Sí, desactivar
                      </button>
                    </div>
                  </div>
                </div>
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
                            <th>Tipo</th>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Unidad</th>
                            <th>Precios</th>
                            <th>Impuestos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtrados.map((prod) => (
                            <tr key={prod.id}>
                              <td>
                                <span
                                  className={`badge ${prod.esServicio ? "bg-primary" : "bg-secondary"}`}
                                >
                                  {prod.esServicio ? "Servicio" : "Producto"}
                                </span>
                              </td>
                              <td>
                                <span
                                  className="text-primary fw-semibold"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setProductoVer(prod)}
                                >
                                  {prod.nombre}
                                </span>
                              </td>
                              <td className="text-muted">
                                {prod.codigoInterno || "—"}
                              </td>
                              <td>{prod.unidadMedida || "—"}</td>
                              <td className="fw-bold text-success">
                                ${prod.precioUnitario?.toLocaleString("es-CO")}{" "}
                                COP
                                {prod.incluyeIVA && (
                                  <span className="ms-1 text-muted small">
                                    ···
                                  </span>
                                )}
                              </td>
                              <td>
                                {prod.impuestoCargo ? (
                                  <span className="text-dark">
                                    {prod.impuestoCargo}
                                  </span>
                                ) : (
                                  "—"
                                )}
                                {prod.retencion && (
                                  <span className="ms-1 text-muted small">
                                    + {prod.retencion}
                                  </span>
                                )}
                              </td>
                              <td>
                                {prod.activo ? (
                                  <span className="text-success d-flex align-items-center gap-1">
                                    ✅ Activo
                                  </span>
                                ) : (
                                  <span className="text-warning d-flex align-items-center gap-1">
                                    ⚠️ Inactivo
                                  </span>
                                )}
                              </td>

                              <td>
                                <div className="btn-group-acciones">
                                  <button
                                    className="btn btn-editar btn-sm"
                                    onClick={() => handleEditarProducto(prod)}
                                    disabled={!prod.activo}
                                    title={
                                      !prod.activo
                                        ? "No se puede editar un producto inactivo"
                                        : "Editar"
                                    }
                                    style={
                                      !prod.activo
                                        ? {
                                            opacity: 0.5,
                                            cursor: "not-allowed",
                                            pointerEvents: "auto",
                                            backgroundColor: "#6c757d",
                                            border: "none",
                                            color: "white",
                                          }
                                        : {}
                                    }
                                  >
                                    Editar
                                  </button>

                                  <button
                                    className="btn btn-eliminar btn-sm"
                                    onClick={() =>
                                      setProductoAEliminar(prod.id)
                                    }
                                  >
                                    ▾
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
          </div>
        );

      default:
        return null;
    }
  };

  const handleNuevoProducto = () => {
    navigate("/crearProducto");
  };

  const handleEditarProducto = (prod) => {
    navigate(`/crearProducto/editar/${prod.id}`);
  };

  const eliminarProducto = async (id) => {
    try {
      await axiosClient.put(`/Productos/desactivar/${id}`, { estado: false });
      setMensajeExito("Producto desactivado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);

      // Actualiza localmente: cambia activo a false sin recargar
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, activo: false } : p)),
      );
    } catch (error) {
      console.error("Error al desactivar producto:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
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
    <div className="container-fluid px-4">
      <div className="header-card mb-3 px-4">
        <div className="header-content ">
          <h2 className="header-title">Inventario de Productos / Servicios</h2>
          <div className="header-icon">
            <BoxSeam size={50} />
          </div>
        </div>
      </div>

      {/* BOTONES TABS */}
      <div className="menu-tabs px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`menu-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      {renderContent()}
    </div>
  );
}

export default Productos;
