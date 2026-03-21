import { useState } from "react";
import { API_URL } from "../../api/config";
import ModalDocumentoSoporte from "../modals/ModalDocumentoSoporte";
import {
  Eye, Pencil, Trash,
  CheckCircleFill,
  FileEarmarkPdf, FileEarmarkCode,
  Envelope, FileEarmarkExcel,
  Search, Calendar3, XCircle,
} from "react-bootstrap-icons";
import {
  ANOS,
  PERIODOS,
  TIPOS_TRANSACCION,
  OPCIONES_DIAN,
} from "../../constants/documentoSoporte";
import { useDocumentoSoporte } from "../../hooks/useDocumentoSoporte";
import { calcularFechasPorPeriodo } from "../../utils/calcularFechas";
import "../../styles/ComprasGastos/DocumentoSoporte.css";
import { useNavigate } from "react-router-dom";

function DocumentosSoporte() {
  const {
    documentos,        // ← ahora sí viene del hook
    loading,
    error,
    eliminarDocumento,
    recargarDatos,
  } = useDocumentoSoporte();

  const [mensajeExito, setMensajeExito]             = useState("");
  const [mostrarModal, setMostrarModal]             = useState(false);
  const [documentoEditando, setDocumentoEditando]   = useState(null);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [documentoVer, setDocumentoVer]             = useState(null);
  const [filtrosVisibles, setFiltrosVisibles]       = useState(true);
  const navigate = useNavigate();

  // ── Estado de filtros ─────────────────────────────────────────
  const [filtros, setFiltros] = useState(() => {
    const fechas = calcularFechasPorPeriodo("15dias", new Date().getFullYear());
    return {
      proveedor:        "",
      tipoTransaccion:  "",
      facturaProveedor: "",
      creadoPor:        "",
      envioDian:        "",
      ano:              new Date().getFullYear(),
      periodo:          "15dias",
      fechaDesde:       fechas?.desde || "",
      fechaHasta:       fechas?.hasta || "",
    };
  });

  // ── Manejo de cambio de filtros ───────────────────────────────
  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => {
      const nuevo = { ...prev, [campo]: valor };
      if (
        (campo === "periodo" && valor !== "rango") ||
        (campo === "ano" && prev.periodo !== "rango")
      ) {
        const anoRef = campo === "ano" ? valor : prev.ano;
        const perRef = campo === "periodo" ? valor : prev.periodo;
        const fechas = calcularFechasPorPeriodo(perRef, anoRef);
        if (fechas) {
          nuevo.fechaDesde = fechas.desde;
          nuevo.fechaHasta = fechas.hasta;
        }
      }
      return nuevo;
    });
  };

  const limpiarFiltros = () => {
    const fechas = calcularFechasPorPeriodo("15dias", new Date().getFullYear());
    setFiltros({
      proveedor: "", tipoTransaccion: "", facturaProveedor: "",
      creadoPor: "", envioDian: "",
      ano:        new Date().getFullYear(),
      periodo:    "15dias",
      fechaDesde: fechas?.desde || "",
      fechaHasta: fechas?.hasta || "",
    });
  };

  // ── Guardado exitoso ──────────────────────────────────────────
  const handleGuardadoExitoso = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(""), 3000);
    setMostrarModal(false);
    recargarDatos();
    setDocumentoEditando(null);
  };

  // ── Descargas / Email ─────────────────────────────────────────
  const descargarPDF  = (id) => window.open(`${API_URL}/DocumentosSoporte/${id}/pdf`,  "_blank");
  const descargarXML  = (id) => window.open(`${API_URL}/DocumentosSoporte/${id}/xml`,  "_blank");
  const exportarExcel = ()   => window.open(`${API_URL}/DocumentosSoporte/exportar-excel`, "_blank");

  const enviarEmail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/DocumentosSoporte/${id}/enviar-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al enviar email");
      setMensajeExito("Email enviado exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    recargarDatos();
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarDocumento(id);
      setMensajeExito("Documento soporte eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      alert(err.message);
    }
    setDocumentoAEliminar(null);
  };

  // ── Error de carga ────────────────────────────────────────────
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-start gap-3">
          <div className="flex-grow-1">
            <h5 className="mb-1">Error al cargar documentos soporte</h5>
            <p className="mb-0">{error}</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={recargarDatos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-container">

      {/* ── Alerta éxito ── */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-3">
          <CheckCircleFill size={18} className="me-2" />
          {mensajeExito}
          <button className="btn-close" onClick={() => setMensajeExito("")} />
        </div>
      )}

      {/* ── Toggle filtros ── */}
      <button
        className="ds-toggle-filtros"
        onClick={() => setFiltrosVisibles((v) => !v)}
      >
        {filtrosVisibles ? "Ocultar" : "Mostrar"} criterios de búsqueda
      </button>

      {/* ── Panel filtros ── */}
      {filtrosVisibles && (
        <form className="ds-filtros-panel" onSubmit={handleBuscar}>
          <div className="ds-filtros-grid">

            {/* ── Columna izquierda ── */}
            <div className="ds-filtros-col">
              <div className="ds-filtro-fila">
                <label className="ds-filtro-label">Proveedor</label>
                <div className="ds-input-icono">
                  <input type="text" className="form-control form-control-sm"
                    placeholder="Buscar" value={filtros.proveedor}
                    onChange={(e) => handleFiltroChange("proveedor", e.target.value)} />
                  <Search size={14} className="ds-icono-buscar" />
                </div>
              </div>
              <div className="ds-filtro-fila">
                <label className="ds-filtro-label">Tipo de transacción</label>
                <select className="form-select form-select-sm"
                  value={filtros.tipoTransaccion}
                  onChange={(e) => handleFiltroChange("tipoTransaccion", e.target.value)}>
                  {TIPOS_TRANSACCION.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="ds-filtro-fila">
                <label className="ds-filtro-label">Factura proveedor</label>
                <div className="ds-input-icono">
                  <input type="text" className="form-control form-control-sm"
                    placeholder="Buscar" value={filtros.facturaProveedor}
                    onChange={(e) => handleFiltroChange("facturaProveedor", e.target.value)} />
                  <Search size={14} className="ds-icono-buscar" />
                </div>
              </div>
            </div>

            {/* ── Columna derecha ── */}
            <div className="ds-filtros-col">
              <div className="ds-filtro-fila ds-filtro-fecha">
                <label className="ds-filtro-label">Fecha elaboración</label>
                <div className="ds-fecha-controles">
                  <select className="form-select form-select-sm ds-select-ano"
                    value={filtros.ano}
                    onChange={(e) => handleFiltroChange("ano", Number(e.target.value))}>
                    {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select className="form-select form-select-sm ds-select-periodo"
                    value={filtros.periodo}
                    onChange={(e) => handleFiltroChange("periodo", e.target.value)}>
                    {PERIODOS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="ds-fecha-rangos">
                  <div className="ds-fecha-input">
                    <input type="date" className="form-control form-control-sm"
                      value={filtros.fechaDesde}
                      onChange={(e) => { handleFiltroChange("fechaDesde", e.target.value); handleFiltroChange("periodo", "rango"); }} />
                    <button type="button" className="ds-fecha-clear"
                      onClick={() => handleFiltroChange("fechaDesde", "")}>
                      <XCircle size={13} />
                    </button>
                    <button type="button" className="ds-fecha-calendar"><Calendar3 size={13} /></button>
                  </div>
                  <div className="ds-fecha-input">
                    <input type="date" className="form-control form-control-sm"
                      value={filtros.fechaHasta}
                      onChange={(e) => { handleFiltroChange("fechaHasta", e.target.value); handleFiltroChange("periodo", "rango"); }} />
                    <button type="button" className="ds-fecha-clear"
                      onClick={() => handleFiltroChange("fechaHasta", "")}>
                      <XCircle size={13} />
                    </button>
                    <button type="button" className="ds-fecha-calendar"><Calendar3 size={13} /></button>
                  </div>
                </div>
              </div>
              <div className="ds-filtro-fila">
                <label className="ds-filtro-label">Creado por</label>
                <div className="ds-input-icono">
                  <input type="text" className="form-control form-control-sm"
                    placeholder="Buscar" value={filtros.creadoPor}
                    onChange={(e) => handleFiltroChange("creadoPor", e.target.value)} />
                  <Search size={14} className="ds-icono-buscar" />
                </div>
              </div>
              <div className="ds-filtro-fila">
                <label className="ds-filtro-label">Envío a la Dian</label>
                <select className="form-select form-select-sm"
                  value={filtros.envioDian}
                  onChange={(e) => handleFiltroChange("envioDian", e.target.value)}>
                  {OPCIONES_DIAN.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="ds-filtros-acciones">
            <button type="submit" className="ds-btn-buscar">Buscar</button>
            <button type="button" className="ds-btn-limpiar" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        </form>
      )}

      {/* ── Tabla ── */}
      <div className="ds-tabla-wrapper">
        <div className="ds-tabla-topbar">
          <button className="ds-btn-excel" onClick={exportarExcel} title="Exportar a Excel">
            <FileEarmarkExcel size={18} />
          </button>
          <button className="btn-crear" onClick={() => navigate('/nuevo-documento-soporte')}>
            Nuevo Documento Soporte
          </button>
        </div>

        <div className="table-responsive">
          <table className="table ds-tabla mb-0">
            <thead>
              <tr>
                <th>Tipo de transacción</th>
                <th>Comprobante</th>
                <th>Factura proveedor</th>
                <th>Fecha elaboración</th>
                <th>Identificación</th>
                <th>Sucursal</th>
                <th>Proveedor</th>
                <th>Estado envío de correo</th>
                <th className="text-end">Valor</th>
                <th>Moneda</th>
                <th>Envío a la Dian</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Cargando...
                  </td>
                </tr>
              ) : documentos.length === 0 ? (
                <tr>
                  <td colSpan="12" className="ds-empty">
                    No se encontraron resultados para tu búsqueda
                  </td>
                </tr>
              ) : (
                documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td><small>{doc.tipoTransaccion || "—"}</small></td>
                    <td><strong>{doc.numeroDocumento}</strong></td>
                    <td><small>{doc.facturaProveedor || "—"}</small></td>
                    <td>
                      <small>
                        {doc.fechaGeneracion
                          ? new Date(doc.fechaGeneracion).toLocaleDateString("es-CO")
                          : "—"}
                      </small>
                    </td>
                    <td><small>{doc.proveedorNit || "—"}</small></td>
                    <td><small>{doc.sucursal || "—"}</small></td>
                    <td>{doc.proveedorNombre}</td>
                    <td>
                      <span className={`ds-badge-correo ${
                        doc.estadoCorreo === "Enviado"  ? "ds-badge-enviado"  :
                        doc.estadoCorreo === "Error"    ? "ds-badge-error"    :
                        "ds-badge-pendiente"
                      }`}>
                        {doc.estadoCorreo || "Pendiente"}
                      </span>
                    </td>
                    <td className="text-end">
                      <strong>${doc.valorTotal?.toLocaleString("es-CO") ?? "0"}</strong>
                    </td>
                    <td><small>{doc.moneda || "COP"}</small></td>
                    <td>
                      <span className={`ds-badge-dian ${
                        doc.estadoDian === "Aceptado"  ? "ds-badge-aceptado"  :
                        doc.estadoDian === "Rechazado" ? "ds-badge-rechazado" :
                        "ds-badge-pendiente"
                      }`}>
                        {doc.estadoDian || "Pendiente"}
                      </span>
                    </td>
                    <td>
                      <div className="ds-acciones">
                        <button className="ds-btn-accion ds-btn-ver"
                          onClick={() => setDocumentoVer(doc)} title="Ver">
                          <Eye size={14} />
                        </button>
                        <button className="ds-btn-accion ds-btn-pdf"
                          onClick={() => descargarPDF(doc.id)} title="PDF">
                          <FileEarmarkPdf size={14} />
                        </button>
                        <button className="ds-btn-accion ds-btn-xml"
                          onClick={() => descargarXML(doc.id)} title="XML">
                          <FileEarmarkCode size={14} />
                        </button>
                        <button className="ds-btn-accion ds-btn-email"
                          onClick={() => enviarEmail(doc.id)} title="Email">
                          <Envelope size={14} />
                        </button>
                        <button className="ds-btn-accion ds-btn-editar"
                          onClick={() => { setDocumentoEditando(doc); setMostrarModal(true); }}
                          title="Editar"
                          disabled={doc.estadoDian === "Aceptado"}>
                          <Pencil size={14} />
                        </button>
                        <button className="ds-btn-accion ds-btn-eliminar-tbl"
                          onClick={() => setDocumentoAEliminar(doc)} title="Eliminar">
                          <Trash size={14} />
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

      {/* ── Modal Ver detalles ── */}
      {documentoVer && (
        <div className="ds-modal-overlay" onClick={() => setDocumentoVer(null)}>
          <div className="ds-modal-ver" onClick={(e) => e.stopPropagation()}>
            <div className="ds-modal-header">
              <h6 className="mb-0">Detalles del Documento Soporte</h6>
              <button className="btn-close btn-close-sm" onClick={() => setDocumentoVer(null)} />
            </div>
            <div className="ds-modal-body">
              <table className="table table-sm table-borderless">
                <tbody>
                  {[
                    ["Número Documento", documentoVer.numeroDocumento],
                    ["CUDS",            <small key="cuds">{documentoVer.cuds}</small>],
                    ["Fecha Generación", documentoVer.fechaGeneracion
                      ? new Date(documentoVer.fechaGeneracion).toLocaleString("es-CO") : "—"],
                    ["Proveedor",       documentoVer.proveedorNombre],
                    ["NIT Proveedor",   documentoVer.proveedorNit],
                    ["Descripción",     documentoVer.descripcion],
                    ["Valor Total",     <strong key="val">${documentoVer.valorTotal?.toLocaleString("es-CO")}</strong>],
                    ["Estado DIAN", (
                      <span key="dian" className={`ds-badge-dian ${
                        documentoVer.estadoDian === "Aceptado"  ? "ds-badge-aceptado"  :
                        documentoVer.estadoDian === "Rechazado" ? "ds-badge-rechazado" :
                        "ds-badge-pendiente"
                      }`}>
                        {documentoVer.estadoDian || "Pendiente"}
                      </span>
                    )],
                  ].map(([key, val]) => (
                    <tr key={key}>
                      <th className="text-muted fw-normal" style={{ width: "160px" }}>{key}</th>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ds-modal-footer">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setDocumentoVer(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar eliminar ── */}
      {documentoAEliminar && (
        <div className="ds-modal-overlay" onClick={() => setDocumentoAEliminar(null)}>
          <div className="ds-modal-eliminar" onClick={(e) => e.stopPropagation()}>
            <h6 className="mb-3">¿Eliminar documento soporte?</h6>
            <p className="text-muted small text-center mb-4">
              Esta acción no se puede deshacer. El documento{" "}
              <strong>{documentoAEliminar.numeroDocumento}</strong> será eliminado permanentemente.
            </p>
            <div className="ds-modal-footer">
              <button className="btn btn-sm btn-outline-secondary"
                onClick={() => setDocumentoAEliminar(null)}>
                Cancelar
              </button>
              <button className="btn btn-sm btn-danger"
                onClick={() => handleEliminar(documentoAEliminar.id)}>
                <Trash size={14} className="me-1" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Crear / Editar ── */}
      <ModalDocumentoSoporte
        isOpen={mostrarModal}
        onClose={() => { setMostrarModal(false); setDocumentoEditando(null); }}
        onSuccess={handleGuardadoExitoso}
        documentoEditar={documentoEditando}
      />

    </div>
  );
}

export default DocumentosSoporte;