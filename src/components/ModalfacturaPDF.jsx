import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import unidadesMedidaDIAN from "../utils/UnidadesMedidas.json";

import { numeroALetras } from "../utils/Helpers.js";

function obtenerLabel(array, codigo) {
  return array.find((v) => v.codigo === codigo)?.descripcion || "";
}

function ModalFacturaPDF({ facturaId, onClose }) {
  const [factura, setFactura] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  useEffect(() => {
    if (!facturaId) return;

    fetch(`${API_URL}/Facturas/${facturaId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setFactura(data);
      })
      .catch((err) => console.error("Error cargando factura:", err));
  }, [facturaId]);

  if (!factura || !usuario) return null;

  const detalleFacturas =
    factura.detallesFactura ??
    factura.detalleFacturas ??
    factura.detalles ??
    factura.items ??
    factura.detalle ??
    [];

  console.log("Detalles detectados:", detalleFacturas);

  const qrCodeUrl =
    factura.qr ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
      factura.cufe || factura.numeroFactura
    }`;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
    >
      <style>
        {`
@media print {

  /* Oculta absolutamente todo en la página */
  body * {
    visibility: hidden !important;
  }

  /* Solo se muestra la factura */
  .factura-print, .factura-print * {
    visibility: visible !important;
  }

  /* Posiciona la factura como única hoja */
  .factura-print {
    position: center !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    background: #fff !important;
    margin: 0 !important;
    padding: 1px !important;
    border: none !important;
    box-shadow: none !important;
  }
}
`}
      </style>

      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        style={{ maxWidth: 900 }}
      >
        <div className="modal-content" style={{ borderRadius: 10 }}>
          <div className="modal-header bg-primary text-white no-print">
            <h5 className="modal-title" style={{ flex: 1 }}>
              Factura Electrónica PDF
            </h5>

            <button
              className="btn btn-light btn-sm me-2"
              onClick={() => window.print()}
            >
              Imprimir
            </button>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div
            className="modal-body"
            style={{ background: "#fff", padding: 0 }}
          >
            <div
              className="factura-print"
              style={{
                border: "2px solid #333",
                padding: 30,
                margin: 10,
                fontFamily: "Arial, sans-serif",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ flex: "0 0 120px", textAlign: "center" }}>
                  {usuario.logoNegocio ? (
                    <img
                      src={usuario.logoNegocio}
                      alt="Logo"
                      style={{
                        maxWidth: 100,
                        maxHeight: 80,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 80,
                        background: "#0066cc",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 24,
                      }}
                    >
                      {usuario.nombreNegocio?.substring(0, 2).toUpperCase() ||
                        "FC"}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
                    {usuario.nombreNegocio}
                  </h3>

                  <div style={{ fontSize: 10, marginTop: 5 }}>
                    <div>
                      NIT: {usuario.nitNegocio}-{usuario.dvNitNegocio || "0"}
                    </div>
                    <div>{usuario.direccionNegocio}</div>
                    <div>
                      {usuario.ciudadNegocio} - {usuario.departamentoNegocio} -
                      COLOMBIA
                    </div>
                    <div>{usuario.telefono || "N/A"}</div>
                    <div>
                      {usuario.correoNegocio || usuario.correo || "N/A"}
                    </div>
                  </div>

                  <div
                    style={{ marginTop: 8, fontSize: 9, fontStyle: "italic" }}
                  >
                    Responsables de IVA – No somos autorretenedores
                  </div>
                </div>

                <div style={{ flex: "0 0 120px", textAlign: "center" }}>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{
                      width: 100,
                      height: 100,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 20,
                  marginBottom: 15,
                  fontSize: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 11,
                      marginBottom: 5,
                    }}
                  >
                    DATOS DEL CLIENTE
                  </div>
                  <table
                    className="table table-bordered mt-4"
                    style={{ fontSize: 10 }}
                  >
                    <tbody>
                      <tr>
                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Nombre:
                        </td>
                        <td>
                          {factura.cliente?.nombre} {factura.cliente?.apellido}
                        </td>

                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Tipo Identificación:
                        </td>
                        <td>{factura.cliente?.tipoIdentificacion}</td>
                      </tr>

                      <tr>
                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Identificación:
                        </td>
                        <td>{factura.cliente?.numeroIdentificacion}</td>

                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Dirección:
                        </td>
                        <td>{factura.cliente?.direccion || "N/A"}</td>
                      </tr>

                      <tr>
                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Correo:
                        </td>
                        <td>{factura.cliente?.correo || "N/A"}</td>

                        <td
                          className="table-light"
                          style={{ fontWeight: "bold" }}
                        >
                          Teléfono:
                        </td>
                        <td>{factura.cliente?.telefono || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      background: "#f0f0f0",
                      padding: 10,
                      border: "1px solid #ccc",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        marginBottom: 5,
                      }}
                    >
                      FACTURA {factura.numeroFactura}
                    </div>

                    <div style={{ fontSize: 9 }}>
                      <div>
                        <strong>Fecha y Hora de Factura</strong>
                      </div>

                      <div>
                        Generación:{" "}
                        {new Date(factura.fechaEmision).toLocaleDateString(
                          "es-CO"
                        )}{" "}
                        {factura.horaEmision}
                      </div>

                      <div>
                        Vencimiento:{" "}
                        {factura.fechaVencimiento
                          ? new Date(
                              factura.fechaVencimiento
                            ).toLocaleDateString("es-CO")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>Descripción</th>
                    <th className="text-center">Unidad</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {detalleFacturas.map((det, i) => (
                    <tr key={i}>
                      <td>{det.descripcion}</td>
                      <td className="text-center">
                        {det.unidadMedida ?? "N/D"}
                        {obtenerLabel(unidadesMedidaDIAN, det.unidadMedida)}
                      </td>

                      <td className="text-center">{det.cantidad}</td>
                      <td className="text-end">
                        ${det.precioUnitario.toLocaleString("es-CO")}
                      </td>
                      <td className="text-end">
                        ${det.subtotalLinea?.toLocaleString("es-CO")}
                      </td>
                      <td className="text-end">
                        <strong>
                          ${det.totalLinea?.toLocaleString("es-CO")}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                }}
              >
                {/* Columna izquierda */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: 5 }}>
                    CONDICIÓN DE PAGO
                  </div>

                  <div>
                    <strong>{factura.formaPago || "Contado"}:</strong>{" "}
                    {factura.medioPago || "Efectivo"} – $
                    {factura.totalFactura.toLocaleString("es-CO")}
                  </div>
                  <div style={{ marginTop: 10, fontWeight: "bold" }}>
                    VALOR EN LETRAS
                  </div>

                  <div style={{ fontSize: 9 }}>
                    {numeroALetras(factura.totalFactura) || "N/A"}
                  </div>

                  <div style={{ marginTop: 10, fontWeight: "bold" }}>
                    OBSERVACIONES
                  </div>

                  <div style={{ fontSize: 9 }}>
                    {factura.observaciones || "Ninguna"}
                  </div>
                </div>

                <div
                  style={{
                    flex: "0 0 250px",
                    marginLeft: 20,
                    border: "1px solid #999",
                    padding: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Total Bruto</span>
                    <span>
                      ${factura.subtotal?.toLocaleString("es-CO") || "0.00"}
                    </span>
                  </div>
                  {factura.totalIVA > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>IVA</span>
                      <span>
                        ${factura.totalIVA?.toLocaleString("es-CO") || "0.00"}
                      </span>
                    </div>
                  )}

                  {factura.totalINC > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>INC</span>
                      <span>${factura.totalINC.toLocaleString("es-CO")}</span>
                    </div>
                  )}

                  {factura.totalDescuentos > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Descuento</span>
                      <span>
                        $
                        {factura.totalDescuentos?.toLocaleString("es-CO") ||
                          "0.00"}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      fontSize: 12,
                      borderTop: "2px solid #333",
                      paddingTop: 5,
                      marginTop: 5,
                    }}
                  >
                    <span>Total a Pagar</span>
                    <span>
                      ${factura.totalFactura?.toLocaleString("es-CO") || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 10,
                  borderTop: "1px solid #ccc",
                  textAlign: "center",
                  fontSize: 8,
                }}
              >
                {new Date().toISOString().split("T")[0]}{" "}
                {new Date().toTimeString().split(" ")[0]}
                <br />
                Documento válido ante la DIAN – Generado por{" "}
                <strong>FactCloud</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalFacturaPDF;
