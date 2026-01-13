import React, { useState, useEffect } from "react";
import { API_URL } from "../api/config";

function Reportes() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporteVentas, setReporteVentas] = useState(null);
  const [topClientes, setTopClientes] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipoReporte, setTipoReporte] = useState("ventas");

  
function descargarCsv(ruta, nombreArchivo) {
  fetch(`${API_URL}${ruta}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error("Error descargando CSV", err);
      alert("No se pudo descargar el archivo CSV");
    });
}


  const generarReporteVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/Facturas/Reportes/Ventas`;
      const params = new URLSearchParams();

      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
      if (!response.ok) throw new Error("Error al generar reporte");

      const data = await response.json();
      setReporteVentas(data);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const token = localStorage.getItem("token");
  const cargarTopClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/Facturas/Reportes/TopClientes?top=10`
        ,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
      );

      if (!response.ok) throw new Error("Error al cargar top clientes");

      const data = await response.json();
      setTopClientes(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductosMasVendidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/Facturas/Reportes/ProductosMasVendidos?top=10`,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
      );
      if (!response.ok)
        throw new Error("Error al cargar productos mas vendidos");

      const data = await response.json();
      setProductosMasVendidos(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tipoReporte === "clientes") {
      cargarTopClientes();
    } else if (tipoReporte === "productos") {
      cargarProductosMasVendidos();
    }
  }, [tipoReporte]);


  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="text-primary mb-4">Reportes de Facturacion</h2>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Seleccionar Tipo de Reporte</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${
                    tipoReporte === "ventas"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTipoReporte("ventas")}
                >
                  Reporte de Ventas
                </button>
                <button
                  type="button"
                  className={`btn ${
                    tipoReporte === "clientes"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTipoReporte("clientes")}
                >
                  Top Clientes
                </button>
                <button
                  type="button"
                  className={`btn ${
                    tipoReporte === "productos"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTipoReporte("productos")}
                >
                  Productos Mas Vendidos
                </button>
              </div>
            </div>
          </div>

          {tipoReporte === "ventas" && (
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha Fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label d-block">&nbsp;</label>
                <button
                  className="btn btn-success w-100"
                  onClick={generarReporteVentas}
                  disabled={loading}
                >
                  {loading ? "Generando..." : "Generar Reporte"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando reporte...</p>
        </div>
      )}

      {tipoReporte === "ventas" && reporteVentas && !loading && (
        <div>
          <div className="card mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Resumen de Ventas</h5>
              <div>
                <button
          className="btn btn-light btn-sm me-2"
          onClick={() =>
            descargarCsv("/reportes/ventas/csv", "reporte_ventas.csv")
          }
        >
                  Exportar Excel
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="text-primary">
                        {reporteVentas.totalFacturas}
                      </h3>
                      <p className="mb-0">Total Facturas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="text-success">
                        {reporteVentas.facturasPagadas}
                      </h3>
                      <p className="mb-0">Facturas Pagadas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="text-warning">
                        {reporteVentas.facturasPendientes}
                      </h3>
                      <p className="mb-0">Facturas Pendientes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="text-success">
                        ${reporteVentas.totalVentas.toLocaleString("es-CO")}
                      </h3>
                      <p className="mb-0">Total Ventas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row text-center mt-3">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h4 className="text-success">
                        $
                        {reporteVentas.totalVentasPagadas.toLocaleString(
                          "es-CO"
                        )}
                      </h4>
                      <p className="mb-0">Ventas Pagadas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h4 className="text-info">
                        ${reporteVentas.totalIVA.toLocaleString("es-CO")}
                      </h4>
                      <p className="mb-0">Total IVA Recaudado</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h4 className="text-warning">
                        $
                        {reporteVentas.totalVentasPendientes.toLocaleString(
                          "es-CO"
                        )}
                      </h4>
                      <p className="mb-0">Ventas Pendientes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Detalle de Facturas</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Numero</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th className="text-end">Subtotal</th>
                      <th className="text-end">IVA</th>
                      <th className="text-end">INC</th>
                      <th className="text-end">Total</th>
                      <th>Estado</th>
                      <th>Medio Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteVentas.facturas.map((factura) => (
                      <tr key={factura.id}>
                        <td>{factura.numeroFactura}</td>
                        <td>
                          {new Date(factura.fechaEmision).toLocaleDateString(
                            "es-CO"
                          )}
                        </td>
                        <td>
                          {factura.cliente?.nombre} {factura.cliente?.apellido}
                        </td>
                        <td className="text-end">
                          ${factura.subtotal.toLocaleString("es-CO")}
                        </td>
                        <td className="text-end">
                          ${factura.totalIVA.toLocaleString("es-CO")}
                        </td>
                        <td className="text-end">
                          ${factura.totalINC.toLocaleString("es-CO")}
                        </td>
                        <td className="text-end fw-bold">
                          ${factura.totalFactura.toLocaleString("es-CO")}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              factura.estado === "Pagada"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {factura.estado}
                          </span>
                        </td>
                        <td>{factura.medioPago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tipoReporte === "clientes" && topClientes.length > 0 && !loading && (
        <div className="card">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Top 10 Clientes</h5>
            <div>
                <button
          className="btn btn-light btn-sm me-2"
          onClick={() =>
            descargarCsv("/reportes/top-clientes/csv", "top_clientes.csv")
          }>
                Exportar Excel
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Posicion</th>
                    <th>Cliente</th>
                    <th className="text-center">Cantidad Facturas</th>
                    <th className="text-end">Total Compras</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientes.map((cliente, index) => (
                    <tr key={cliente.clienteId}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
                      <td>{cliente.nombreCliente}</td>
                      <td className="text-center">{cliente.totalFacturas}</td>
                      <td className="text-end fw-bold text-success">
                        ${cliente.totalCompras.toLocaleString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tipoReporte === "productos" &&
        productosMasVendidos.length > 0 &&
        !loading && (
          <div className="card">
            <div className="card-header bg-warning d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top 10 Productos Mas Vendidos</h5>
              <div>
                 <button
          className="btn btn-light btn-sm me-2"
          onClick={() =>
            descargarCsv(
              "/reportes/productos-mas-vendidos/csv",
              "productos_mas_vendidos.csv"
            )
          }
        >
                  Exportar Excel
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Posicion</th>
                      <th>Producto</th>
                      <th className="text-center">Cantidad Vendida</th>
                      <th className="text-end">Total Ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosMasVendidos.map((producto, index) => (
                      <tr key={producto.productoId}>
                        <td>
                          <strong>{index + 1}</strong>
                        </td>
                        <td>{producto.nombreProducto}</td>
                        <td className="text-center">
                          {producto.cantidadVendida}
                        </td>
                        <td className="text-end fw-bold text-success">
                          ${producto.totalVentas.toLocaleString("es-CO")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Reportes;
