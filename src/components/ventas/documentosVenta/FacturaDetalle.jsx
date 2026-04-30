import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { numeroALetras } from "../../../utils/Helpers";
import mediosPagoJSON from "../../../utils/MediosPago.json";
import unidadesMedidaDIAN from "../../../utils/UnidadesMedidas.json";
import { useUsuarios } from "../../../hooks/useUsuarios";
import {
  FileEarmarkText,
  Printer,
  ChatLeftText,
  Paperclip,
  Envelope,
  CheckLg,
  CaretDownFill,
  XCircle,
  Download,
  SendFill,
  PencilSquare,
} from "react-bootstrap-icons";
import { toast, ToastContainer } from "react-toastify";
import "./FacturaDetalle.css";

/* ── Utilidades ─────────────────────────────────── */
const obtenerLabelUnidad = (codigo) =>
  unidadesMedidaDIAN.find((v) => v.codigo === codigo)?.descripcion || codigo || "Unidad";

const obtenerLabelMedioPago = (codigo) =>
  mediosPagoJSON.find((m) => m.codigo === String(codigo))?.descripcion || codigo || "No definido";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "N/A";

const formatTime = (factura) => {
  if (factura?.horaEmision) return factura.horaEmision.substring(0, 5);
  if (factura?.fechaEmision) {
    const d = new Date(factura.fechaEmision);
    return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }
  return "00:00";
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return `${d.toLocaleDateString("es-CO")} ${d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} hrs.`;
};

const obtenerFormaPago = (codigo) => {
  const map = { "1": "Contado", "2": "Crédito" };
  return map[String(codigo)] || codigo || "Contado";
};

/* ── Steps config ────────────────────────────────── */
const STEPS = [
  { key: "guardado", label: "Documento guardado" },
  { key: "enviadoDIAN", label: "Enviado a la DIAN" },
  { key: "aprobadoDIAN", label: "Aprobado por la DIAN" },
  { key: "enviadoMail", label: "Enviado por Mail" },
];

function calcularStepActivo(factura) {
  if (!factura) return 0;
  // Siempre guardado = step 0 completado
  let completados = 1;
  if (factura.enviadaDIAN || factura.fechaEnvioDIAN) completados = 2;
  if (factura.respuestaDIAN || factura.cufe) completados = 3;
  if (factura.enviadaCliente || factura.fechaEnvioCliente) completados = 4;
  return completados;
}

function obtenerMensajeBanner(completados) {
  if (completados >= 4)
    return "El documento electrónico Aprobado por la DIAN ha sido enviado con CUFE y QR a tu cliente de forma exitosa.";
  if (completados >= 3)
    return "El documento electrónico ha sido aprobado por la DIAN. Pendiente de envío al cliente.";
  if (completados >= 2)
    return "El documento ha sido enviado a la DIAN. Esperando respuesta de aprobación.";
  return "El documento ha sido guardado exitosamente. Pendiente de envío a la DIAN.";
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
function FacturaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [factura, setFactura] = useState(null);
  const { data: userData, isLoading: isLoadingUser } = useUsuarios();

  const usuario = userData?.usuario || null;
  const negocio = userData?.negocio || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  /* ── Cargar factura desde API ── */
  useEffect(() => {
    if (!id) {
      setError("ID de factura inválido.");
      setLoading(false);
      return;
    }

    const fetchFactura = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/Facturas/${id}`);
        // axiosClient response interceptor devuelve `response` (axios),
        // el dato real puede estar en res.data o directamente en res
        const data = res?.data ?? res;
        if (!data || typeof data !== "object") throw new Error("Respuesta vacía");
        setFactura(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar factura:", err);
        setError(
          err?.response?.status === 404
            ? "La factura no existe o fue eliminada."
            : "No se pudo cargar la factura. Intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFactura();
  }, [id]);

  /* ── Cerrar dropdown al hacer clic fuera ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Acciones ── */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDescargarXML = useCallback(() => {
    if (!factura?.xmlBase64) {
      toast.warn("No hay XML generado para esta factura");
      return;
    }
    try {
      const xmlContent = atob(factura.xmlBase64);
      const blob = new Blob([xmlContent], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Factura-${factura.prefijo || "FV"}${factura.numeroFactura || factura.id}.xml`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("XML descargado correctamente");
    } catch {
      toast.error("Error al descargar XML");
    }
  }, [factura]);

  const handleEnviarCorreo = useCallback(async () => {
    if (!factura?.id) return;
    try {
      await axiosClient.post(`/Facturas/${factura.id}/enviar-cliente`);
      toast.success("Factura enviada al cliente por correo.");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Error al enviar factura";
      toast.error(msg);
    }
  }, [factura]);

  const handleEditar = useCallback(() => {
    navigate(`/nueva-factura?editar=${id}`);
  }, [navigate, id]);

  /* ── Loading State ── */
  if (loading || isLoadingUser) {
    return (
      <div className="fd-loading">
        <div className="fd-loading-spinner">
          <div className="spinner-border text-primary" role="status" />
          <p>Cargando factura...</p>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !factura) {
    return (
      <div className="fd-error">
        <div className="fd-error-card">
          <XCircle size={48} className="text-danger mb-3" />
          <h4>No se pudo cargar la factura</h4>
          <p className="text-muted">{error || "Datos no disponibles."}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/ventas")}>
            Volver a Ventas
          </button>
        </div>
      </div>
    );
  }

  /* ── Datos derivados ── */
  const detalles =
    factura.detallesFactura ??
    factura.detalleFacturas ??
    factura.detalles ??
    factura.items ??
    factura.detalle ??
    [];

  const cliente = factura.cliente || {};
  const stepCompletados = calcularStepActivo(factura);

  const qrCodeUrl =
    factura.qr ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      factura.cufe || factura.numeroFactura || "TEMP"
    )}`;

  const prefijo = factura.prefijo || "";
  const numero = factura.numeroFactura || factura.id;
  const totalItems = detalles.reduce((acc, d) => acc + (d.cantidad || 1), 0);

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <div className="fd-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ═══ HEADER SUPERIOR ═══ */}
      <div className="fd-header no-print">
        <div className="fd-header-left">
          <h2 className="fd-title">
            Factura de venta : {prefijo}-{numero}
          </h2>
          <p className="fd-subtitle">
            Creado: {negocio?.nombreNegocio || usuario?.nombreNegocio || "Empresa"}{" "}
            {formatDateTime(factura.fechaRegistro || factura.fechaEmision)}
          </p>

          <div className="fd-action-row">
            <button className="fd-btn-outlined" onClick={handleEditar}>
              <PencilSquare size={14} />
              Editar
            </button>

            <div className="fd-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="fd-btn-outlined fd-btn-mas"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Más <CaretDownFill size={10} />
              </button>
              {dropdownOpen && (
                <ul className="fd-dropdown-menu">
                  <li>
                    <button onClick={() => { navigate(`/nueva-nota-credito?facturaId=${id}`); setDropdownOpen(false); }}>
                      Aplicar nota crédito
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { navigate(`/nueva-nota-debito?facturaId=${id}`); setDropdownOpen(false); }}>
                      Aplicar nota débito
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { toast.info("Funcionalidad en desarrollo"); setDropdownOpen(false); }}>
                      Actualizar documento electrónico
                    </button>
                  </li>
                  <li className="fd-dropdown-divider" />
                  <li>
                    <button onClick={() => { toast.info("Funcionalidad en desarrollo"); setDropdownOpen(false); }}>
                      Anular
                    </button>
                  </li>
                  <li>
                    <button className="text-danger" onClick={() => { toast.info("Funcionalidad en desarrollo"); setDropdownOpen(false); }}>
                      Eliminar
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="fd-header-right">
          <button className="fd-circle-btn" title="Documento relacionado" onClick={() => toast.info("Documentos relacionados")}>
            <FileEarmarkText size={18} />
          </button>
          <button className="fd-circle-btn" title="Imprimir" onClick={handlePrint}>
            <Printer size={18} />
          </button>
          <button className="fd-circle-btn" title="Comentarios" onClick={() => toast.info("Sección de comentarios")}>
            <ChatLeftText size={18} />
          </button>
          <button className="fd-circle-btn" title="Descargar XML" onClick={handleDescargarXML}>
            <Download size={18} />
          </button>
          <button className="fd-circle-btn" title="Adjuntos" onClick={() => toast.info("Gestión de adjuntos")}>
            <Paperclip size={18} />
          </button>
          <button className="fd-circle-btn fd-circle-btn-send" title="Enviar por correo" onClick={handleEnviarCorreo}>
            <Envelope size={18} />
          </button>
        </div>
      </div>

      {/* ═══ STEPPER ═══ */}
      <div className="fd-stepper-card no-print">
        <div className="fd-stepper">
          {STEPS.map((step, i) => {
            const isCompleted = i < stepCompletados;
            const isCurrent = i === stepCompletados;
            return (
              <React.Fragment key={step.key}>
                {i > 0 && (
                  <div className={`fd-stepper-line ${isCompleted ? "completed" : ""}`} />
                )}
                <div className={`fd-stepper-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                  <div className="fd-step-circle">
                    {isCompleted ? <CheckLg size={14} /> : <span>{i + 1}</span>}
                  </div>
                  <span className="fd-step-label">{step.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className={`fd-banner ${stepCompletados >= 4 ? "success" : stepCompletados >= 3 ? "info" : "warning"}`}>
          {stepCompletados >= 3 && <CheckLg size={18} />}
          <span>{obtenerMensajeBanner(stepCompletados)}</span>
        </div>
      </div>

      {/* ═══ FACTURA (Papel) ═══ */}
      <div className="fd-invoice-paper">
        {/* ── Encabezado empresa ── */}
        <div className="fd-invoice-header">
          <div className="fd-inv-logo">
            {negocio?.logoNegocio || usuario?.logoNegocio ? (
              <img src={negocio?.logoNegocio || usuario?.logoNegocio} alt="Logo" />
            ) : (
              <div className="fd-inv-logo-placeholder">
                <span>Espacio para</span>
                <span>Logo Corporativo</span>
              </div>
            )}
          </div>

          <div className="fd-inv-company">
            <h3>{negocio?.nombreNegocio || usuario?.nombreNegocio || "EMPRESA S.A.S"}</h3>
            <p>NIT {negocio?.nit || usuario?.nitNegocio || "000.000.000"}-{negocio?.dvNit || usuario?.dvNitNegocio || "0"}</p>
            <p>{negocio?.direccion || usuario?.direccionNegocio || "Dirección no especificada"}</p>
            <p>Tel. {negocio?.telefono || usuario?.telefono || "No especificado"}</p>
            <p>
              {negocio?.ciudad || usuario?.ciudadNegocio || "Ciudad"} - Colombia
            </p>
            <p>{negocio?.correo || usuario?.correoNegocio || usuario?.correo || "correo@empresa.com"}</p>
          </div>

          <div className="fd-inv-qr">
            <img src={qrCodeUrl} alt="Código QR" />
          </div>

          <div className="fd-inv-type-box">
            <h4>Factura electrónica de venta</h4>
            <p className="fd-inv-type-num">
              No. {prefijo} {numero}
            </p>
          </div>
        </div>

        {/* ── Datos cliente + Fechas ── */}
        <div className="fd-inv-info-grid">
          <div className="fd-inv-client-table">
            <table>
              <tbody>
                <tr>
                  <td className="fd-td-label">Señores</td>
                  <td colSpan="3">
                    {cliente.nombreComercial || [cliente.nombre, cliente.apellido].filter(Boolean).join(" ") || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="fd-td-label">NIT</td>
                  <td>{cliente.numeroIdentificacion || "N/A"}</td>
                  <td className="fd-td-label">Teléfono</td>
                  <td>{cliente.telefono || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fd-td-label">Dirección</td>
                  <td>{cliente.direccion || "No aplica"}</td>
                  <td className="fd-td-label">Ciudad</td>
                  <td>
                    {[cliente.ciudad, "Colombia"].filter(Boolean).join(" - ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="fd-inv-dates-table">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Fecha y hora Factura</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fd-td-label">Generación</td>
                  <td>{formatDate(factura.fechaEmision)}, {formatTime(factura)}</td>
                </tr>
                <tr>
                  <td className="fd-td-label">Expedición</td>
                  <td>{formatDate(factura.fechaEmision)}, {formatTime(factura)}</td>
                </tr>
                <tr>
                  <td className="fd-td-label">Vencimiento</td>
                  <td>{formatDate(factura.fechaVencimiento)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Tabla de ítems ── */}
        <div className="fd-inv-items-wrapper">
          <table className="fd-inv-items-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }} className="text-center">Ítem</th>
                <th style={{ width: "35%" }}>Descripción</th>
                <th style={{ width: "10%" }} className="text-center">Cantidad</th>
                <th style={{ width: "15%" }} className="text-right">Vr. Unitario</th>
                <th style={{ width: "10%" }} className="text-center">Desc %</th>
                <th style={{ width: "10%" }} className="text-center">IVA %</th>
                <th style={{ width: "15%" }} className="text-right">Vr. Total</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-muted">
                    Sin detalle de productos
                  </td>
                </tr>
              ) : (
                detalles.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.descripcion || item.nombre || "Producto sin descripción"}</td>
                    <td className="text-center">{Number(item.cantidad || 0).toFixed(2)}</td>
                    <td className="text-right">{formatCurrency(item.precioUnitario)}</td>
                    <td className="text-center">{item.porcentajeDescuento || 0}%</td>
                    <td className="text-center">{item.porcentajeIVA || item.porcentajeIva || item.tarifaIVA || 0}%</td>
                    <td className="text-right">{formatCurrency(item.totalLinea || item.subtotalLinea || item.subtotal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer: Pago + Totales ── */}
        <div className="fd-inv-footer-grid">
          <div className="fd-inv-footer-left">
            <div className="fd-inv-info-block">
              <strong>Total items:</strong>{" "}
              <span className="text-primary">{totalItems}</span>
            </div>

            <div className="fd-inv-info-block">
              <strong>Valor en Letras:</strong>
              <p className="fd-inv-letras">
                {numeroALetras(factura.totalFactura) || "Cero pesos"} m/cte
              </p>
            </div>

            <div className="fd-inv-info-block">
              <strong>Forma de pago:</strong>
              <p>{obtenerFormaPago(factura.formaPago)}</p>
            </div>

            <div className="fd-inv-info-block">
              <strong>Medio de pago:</strong>
              <div className="fd-inv-medio-pago-row">
                <span>{obtenerLabelMedioPago(factura.medioPago)}</span>
                <span>$ {formatCurrency(factura.totalFactura)}</span>
              </div>
            </div>

            <div className="fd-inv-info-block">
              <strong>Observaciones:</strong>
              <p>{factura.observaciones || "Sin observaciones"}</p>
            </div>
          </div>

          <div className="fd-inv-footer-right">
            <table className="fd-inv-totals-table">
              <tbody>
                <tr>
                  <td className="fd-td-label">Total Bruto</td>
                  <td className="text-right">{formatCurrency(factura.subtotal)}</td>
                </tr>
                {(factura.totalDescuentos || 0) > 0 && (
                  <tr>
                    <td className="fd-td-label">Descuentos</td>
                    <td className="text-right text-danger">-{formatCurrency(factura.totalDescuentos)}</td>
                  </tr>
                )}
                <tr>
                  <td className="fd-td-label">IVA 19%</td>
                  <td className="text-right">{formatCurrency(factura.totalIVA)}</td>
                </tr>
                {(factura.totalINC || 0) > 0 && (
                  <tr>
                    <td className="fd-td-label">INC</td>
                    <td className="text-right">{formatCurrency(factura.totalINC)}</td>
                  </tr>
                )}
                {(factura.totalRetenciones || 0) > 0 && (
                  <tr>
                    <td className="fd-td-label">Retenciones</td>
                    <td className="text-right text-danger">-{formatCurrency(factura.totalRetenciones)}</td>
                  </tr>
                )}
                <tr className="fd-total-row">
                  <td><strong>Total a Pagar</strong></td>
                  <td className="text-right"><strong>{formatCurrency(factura.totalFactura)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CUFE / Autorización ── */}
        <div className="fd-inv-cufe-box">
          <p>
            A esta factura de venta aplican las normas relativas a la letra de
            cambio (artículo 5 Ley 1231 de 2008). Con esta el Comprador declara
            haber recibido real y materialmente las mercancías o prestación de
            servicios descritos en este título - Valor.{" "}
            <strong>
              Número Autorización Electrónica{" "}
              {factura.numeroAutorizacion || "18760000001"}
            </strong>{" "}
            aprobado en {formatDate(factura.fechaInicioAutorizacion || factura.fechaEmision || new Date())} prefijo{" "}
            {prefijo || "FV"} desde el número{" "}
            {factura.rangoNumeracionDesde || 1} al{" "}
            {factura.rangoNumeracionHasta || 50000} Vigencia: 24 Meses
          </p>
          <div className="fd-cufe-text" style={{ wordBreak: 'break-all' }}>
            <strong>CUFE:</strong> {factura.cufe || "Pendiente de generación DIAN"}
          </div>
        </div>

        {/* ── Email status ── */}
        <div className="fd-inv-email-status">
          <div className="fd-inv-email-left">
            <SendFill size={14} className="text-primary" />
            <span>
              Documento{" "}
              <strong>{factura.enviadaCliente ? "enviado" : "pendiente"}</strong>{" "}
              a {cliente.nombre} {cliente.apellido}{" "}
              {cliente.correo ? `(${cliente.correo})` : ""}
            </span>
          </div>
          <div className="fd-inv-email-right">
            <span>
              {formatDate(factura.fechaEnvioCliente || factura.fechaEmision)} -{" "}
              {formatTime(factura)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturaDetalle;
