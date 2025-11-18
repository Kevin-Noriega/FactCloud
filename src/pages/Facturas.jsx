import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../api/config";
import ModalFacturaPDF from "../components/ModalfacturaPDF.jsx";

function Facturas() {
  // ✅ 1. TODOS LOS useState PRIMERO (AL INICIO)
  const [codigoBarras, setCodigoBarras] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [facturaParaPago, setFacturaParaPago] = useState(null);
  const [facturaVista, setFacturaVista] = useState(null);

  // ⬇️ MOVIDO AQUÍ (estaba en línea 184)
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [factura, setFactura] = useState({
    clienteId: "",
    numeroFactura: "",
    prefijo: "FE",
    observaciones: "",
  });

  const [pago, setPago] = useState({
    medioPago: "Efectivo",
    montoPagado: "",
    referencia: "",
    observaciones: "",
  });

  // ✅ 2. useRef
  const barcodeInputRef = useRef(null);

  // ✅ 3. FUNCIONES (después de los hooks)
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

  // ⬇️ Ahora procesarCodigoBarras se declara ANTES de handleBarcodeInput
  const procesarCodigoBarras = (codigoRaw) => {
    const codigo = String(codigoRaw || "").trim();

    if (!codigo) {
      console.warn("❌ Código vacío ignorado");
      return;
    }

    if (productos.length === 0) {
      alert("⚠️ No hay productos cargados en el sistema.");
      return;
    }

    // 🟦 Debug útil pero limpio
    console.log("\n" + "=".repeat(40));
    console.log("🔍 Código recibido:", codigo);

    // Buscar producto normalizando ambos valores
    const producto = productos.find((p) => {
      const dbCode = String(p.codigoBarras || "").trim();
      return dbCode === codigo;
    });

    // ❌ No encontrado
    if (!producto) {
      console.error("❌ No encontrado:", codigo);
      alert(`❌ Producto no encontrado.\nCódigo: ${codigo}`);
      return;
    }

    console.log("✅ Producto encontrado:", producto.nombre);

    // 🟩 Agregar o incrementar producto
    setProductosSeleccionados((prev) => {
      const index = prev.findIndex(
        (item) => Number(item.productoId) === Number(producto.id)
      );

      // ➕ Ya existe → aumentar cantidad
      if (index !== -1) {
        const listaActualizada = [...prev];
        listaActualizada[index] = {
          ...listaActualizada[index],
          cantidad: Number(listaActualizada[index].cantidad) + 1,
        };

        console.log(
          `➕ Cantidad aumentada: ${listaActualizada[index].descripcion} → ${listaActualizada[index].cantidad}`
        );

        return listaActualizada;
      }

      // 🆕 Nuevo producto
      const nuevoItem = {
        productoId: producto.id,
        descripcion: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precioUnitario ?? 0,
        unidadMedida: producto.unidadMedida ?? "Unidad",
        porcentajeDescuento: producto.porcentajeDescuento ?? 0,
        tarifaIVA: producto.tarifaIVA ?? 0,
        tarifaINC: producto.tarifaINC ?? 0,
      };

      console.log("🆕 Agregado:", nuevoItem.descripcion);

      return [...prev, nuevoItem];
    });

    // 🔄 Focus al input para escáner
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  };

  // ⬇️ Ahora handleBarcodeInput está DESPUÉS de procesarCodigoBarras
  const handleBarcodeInput = (e) => {
    // ⛔ Si la lista está vacía, evitar errores
    if (!productos || productos.length === 0) {
      console.warn("⛔ No hay productos cargados en memoria todavía.");
      return;
    }

    // ✔ Escaneo válido
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();

      const codigo = e.target.value.trim();
      console.log("🎯 CÓDIGO A PROCESAR:", codigo);

      if (codigo.length === 0) {
        console.log("⚠️ Código vacío al presionar Enter");
      } else {
        procesarCodigoBarras(codigo);
      }

      // Resetear input
      setCodigoBarras("");
      e.target.value = "";

      // Mantener el auto-focus
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 80);
    }
  };

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
        tarifaIVA: 19,
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
    });
    setProductosSeleccionados([]);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
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
        formaPago: "Credito",
        medioPago: "Pendiente",
        observaciones: factura.observaciones,
        estado: "Pendiente",
        enviadaDIAN: false,
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

      alert("Factura creada correctamente. Estado: Pendiente de pago");
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
          method: "PATCH",
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

  // 📌 1. Cargar productos desde la API solo una vez
  useEffect(() => {
    fetchDatos();
  }, []);

  // 📌 2. Debug útil: solo si necesitas verificar la carga
  useEffect(() => {
    if (productos.length === 0) return;

    console.log("📦 Productos cargados:", productos.length);
    console.log(
      "Códigos de barras:",
      productos.map((p) => p.codigoBarras).filter(Boolean)
    );
  }, [productos]);

  // 📌 3. Productos que estás agregando a la factura
  useEffect(() => {
    if (productosSeleccionados.length === 0) return;
    console.log("🧾 Productos en factura:", productosSeleccionados.length);
  }, [productosSeleccionados]);

  // 📌 4. Enfocar input cuando se muestre el formulario
  useEffect(() => {
    if (!mostrarFormulario) return;

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 150);
  }, [mostrarFormulario]);

  useEffect(() => {
    if (!mostrarFormulario) return;

    const focusInput = () => {
      const activeElement = document.activeElement;
      const isFormElement =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "SELECT" ||
        activeElement?.tagName === "TEXTAREA";

      if (!isFormElement && barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    };

    setTimeout(focusInput, 100);

    const handleClick = (e) => {
      if (!e.target.closest("input, select, textarea, button")) {
        setTimeout(focusInput, 50);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [mostrarFormulario]);

  // ✅ 5. Return condicional y JSX
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
      <h2 className="text-info mb-4">Facturacion Electronica</h2>

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
                  <select
                    className="form-select"
                    value={factura.clienteId}
                    onChange={(e) =>
                      setFactura({ ...factura, clienteId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} -{" "}
                        {cliente.numeroIdentificacion}
                      </option>
                    ))}
                  </select>
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
                  <label className="form-label">Numero Factura</label>
                  <input
                    type="text"
                    className="form-control"
                    value={factura.numeroFactura}
                    onChange={(e) =>
                      setFactura({ ...factura, numeroFactura: e.target.value })
                    }
                    placeholder="Se generara automaticamente"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Escanear producto</label>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  onKeyDown={handleBarcodeInput}
                  placeholder="Escanea código de barras..."
                  className="form-control"
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">
                    Detalle de Productos
                  </label>
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
                                <select
                                  className="form-select form-select-sm"
                                  value={item.productoId}
                                  onChange={(e) =>
                                    actualizarProducto(
                                      index,
                                      "productoId",
                                      e.target.value
                                    )
                                  }
                                  required
                                >
                                  <option value="">Seleccionar</option>
                                  {productos.map((producto) => (
                                    <option
                                      key={producto.id}
                                      value={producto.id}
                                    >
                                      {producto.nombre}
                                    </option>
                                  ))}
                                </select>
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
              </div>

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
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  Registrar Pago - Factura {facturaParaPago.numeroFactura}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModalPago(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <p className="mb-1">
                    <strong>Cliente:</strong> {facturaParaPago.cliente?.nombre}{" "}
                    {facturaParaPago.cliente?.apellido}
                  </p>
                  <p className="mb-1">
                    <strong>Fecha:</strong>{" "}
                    {new Date(facturaParaPago.fechaEmision).toLocaleDateString(
                      "es-CO"
                    )}
                  </p>
                  <p className="mb-0">
                    <strong>Total a Pagar:</strong>
                    <span className="fs-4 text-success ms-2">
                      $
                      {facturaParaPago.totalFactura.toLocaleString("es-CO", {
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
                        className="form-select"
                        value={pago.medioPago}
                        onChange={(e) =>
                          setPago({ ...pago, medioPago: e.target.value })
                        }
                        required
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">
                          Transferencia Bancaria
                        </option>
                        <option value="Tarjeta Debito">Tarjeta Debito</option>
                        <option value="Tarjeta Credito">Tarjeta Credito</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Monto Pagado</label>
                      <input
                        type="number"
                        className="form-control"
                        value={pago.montoPagado}
                        onChange={(e) =>
                          setPago({ ...pago, montoPagado: e.target.value })
                        }
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {parseFloat(pago.montoPagado) >
                    facturaParaPago.totalFactura && (
                    <div className="alert alert-warning">
                      <strong>Cambio a Devolver:</strong> $
                      {(
                        parseFloat(pago.montoPagado) -
                        facturaParaPago.totalFactura
                      ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Referencia de Pago</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pago.referencia}
                      onChange={(e) =>
                        setPago({ ...pago, referencia: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={pago.observaciones}
                      onChange={(e) =>
                        setPago({ ...pago, observaciones: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setMostrarModalPago(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                      Confirmar Pago
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Facturas;
