import { useEffect, useState } from "react";
import { BoxSeam } from "react-bootstrap-icons";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import exportarProductosExcel from "./exportarProductosExcel";
import "./Productos.css";
import { FunnelFill, FileEarmarkExcelFill } from "react-bootstrap-icons";
import { toArray } from "../../utils/Helpers";

function Productos() {
  const [activeTab, setActiveTab] = useState("productos");

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
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [productoImpuestos, setProductoImpuestos] = useState(null);

  const [filtros, setFiltros] = useState({
    tipo: "Todos",
    moneda: "Todos",
    estado: "Todos",
    inventariable: "Todos",
  });

  const [orden, setOrden] = useState("recientes");

  const actualizarFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: "Todos",
      moneda: "Todos",
      estado: "Todos",
      inventariable: "Todos",
    });
    setBuscador("");
    setOrden("recientes");
  };

  const filtrados = productos
    .filter((prod) => {
      const query = buscador.trim().toLowerCase();

      const coincideBusqueda =
        !query ||
        prod.nombre?.toLowerCase().includes(query) ||
        prod.codigoBarras?.toLowerCase().includes(query) ||
        prod.codigoInterno?.toLowerCase().includes(query) ||
        prod.descripcion?.toLowerCase().includes(query);

      const coincideTipo =
        filtros.tipo === "Todos" ||
        (filtros.tipo === "Producto" && !prod.esServicio) ||
        (filtros.tipo === "Servicio" && prod.esServicio);

      const coincideMoneda =
        filtros.moneda === "Todos" || prod.moneda === filtros.moneda;

      const coincideEstado =
        filtros.estado === "Todos" ||
        (filtros.estado === "Activo" && prod.activo) ||
        (filtros.estado === "Inactivo" && !prod.activo);

      const coincideInventariable =
        filtros.inventariable === "Todos" ||
        (filtros.inventariable === "Sí" && prod.inventariable) ||
        (filtros.inventariable === "No" && !prod.inventariable);

      return (
        coincideBusqueda &&
        coincideTipo &&
        coincideMoneda &&
        coincideEstado &&
        coincideInventariable
      );
    })
    .sort((a, b) => {
      switch (orden) {
        case "recientes":
          return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
        case "antiguos":
          return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
        case "caros":
          return (b.precioUnitario || 0) - (a.precioUnitario || 0);
        case "baratos":
          return (a.precioUnitario || 0) - (b.precioUnitario || 0);
        default:
          return 0;
      }
    });

  const formatearPorcentaje = (texto = "") => {
    return texto.replaceAll("_", ".");
  };

  const formatearImpuesto = (valor) => {
    if (!valor) return "";

    const limpio = valor.trim();

    if (limpio.toUpperCase().startsWith("IVA_")) {
      return `IVA ${formatearPorcentaje(limpio.slice(4))}%`;
    }

    if (limpio.toUpperCase().startsWith("RTE_")) {
      return `Retención ${formatearPorcentaje(limpio.slice(4))}%`;
    }

    if (limpio.toUpperCase().startsWith("INC_")) {
      return `INC ${formatearPorcentaje(limpio.slice(4))}%`;
    }

    if (limpio.toUpperCase().startsWith("ICO_")) {
      return `ICO ${formatearPorcentaje(limpio.slice(4))}%`;
    }

    return limpio.replaceAll("_", " ");
  };

  const obtenerListaImpuestos = (prod) => {
    const lista = [];

    if (prod.impuestoCargo) {
      lista.push({
        tipo: "Impuesto cargo",
        valor: formatearImpuesto(prod.impuestoCargo),
      });
    }

    if (prod.retencion) {
      lista.push({
        tipo: "Retención",
        valor: formatearImpuesto(prod.retencion),
      });
    }

    return lista;
  };

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
      setProductos(toArray(response));
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
    { id: "productos", label: "Productos" },
    { id: "servicios", label: "Servicios" },
  ];

  const renderContent = () => {
    const dataFiltrada = filtrados.filter(p => 
      activeTab === "productos" ? !p.esServicio : p.esServicio
    );

    return (
      <div className="tab-content p-4" style={{ height: "100%" }}>
        <div className="container-fluid px-2">
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
                  <button
                    className="btn btn-filtros"
                    onClick={() => setMostrarFiltros(true)}
                  >
                    <FunnelFill size={16} />
                    Filtros
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
                    <FileEarmarkExcelFill size={16} />
                    Exportar Excel
                  </button>
                </div>
              </div>
              {productoImpuestos && (
                <div
                  className="modal-overlay"
                  onClick={() => setProductoImpuestos(null)}
                >
                  <div
                    className="modal-impuestos"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn-close position-absolute top-0 end-0 mt-2 me-2"
                      onClick={() => setProductoImpuestos(null)}
                    />

                    <h5 className="mb-3">Impuestos del producto</h5>
                    <p className="text-muted mb-3">
                      {productoImpuestos.nombre}
                    </p>

                    <div className="impuestos-modal-lista">
                      {obtenerListaImpuestos(productoImpuestos).map(
                        (imp, index) => (
                          <div key={index} className="impuesto-item">
                            <span className="impuesto-item-label">
                              {imp.tipo}
                            </span>
                            <span className="impuesto-item-value">
                              {imp.valor}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mostrarFiltros && (
                <div
                  className="modal-overlay"
                  onClick={() => setMostrarFiltros(false)}
                >
                  <div
                    className="modal-filtros"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-filtros-header">
                      <h4>Filtros</h4>
                      <button
                        className="btn-close"
                        onClick={() => setMostrarFiltros(false)}
                      ></button>
                    </div>

                    <p className="text-muted mb-3">
                      Define los filtros que deseas aplicar a la tabla:
                    </p>

                    <div className="mb-3">
                      <label className="form-label">Tipo de producto</label>
                      <select
                        className="form-select"
                        value={filtros.tipo}
                        onChange={(e) =>
                          actualizarFiltro("tipo", e.target.value)
                        }
                      >
                        <option>Todos</option>
                        <option>Producto</option>
                        <option>Servicio</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Moneda</label>
                      <select
                        className="form-select"
                        value={filtros.moneda}
                        onChange={(e) =>
                          actualizarFiltro("moneda", e.target.value)
                        }
                      >
                        <option>Todos</option>
                        <option>COP</option>
                        <option>USD</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select"
                        value={filtros.estado}
                        onChange={(e) =>
                          actualizarFiltro("estado", e.target.value)
                        }
                      >
                        <option>Todos</option>
                        <option>Activo</option>
                        <option>Inactivo</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Inventariables</label>
                      <select
                        className="form-select"
                        value={filtros.inventariable}
                        onChange={(e) =>
                          actualizarFiltro("inventariable", e.target.value)
                        }
                      >
                        <option>Todos</option>
                        <option>Sí</option>
                        <option>No</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Ordenar por</label>
                      <select
                        className="form-select"
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                      >
                        <option value="recientes">Más recientes</option>
                        <option value="antiguos">Más antiguos</option>
                        <option value="caros">Mayor precio</option>
                        <option value="baratos">Menor precio</option>
                      </select>
                    </div>

                    <div className="modal-filtros-footer">
                      <button
                        className="btn btn-light"
                        onClick={() => setMostrarFiltros(false)}
                      >
                        Cancelar
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={limpiarFiltros}
                      >
                        Limpiar
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => setMostrarFiltros(false)}
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

              <div className="card">
                <div className="card-body">
                  {dataFiltrada.length === 0 ? (
                    <div className="alert alert-info">
                      No hay {activeTab} registrados.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover facturas-table">
                        <thead className="facturas-table-header">
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
                          {dataFiltrada.map((prod) => (
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
                                {(() => {
                                  const impuestos = obtenerListaImpuestos(prod);

                                  return impuestos.length > 0 ? (
                                    <div className="impuestos-cell">
                                      {impuestos.map((imp, index) => (
                                        <span
                                          key={index}
                                          className={`impuesto-chip ${imp.tipo === "Retención" ? "rte" : "iva"}`}
                                        >
                                          {imp.valor}
                                        </span>
                                      ))}

                                      <button
                                        type="button"
                                        className="btn btn-link btn-sm impuestos-detalle-btn"
                                        onClick={() =>
                                          setProductoImpuestos(prod)
                                        }
                                      >
                                        Ver
                                      </button>
                                    </div>
                                  ) : null;
                                })()}
                              </td>

                              <td>
                                {prod.activo ? (
                                  <span className="text-success d-flex align-items-center gap-1">
                                    Activo
                                  </span>
                                ) : (
                                  <span className="text-warning d-flex align-items-center gap-1">
                                    Inactivo
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
    <div
      className="container-fluid d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="header-card mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center">
          <h2 className="header-title">Productos y servicios</h2>

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
      <div style={{ flex: 1 }}>{renderContent()}</div>
    </div>
  );
}

export default Productos;
