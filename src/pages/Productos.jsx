import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
const unidadesMedidaDIAN = [
 { codigo: "94", label: "Unidad (UND)" },
  { codigo: "KGM",label: "Kilogramo (KGM)" },
  { codigo: "LTR",label: "Litro (LTR)" },
  { codigo: "MTR",label: "Metro (MTR)" },
  { codigo: "MTK",label: "Metro cuadrado (MTK)" },
  { codigo: "CE", label:"Cien unidades (CE)" },
  { codigo: "GRM",label: "Gramo (GRM)" },
  { codigo: "MWH",label: "Megavatio hora (MWH)" },
  { codigo: "HUR",label: "Hora (HUR)" },
  { codigo: "CMK",label: "Centímetro cuadrado (CMK)" },
  { codigo: "CMT",label: "Centímetro (CMT)" },
  { codigo: "INH",label: "Pulgada (INH)" },
  { codigo: "LTR",label: "Litro (LTR)" },
  { codigo: "MLT",label: "Mililitro (MLT)" },
  { codigo: "PR", label: "Par (PR)" },
  { codigo: "SET",label: "Set (SET)" },
  { codigo: "NIU",label: "Unidad internacional (NIU)" },
];
function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
    const [productoVer, setProductoVer] = useState(null);

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
  });

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
    });
    setProductoEditando(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontro un usuario autenticado.");
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
        usuarioId: usuarioGuardado.id,
      };

      const url = productoEditando
        ? `${API_URL}/Productos/${productoEditando}`
        : `${API_URL}/Productos`;

      const method = productoEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto);
      }

      alert(
        productoEditando
          ? "Producto actualizado correctamente"
          : "Producto agregado correctamente"
      );
      limpiarFormulario();
      fetchProductos();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar producto: " + error.message);
    }
  };

  const editarProducto = (prod) => {
    setProducto({
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
    });
    setProductoEditando(prod.id);
    setMostrarFormulario(true);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estas seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${API_URL}/Productos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar producto");

      alert("Producto eliminado correctamente");
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

      <button
        className="btn btn-success mb-4"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Nuevo Producto"}
      </button>
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
                  <td>
                    {productoVer.nombre}
                  </td>
                </tr>
                <tr>
                  <th>Descripcion</th>
                  <td>
                    {productoVer.descripcion}
                  </td>
                </tr>
                <tr>
                  <th>Precio</th>
                  <td>{"$ "}{productoVer.precioUnitario.toLocaleString("es-CO")}</td>
                </tr>
                <tr>
                  <th>Categoria</th>
                  <td>{productoVer.categoria}</td>
                </tr>
                <tr>
                  <th>Codigo de barras</th>
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
              <div className="row mb-3">
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
                  <label className="form-label">Descripcion Detallada</label>
                  <input
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={producto.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Codigo Interno</label>
                  <input
                    type="text"
                    name="codigoInterno"
                    className="form-control"
                    value={producto.codigoInterno}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Codigo UNSPSC</label>
                  <input
                    type="text"
                    name="codigoUNSPSC"
                    className="form-control"
                    value={producto.codigoUNSPSC}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Codigo EAN</label>
                  <input
                    type="text"
                    name="codigoEAN"
                    className="form-control"
                    value={producto.codigoEAN}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                  <label className="form-label">Categoria</label>
                  <input
                    type="text"
                    name="categoria"
                    className="form-control"
                    value={producto.categoria}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3">Unidad y Precios</h6>

              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Unidad de Medida</label>
                  <select
                    name="unidadMedida"
                    className="form-select"
                    value={producto.unidadMedida}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {unidadesMedidaDIAN.map((un) => (
                      <option key={un.codigo} value={un.codigo}>
                        {un.codigo} - {un.label}
                      </option>
                    ))}
                  </select>
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
                  <label className="form-label">Codigo de Barras</label>
                  <input
                    type="text"
                    name="codigoBarras"
                    className="form-control"
                    value={producto.codigoBarras}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3">
                Impuestos - Configuracion DIAN
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

      <div className="card">
        <div className="card-body">
          {productos.length === 0 ? (
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
                  {productos.map((prod) => (
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
