import React, { useEffect, useState, useRef } from "react";
import ModalFacturaPDF from "../../modals/ModalfacturaPDF.jsx";
import ModalPago from "../../modals/ModalPago.jsx";
import ModalCrearFactura from "../../modals/ModalCrearFactura.jsx";
import { createConnection } from "../../../SignalR/SignalConector.jsx";
import { toast, ToastContainer } from "react-toastify";
import axiosClient from "../../../api/axiosClient.js";
import { useNavigate } from "react-router-dom";
import { FunnelFill } from "react-bootstrap-icons";
import { toArray } from "../../../utils/Helpers.js";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [facturaParaPago, setFacturaParaPago] = useState(null);
  const connectionRef = useRef(null);
  const [facturaVista, setFacturaVista] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(hoy.getMonth() - 1);
  const formatearFechaInput = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const filtrosIniciales = {
    moneda: "COP",
    estado: "Todos",
    fechaDesde: formatearFechaInput(haceUnMes),
    fechaHasta: formatearFechaInput(hoy),
    orden: "recientes",
  };

  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [filtrosDraft, setFiltrosDraft] = useState(filtrosIniciales);
  const [buscador, setBuscador] = useState("");

  const abrirModalFiltros = () => {
    setFiltrosDraft(filtros);
    setMostrarFiltros(true);
  };

  const actualizarFiltroDraft = (campo, valor) => {
    setFiltrosDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const aplicarFiltros = () => {
    setFiltros(filtrosDraft);
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setFiltrosDraft(filtrosIniciales);
    setMostrarFiltros(false);
  };

  const obtenerNombreCliente = (cliente) => {
    if (!cliente) return "N/A";
    return [cliente.nombre, cliente.apellido].filter(Boolean).join(" ").trim();
  };

  const obtenerNitCliente = (cliente) => {
    return cliente?.numeroIdentificacion;
  };

  const sugerenciasFiltradas = Array.from(
    new Map(
      toArray(clientes).map((cliente) => {
        const nombreCompleto = obtenerNombreCliente(cliente);
        const nit = obtenerNitCliente(cliente);

        return [
          cliente.id || `${nombreCompleto}-${nit}`,
          {
            ...cliente,
            nombreCompleto,
            nit,
          },
        ];
      }),
    ).values(),
  )
    .filter((cliente) => {
      const query = buscador.trim().toLowerCase();

      if (!query) return true; // <- importante
      return (
        cliente.nombreCompleto.toLowerCase().includes(query) ||
        cliente.nit.toLowerCase().includes(query)
      );
    })
    .slice(0, 8);

  const seleccionarCliente = (cliente) => {
    const texto = `${cliente.nombreCompleto} - ${cliente.nit}`;
    setBuscador(texto);
    setMostrarSugerencias(false);
  };

  const navigate = useNavigate();

  /*const enviarFacturaPorCorreo = async (factId) => {
    try {
      await axiosClient.post(`/Facturas/${factId}/enviar-cliente`);

      setMensajeExito("Factura enviada al cliente por correo.");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      const mensaje =
        err.response?.data?.message || err.message || "Error al enviar factura";
      setMensajeExito(mensaje);
      setTimeout(() => setMensajeExito(""), 3000);
    }
  };

  const descargarXML = (fact) => {
    if (!fact.xmlBase64) {
      setMensajeExito("No hay XML generado para esta factura");
      setTimeout(() => setMensajeExito(""), 3000);
      return;
    }

    const xmlContent = atob(fact.xmlBase64);
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Factura-${fact.numeroFactura}.xml`;
    a.click();
  };*/

  const filtrados = facturas
    .filter((fac) => {
      const query = buscador.trim().toLowerCase();
      const nombreCliente = obtenerNombreCliente(fac.cliente).toLowerCase();
      const nitCliente = obtenerNitCliente(fac.cliente).toLowerCase();
      const comprobante = (fac.numeroFactura || fac.id || "")
        .toString()
        .toLowerCase();

      const coincideBusqueda =
        !query ||
        comprobante.includes(query) ||
        nombreCliente.includes(query) ||
        nitCliente.includes(query);

      const coincideEstado =
        filtros.estado === "Todos" || fac.estado === filtros.estado;

      const fechaFactura = fac.fechaEmision
        ? new Date(fac.fechaEmision)
        : fac.fechaRegistro
          ? new Date(fac.fechaRegistro)
          : null;

      const coincideFechaDesde =
        !filtros.fechaDesde ||
        (fechaFactura &&
          fechaFactura >= new Date(`${filtros.fechaDesde}T00:00:00`));

      const coincideFechaHasta =
        !filtros.fechaHasta ||
        (fechaFactura &&
          fechaFactura <= new Date(`${filtros.fechaHasta}T23:59:59`));

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideFechaDesde &&
        coincideFechaHasta
      );
    })
    .sort((a, b) => {
      switch (filtros.orden) {
        case "recientes":
          return (
            new Date(b.fechaRegistro || b.fechaEmision) -
            new Date(a.fechaRegistro || a.fechaEmision)
          );
        case "antiguos":
          return (
            new Date(a.fechaRegistro || a.fechaEmision) -
            new Date(b.fechaRegistro || b.fechaEmision)
          );
        default:
          return 0;
      }
    });

  const fetchDatos = async () => {
    try {
      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        axiosClient.get("/Facturas"),
        axiosClient.get("/Clientes"),
        axiosClient.get("/Productos"),
      ]);


      setFacturas(toArray(facturasRes));
      setClientes(toArray(clientesRes));
      setProductos(toArray(productosRes));
      setError(null);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar datos";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {
    const conn = createConnection();
    connectionRef.current = conn;

    let isUnmounted = false;

    conn
      .start()
      .then(() => {
        if (isUnmounted) {
          return conn.stop();
        }
        console.log("Conectado a SignalR");
        conn.on("FacturaCreada", (data) => {
          toast.success(`Factura #${data.id} creada correctamente`);
          fetchDatos?.();
        });
      })
      .catch((err) => {
        if (err?.name === "AbortError") {
          console.debug("SignalR abortado durante start (desmontaje).");
          return;
        }
        console.error("Error al conectar SignalR:", err);
      });

    return () => {
      isUnmounted = true;
      if (connectionRef.current) {
        console.log("Desconectando SignalR...");
        connectionRef.current.off("FacturaCreada");
        connectionRef.current
          .stop()
          .catch((err) => console.debug("Error al detener SignalR:", err));
      }
    };
  }, []);

  /* const abrirModalPago = (fact) => {
    setFacturaParaPago(fact);
    setMostrarModalPago(true);
  };*/

  const handleFacturaCreada = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchDatos();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-error mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar datos</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchDatos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2">
      {mensajeExito && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{mensajeExito}</span>
          <button
            className="btn btn-close"
            onClick={() => setMensajeExito("")}
          />
        </div>
      )}
      {mostrarFiltros && (
        <div className="modal-overlay" onClick={() => setMostrarFiltros(false)}>
          <div className="modal-filtros" onClick={(e) => e.stopPropagation()}>
            <div className="modal-filtros-header">
              <h4>Filtros</h4>
              <button
                className="btn-close"
                onClick={() => setMostrarFiltros(false)}
              />
            </div>

            <p className="text-muted mb-3">
              Define los filtros que deseas aplicar a la tabla:
            </p>

            <div className="mb-3">
              <label className="form-label">Tipo de moneda</label>
              <select
                className="form-select"
                value={filtrosDraft.moneda}
                onChange={(e) =>
                  actualizarFiltroDraft("moneda", e.target.value)
                }
              >
                <option value="COP">COP</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={filtrosDraft.estado}
                onChange={(e) =>
                  actualizarFiltroDraft("estado", e.target.value)
                }
              >
                <option value="Todos">Todos</option>
                <option value="Pagada">Pagada</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha desde</label>
              <input
                type="date"
                className="form-control"
                value={filtrosDraft.fechaDesde}
                onChange={(e) =>
                  actualizarFiltroDraft("fechaDesde", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha hasta</label>
              <input
                type="date"
                className="form-control"
                value={filtrosDraft.fechaHasta}
                onChange={(e) =>
                  actualizarFiltroDraft("fechaHasta", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ordenar por</label>
              <select
                className="form-select"
                value={filtrosDraft.orden}
                onChange={(e) => actualizarFiltroDraft("orden", e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
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

              <button className="btn btn-primary" onClick={aplicarFiltros}>
                Filtrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="opcions-header">
        <div className="filters">
          <div className="buscador-clientes">
            <div className="buscador-input-wrap">
              <i className="bi bi-search buscador-icon"></i>

              <input
                type="text"
                className="form-control buscador-input"
                placeholder="Buscar por identificación o cliente..."
                value={buscador}
                autoComplete="off"
                onChange={(e) => setBuscador(e.target.value)}
                onFocus={() => setMostrarSugerencias(true)}
                onBlur={() => {
                  setTimeout(() => setMostrarSugerencias(false), 150);
                }}
              />
            </div>

            {mostrarSugerencias && sugerenciasFiltradas.length > 0 && (
              <div className="buscador-dropdown">
                {sugerenciasFiltradas.map((cliente) => (
                  <button
                    key={cliente.id}
                    type="button"
                    className="buscador-item"
                    onClick={() => seleccionarCliente(cliente)}
                  >
                    <span className="buscador-item-nombre">
                      {cliente.nombreCompleto}
                    </span>
                    <span className="buscador-item-nit">{cliente.nit}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="btn btn-filtros" onClick={abrirModalFiltros}>
            <FunnelFill size={16} />
            Filtros
          </button>
        </div>

        <button
          className="btn-crear"
          onClick={() => navigate("/nueva-factura")}
        >
          Nueva Factura
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover facturas-table">
              <thead className="facturas-table-header">
                <tr>
                  <th>Fecha</th>
                  <th>Comprobante</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Saldo</th>
                  <th>DIAN</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No hay facturas registradas
                    </td>
                  </tr>
                ) : (
                  filtrados.map((fact) => {
                    const nombreCliente = obtenerNombreCliente(fact.cliente);
                    const nitCliente = obtenerNitCliente(fact.cliente);
                    const saldo =
                      fact.saldoPendiente ??
                      (fact.estado === "Pagada" ? 0 : fact.totalFactura || 0);

                    return (
                      <tr key={fact.id}>
                        <td>
                          {new Date(
                            fact.fechaEmision || fact.fechaRegistro,
                          ).toLocaleDateString("es-CO")}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="link-button factura-link"
                            onClick={() => window.open(`/facturas/${fact.id}`, '_blank')}
                          >
                            {(fact.prefijo && fact.numeroFactura) ? `${fact.prefijo}${fact.numeroFactura}` : (fact.numeroFactura || `FV-${fact.id}`)}
                          </button>
                          <div className="text-muted small">
                            Factura de venta
                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="link-button cliente-link"
                            onClick={() =>
                              navigate(`/clientes/${fact.cliente?.id}`)
                            }
                            disabled={!fact.cliente?.id}
                          >
                            {nombreCliente}
                          </button>
                          <div className="text-muted small">
                            {nitCliente || "Sin NIT"}
                          </div>
                        </td>

                        <td className="text-end">
                          ${(fact.totalFactura || 0).toLocaleString("es-CO")}{" "}
                          COP
                        </td>

                        <td className="text-end">
                          <div>{saldo.toLocaleString("es-CO")} COP</div>
                          {saldo === 0 ? (
                            <span className="badge saldo-pagado">Pagada</span>
                          ) : (
                            <span className="badge saldo-pendiente">
                              Pendiente
                            </span>
                          )}
                        </td>

                        <td>
                          {(fact.cufe || fact.numeroAutorizacion) ? (
                            <span className="estado-dian aprobado">Aprobada</span>
                          ) : (
                            <span className="estado-dian pendiente" style={{ color: '#d97706', backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>Pendiente</span>
                          )}
                        </td>

                        <td>
                          <span className="email-estado">
                            {fact.enviadaPorCorreo ? "Enviado" : "Pendiente"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-ver-documento"
                            onClick={() => window.open(`/facturas/${fact.id}`, '_blank')}
                          >
                            Ver documento
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalCrearFactura
        open={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        clientes={clientes}
        productos={productos}
        onSuccess={handleFacturaCreada}
      />

      {facturaVista && (
        <ModalFacturaPDF
          facturaId={facturaVista}
          onClose={() => setFacturaVista(null)}
        />
      )}

      {mostrarModalPago && facturaParaPago && (
        <ModalPago
          factura={facturaParaPago}
          onSuccess={fetchDatos}
          onClose={() => setMostrarModalPago(false)}
          setMensajeExito={setMensajeExito}
        />
      )}
    </div>
  );
}

export default Facturas;
