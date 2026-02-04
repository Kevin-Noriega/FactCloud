import { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import ModalDocumentoSoporte from "../components/ModalDocumentoSoporte";
import "../styles/sharedPage.css";
import { 
  FileEarmarkText, 
  Eye, 
  Pencil, 
  Trash,
  XCircle,
  CheckCircleFill,
  FileEarmarkPdf,
  FileEarmarkCode,
  Envelope
} from "react-bootstrap-icons";

function DocumentosSoporte() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [documentoEditando, setDocumentoEditando] = useState(null);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [documentoVer, setDocumentoVer] = useState(null);
  const [buscador, setBuscador] = useState("");
  const [filtro, setFiltro] = useState("recientes");

  const filtrados = documentos
    .filter((doc) => {
      const query = buscador.trim().toLowerCase();
      return (
        !query ||
        doc.numeroDocumento?.toLowerCase().includes(query) ||
        doc.proveedorNombre?.toLowerCase().includes(query) ||
        doc.cuds?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (filtro) {
        case "recientes":
          return new Date(b.fechaGeneracion) - new Date(a.fechaGeneracion);
        case "antiguos":
          return new Date(a.fechaGeneracion) - new Date(b.fechaGeneracion);
        case "mayor":
          return b.valorTotal - a.valorTotal;
        case "menor":
          return a.valorTotal - b.valorTotal;
        default:
          return 0;
      }
    });

  const fetchDocumentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/DocumentosSoporte`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setDocumentos(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar documentos soporte:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const handleNuevoDocumento = () => {
    setDocumentoEditando(null);
    setMostrarModal(true);
  };

  const handleEditarDocumento = (doc) => {
    setDocumentoEditando(doc);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setDocumentoEditando(null);
  };

  const handleGuardadoExitoso = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    fetchDocumentos();
    handleCerrarModal();
  };

  const eliminarDocumento = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/DocumentosSoporte/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorTxt = await response.text();
        throw new Error(errorTxt);
      }

      setMensajeExito("Documento soporte eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);
      fetchDocumentos();
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      alert("Error al eliminar documento soporte: " + error.message);
    }
    setDocumentoAEliminar(null);
  };

  const descargarPDF = (id) => {
    window.open(`${API_URL}/DocumentosSoporte/${id}/pdf`, "_blank");
  };

  const descargarXML = (id) => {
    window.open(`${API_URL}/DocumentosSoporte/${id}/xml`, "_blank");
  };

  const enviarEmail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/DocumentosSoporte/${id}/enviar-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al enviar email");
      
      setMensajeExito("Email enviado exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al enviar email: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Cargando documentos soporte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-error mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar documentos soporte</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchDocumentos}>
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
            <h2 className="header-title">Documentos Soporte</h2>
            <p className="header-subtitle">
              Gestiona tus adquisiciones a proveedores no obligados a facturar
            </p>
          </div>
          <div className="header-icon">
            <FileEarmarkText size={80} />
          </div>
        </div>
      </div>

      <div className="nota-info">
        <p>
          <strong>Información importante:</strong> Los documentos soporte se utilizan 
          para soportar adquisiciones realizadas a proveedores no obligados a expedir 
          factura electrónica, cumpliendo con la normativa DIAN.
        </p>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <CheckCircleFill size={20} className="me-2" />
          <span>{mensajeExito}</span>
          <button
            className="btn-close"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      <div className="opcions-header">
        <button className="btn-crear" onClick={handleNuevoDocumento}>
          Nuevo Documento Soporte
        </button>
        <div className="filters">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por número, proveedor o CUDS..."
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
            <option value="mayor">Mayor valor</option>
            <option value="menor">Menor valor</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>N° Documento</th>
                  <th>CUDS</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>NIT Proveedor</th>
                  <th>Descripción</th>
                  <th>Valor Total</th>
                  <th>Estado DIAN</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No hay documentos soporte registrados
                    </td>
                  </tr>
                ) : (
                  filtrados.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <strong>{doc.numeroDocumento}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {doc.cuds?.substring(0, 20)}...
                        </small>
                      </td>
                      <td>
                        {new Date(doc.fechaGeneracion).toLocaleDateString("es-CO")}
                      </td>
                      <td>{doc.proveedorNombre}</td>
                      <td>{doc.proveedorNit}</td>
                      <td>{doc.descripcion}</td>
                      <td>
                        <strong>
                          ${doc.valorTotal?.toLocaleString("es-CO")}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            doc.estadoDian === "Aceptado"
                              ? "bg-success"
                              : doc.estadoDian === "Rechazado"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {doc.estadoDian || "Pendiente"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group-acciones">
                          <button
                            className="btn btn-sm btn-ver"
                            onClick={() => setDocumentoVer(doc)}
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-pdf"
                            onClick={() => descargarPDF(doc.id)}
                            title="Descargar PDF"
                          >
                            <FileEarmarkPdf size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-xml"
                            onClick={() => descargarXML(doc.id)}
                            title="Descargar XML"
                          >
                            <FileEarmarkCode size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-email"
                            onClick={() => enviarEmail(doc.id)}
                            title="Enviar por email"
                          >
                            <Envelope size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-editar"
                            onClick={() => handleEditarDocumento(doc)}
                            title="Editar"
                            disabled={doc.estadoDian === "Aceptado"}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-eliminar"
                            onClick={() => setDocumentoAEliminar(doc)}
                            title="Eliminar"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ver Detalles */}
      {documentoVer && (
        <div className="modal-overlay" onClick={() => setDocumentoVer(null)}>
          <div className="modal-ver" onClick={(e) => e.stopPropagation()}>
            <h5>
              <FileEarmarkText className="me-2" />
              Detalles del Documento Soporte
            </h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Número Documento</th>
                  <td>{documentoVer.numeroDocumento}</td>
                </tr>
                <tr>
                  <th>CUDS</th>
                  <td><small>{documentoVer.cuds}</small></td>
                </tr>
                <tr>
                  <th>Fecha Generación</th>
                  <td>
                    {new Date(documentoVer.fechaGeneracion).toLocaleString("es-CO")}
                  </td>
                </tr>
                <tr>
                  <th>Proveedor</th>
                  <td>{documentoVer.proveedorNombre}</td>
                </tr>
                <tr>
                  <th>NIT Proveedor</th>
                  <td>{documentoVer.proveedorNit}</td>
                </tr>
                <tr>
                  <th>Descripción</th>
                  <td>{documentoVer.descripcion}</td>
                </tr>
                <tr>
                  <th>Valor Total</th>
                  <td>
                    <strong>
                      ${documentoVer.valorTotal?.toLocaleString("es-CO")}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <th>Estado DIAN</th>
                  <td>
                    <span
                      className={`badge ${
                        documentoVer.estadoDian === "Aceptado"
                          ? "bg-success"
                          : documentoVer.estadoDian === "Rechazado"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {documentoVer.estadoDian || "Pendiente"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setDocumentoVer(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {documentoAEliminar && (
        <div className="modal-overlay" onClick={() => setDocumentoAEliminar(null)}>
          <div className="modal-eliminar" onClick={(e) => e.stopPropagation()}>
            <h5>¿Eliminar documento soporte?</h5>
            <p className="text-center text-muted mb-4">
              Esta acción no se puede deshacer. El documento{" "}
              <strong>{documentoAEliminar.numeroDocumento}</strong> será eliminado
              permanentemente.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setDocumentoAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => eliminarDocumento(documentoAEliminar.id)}
              >
                <Trash className="me-2" size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModal && (
        <ModalDocumentoSoporte
          isOpen={mostrarModal}
          onClose={handleCerrarModal}
          onSuccess={handleGuardadoExitoso}
          documentoEditar={documentoEditando}
        />
      )}
    </div>
  );
}

export default DocumentosSoporte;
