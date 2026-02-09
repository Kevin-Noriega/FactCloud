import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../api/config";
import ModalFacturaPDF from "../components/dashboard/ModalfacturaPDF.jsx";
import ModalPago from "../components/dashboard/ModalPago.jsx";
import ModalCrearFactura from "../components/dashboard/ModalCrearFactura.jsx"; 
import { createConnection } from "../SignalR/SignalConector";
import { toast, ToastContainer } from "react-toastify";
import {FileEarmarkText} from 'react-bootstrap-icons';
import "../styles/sharedPage.css";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [buscador, setBuscador] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [facturaParaPago, setFacturaParaPago] = useState(null);
  const connectionRef = useRef(null);
  const [facturaVista, setFacturaVista] = useState(null);
  const [filtro, setFiltro] = useState("recientes");

  const enviarFacturaPorCorreo = async (factId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado. Inicia sesión de nuevo.");
        return;
      }

      const resp = await fetch(`${API_URL}/Facturas/${factId}/enviar-cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al enviar factura");
      }

      setMensajeExito("Factura enviada al cliente por correo.");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      setMensajeExito(err.message);
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
  };

  const filtrados = facturas
    .filter((fac) => {
      const query = buscador.trim().toLowerCase();
      return !query || fac.numeroFactura?.toLowerCase().includes(query);
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

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        fetch(`${API_URL}/Facturas`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/Clientes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/Productos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!facturasRes.ok || !clientesRes.ok || !productosRes.ok) {
        throw new Error("Error al cargar datos");
      }

      const facturasData = await facturasRes.json();
      const clientesData = await clientesRes.json();
      const productosData = await productosRes.json();

      setFacturas(facturasData);
      setClientes(clientesData);
      setProductos(productosData);
      setError(null);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(error.message);
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

  const abrirModalPago = (fact) => {
    setFacturaParaPago(fact);
    setMostrarModalPago(true);
  };

  const handleFacturaCreada = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchDatos();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando pdatos...</p>
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
    <div className="container-fluid mt-4 px-4">
            <div className="header-card">
                      <div className="header-content">
                        <div className="header-text">
                         <h2 className="header-title mb-4">Gestión de Facturas</h2>
                          <p className="header-subtitle">
                          Emite, consulta y administra tus facturas de forma rápida y segura.
                          </p>
            
                        </div>
                        <div className="header-icon">
                          <FileEarmarkText size={80} />
                        </div>
                      </div>
                    </div>

      {mensajeExito && (
        <div className="alert alert-success d-flex justify-content-between align-items-center" role="alert">
          <span>{mensajeExito}</span>
          <button
            className="btn btn-close"
            onClick={() => setMensajeExito("")}
          />
        </div>
      )}

      <div className="opcions-header">

        <button
          className="btn-crear"
          onClick={() => setMostrarFormulario(true)}
        >
          Nueva Factura
        </button>
        <div className="filters">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por número de factura"
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

      <div className="card mt-3">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">No hay facturas registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-header">
                  <tr>
                    <th>Factura</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Subtotal</th>
                    <th>IVA</th>
                    <th>INC</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((fact) => (
                    <tr key={fact.id}>
                      <td><strong>{fact.numeroFactura || fact.id}</strong></td>
                      <td>
                        {fact.cliente
                          ? `${fact.cliente.nombre} ${fact.cliente.apellido}`
                          : "N/A"}
                      </td>
                      <td>
                        {new Date(fact.fechaEmision).toLocaleDateString("es-CO")}
                      </td>
                      <td className="text-end">
                        ${fact.subtotal?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end">
                        ${fact.totalIVA?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end">
                        ${fact.totalINC?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end fw-bold text-success">
                        ${fact.totalFactura?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td>
                        {fact.estado === "Pagada" ? (
                          <span className="badge bg-success">Pagada</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pendiente</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group-acciones">
                        {fact.estado !== "Pagada" && (
                          
                          <button
                            className="btn btn-cobrar btn-sm"
                            onClick={() => abrirModalPago(fact)}
                          >
                            Cobrar
                          </button>
                        )}
                        <button
                          className="btn btn-pdf btn-sm"
                          onClick={() => setFacturaVista(fact.id)}
                        >
                          PDF
                        </button>
                        <button
                          className="btn btn-xml btn-sm"
                          onClick={() => descargarXML(fact)}
                        >
                          XML
                        </button>
                        <button
                          className="btn btn-email btn-sm"
                          onClick={() => enviarFacturaPorCorreo(fact.id)}
                        >
                          Enviar Email
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
