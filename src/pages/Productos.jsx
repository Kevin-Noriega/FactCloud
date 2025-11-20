import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import Select from "react-select";
import unidadesMedidaDIAN from "../utils/UnidadesMedidas.json";
import tipoProductoDIAN from "../utils/TiposProducto.json";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
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

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    codigoInterno: "",
    codigoUNSPSC: "",
    codigoEAN: "",
    unidadMedida: "Unidad",
    marca: "",
    modelo: "",
    precioUnitario: "",
    costo: "",
    tipoImpuesto: "IVA",
    tarifaIVA: 19,
    productoExcluido: false,
    productoExento: false,
    gravaINC: false,
    tarifaINC: 0,
    cantidadDisponible: "",
    cantidadMinima: 0,
    categoria: "",
    codigoBarras: "",
    estado: true,

    tipoProducto: "",
    baseGravable: "",
    retencionFuente: "",
    retencionIVA: "",
    retencionICA: "",
  });
  // Conversiones a número
  const baseGravable = producto.baseGravable
    ? parseFloat(producto.baseGravable)
    : 0;
  const porcentajeFuente = producto.retencionFuente
    ? parseFloat(producto.retencionFuente)
    : 0;
  const porcentajeIVA = producto.retencionIVA
    ? parseFloat(producto.retencionIVA)
    : 0;
  const porcentajeICA = producto.retencionICA
    ? parseFloat(producto.retencionICA)
    : 0;

  const valorRetencionFuente = +(
    (baseGravable * porcentajeFuente) /
    100
  ).toFixed(2);
  const valorRetencionIVA = +((baseGravable * porcentajeIVA) / 100).toFixed(2);
  const valorRetencionICA = +((baseGravable * porcentajeICA) / 100).toFixed(2);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/Productos`);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const limpiarFormulario = () => {
    setProducto({
      nombre: "",
      descripcion: "",
      codigoInterno: "",
      codigoUNSPSC: "",
      codigoEAN: "",
      unidadMedida: "",
      marca: "",
      modelo: "",
      precioUnitario: "",
      costo: "",
      tipoImpuesto: "IVA",
      tarifaIVA: 19,
      productoExcluido: false,
      productoExento: false,
      gravaINC: false,
      tarifaINC: 0,
      cantidadDisponible: "",
      cantidadMinima: 0,
      categoria: "",
      codigoBarras: "",
      estado: true,
      tipoProducto: "",
      baseGravable: "",
      retencionFuente: "",
      retencionIVA: "",
      retencionICA: "",
    });
    setProductoEditando(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        return;
      }

      const payload = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        codigoInterno: producto.codigoInterno,
        codigoUNSPSC: producto.codigoUNSPSC,
        codigoEAN: producto.codigoEAN,
        unidadMedida: producto.unidadMedida,
        marca: producto.marca,
        modelo: producto.modelo,
        precioUnitario: parseFloat(producto.precioUnitario),
        costo: producto.costo ? parseFloat(producto.costo) : null,
        tipoImpuesto: producto.tipoImpuesto,
        tarifaIVA: parseFloat(producto.tarifaIVA),
        productoExcluido: producto.productoExcluido,
        productoExento: producto.productoExento,
        gravaINC: producto.gravaINC,
        tarifaINC: producto.gravaINC ? parseFloat(producto.tarifaINC) : null,
        cantidadDisponible: parseInt(producto.cantidadDisponible),
        cantidadMinima: parseInt(producto.cantidadMinima),
        categoria: producto.categoria,
        codigoBarras: producto.codigoBarras,
        tipoProducto: producto.tipoProducto,
        baseGravable: producto.baseGravable,
        retencionFuente: producto.retencionFuente,
        retencionIVA: producto.retencionIVA,
        retencionICA: producto.retencionICA,
        estado: producto.estado,
        usuarioId: usuarioGuardado.id,
      };

      const url = productoEditando
        ? `${API_URL}/Productos/${productoEditando}`
        : `${API_URL}/Productos`;
      const method = productoEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto);
      }

      limpiarFormulario();
      fetchProductos();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar producto: " + error.message);
    }
  };

  const editarProducto = (prod) => {
    setProducto({
      id: productoEditando,
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      codigoInterno: prod.codigoInterno || "",
      codigoUNSPSC: prod.codigoUNSPSC || "",
      codigoEAN: prod.codigoEAN || "",
      unidadMedida: prod.unidadMedida,
      marca: prod.marca || "",
      modelo: prod.modelo || "",
      precioUnitario: prod.precioUnitario,
      costo: prod.costo || "",
      tipoImpuesto: prod.tipoImpuesto,
      tarifaIVA: prod.tarifaIVA,
      productoExcluido: prod.productoExcluido,
      productoExento: prod.productoExento,
      gravaINC: prod.gravaINC,
      tarifaINC: prod.tarifaINC || 0,
      cantidadDisponible: prod.cantidadDisponible,
      cantidadMinima: prod.cantidadMinima,
      categoria: prod.categoria || "",
      codigoBarras: prod.codigoBarras || "",
      tipoProducto: prod.tipoProducto || "",
      baseGravable: prod.baseGravable || "",
      retencionFuente: prod.retencionFuente || "",
      retencionIVA: prod.retencionIVA || "",
      retencionICA: prod.retencionICA || "",
      estado: prod.estado,
    });
    setProductoEditando(prod.id);
    setMostrarFormulario(true);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${API_URL}/Productos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar producto");

      fetchProductos();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar producto");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-success"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Ocultar Formulario" : "Nuevo Producto"}
        </button>
        <div className="d-flex" style={{ gap: "1rem", width: "50%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o código de barras…"
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
            <option value="caros">Más caros</option>
            <option value="baratos">Más baratos</option>
          </select>
        </div>
      </div>

      {productoVer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minWidth: 340,
              maxWidth: 480,
              boxShadow: "0 2px 32px #0007",
              padding: 30,
              position: "relative",
            }}
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
                  <td>
                    {"$ "}
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

      {mostrarFormulario && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Nombre y descripción */}
              <div className="row mb-3">
                <h6 className="border-bottom pb-2 mb-3">Unidad y Precios</h6>
                <div className="col-md-6">
                  <label className="form-label">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={producto.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción Detallada</label>
                  <input
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={producto.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Códigos */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Código Interno</label>
                  <input
                    type="text"
                    name="codigoInterno"
                    className="form-control"
                    value={producto.codigoInterno}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Código UNSPSC</label>
                  <input
                    type="text"
                    name="codigoUNSPSC"
                    className="form-control"
                    value={producto.codigoUNSPSC}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Código EAN</label>
                  <input
                    type="text"
                    name="codigoEAN"
                    className="form-control"
                    value={producto.codigoEAN}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Marca, modelo y categoría */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    className="form-control"
                    value={producto.marca}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    className="form-control"
                    value={producto.modelo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    className="form-control"
                    value={producto.categoria}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Tipo Producto</label>
                  <Select
                    name="tipoProducto"
                    options={tipoProductoDIAN.map((um) => ({
                      value: um.descripcion,
                      label: `${um.codigo} - ${um.descripcion}`,
                    }))}
                    value={
                      producto.tipoProducto
                        ? tipoProductoDIAN
                            .map((um) => ({
                              value: um.descripcion,
                              label: `${um.codigo} - ${um.descripcion}`,
                            }))
                            .find((opt) => opt.value === producto.tipoProducto)
                        : null
                    }
                    onChange={(opt) =>
                      setProducto((prev) => ({
                        ...prev,
                        tipoProducto: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar tipo de producto"
                  />
                </div>
              </div>
              {/* Base Gravable y Retenciones */}
              <h6 className="border-bottom pb-2 mb-3 mt-4">
                Base Gravable y Retenciones
              </h6>
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Base Gravable</label>
                  <input
                    type="number"
                    name="baseGravable"
                    className="form-control"
                    value={producto.baseGravable}
                    onChange={handleChange}
                    step="0.01"
                    required
                    placeholder="Ej: 100000"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Retención Fuente (%)</label>
                  <input
                    type="number"
                    name="retencionFuente"
                    className="form-control"
                    value={producto.retencionFuente}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="Ej: 2.5"
                  />
                  <small className="text-muted">
                    Valor calculado: $
                    {valorRetencionFuente.toLocaleString("es-CO")}
                  </small>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Retención IVA (%)</label>
                  <input
                    type="number"
                    name="retencionIVA"
                    className="form-control"
                    value={producto.retencionIVA}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="Ej: 15"
                  />
                  <small className="text-muted">
                    Valor calculado: $
                    {valorRetencionIVA.toLocaleString("es-CO")}
                  </small>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Retención ICA (%)</label>
                  <input
                    type="number"
                    name="retencionICA"
                    className="form-control"
                    value={producto.retencionICA}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="Ej: 6.9"
                  />
                  <small className="text-muted">
                    Valor calculado: $
                    {valorRetencionICA.toLocaleString("es-CO")}
                  </small>
                </div>
              </div>

              {/* Unidad de medida y precios */}
              <h6 className="border-bottom pb-2 mb-3">Unidad y Precios</h6>

              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Unidad de Medida</label>
                  <Select
                    name="unidadMedida"
                    options={unidadesMedidaDIAN.map((um) => ({
                      value: um.nombre,
                      label: `${um.codigo} - ${um.nombre}`,
                    }))}
                    value={
                      producto.unidadMedida
                        ? unidadesMedidaDIAN
                            .map((um) => ({
                              value: um.nombre,
                              label: `${um.codigo} - ${um.nombre}`,
                            }))
                            .find((opt) => opt.value === producto.unidadMedida)
                        : null
                    }
                    onChange={(opt) =>
                      setProducto((prev) => ({
                        ...prev,
                        unidadMedida: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar unidad de medida"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Precio Unitario</label>
                  <input
                    type="number"
                    name="precioUnitario"
                    className="form-control"
                    value={producto.precioUnitario}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Costo</label>
                  <input
                    type="number"
                    name="costo"
                    className="form-control"
                    value={producto.costo}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Código de Barras</label>
                  <input
                    type="text"
                    name="codigoBarras"
                    className="form-control"
                    value={producto.codigoBarras}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Impuestos */}
              <h6 className="border-bottom pb-2 mb-3">
                Impuestos - Configuración DIAN
              </h6>

              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Tipo de Impuesto</label>
                  <select
                    name="tipoImpuesto"
                    className="form-select"
                    value={producto.tipoImpuesto}
                    onChange={handleChange}
                  >
                    <option value="IVA">IVA</option>
                    <option value="INC">INC</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tarifa IVA (%)</label>
                  <select
                    name="tarifaIVA"
                    className="form-select"
                    value={producto.tarifaIVA}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="19">19%</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      name="productoExcluido"
                      className="form-check-input"
                      checked={producto.productoExcluido}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Producto Excluido
                    </label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      name="productoExento"
                      className="form-check-input"
                      checked={producto.productoExento}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Producto Exento</label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="gravaINC"
                      className="form-check-input"
                      checked={producto.gravaINC}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Grava Impuesto al Consumo (INC)
                    </label>
                  </div>
                </div>
                {producto.gravaINC && (
                  <div className="col-md-4">
                    <label className="form-label">Tarifa INC (%)</label>
                    <input
                      type="number"
                      name="tarifaINC"
                      className="form-control"
                      value={producto.tarifaINC}
                      onChange={handleChange}
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              {/* Inventario */}
              <h6 className="border-bottom pb-2 mb-3">Inventario</h6>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Cantidad Disponible</label>
                  <input
                    type="number"
                    name="cantidadDisponible"
                    className="form-control"
                    value={producto.cantidadDisponible}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cantidad Minima</label>
                  <input
                    type="number"
                    name="cantidadMinima"
                    className="form-control"
                    value={producto.cantidadMinima}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {productoEditando
                    ? "Actualizar Producto"
                    : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla productos */}
      <div className="card">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">
              No hay productos registrados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoria</th>
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
                      <td>{prod.categoria || "Sin categoria"}</td>
                      <td>{prod.cantidadDisponible}</td>
                      <td>${prod.precioUnitario.toLocaleString("es-CO")}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary color-gray me-2"
                          onClick={() => setProductoVer(prod)}
                        >
                          ver
                        </button>
                        <button
                          className="btn btn-sm btn-info me-2 text-white"
                          onClick={() => editarProducto(prod)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarProducto(prod.id)}
                        >
                          Eliminar
                        </button>
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
