import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";

const tiposDocumentoDIAN = [/* ... */];
const unidadesMedidaDIAN = [/* ... */];
function obtenerLabel(array, codigo) { return (array.find(v => v.codigo === codigo)?.label) || ""; }

function ModalFacturaPDF({ facturaId, onClose }) {
  const [factura, setFactura] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  useEffect(() => {
    if (facturaId)
      fetch(`${API_URL}/Facturas/${facturaId}`)
        .then(res => res.ok ? res.json() : null)
        .then(setFactura);
  }, [facturaId]);

  if (!factura || !usuario) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}>
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

      <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: 900 }}>
        <div className="modal-content" style={{ borderRadius: 10 }}>

          <div className="modal-header bg-primary text-white no-print" style={{ alignItems: "center" }}>
            <h5 className="modal-title" style={{ flex: 1 }}>Factura electrónica PDF</h5>
            <button className="btn btn-light btn-sm me-2" onClick={() => window.print()}>Imprimir</button>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body" style={{ background: "#fff", padding: 0 }}>
  <div className="factura-print" style={{ border: '2px solid #000', padding: 28, margin: 8 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2>{usuario.nombreNegocio}</h2>
                  <div>NIT: {usuario.nitNegocio}</div>
                  <div>{usuario.direccionNegocio}</div>
                  <div>{usuario.ciudadNegocio}, {usuario.departamentoNegocio}</div>
                  <div>Tel: {usuario.telefono || "N/A"}</div>
                  <div>Email: {usuario.correoFacturacion || usuario.correo || "N/A"}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3>FACTURA ELECTRÓNICA</h3>
                  <strong>{factura.numeroFactura}</strong>
                  <div>Fecha: {new Date(factura.fechaEmision).toLocaleDateString('es-CO')}</div>
                  <div>Hora: {factura.horaEmision}</div>
                </div>
              </div>
              <hr />
              <h5>Datos del Cliente</h5>
              <div>
                <div>- Tipo Doc: {factura.cliente?.tipoIdentificacion} - {obtenerLabel(tiposDocumentoDIAN, factura.cliente?.tipoIdentificacion)}</div>
                <div>- Nro: {factura.cliente?.numeroIdentificacion}</div>
                <div>- Nombre: {factura.cliente?.nombre} {factura.cliente?.apellido}</div>
                <div>- Dirección: {factura.cliente?.direccion}</div>
                <div>- Email: {factura.cliente?.correo} - Tel: {factura.cliente?.telefono}</div>
              </div>
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>Descripción</th>
                    <th className="text-center">Unidad</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">IVA</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.detalleFacturas?.map((det, i) =>
                    <tr key={i}>
                      <td>{det.descripcion}</td>
                      <td className="text-center">{det.unidadMedida} - {obtenerLabel(unidadesMedidaDIAN, det.unidadMedida)}</td>
                      <td className="text-center">{det.cantidad}</td>
                      <td className="text-end">${det.precioUnitario.toLocaleString('es-CO')}</td>
                      <td className="text-end">${det.subtotalLinea?.toLocaleString('es-CO')}</td>
                      <td className="text-end">${det.valorIVA?.toLocaleString('es-CO')}</td>
                      <td className="text-end"><strong>${det.totalLinea?.toLocaleString('es-CO')}</strong></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row mt-3">
                <div className="col-6">
                  <div><strong>Estado:</strong> {factura.estado}</div>
                  <div><strong>Forma de pago:</strong> {factura.formaPago}</div>
                  <div><strong>Medio de pago:</strong> {factura.medioPago}</div>
                  {factura.observaciones &&
                    <div><strong>Observaciones:</strong><br />{factura.observaciones}</div>}
                </div>
                <div className="col-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>Subtotal:</td>
                        <td className="text-end">${factura.subtotal.toLocaleString('es-CO')}</td>
                      </tr>
                      {factura.totalDescuentos > 0 && (
                        <tr>
                          <td>Descuentos:</td>
                          <td className="text-end text-danger">-${factura.totalDescuentos.toLocaleString('es-CO')}</td>
                        </tr>
                      )}
                      <tr>
                        <td>IVA:</td>
                        <td className="text-end">${factura.totalIVA.toLocaleString('es-CO')}</td>
                      </tr>
                      {factura.totalINC > 0 && (
                        <tr>
                          <td>INC:</td>
                          <td className="text-end">${factura.totalINC.toLocaleString('es-CO')}</td>
                        </tr>
                      )}
                      <tr>
                        <td><strong>TOTAL:</strong></td>
                        <td className="text-end"><strong>${factura.totalFactura.toLocaleString('es-CO')}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-center pt-3 border-top">
                Documento válido ante la DIAN - generado por FactCloud
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalFacturaPDF;
