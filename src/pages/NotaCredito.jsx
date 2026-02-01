import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import ModalNotaCredito from "../components/ModalNotaCredito";
import "../styles/NotaCredito.css";

function NotaCredito() {
  const [notasCredito, setNotasCredito] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [buscador, setBuscador] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [filtro, setFiltro] = useState("recientes");

  const filtrados = notasCredito
    .filter((nota) => {
      const query = buscador.trim().toLowerCase();
      return !query || nota.numeroNota?.toLowerCase().includes(query);
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

      const [notasRes, facturasRes, productosRes] = await Promise.all([
        fetch(`${API_URL}/NotasCredito`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/Facturas`, {
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

      if (!notasRes.ok || !facturasRes.ok || !productosRes.ok) {
        throw new Error("Error al cargar datos");
      }

      const notasData = await notasRes.json();
      const facturasData = await facturasRes.json();
      const productosData = await productosRes.json();

      setNotasCredito(notasData);
      setFacturas(facturasData);
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

  const handleNotaCreada = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchDatos();
  };

  const abrirModalNuevo = () => {
    setNotaEditando(null);
    setMostrarModal(true);
  };

  const descargarXML = (nota) => {
    if (!nota.xmlBase64) {
      setMensajeExito("No hay XML generado para esta nota");
      setTimeout(() => setMensajeExito(""), 3000);
      return;
    }

    const xmlContent = atob(nota.xmlBase64);
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `NotaCredito-${nota.numeroNota}.xml`;
    a.click();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
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
                         <h2 className="header-title mb-4">Gestión Nota Credito</h2>
                          <p className="header-subtitle">
                          Gestiona, actualiza y controla tu inventario.
                          </p>
            
                        </div>
                        <div className="header-icon">
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

      <div className="nota-credito-info mb-4">
        <p>
          <strong>Información importante:</strong> Las notas crédito son documentos que reducen el valor de una factura. 
          Este proceso es irreversible una vez validado con la DIAN. Afecta directamente los registros contables.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-success text-white"
          onClick={abrirModalNuevo}
        >
          Nueva Nota Crédito
        </button>
        <div className="d-flex" style={{ gap: "20px", width: "40%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por número de nota"
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

      <div className="card">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">No hay notas crédito registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Número</th>
                    <th>Factura</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Motivo</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((nota) => (
                    <tr key={nota.id}>
                      <td><strong>{nota.numeroNota || nota.id}</strong></td>
                      <td>{nota.numeroFactura}</td>
                      <td>{nota.cliente?.nombre || "N/A"}</td>
                      <td>
                        {new Date(nota.fechaElaboracion).toLocaleDateString("es-CO")}
                      </td>
                      <td>
                        <span className={`badge ${
                          nota.tipo === "anulacion" ? "bg-danger" : 
                          nota.tipo === "devolucion" ? "bg-warning text-dark" : 
                          "bg-info"
                        }`}>
                          {nota.tipo === "anulacion" ? "Anulación" : 
                           nota.tipo === "devolucion" ? "Devolución" : 
                           "Descuento"}
                        </span>
                      </td>
                      <td>{nota.motivoDIAN}</td>
                      <td className="text-end fw-bold text-success">
                        ${nota.totalNeto?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td>
                        {nota.estado === "Enviada" ? (
                          <span className="badge bg-success">Enviada</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pendiente</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => console.log("Ver PDF")}
                        >
                          PDF
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => descargarXML(nota)}
                        >
                          XML
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

           {mostrarModal && (
        <ModalNotaCredito
        open={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setNotaEditando(null);
        }}
        notaEditando={notaEditando}
        facturas={facturas}
        productos={productos}
        onSuccess={handleNotaCreada}
      />
      )}
    </div>
  );
}

export default NotaCredito;