import React, { useEffect, useState, useCallback, useMemo } from "react";
import { API_URL } from "../../api/config.js";
import unidadesMedidaDIAN from "../../utils/UnidadesMedidas.json";
import { numeroALetras } from "../../utils/Helpers.js";

const obtenerLabel = (array, codigo) => 
  array.find((v) => v.codigo === codigo)?.descripcion || "";

const formatCurrency = (value) => 
  `$${Number(value || 0).toLocaleString("es-CO")}`;

const formatDate = (date) => 
  date ? new Date(date).toLocaleDateString("es-CO") : "N/A";

function ModalFacturaPDF({ facturaId, onClose }) {
  const [factura, setFactura] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePrint = useCallback(() => {
    setTimeout(() => window.print(), 100);
  }, []);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("usuario");
      if (userData) {
        setUsuario(JSON.parse(userData));
      } else {
        setError("Usuario no encontrado");
      }
    } catch (err) {
      console.error("Error usuario:", err);
      setError("Error cargando datos de usuario");
    }
  }, []);

  useEffect(() => {
    if (!facturaId) {
      setError("ID de factura inválido");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sesión expirada");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/Facturas/${facturaId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data) throw new Error("Factura vacía");
        setFactura(data);
      })
      .catch((err) => {
        console.error("Error API:", err);
        setError("Error cargando factura. Intenta de nuevo.");
      })
      .finally(() => setLoading(false));
  }, [facturaId]);

  const detalleFacturas = useMemo(() => 
    factura?.detallesFactura ?? 
    factura?.detalleFacturas ?? 
    factura?.detalles ?? 
    factura?.items ?? 
    factura?.detalle ?? 
    [], 
  [factura]);

  const qrCodeUrl = useMemo(() => 
    factura?.qr || 
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(factura?.cufe || factura?.numeroFactura || 'TEMP')}`,
  [factura]);
  if (loading) {
    return (
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
              <h5 className="fw-bold text-primary">Cargando Factura...</h5>
              <p className="text-muted small mb-0">Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !factura || !usuario) {
    return (
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body text-center py-5">
              <div className="text-danger mb-3" style={{ fontSize: "3rem" }}>⚠️</div>
              <h5 className="fw-bold text-danger mb-3">Error al cargar</h5>
              <p className="text-muted">{error || "Datos incompletos"}</p>
              <button className="btn btn-primary mt-3" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000 }}>

      <style>{`
@media print {

  .modal-backdrop, .no-print, .modal-header { 
    display: none !important; 
  }
html, body {
    overflow: visible !important;
    background: white !important;
  }
  .factura-print {
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    background: #fff !important;
    margin: 0 !important;
    padding: 1px !important;
    border: none !important;
    box-shadow: none !important;
    display: block !important;
  }

     @page {
    size: A4 portrait;
    margin: 10mm;
  }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }


`}</style>

      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: 950 }}>
        <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: 16 }}>
          {/* ✅ HEADER MEJORADO */}
          <div 
            className="modal-header bg-primary text-white border-0 no-print" 
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px 16px 0 0", padding: "15px 25px", display: "flex",
              justifyContent: "space-between", alignItems: "center", gap: 15
            }}
          >
            <div className="d-flex align-items-center flex-2">
              <h5 className="modal-title fw-bold mb-0 me-3">
                Factura Electrónica
              </h5>
              <span className="badge bg-white text-primary fs-6 px-3 py-2" style={{ fontFamily: "monospace" }}>
                #{factura.numeroFactura}
              </span>
            </div>
            
            <button 
              className="btn btn-light btn-sm fw-semibold shadow-sm"
              onClick={handlePrint}
              style={{ borderRadius: 4 }}
            >
              Imprimir/PDF
            </button>
            
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-sm" 
              onClick={onClose}
              aria-label="Cerrar modal"
            />
          </div>

          {/* ✅ BODY MEJORADO */}
          <div className="modal-body p-0 bg-light" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <div 
              className="factura-print m-4 p-5 bg-white"
              style={{
                border: "3px solid #667eea",
                borderRadius: 12,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: 13,
                boxShadow: "0 20px 60px rgba(102,126,234,0.15)"
              }}
            >
              {/* ✅ HEADER FACTURA */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30, gap: 20 }}>
                {/* Logo */}
                <div style={{ flex: "0 0 130px", textAlign: "center" }}>
                  {usuario.logoNegocio ? (
                    <img
                      src={usuario.logoNegocio}
                      alt={`Logo ${usuario.nombreNegocio}`}
                      style={{ maxWidth: 110, maxHeight: 85, objectFit: "contain" }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{
                      width: 110, height: 85,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: "bold", fontSize: 28,
                      borderRadius: 10, boxShadow: "0 8px 24px rgba(102,126,234,0.4)"
                    }}>
                      {usuario.nombreNegocio?.substring(0, 2).toUpperCase() || "FC"}
                    </div>
                  )}
                </div>

                {/* Datos Empresa */}
                <div style={{ flex: 1, paddingLeft: 25 }}>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#667eea" }}>
                    {usuario.nombreNegocio}
                  </h2>
                  <div style={{ fontSize: 11, marginTop: 10, lineHeight: 1.6, color: "#555" }}>
                    <div><strong>NIT:</strong> {usuario.nitNegocio}-{usuario.dvNitNegocio || "0"}</div>
                    <div><strong>Dirección:</strong> {usuario.direccionNegocio}</div>
                    <div><strong>Ciudad:</strong> {usuario.ciudadNegocio}, {usuario.departamentoNegocio} - COLOMBIA</div>
                    <div><strong>Tel:</strong> {usuario.telefono || "N/A"} | <strong>Email:</strong> {usuario.correoNegocio || usuario.correo || "N/A"}</div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 10, fontStyle: "italic", color: "#888", borderLeft: "3px solid #667eea", paddingLeft: 10 }}>
                    Responsables de IVA – No somos autorretenedores
                  </div>
                </div>

                {/* QR Code */}
                <div style={{ flex: "0 0 130px", textAlign: "center" }}>
                  <img
                    src={qrCodeUrl}
                    alt="Código QR de la factura"
                    style={{ width: 110, height: 110, border: "3px solid #667eea", borderRadius: 10, padding: 5 }}
                    loading="lazy"
                  />
                  <div style={{ fontSize: 9, color: "#888", marginTop: 5 }}>Escanea para validar</div>
                </div>
              </div>

              {/* ✅ CLIENTE + FACTURA */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 25, marginBottom: 25 }}>
                {/* Datos Cliente */}
                <div>
                  <div style={{ 
                    fontWeight: "bold", fontSize: 13, marginBottom: 12, 
                    color: "#667eea", borderBottom: "2px solid #667eea", 
                    paddingBottom: 5, display: "flex", alignItems: "center", gap: 8 
                  }}>
                    DATOS DEL CLIENTE
                  </div>
                  <table className="table table-bordered table-sm mb-0" style={{ fontSize: 11 }}>
                    <tbody>
                      <tr>
                        <td className="table-light fw-semibold" style={{ width: "30%" }}>Nombre:</td>
                        <td colSpan="3">{factura.cliente?.nombre} {factura.cliente?.apellido}</td>
                      </tr>
                      <tr>
                        <td className="table-light fw-semibold">Tipo ID:</td>
                        <td>{factura.cliente?.tipoIdentificacion}</td>
                        <td className="table-light fw-semibold" style={{ width: "20%" }}>Número:</td>
                        <td>{factura.cliente?.numeroIdentificacion}</td>
                      </tr>
                      <tr>
                        <td className="table-light fw-semibold">Dirección:</td>
                        <td colSpan="3">{factura.cliente?.direccion || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="table-light fw-semibold">Correo:</td>
                        <td>{factura.cliente?.correo || "N/A"}</td>
                        <td className="table-light fw-semibold">Teléfono:</td>
                        <td>{factura.cliente?.telefono || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Datos Factura */}
                <div>
                  <div style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    padding: 20, border: "2px solid #667eea", borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(102,126,234,0.1)"
                  }}>
                    <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 12, color: "#667eea", textAlign: "center" }}>
                      FACTURA
                    </div>
                    <div style={{ fontSize: 10, lineHeight: 1.8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Fecha:</strong>
                        <span>{formatDate(factura.fechaEmision)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Hora:</strong>
                        <span>{factura.horaEmision || "N/A"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px dashed #ccc" }}>
                        <strong>Vencimiento:</strong>
                        <span>{formatDate(factura.fechaVencimiento)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ TABLA DETALLES */}
              <table className="table table-bordered table-hover mb-4" style={{ fontSize: 11 }}>
                <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                  <tr>
                    <th style={{ width: "40%" }}>Descripción</th>
                    <th className="text-center" style={{ width: "12%" }}>Unidad</th>
                    <th className="text-center" style={{ width: "8%" }}>Cant.</th>
                    <th className="text-end" style={{ width: "13%" }}>Precio</th>
                    <th className="text-end" style={{ width: "13%" }}>Subtotal</th>
                    <th className="text-end" style={{ width: "14%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleFacturas.map((det, i) => (
                    <tr key={i}>
                      <td>{det.descripcion}</td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark">
                          {obtenerLabel(unidadesMedidaDIAN, det.unidadMedida) || det.unidadMedida || "N/D"}
                        </span>
                      </td>
                      <td className="text-center fw-semibold">{det.cantidad}</td>
                      <td className="text-end">{formatCurrency(det.precioUnitario)}</td>
                      <td className="text-end">{formatCurrency(det.subtotalLinea)}</td>
                      <td className="text-end fw-bold text-primary">{formatCurrency(det.totalLinea)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ FOOTER: PAGO + TOTALES */}
              <div style={{ display: "flex", gap: 25, fontSize: 11 }}>
                {/* Info izquierda */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 8, color: "#667eea", display: "flex", alignItems: "center", gap: 5 }}>
                      CONDICIÓN DE PAGO
                    </div>
                    <div className="p-3 bg-light rounded border">
                      <strong>{factura.formaPago || "Contado"}:</strong> {factura.medioPago || "Efectivo"} – {formatCurrency(factura.totalFactura)}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 8, color: "#667eea", display: "flex", alignItems: "center", gap: 5 }}>
                      VALOR EN LETRAS
                    </div>
                    <div className="p-3 bg-light rounded border" style={{ fontStyle: "italic", fontSize: 10 }}>
                      {numeroALetras(factura.totalFactura) || "Cero pesos"}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: "bold", marginBottom: 8, color: "#667eea", display: "flex", alignItems: "center", gap: 5 }}>
                      OBSERVACIONES
                    </div>
                    <div className="p-3 bg-light rounded border" style={{ fontSize: 10, minHeight: 60 }}>
                      {factura.observaciones || "Sin observaciones"}
                    </div>
                  </div>
                </div>

                {/* Totales derecha */}
                <div style={{
                  flex: "0 0 280px", border: "3px solid #667eea",
                  padding: 20, background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
                  borderRadius: 12, boxShadow: "0 8px 24px rgba(102,126,234,0.15)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8 }}>
                    <span>Total Bruto</span>
                    <span className="fw-semibold">{formatCurrency(factura.subtotal)}</span>
                  </div>

                  {factura.totalIVA > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>IVA ({factura.porcentajeIVA || 19}%)</span>
                      <span className="fw-semibold">{formatCurrency(factura.totalIVA)}</span>
                    </div>
                  )}

                  {factura.totalINC > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>INC</span>
                      <span className="fw-semibold">{formatCurrency(factura.totalINC)}</span>
                    </div>
                  )}

                  {factura.totalDescuentos > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span>Descuentos</span>
                      <span className="fw-semibold text-danger">-{formatCurrency(factura.totalDescuentos)}</span>
                    </div>
                  )}

                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontWeight: "bold", fontSize: 16, paddingTop: 15,
                    borderTop: "3px solid #667eea", marginTop: 10
                  }}>
                    <span style={{ color: "#667eea" }}>TOTAL A PAGAR</span>
                    <span className="text-primary">{formatCurrency(factura.totalFactura)}</span>
                  </div>
                </div>
              </div>

              {/* ✅ FOOTER FIRMA */}
              <div style={{
                marginTop: 40, paddingTop: 20, borderTop: "2px dashed #ccc",
                textAlign: "center", fontSize: 9, color: "#888"
              }}>
                <div className="mb-2">
                  {new Date().toLocaleString("es-CO")}
                </div>
                <div>
                  Documento válido ante la DIAN | Resolución DIAN {factura.resolucionDIAN || "N/A"} | Generado por <strong style={{ color: "#667eea" }}>FactCloud</strong> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalFacturaPDF;
