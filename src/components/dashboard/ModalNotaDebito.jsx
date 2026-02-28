import React, { useState, useEffect } from "react";
import Select from "react-select";
import { API_URL } from "../../api/config";
import "../../styles/ModalNotaDebito.css";

const motivosDIAN = [
  { value: "DF-1", label: "DF-1 - Intereses" },
  { value: "DF-2", label: "DF-2 - Gastos de cobro" },
  { value: "DF-3", label: "DF-3 - Cambio del valor" },
  { value: "DF-4", label: "DF-4 - Otros" },
];

const formasPagoOpciones = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta Débito", label: "Tarjeta Débito" },
  { value: "Tarjeta Crédito", label: "Tarjeta Crédito" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Nequi", label: "Nequi" },
  { value: "Daviplata", label: "Daviplata" },
];

function ModalNotaDebito({ open, onClose, notaEditando, facturas, productos, onSuccess }) {
  const [notaDebito, setNotaDebito] = useState({
    facturaId: "",
    motivoDIAN: "DF-2",
    fechaElaboracion: new Date().toISOString().split("T")[0],
    vendedor: "",
    cufe: "",
    observaciones: "",
    retelCA: 0,
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([
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

  const [formasPago, setFormasPago] = useState([
    { metodo: "Efectivo", valor: 0 },
  ]);

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    if (notaEditando && open) {
      setNotaDebito({
        facturaId: notaEditando.facturaId || "",
        motivoDIAN: notaEditando.motivoDIAN || "DF-2",
        fechaElaboracion: notaEditando.fechaElaboracion?.split("T")[0] || new Date().toISOString().split("T")[0],
        vendedor: notaEditando.vendedor || "",
        cufe: notaEditando.cufe || "",
        observaciones: notaEditando.observaciones || "",
        retelCA: notaEditando.retelCA || 0,
      });

      if (notaEditando.detalleNotaDebito && notaEditando.detalleNotaDebito.length > 0) {
        setProductosSeleccionados(notaEditando.detalleNotaDebito);
      }

      if (notaEditando.formasPago && notaEditando.formasPago.length > 0) {
        setFormasPago(notaEditando.formasPago);
      }

      const factura = facturas.find((f) => f.id === notaEditando.facturaId);
      setFacturaSeleccionada(factura || null);
    } else if (!notaEditando && open) {
      setNotaDebito({
        facturaId: "",
        motivoDIAN: "DF-2",
        fechaElaboracion: new Date().toISOString().split("T")[0],
        vendedor: "",
        cufe: "",
        observaciones: "",
        retelCA: 0,
      });
      setProductosSeleccionados([
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
      setFormasPago([{ metodo: "Efectivo", valor: 0 }]);
      setFacturaSeleccionada(null);
    }
  }, [notaEditando, open, facturas]);

  const handleFacturaChange = (selectedOption) => {
    if (!selectedOption) {
      setNotaDebito({ ...notaDebito, facturaId: "", cufe: "" });
      setFacturaSeleccionada(null);
      return;
    }

    const factura = facturas.find((f) => f.id === selectedOption.value);
    setFacturaSeleccionada(factura || null);
    setNotaDebito({
      ...notaDebito,
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
        (p) => p.id === parseInt(valor)
      );
      if (productoSeleccionado) {
        nuevosProductos[index] = {
          ...nuevosProductos[index],
          productoId: parseInt(valor),
          precioUnitario: productoSeleccionado.precioVenta || 0,
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
      productosSeleccionados.filter((_, i) => i !== index)
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

    const retelCA = subtotal * (parseFloat(notaDebito.retelCA) / 100);
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
    setFormasPago([...formasPago, { metodo: "Efectivo", valor: 0 }]);
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
    return formasPago.reduce((total, forma) => total + parseFloat(forma.valor || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notaDebito.facturaId) {
      alert("Debes seleccionar una factura");
      return;
    }

    if (productosSeleccionados.length === 0) {
      alert("Debes agregar al menos un producto");
      return;
    }

    const productosSinID = productosSeleccionados.filter((p) => !p.productoId);
    if (productosSinID.length > 0) {
      alert("Todos los productos deben estar seleccionados");
      return;
    }

    const totales = calcularTotales();
    const totalFormasPago = calcularTotalFormasPago();

    if (Math.abs(totales.totalNeto - totalFormasPago) > 0.01) {
      const diferencia = totales.totalNeto - totalFormasPago;
      alert(
        `El total de formas de pago debe coincidir con el total neto.\n` +
        `Total Neto: $${totales.totalNeto.toFixed(2)}\n` +
        `Total Formas de Pago: $${totalFormasPago.toFixed(2)}\n` +
        `Diferencia: $${Math.abs(diferencia).toFixed(2)}`
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const usuarioId = user.id;

      if (!usuarioId) {
        alert("No se pudo obtener el ID del usuario. Por favor inicia sesión nuevamente.");
        return;
      }

      const payload = {
        usuarioId: usuarioId,
        facturaId: parseInt(notaDebito.facturaId),
        numeroNota: notaEditando?.numeroNota || `ND-${Date.now()}`,
        motivoDIAN: notaDebito.motivoDIAN,
        fechaElaboracion: notaDebito.fechaElaboracion,
        vendedor: notaDebito.vendedor || "",
        cufe: notaDebito.cufe || "",
        totalBruto: totales.totalBruto,
        totalDescuentos: totales.totalDescuentos,
        subtotal: totales.subtotal,
        totalIVA: totales.totalIVA,
        totalINC: totales.totalINC,
        retelCA: totales.retelCA,
        totalNeto: totales.totalNeto,
        observaciones: notaDebito.observaciones || "",
        estado: "Pendiente",
        detalleNotaDebito: productosSeleccionados.map((item) => {
          const linea = calcularLinea(item);
          return {
            productoId: parseInt(item.productoId),
            descripcion: item.descripcion || "",
            cantidad: parseFloat(item.cantidad),
            unidadMedida: item.unidadMedida || "Unidad",
            precioUnitario: parseFloat(item.precioUnitario),
            porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
            valorDescuento: linea.valorDescuento,
            subtotalLinea: linea.subtotalLinea,
            tarifaIVA: parseFloat(item.tarifaIVA),
            valorIVA: linea.valorIVA,
            tarifaINC: parseFloat(item.tarifaINC) || 0,
            valorINC: linea.valorINC,
            totalLinea: linea.totalLinea,
          };
        }),
        formasPago: formasPago.map((f) => ({
          metodo: f.metodo,
          valor: parseFloat(f.valor),
        })),
      };

      const url = notaEditando
        ? `${API_URL}/NotasDebito/${notaEditando.id}`
        : `${API_URL}/NotasDebito`;

      const method = notaEditando ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al guardar la nota débito");
      }

      onSuccess(
        notaEditando
          ? "Nota débito actualizada exitosamente"
          : "Nota débito creada exitosamente"
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la nota débito: " + error.message);
    }
  };

  if (!open) return null;

  const totales = calcularTotales();
  const totalFormasPago = calcularTotalFormasPago();
  const diferencia = Math.abs(totales.totalNeto - totalFormasPago);
  const formasPagoCuadran = diferencia < 0.01;

  return (
    <>
      <div className="modal-notadebito-overlay" onClick={onClose} />
      <div className="modal-notadebito-content">
        <div className="modal-notadebito-header">
          <h5>{notaEditando ? "Editar Nota Débito" : "Nueva Nota Débito"}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="modal-notadebito-body">
          <form onSubmit={handleSubmit}>
            <h6 className="section-title-notadebito">Información Básica</h6>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Factura *</label>
                <Select
                  options={facturas.map((f) => ({
                    value: f.id,
                    label: `${f.numeroFactura} - ${f.cliente?.nombre || ""} ${f.cliente?.apellido || ""}`,
                  }))}
                  value={
                    notaDebito.facturaId
                      ? facturas
                          .map((f) => ({
                            value: f.id,
                            label: `${f.numeroFactura} - ${f.cliente?.nombre || ""} ${f.cliente?.apellido || ""}`,
                          }))
                          .find((opt) => opt.value === parseInt(notaDebito.facturaId))
                      : null
                  }
                  onChange={handleFacturaChange}
                  isClearable
                  placeholder="Seleccionar factura"
                  isDisabled={!!notaEditando}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Motivo DIAN *</label>
                <select
                  className="form-select"
                  value={notaDebito.motivoDIAN}
                  onChange={(e) =>
                    setNotaDebito({ ...notaDebito, motivoDIAN: e.target.value })
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

              <div className="col-md-4">
                <label className="form-label">Fecha Elaboración *</label>
                <input
                  type="date"
                  className="form-control"
                  value={notaDebito.fechaElaboracion}
                  onChange={(e) =>
                    setNotaDebito({
                      ...notaDebito,
                      fechaElaboracion: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {facturaSeleccionada && (
              <div className="row mb-3">
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
                <div className="col-md-4">
                  <label className="form-label">CUFE</label>
                  <input
                    type="text"
                    className="form-control"
                    value={notaDebito.cufe}
                    disabled
                  />
                </div>
              </div>
            )}

            <h6 className="section-title-notadebito">Detalle de Productos</h6>
            <div className="table-responsive mb-3">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: "250px" }}>Producto</th>
                    <th style={{ width: "80px" }}>Cant</th>
                    <th style={{ width: "100px" }}>Precio</th>
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
                        <td>
                          <Select
                            options={productos.map((pro) => ({
                              value: pro.id,
                              label: `${pro.nombre} - $${(pro.precioVenta || 0).toLocaleString("es-CO")}`,
                            }))}
                            value={
                              item.productoId
                                ? productos
                                    .map((pro) => ({
                                      value: pro.id,
                                      label: `${pro.nombre} - $${(pro.precioVenta || 0).toLocaleString("es-CO")}`,
                                    }))
                                    .find((opt) => opt.value === parseInt(item.productoId))
                                : null
                            }
                            onChange={(opt) =>
                              actualizarProducto(
                                index,
                                "productoId",
                                opt ? opt.value : ""
                              )
                            }
                            isClearable
                            placeholder="Seleccionar"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
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
                              actualizarProducto(index, "precioUnitario", e.target.value)
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
                                e.target.value
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
                          ${linea.totalLinea.toLocaleString("es-CO", {
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
              className="btn btn-sm btn-outline-warning mb-3"
              onClick={agregarProducto}
            >
              Agregar Producto
            </button>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="section-title-notadebito">Formas de Pago</h6>
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
                            {op.label}
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
                  className="btn btn-sm btn-outline-warning"
                  onClick={agregarFormaPago}
                >
                  + Agregar Forma de Pago
                </button>

                <div className={`mt-3 p-2 rounded ${formasPagoCuadran ? "bg-success bg-opacity-10" : "bg-warning bg-opacity-10"}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total formas de pago:</strong>
                    <span className={formasPagoCuadran ? "text-success fw-bold" : "text-warning fw-bold"}>
                      ${totalFormasPago.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    {formasPagoCuadran && (
                      <span className="text-success fs-5">✔</span>
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
                <h6 className="section-title-notadebito">Totales</h6>
                <div className="totales-box-notadebito">
                  <div className="totales-row-notadebito">
                    <span>Total Bruto:</span>
                    <span>
                      ${totales.totalBruto.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="totales-row-notadebito">
                    <span>Descuentos:</span>
                    <span className="text-danger">
                      -${totales.totalDescuentos.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="totales-row-notadebito">
                    <span>Subtotal:</span>
                    <span>
                      ${totales.subtotal.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="totales-row-notadebito">
                    <span>IVA:</span>
                    <span>
                      ${totales.totalIVA.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="totales-row-notadebito">
                    <span>INC:</span>
                    <span>
                      ${totales.totalINC.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="totales-row-notadebito">
                    <span>ReteICA:</span>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "80px" }}
                        value={notaDebito.retelCA}
                        onChange={(e) =>
                          setNotaDebito({ ...notaDebito, retelCA: parseFloat(e.target.value) })
                        }
                      >
                        <option value="0">0%</option>
                        <option value="1">1%</option>
                        <option value="2">2%</option>
                        <option value="3">3%</option>
                      </select>
                      <span className="text-danger">
                        -${totales.retelCA.toLocaleString("es-CO", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="totales-net-notadebito">
                    <span>Total Neto:</span>
                    <span>
                      ${totales.totalNeto.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h6 className="section-title-notadebito">Observaciones</h6>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                value={notaDebito.observaciones}
                onChange={(e) =>
                  setNotaDebito({ ...notaDebito, observaciones: e.target.value })
                }
                placeholder="Observaciones adicionales sobre la nota débito..."
              />
            </div>

            <div className="modal-notadebito-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-warning text-white"
                disabled={!formasPagoCuadran}
              >
                {notaEditando ? "Actualizar Nota Débito" : "Crear Nota Débito"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ModalNotaDebito;