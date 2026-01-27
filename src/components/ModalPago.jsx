import React, { useState } from "react";
import { API_URL } from "../api/config";
import bancos from "../utils/Bancos.json";
import Select from "react-select";

function ModalPago({ factura, onSuccess, onClose,setMensajeExito }) {
  const generarReferenciaUnica = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `REF-${timestamp}-${random}`;
  };

  const [pago, setPago] = useState({
    medioPago: "efectivo",
    montoPagado: factura.totalFactura,
    referencia: generarReferenciaUnica(),
    observaciones: "",
    bancoOrigen: "N/A",
    bancoDestino: "N/A",
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPago({ ...pago, [name]: value });
  };

const registrarPago = async (e) => {
  e.preventDefault();
  setCargando(true);
  try {
    const montoPagado = parseFloat(pago.montoPagado);
    if (montoPagado < factura.totalFactura) {
      setMensaje("El monto pagado no puede ser menor al total de la factura");
      return;
    }

    const payload = {
        estado: "Pagada",
  medioPago: pago.medioPago,
  formaPago: "Contado",
  montoPagado,
  observaciones: `${pago.observaciones} | Referencia: ${pago.referencia}`,
  fechaPago: new Date().toISOString(),
  referencia: pago.referencia,
  bancoOrigen: pago.bancoOrigen,
  bancoDestino: pago.bancoDestino,
    };

    const token = localStorage.getItem("token");

    const respuesta = await fetch(
      `${API_URL}/Facturas/${factura.id}/pago`, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Status =>", respuesta.status);

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      console.error("Respuesta del servidor:", errorData);
      throw new Error("Error al registrar pago");
    }

    setMensajeExito("Factura pagada con éxito.");
    setTimeout(() => setMensajeExito(""), 3000);
    onSuccess?.();
    onClose?.();
  } catch (error) {
    console.error("Error al registrar pago:", error);
    setMensaje("Error al registrar pago: " + error.message);
  } finally {
    setCargando(false);
  }
};

  const calcularCambio = () => {
    const montoPagado = parseFloat(pago.montoPagado) || 0;
    const cambio = montoPagado - factura.totalFactura;
    return cambio > 0 ? cambio : 0;
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              Registrar Pago - Factura {factura.numeroFactura}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info">
              <h6>Informacion de la Factura</h6>
              <p className="mb-1">
                <strong>Referencia de pago:</strong> {pago.referencia}
              </p>
              <p className="mb-1">
                <strong>Cliente:</strong> {factura.cliente?.nombre}{" "}
                {factura.cliente?.apellido}
              </p>
              <p className="mb-1">
                <strong>Fecha:</strong>{" "}
                {new Date(factura.fechaEmision).toLocaleDateString("es-CO")}
              </p>
              <p className="mb-0">
                <strong>Total a Pagar:</strong>
                <span className="fs-4 text-success ms-2">
                  $
                  {factura.totalFactura.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>

            <form onSubmit={registrarPago}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Medio de Pago</label>
                  <select
                    name="medioPago"
                    className="form-select"
                    value={pago.medioPago}
                    onChange={handleChange}
                    required
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">
                      Transferencia Bancaria
                    </option>
                    <option value="Tarjeta Debito">Tarjeta Debito</option>
                    <option value="Tarjeta Credito">Tarjeta Credito</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Monto Pagado</label>
                  <input
                    type="number"
                    name="montoPagado"
                    className="form-control"
                    value={pago.montoPagado}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {calcularCambio() > 0 && (
                <div className="alert alert-warning">
                  <strong>Cambio a Devolver:</strong> $
                  {calcularCambio().toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
              {pago.medioPago === "Transferencia" && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Banco Origen</label>
                      <Select
                        name="bancoOrigen"
                        options={bancos.map((b) => ({
                          value: b.nombre,
                          label: `${b.codigo} - ${b.nombre}`,
                        }))}
                        value={
                          pago.bancoOrigen !== "N/A"
                            ? bancos
                                .map((b) => ({
                                  value: b.nombre,
                                  label: `${b.codigo} - ${b.nombre}`,
                                }))
                                .find((opt) => opt.value === pago.bancoOrigen)
                            : null
                        }
                        onChange={(opt) =>
                          setPago((prev) => ({
                            ...prev,
                            bancoOrigen: opt ? opt.value : "N/A",
                          }))
                        }
                        isClearable
                        placeholder="Seleccionar Banco Origen"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Banco destino</label>
                      <Select
                        name="bancoDestino"
                        options={bancos.map((b) => ({
                          value: b.nombre,
                          label: `${b.codigo} - ${b.nombre}`,
                        }))}
                        value={
                          pago.bancoDestino !== "N/A"
                            ? bancos
                                .map((b) => ({
                                  value: b.nombre,
                                  label: `${b.codigo} - ${b.nombre}`,
                                }))
                                .find((opt) => opt.value === pago.bancoDestino)
                            : null
                        }
                        onChange={(opt) =>
                          setPago((prev) => ({
                            ...prev,
                            bancoDestino: opt ? opt.value : "N/A",
                          }))
                        }
                        isClearable
                        placeholder="Seleccionar Banco destino"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">Observaciones</label>
                <textarea
                  name="observaciones"
                  className="form-control"
                  rows="2"
                  value={pago.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones del pago"
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={cargando}
                >
                  {cargando ? "Registrando..." : "Confirmar Pago"}
                </button>
              </div>
            </form>

            {mensaje && (
              <div className="mt-3 alert alert-danger">{mensaje}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPago;
