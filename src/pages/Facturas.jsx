import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../api/config";
import ModalFacturaPDF from "../components/ModalfacturaPDF.jsx";
import ModalPago from "../components/ModalPago.jsx";
import Select from "react-select";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [facturaParaPago, setFacturaParaPago] = useState(null);

  const [codigoBarras, setCodigoBarras] = useState("");
  const barcodeInputRef = useRef(null);

  const [factura, setFactura] = useState({
    clienteId: "",
    numeroFactura: "",
    prefijo: "FE",
    observaciones: "",
    metodoPagoCodigo: "10",
    fechaVencimiento: "",
  });

  const [facturaVista, setFacturaVista] = useState(null);

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [pago, setPago] = useState({
    medioPago: "Efectivo",
    montoPagado: "",
    referencia: "",
    observaciones: "",
  });

  // ESCANER/BOTÓN SIEMPRE SUMA DE A 1
  const agregarPorCodigoBarras = () => {
    const codigo = codigoBarras.trim();
    if (!codigo) return;
    const producto = productos.find(
      (p) => String(p.codigoBarras || "").trim() === codigo
    );
    if (!producto) {
      alert(`Producto no encontrado.\nCódigo: ${codigo}`);
      return;
    }
    setProductosSeleccionados((prev) => {
      const idx = prev.findIndex(
        (item) => Number(item.productoId) === Number(producto.id)
      );
      if (idx !== -1) {
        const actualizada = [...prev];
        actualizada[idx].cantidad = Number(actualizada[idx].cantidad || 0) + 1;
        return actualizada;
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          descripcion: producto.nombre,
          cantidad: 1,
          precioUnitario: producto.precioUnitario ?? 0,
          unidadMedida: producto.unidadMedida ?? "Unidad",
          porcentajeDescuento: 0,
          tarifaIVA: 19,
          tarifaINC: 0,
        },
      ];
    });
    setCodigoBarras("");
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  };

  const handleBarcodeInput = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      agregarPorCodigoBarras();
    }
  };

  // AUTOCOMPLETA FECHA SI CAMBIAS A CRÉDITO, LIMPIA SI VUELVES A CONTADO
  useEffect(() => {
    if (factura.metodoPagoCodigo === "20" && !factura.fechaVencimiento) {
      const hoy = new Date();
      const venc = new Date();
      venc.setDate(hoy.getDate() + 30);
      setFactura((f) => ({
        ...f,
        fechaVencimiento: venc.toISOString().split("T")[0],
      }));
    }
    if (factura.metodoPagoCodigo === "10" && factura.fechaVencimiento) {
      setFactura((f) => ({ ...f, fechaVencimiento: "" }));
    }
    // eslint-disable-next-line
  }, [factura.metodoPagoCodigo]);

  const fetchDatos = async () => {
    try {
      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        fetch(`${API_URL}/Facturas`),
        fetch(`${API_URL}/Clientes`),
        fetch(`${API_URL}/Productos`),
      ]);

      if (!facturasRes.ok || !clientesRes.ok || !productosRes.ok) {
        throw new Error("Error al cargar datos");
      }

      const facturasData = await facturasRes.json();
      const clientesData = await clientesRes.json();
      const productosData = await productosRes.json();

      setFacturas(facturasData);
      setClientes(clientesData);
      setProductos(productosData);
      setError(null);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        productoId: "",
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        unidadMedida: "Unidad",
        porcentajeDescuento: 0,
        tarifaIVA: 0,
        tarifaINC: 0,
      },
    ]);
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][campo] = valor;

    if (campo === "productoId") {
      const productoSeleccionado = productos.find(
        (p) => p.id === parseInt(valor)
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
    let subtotal = 0;
    let totalDescuentos = 0;
    let totalIVA = 0;
    let totalINC = 0;

    productosSeleccionados.forEach((item) => {
      const linea = calcularLinea(item);
      subtotal += linea.subtotalLinea;
      totalDescuentos += linea.valorDescuento;
      totalIVA += linea.valorIVA;
      totalINC += linea.valorINC;
    });

    const totalFactura = subtotal - totalDescuentos + totalIVA + totalINC;

    return {
      subtotal,
      totalDescuentos,
      totalIVA,
      totalINC,
      totalFactura,
    };
  };

  const limpiarFormulario = () => {
    setFactura({
      clienteId: "",
      numeroFactura: "",
      prefijo: "FV",
      observaciones: "",
      metodoPagoCodigo: "10",
      fechaVencimiento: "",
    });
    setProductosSeleccionados([]);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontro un usuario autenticado.");
        return;
      }

      if (!factura.clienteId) {
        alert("Selecciona un cliente.");
        return;
      }

      if (productosSeleccionados.length === 0) {
        alert("Agrega al menos un producto.");
        return;
      }

      const totales = calcularTotales();
      const fechaActual = new Date();

      const payload = {
        usuarioId: usuarioGuardado.id,
        clienteId: parseInt(factura.clienteId),
        numeroFactura:
          factura.numeroFactura || `${factura.prefijo}-${Date.now()}`,
        prefijo: factura.prefijo,
        fechaEmision: fechaActual.toISOString(),
        horaEmision: fechaActual.toTimeString().split(" ")[0],
        subtotal: totales.subtotal,
        totalIVA: totales.totalIVA,
        totalINC: totales.totalINC,
        totalDescuentos: totales.totalDescuentos,
        totalRetenciones: 0,
        totalFactura: totales.totalFactura,
        formaPago: factura.metodoPagoCodigo === "20" ? "Credito" : "Contado",
        medioPago: "Pendiente",
        observaciones: factura.observaciones,
        estado: "Pendiente",
        enviadaDIAN: false,
        tipoFactura: "",
        moneda: "COP",
        metodoPagoCodigo: factura.metodoPagoCodigo || "",
        fechaVencimiento: factura.fechaVencimiento?.trim()
          ? factura.fechaVencimiento
          : null,
        tipoOperacion: "",
        CUFE: "",
        QR: "",
        numeroResolucionDIAN: "",
        rangoAutorizadoDesde: "",
        rangoAutorizadoHasta: "",
        ambienteDIAN: "",
        detalleFacturas: productosSeleccionados.map((item) => {
          const linea = calcularLinea(item);
          return {
            productoId: parseInt(item.productoId),
            descripcion: item.descripcion,
            cantidad: parseInt(item.cantidad),
            unidadMedida: item.unidadMedida,
            precioUnitario: parseFloat(item.precioUnitario),
            porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
            valorDescuento: linea.valorDescuento,
            subtotalLinea: linea.baseImponible,
            tarifaIVA: parseFloat(item.tarifaIVA),
            valorIVA: linea.valorIVA,
            tarifaINC: parseFloat(item.tarifaINC) || 0,
            valorINC: linea.valorINC,
            totalLinea: linea.totalLinea,
            codigoUNSPSC: "",
            codigoInterno: "",
            baseImponibleItem: "",
            tipoImpuestoItem: "",
          };
        }),
      };

      const respuesta = await fetch(`${API_URL}/Facturas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto);
      }

      limpiarFormulario();
      fetchDatos();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear factura: " + error.message);
    }
  };

  const abrirModalPago = (fact) => {
    setFacturaParaPago(fact);
    setPago({
      medioPago: "Efectivo",
      montoPagado: fact.totalFactura,
      referencia: "",
      observaciones: "",
    });
    setMostrarModalPago(true);
  };

  const registrarPago = async (e) => {
    e.preventDefault();

    try {
      const montoPagado = parseFloat(pago.montoPagado);

      if (montoPagado < facturaParaPago.totalFactura) {
        alert("El monto pagado no puede ser menor al total de la factura");
        return;
      }

      const payload = {
        id: facturaParaPago.id,
        estado: "Pagada",
        medioPago: pago.medioPago,
        formaPago: "Contado",
        observaciones: pago.observaciones + ` | Referencia: ${pago.referencia}`,
      };

      const respuesta = await fetch(
        `${API_URL}/Facturas/${facturaParaPago.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!respuesta.ok) throw new Error("Error al registrar pago");

      alert("Pago registrado correctamente");
      setMostrarModalPago(false);
      fetchDatos();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar pago: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-info" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar datos</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchDatos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totales = calcularTotales();

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="text-info mb-4">Facturación Electrónica</h2>

      <button
        className="btn btn-info text-white mb-4"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Nueva Factura"}
      </button>

      {mostrarFormulario && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Cliente</label>
                  <Select
                    name="cliente"
                    options={clientes.map((cli) => ({
                      value: cli.id,
                      label: `${cli.nombre} ${cli.apellido} - ${cli.numeroIdentificacion}`,
                    }))}
                    value={
                      factura.clienteId
                        ? clientes
                            .map((cli) => ({
                              value: cli.id,
                              label: `${cli.nombre} ${cli.apellido} - ${cli.numeroIdentificacion}`,
                            }))
                            .find((opt) => opt.value === factura.clienteId)
                        : null
                    }
                    onChange={(opt) =>
                      setFactura((prev) => ({
                        ...prev,
                        clienteId: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar cliente"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Prefijo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={factura.prefijo}
                    onChange={(e) =>
                      setFactura({ ...factura, prefijo: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Número Factura</label>
                  <input
                    type="text"
                    className="form-control"
                    value={factura.numeroFactura}
                    onChange={(e) =>
                      setFactura({ ...factura, numeroFactura: e.target.value })
                    }
                    placeholder="Se generará automáticamente"
                  />
                </div>
              </div>
              {/* Escáner */}
              <div className="mb-3 row align-items-center">
                <div className="col-md-6">
                  <label className="form-label">Escanear producto</label>
                  <div className="input-group col-md-3 p-0">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      value={codigoBarras}
                      onChange={(e) => setCodigoBarras(e.target.value)}
                      onKeyDown={handleBarcodeInput}
                      placeholder="Escanea código de barras..."
                      className="form-control"
                      autoComplete="off"
                    />

                    <div className="input-group-append ms-2">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={agregarPorCodigoBarras}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Método de Pago</label>
                  <select
                    className="form-select"
                    value={factura.metodoPagoCodigo}
                    onChange={(e) =>
                      setFactura({
                        ...factura,
                        metodoPagoCodigo: e.target.value,
                      })
                    }
                  >
                    <option value="10">Contado</option>
                    <option value="20">Crédito</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">
                    Fecha Vencimiento (solo crédito)
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={factura.fechaVencimiento || ""}
                    disabled={factura.metodoPagoCodigo !== "20"}
                    onChange={(e) =>
                      setFactura({
                        ...factura,
                        fechaVencimiento: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Detalle de Productos</label>
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={agregarProducto}
                >
                  Agregar Producto
                </button>
              </div>
              {productosSeleccionados.length === 0 ? (
                <div className="alert alert-warning">
                  No hay productos agregados. Haz clic en Agregar Producto.
                </div>
              ) : (
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
                                    "es-CO"
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
                                            "es-CO"
                                          )}`,
                                        }))
                                        .find(
                                          (opt) => opt.value === item.productoId
                                        )
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
                                    e.target.value
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
                                    e.target.value
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
                                    e.target.value
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
                                    e.target.value
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
                                    e.target.value
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
              )}
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={factura.observaciones}
                    onChange={(e) =>
                      setFactura({ ...factura, observaciones: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Resumen de Factura</h6>
                      <table className="table table-sm table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td>Subtotal:</td>
                            <td className="text-end">
                              $
                              {totales.subtotal.toLocaleString("es-CO", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Descuentos:</td>
                            <td className="text-end text-danger">
                              -$
                              {totales.totalDescuentos.toLocaleString("es-CO", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>IVA:</td>
                            <td className="text-end">
                              $
                              {totales.totalIVA.toLocaleString("es-CO", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                          {totales.totalINC > 0 && (
                            <tr>
                              <td>INC:</td>
                              <td className="text-end">
                                $
                                {totales.totalINC.toLocaleString("es-CO", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          )}
                          <tr className="border-top">
                            <td>
                              <strong>Total Factura:</strong>
                            </td>
                            <td className="text-end">
                              <strong className="text-success">
                                $
                                {totales.totalFactura.toLocaleString("es-CO", {
                                  minimumFractionDigits: 2,
                                })}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-info">
                  Crear Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {facturas.length === 0 ? (
            <div className="alert alert-info">No hay facturas registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Factura</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Subtotal</th>
                    <th>IVA</th>
                    <th>INC</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((fact) => (
                    <tr key={fact.id}>
                      <td>
                        <strong>{fact.numeroFactura || fact.id}</strong>
                      </td>
                      <td>
                        {fact.cliente
                          ? `${fact.cliente.nombre} ${fact.cliente.apellido}`
                          : "N/A"}
                      </td>
                      <td>
                        {new Date(fact.fechaEmision).toLocaleDateString(
                          "es-CO"
                        )}
                      </td>
                      <td className="text-end">
                        ${fact.subtotal?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end">
                        ${fact.totalIVA?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end">
                        ${fact.totalINC?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td className="text-end fw-bold text-success">
                        ${fact.totalFactura?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td>
                        {fact.estado === "Pagada" ? (
                          <span className="badge bg-success">Pagada</span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td>
                        {fact.estado !== "Pagada" && (
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => abrirModalPago(fact)}
                          >
                            Cobrar
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setFacturaVista(fact.id)}
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {facturaVista && (
        <ModalFacturaPDF
          facturaId={facturaVista}
          onClose={() => setFacturaVista(null)}
        />
      )}

      {mostrarModalPago && facturaParaPago && (
        <ModalPago
          factura={facturaParaPago}
          onSuccess={() => {
            setMostrarModalPago(false);
            fetchDatos();
          }}
          onClose={() => setMostrarModalPago(false)}
          registrarPago={registrarPago}
          pago={pago}
          setPago={setPago}
        />
      )}
    </div>
  );
}

export default Facturas;
