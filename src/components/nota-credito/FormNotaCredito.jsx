import formasPagoOpciones from "../../utils/MediosPago.json";
import Select from "react-select";

const tiposNotaCredito = [
  { value: "anulacion", label: "Anulación Total" },
  { value: "devolucion", label: "Devolución Parcial" },
  { value: "descuento", label: "Descuento/Rebaja" },
];

const motivosDIAN = [
  { value: "NC-1", label: "NC-1 - Devolución de parte de bienes" },
  { value: "NC-2", label: "NC-2 - Anulación de factura electrónica" },
  { value: "NC-3", label: "NC-3 - Rebaja total aplicada" },
  { value: "NC-4", label: "NC-4 - Descuento total aplicado" },
  { value: "NC-5", label: "NC-5 - Rescisión (retracto)" },
  { value: "NC-6", label: "NC-6 - Otros" },
];

function FormNotaCredito({
  notaCredito,
  setNotaCredito,
  productosSeleccionados,
  setProductosSeleccionados,
  formasPago,
  setFormasPago,
  facturaSeleccionada,
  setFacturaSeleccionada,
  facturas,
  productos,
  notaEditando,
  onSubmit,
  onCancel,
}) {
  const handleFacturaChange = (selectedOption) => {
    if (!selectedOption) {
      setNotaCredito({ ...notaCredito, facturaId: "", cufe: "" });
      setFacturaSeleccionada(null);
      return;
    }

    const factura = facturas.find((f) => f.id === selectedOption.value);
    setFacturaSeleccionada(factura || null);
    setNotaCredito({
      ...notaCredito,
      facturaId: selectedOption.value,
      cufe: factura?.cufe || "",
    });
  };

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        productoId: "",
        cantidad: 1,
        precioUnitario: 0,
        porcentajeDescuento: 0,
        tarifaIVA: 19,
        tarifaINC: 0,
        descripcion: "",
        unidadMedida: "Unidad",
      },
    ]);
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index] = {
      ...nuevosProductos[index],
      [campo]: valor,
    };

    if (campo === "productoId" && valor) {
      const productoSeleccionado = productos.find(
        (p) => p.id === parseInt(valor),
      );
      if (productoSeleccionado) {
        nuevosProductos[index] = {
          ...nuevosProductos[index],
          productoId: parseInt(valor),
          precioUnitario: productoSeleccionado.precioUnitario || 0,
          descripcion: productoSeleccionado.nombre || "",
          unidadMedida: productoSeleccionado.unidadMedida || "Unidad",
          tarifaIVA: productoSeleccionado.tarifaIVA || 19,
          tarifaINC: productoSeleccionado.tarifaINC || 0,
        };
      }
    }

    setProductosSeleccionados(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    if (productosSeleccionados.length === 1) {
      alert("Debes tener al menos un producto");
      return;
    }
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

  const calcularTotales = () => {
    let totalBruto = 0;
    let totalDescuentos = 0;
    let subtotal = 0;
    let totalIVA = 0;
    let totalINC = 0;

    productosSeleccionados.forEach((item) => {
      const linea = calcularLinea(item);
      totalBruto += linea.subtotalLinea;
      totalDescuentos += linea.valorDescuento;
      subtotal += linea.baseImponible;
      totalIVA += linea.valorIVA;
      totalINC += linea.valorINC;
    });

    const retelCA = subtotal * (parseFloat(notaCredito.retelCA) / 100);
    const totalNeto = subtotal + totalIVA + totalINC - retelCA;

    return {
      totalBruto,
      totalDescuentos,
      subtotal,
      totalIVA,
      totalINC,
      retelCA,
      totalNeto,
    };
  };

  const agregarFormaPago = () => {
    setFormasPago([...formasPago, { metodo: "10", valor: 0 }]);
  };

  const actualizarFormaPago = (index, campo, valor) => {
    const nuevasFormas = [...formasPago];
    nuevasFormas[index] = {
      ...nuevasFormas[index],
      [campo]: valor,
    };
    setFormasPago(nuevasFormas);
  };

  const eliminarFormaPago = (index) => {
    if (formasPago.length === 1) {
      alert("Debes tener al menos una forma de pago");
      return;
    }
    setFormasPago(formasPago.filter((_, i) => i !== index));
  };

  const calcularTotalFormasPago = () => {
    return formasPago.reduce(
      (total, forma) => total + parseFloat(forma.valor || 0),
      0,
    );
  };

  const totales = calcularTotales();
  const totalFormasPago = calcularTotalFormasPago();
  const diferencia = Math.abs(totales.totalNeto - totalFormasPago);
  const formasPagoCuadran = diferencia < 0.01;

  return (
    <div className="formulario-nota-container">
      <form onSubmit={onSubmit}>
        {/* INFORMACIÓN BÁSICA */}
        <h6 className="section-title-nota">Información Básica</h6>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Factura *</label>
            <Select
              options={facturas.map((f) => ({
                value: f.id,
                label: `${f.numeroFactura} - ${f.cliente?.nombre || ""} ${
                  f.cliente?.apellido || ""
                }`,
              }))}
              value={
                notaCredito.facturaId
                  ? facturas
                      .map((f) => ({
                        value: f.id,
                        label: `${f.numeroFactura} - ${f.cliente?.nombre || ""} ${
                          f.cliente?.apellido || ""
                        }`,
                      }))
                      .find(
                        (opt) => opt.value === parseInt(notaCredito.facturaId),
                      )
                  : null
              }
              onChange={handleFacturaChange}
              isClearable
              placeholder="Seleccionar factura"
              isDisabled={!!notaEditando}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Tipo de Nota *</label>
            <select
              className="form-select"
              value={notaCredito.tipo}
              onChange={(e) =>
                setNotaCredito({ ...notaCredito, tipo: e.target.value })
              }
              required
            >
              {tiposNotaCredito.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Motivo DIAN *</label>
            <select
              className="form-select"
              value={notaCredito.motivoDIAN}
              onChange={(e) =>
                setNotaCredito({ ...notaCredito, motivoDIAN: e.target.value })
              }
              required
            >
              {motivosDIAN.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Fecha Elaboración *</label>
            <input
              type="date"
              className="form-control"
              value={notaCredito.fechaElaboracion}
              onChange={(e) =>
                setNotaCredito({
                  ...notaCredito,
                  fechaElaboracion: e.target.value,
                })
              }
              required
            />
          </div>

          {facturaSeleccionada && (
            <>
              <div className="col-md-4">
                <label className="form-label">Cliente</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${facturaSeleccionada.cliente?.nombre || ""} ${
                    facturaSeleccionada.cliente?.apellido || ""
                  }`.trim()}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Número Factura</label>
                <input
                  type="text"
                  className="form-control"
                  value={facturaSeleccionada.numeroFactura || ""}
                  disabled
                />
              </div>
            </>
          )}
        </div>

        {/* DETALLE DE PRODUCTOS */}
        <h6 className="section-title-nota">Detalle de Productos</h6>
        <div className="table-responsive mb-3">
          <table className="table table-sm table-bordered ">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: "200px" }}>Producto</th>
                <th style={{ width: "80px" }}>Cant</th>
                <th style={{ width: "200px" }}>Precio</th>
                <th style={{ width: "80px" }}>Desc %</th>
                <th style={{ width: "80px" }}>IVA %</th>
                <th style={{ width: "80px" }}>INC %</th>
                <th style={{ width: "120px" }}>Total</th>
                <th style={{ width: "50px" }}></th>
              </tr>
            </thead>
            <tbody>
              {productosSeleccionados.map((item, index) => {
                const linea = calcularLinea(item);
                return (
                  <tr key={index}>
                    <td className="product-select">
                      <Select
                        options={productos.map((pro) => ({
                          value: pro.id,
                          label: `${pro.nombre} - $${(
                            pro.precioUnitario || 0
                          ).toLocaleString("es-CO")}`,
                        }))}
                        className="producto-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        value={
                          item.productoId
                            ? productos
                                .map((pro) => ({
                                  value: pro.id,
                                  label: `${pro.nombre} - $${(
                                    pro.precioUnitario|| 0
                                  ).toLocaleString("es-CO")}`,
                                }))
                                .find(
                                  (opt) =>
                                    opt.value === parseInt(item.productoId),
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
                        placeholder="Seleccionar"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarProducto(index, "cantidad", e.target.value)
                        }
                        min="1"
                        step="1"
                        required
                      />
                    </td>
                    <td>
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
                        min="0"
                        required
                      />
                    </td>
                    <td>
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
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.tarifaIVA}
                        onChange={(e) =>
                          actualizarProducto(index, "tarifaIVA", e.target.value)
                        }
                        step="0.01"
                        min="0"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.tarifaINC}
                        onChange={(e) =>
                          actualizarProducto(index, "tarifaINC", e.target.value)
                        }
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="text-end fw-bold">
                      $
                      {linea.totalLinea.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarProducto(index)}
                        disabled={productosSeleccionados.length === 1}
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

        <button
          type="button"
          className="btn btn-sm btn-outline-success mb-3"
          onClick={agregarProducto}
        >
          Agregar Producto
        </button>

        {/* FORMAS DE PAGO Y TOTALES */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h6 className="section-title-nota">Formas de Pago</h6>
            {formasPago.map((forma, index) => (
              <div key={index} className="row mb-2 align-items-center">
                <div className="col-6">
                  <select
                    className="form-select form-select-sm"
                    value={forma.metodo}
                    onChange={(e) =>
                      actualizarFormaPago(index, "metodo", e.target.value)
                    }
                  >
                    {formasPagoOpciones.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.codigo} - {op.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-5">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={forma.valor}
                    onChange={(e) =>
                      actualizarFormaPago(index, "valor", e.target.value)
                    }
                    step="0.01"
                    min="0"
                    required
                    placeholder="Digite el valor"
                  />
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarFormaPago(index)}
                    disabled={formasPago.length === 1}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={agregarFormaPago}
            >
              Agregar Forma de Pago
            </button>

            <div
              className={`mt-3 p-2 rounded ${
                formasPagoCuadran
                  ? "bg-primary bg-opacity-10"
                  : "bg-warning bg-opacity-10"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total formas de pago:</strong>
                <span
                  className={
                    formasPagoCuadran
                      ? "text-primary fw-bold"
                      : "text-warning fw-bold"
                  }
                >
                  $
                  {totalFormasPago.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {formasPagoCuadran && (
                  <span className="text-primary fs-5">✔</span>
                )}
              </div>
              {!formasPagoCuadran && (
                <small className="text-warning d-block mt-1">
                  Diferencia: ${diferencia.toFixed(2)}
                </small>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <h6 className="section-title-nota">Totales</h6>
            <div className="totales-box-nota">
              <div className="totales-row-nota">
                <span>Total Bruto:</span>
                <span>
                  $
                  {totales.totalBruto.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              {totales.totalDescuentos > 0 && (
                <div className="totales-row-nota">
                <span>Descuentos:</span>
                <span className="text-danger">
                  -$
                  {totales.totalDescuentos.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              )}
              
              <div className="totales-row-nota">
                <span>Subtotal:</span>
                <span>
                  $
                  {totales.subtotal.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              {totales.totalIVA >0 && (
                <div className="totales-row-nota">
                <span>IVA:</span>
                <span>
                  $
                  {totales.totalIVA.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              )}
              
              {totales.totalINC > 0 && (
                <div className="totales-row-nota">
                <span>INC :</span>
                <span>
                  $
                  {totales.totalINC.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              )}
              
              <div className="totales-net-nota">
                <span>Total Neto:</span>
                <span>
                  $
                  {totales.totalNeto.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OBSERVACIONES */}
        <h6 className="section-title-nota">Observaciones</h6>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={notaCredito.observaciones}
            onChange={(e) =>
              setNotaCredito({ ...notaCredito, observaciones: e.target.value })
            }
            placeholder="Observaciones adicionales sobre la nota crédito..."
          />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success text-white"
            disabled={!formasPagoCuadran}
          >
            {notaEditando ? "Actualizar Nota Crédito" : "Crear Nota Crédito"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default FormNotaCredito;
