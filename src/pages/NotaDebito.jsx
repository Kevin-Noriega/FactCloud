import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotaDebito.css";
import Select from "react-select";

function NotaDebito() {
  const navigate = useNavigate();

  const [notaDebito, setNotaDebito] = useState({
    factura: "",
    tipo: "DF-2",
    cliente: "",
    contacto: "",
    fechaElaboracion: "",
    vendedor: "",
    cufe: "",
    motivoDIAN: "",
    numeroFactura: "",
    productos: [],
    formasPago: [],
  });
  const [productosSeleccionados, setProductosSeleccionados] = useState([
    {
      productoId: "",
      cantidad: 1,
      precioUnitario: 0,
      porcentajeDescuento: 0,
      tarifaIVA: 19,
      tarifaINC: 0,
    },
  ]);
  const productos = [
    {
      id: 1,
      nombre: "SUMINISTRO DE MATERIALES",
      precioUnitario: 6025210.08,
    },
    {
      id: 2,
      nombre: "SERVICIO TÉCNICO",
      precioUnitario: 150000,
    },
  ];
  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][campo] = valor;

    if (campo === "productoId") {
      const productoSeleccionado = productos.find(
        (p) => p.id === parseInt(valor),
      );
      if (productoSeleccionado) {
        nuevosProductos[index].precioUnitario =
          productoSeleccionado.precioUnitario;
        nuevosProductos[index].descripcion = productoSeleccionado.nombre;
        nuevosProductos[index].unidadMedida = productoSeleccionado.unidadMedida;
        nuevosProductos[index].tarifaIVA = productoSeleccionado.tarifaIVA;
        nuevosProductos[index].tarifaINC = productoSeleccionado.tarifaINC || 0;
      }
    }

    setProductosSeleccionados(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((_, i) => i !== index),
    );
  };
  const calcularLinea = (item) => {
    const cantidad = parseFloat(item.cantidad) || 0;
    const precio = parseFloat(item.precioUnitario) || 0;
    const descuento = parseFloat(item.porcentajeDescuento) || 0;
    const tarifaIVA = parseFloat(item.tarifaIVA) || 0;
    const tarifaINC = parseFloat(item.tarifaINC) || 0;

    const subtotalLinea = cantidad * precio;
    const valorDescuento = subtotalLinea * (descuento / 100);
    const baseImponible = subtotalLinea - valorDescuento;
    const valorIVA = baseImponible * (tarifaIVA / 100);
    const valorINC = baseImponible * (tarifaINC / 100);
    const totalLinea = baseImponible + valorIVA + valorINC;

    return {
      subtotalLinea,
      valorDescuento,
      baseImponible,
      valorIVA,
      valorINC,
      totalLinea,
    };
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className=" page-header">
        <h3 className="payment-title">Nota Débito (Ventas)</h3>
        <button className="btn btn-outline-primary btn-sm">
          Ver tutoriales
        </button>
      </div>

      {/* ALERTA */}
      <div className="nota-debito-info  m-1b-4 p-3">
        <p>
          <strong>Información importante:</strong> Has elegido una factura
          electrónica. Recuerda que no se pueden aplicar notas débito cuando la
          factura cuenta con aceptación DIAN.
        </p>
      </div>

      {/* DATOS GENERALES */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Factura</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Tipo</label>
              <select className="form-select">
                <option>DF-2 - Débito Facturación</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Número</label>
              <input className="form-control" disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label">Cliente</label>
              <input className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contacto</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Fecha elaboración</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Vendedor</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">CUFE</label>
              <input className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Motivo DIAN</label>
              <select className="form-select">
                <option>Seleccionar...</option>
              </select>
            </div>
            {/* TABLA PRODUCTOS */}
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Cant</th>
                    <th>Precio</th>
                    <th>Desc %</th>
                    <th>IVA %</th>
                    <th>INC %</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((item, index) => {
                    const linea = calcularLinea(item);
                    return (
                      <tr key={index}>
                        <td>
                          <Select
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                            name="producto"
                            options={productos.map((pro) => ({
                              value: pro.id,
                              label: `${
                                pro.nombre
                              } - $${pro.precioUnitario.toLocaleString(
                                "es-CO",
                              )}`,
                            }))}
                            value={
                              item.productoId
                                ? productos
                                    .map((pro) => ({
                                      value: pro.id,
                                      label: `${
                                        pro.nombre
                                      } - $${pro.precioUnitario.toLocaleString(
                                        "es-CO",
                                      )}`,
                                    }))
                                    .find(
                                      (opt) => opt.value === item.productoId,
                                    )
                                : null
                            }
                            onChange={(opt) =>
                              actualizarProducto(
                                index,
                                "productoId",
                                opt ? opt.value : "",
                              )
                            }
                            isClearable
                            placeholder="Seleccionar producto"
                          />
                        </td>
                        <td style={{ width: "80px" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.cantidad}
                            onChange={(e) =>
                              actualizarProducto(
                                index,
                                "cantidad",
                                e.target.value,
                              )
                            }
                            min="1"
                            required
                          />
                        </td>
                        <td style={{ width: "100px" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.precioUnitario}
                            onChange={(e) =>
                              actualizarProducto(
                                index,
                                "precioUnitario",
                                e.target.value,
                              )
                            }
                            step="0.01"
                            required
                          />
                        </td>
                        <td style={{ width: "80px" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.porcentajeDescuento}
                            onChange={(e) =>
                              actualizarProducto(
                                index,
                                "porcentajeDescuento",
                                e.target.value,
                              )
                            }
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </td>
                        <td style={{ width: "80px" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.tarifaIVA}
                            onChange={(e) =>
                              actualizarProducto(
                                index,
                                "tarifaIVA",
                                e.target.value,
                              )
                            }
                            step="0.01"
                            required
                          />
                        </td>
                        <td style={{ width: "80px" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.tarifaINC}
                            onChange={(e) =>
                              actualizarProducto(
                                index,
                                "tarifaINC",
                                e.target.value,
                              )
                            }
                            step="0.01"
                          />
                        </td>
                        <td className="text-end">
                          $
                          {linea.totalLinea.toLocaleString("es-CO", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarProducto(index)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="payment-totals-wrapper">
              {/* FORMAS DE PAGO */}
              <div className="payment-box">
                <h3 className="payment-title">Formas de pago</h3>

                <div className="payment-row">
                  <span>Efectivo</span>
                  <span className="amount">0.00</span>
                  <button className="delete-btn">🗑</button>
                </div>

                <div className="payment-row">
                  <span>Tarjeta Débito</span>
                  <span className="amount">0.00</span>
                  <button className="delete-btn">🗑</button>
                </div>

                <div className="payment-row">
                  <select className="payment-select">
                    <option>Selecciona forma de pago</option>
                    <option>Transferencia</option>
                    <option>Tarjeta Crédito</option>
                    <option>Nequi</option>
                  </select>

                  <input
                    type="number"
                    className="payment-input"
                    placeholder="0.00"
                  />
                  <button className="delete-btn">🗑</button>
                </div>

                <a href="#" className="add-payment">
                  + Agregar otra forma de pago
                </a>

                <div className="payment-total">
                  <strong>Total formas de pagos:</strong>
                  <span className="total-value">0.00</span>
                  <span className="check">✔</span>
                </div>
              </div>

              {/* TOTALES */}
              <div className="totals-box">
                <div className="totals-row">
                  <span>Total Bruto:</span>
                  <span className="value">0.00</span>
                </div>

                <div className="totals-row">
                  <span>Descuentos:</span>
                  <span className="value">0.00</span>
                </div>

                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span className="value">0.00</span>
                </div>

                <div className="totals-row">
                  <span>RetelCA:</span>
                  <select className="retention-select">
                    <option value="">Seleccione</option>
                    <option>1%</option>
                    <option>2%</option>
                    <option>3%</option>
                  </select>
                  <span className="value">0.00</span>
                </div>

                <div className="totals-net">
                  <span>Total Neto:</span>
                  <span className="net-value">0.00</span>
                </div>
              </div>
            </div>

            {/* observaciones */}
            <div class="observations-box">
              <h3>Observaciones</h3>

              <textarea
                placeholder="Observaciones"
                class="observations-textarea"
              ></textarea>

              <label class="file-upload">
                Adjuntar archivo
                <input type="file" hidden />
                <span class="clip">📎</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </button>
        <button className="btn btn-success">Guardar</button>
        <button className="btn btn-success">Guardar y enviar</button>
      </div>
    </div>
  );
}

export default NotaDebito;
