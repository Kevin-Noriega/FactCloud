import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosClient from "../api/axiosClient";

export const useFactura = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // ── Leer datos del usuario UNA vez al inicio del hook ──────────
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario") || "{}"); // ✅ fix 1
  const tarifaICAEmpresa = parseFloat(usuarioGuardado?.tarifaICA) || 0; // ✅ ahora sí existe

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [formasPago, setFormasPago] = useState([{ metodo: "", valor: "" }]);
  const [facturasUsadas, setFacturasUsadas] = useState({
    usadas: 0,
    limite: 0,
  });
  const [retelCA, setRetelCA] = useState({ tipo: "", valor: 0 });
  const [codigoBarras, setCodigoBarras] = useState("");
  const barcodeInputRef = useRef(null);

  const [factura, setFactura] = useState({
    tipoFactura: "",
    clienteId: "",
    contactoId: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    numeroFactura: "",
    prefijo: "",
    observaciones: "",
    formaPago: "1", // ✅ fix 3 — faltaba
    medioPago: "", // ✅ fix 3 — faltaba
    diasCredito: null, // ✅ fix 3 — faltaba
  });

  // ── Prefijo del usuario ─────────────────────────────────────────
  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (usuarioData?.prefijoAutorizadoDIAN) {
      setFactura((f) => ({ ...f, prefijo: usuarioData.prefijoAutorizadoDIAN }));
    }
  }, []);

  // ── Carga inicial ────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || loading) return;
    const cargarDatos = async () => {
      try {
        const [resClientes, resProductos, resStats] = await Promise.all([
          axiosClient.get("/Clientes"),
          axiosClient.get("/Productos"),
          axiosClient.get("/Planes/estadisticas"),
        ]);

    // Protección: garantiza que siempre sea array
    setClientes(Array.isArray(resClientes.data) ? resClientes.data : resClientes.data?.data ?? resClientes.data?.items ?? []);
    setProductos(Array.isArray(resProductos.data) ? resProductos.data : resProductos.data?.data ?? resProductos.data?.items ?? []);

        setFacturasUsadas({
          usadas: resStats.data.documentosUsados,
          limite: resStats.data.documentosLimite,
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [isAuthenticated, loading]);

  // ── Contactos al cambiar cliente ─────────────────────────────────
  useEffect(() => {
    if (!factura.clienteId) {
      setContactos([]);
      return;
    }
    axiosClient
      .get(`/Clientes/${factura.clienteId}/contactos`)
      .then((res) => setContactos(res.data))
      .catch(() => setContactos([]));
  }, [factura.clienteId]);

  // ── Formas de pago ───────────────────────────────────────────────
  const agregarFormaPago = () =>
    setFormasPago((prev) => [...prev, { metodo: "", valor: "" }]);

  const actualizarFormaPago = (index, campo, valor) =>
    setFormasPago((prev) => {
      const nuevas = [...prev];
      nuevas[index][campo] = valor;
      return nuevas;
    });

  const eliminarFormaPago = (index) =>
    setFormasPago((prev) => prev.filter((_, i) => i !== index));

  const totalFormasPago = formasPago.reduce(
    (acc, fp) => acc + (parseFloat(fp.valor) || 0),
    0,
  );

  // ── Código de barras ─────────────────────────────────────────────
  const agregarPorCodigoBarras = () => {
    const codigo = codigoBarras.trim();
    if (!codigo) return;
    const producto = productos.find(
      (p) => String(p.codigoBarras || "").trim() === codigo,
    );
    if (!producto) {
      alert(`Producto no encontrado.\nCódigo: ${codigo}`);
      return;
    }
    setProductosSeleccionados((prev) => {
      const idx = prev.findIndex(
        (item) => Number(item.productoId) === Number(producto.id),
      );
      if (idx !== -1) {
        const act = [...prev];
        act[idx].cantidad = Number(act[idx].cantidad || 0) + 1;
        return act;
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
          impuestoCargo: "IVA_19",
          impuestoRetencion: "",
          tarifaIVA: producto.tarifaIVA ?? 19,
          tarifaINC: producto.tarifaINC ?? 0,
          tarifaRetencion: 0,
        },
      ];
    });
    setCodigoBarras("");
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  };

  const handleBarcodeInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarPorCodigoBarras();
    }
  };

  // ── Productos ────────────────────────────────────────────────────
  const agregarProductoManual = () =>
    setProductosSeleccionados((prev) => [
      ...prev,
      {
        productoId: "",
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        unidadMedida: "Unidad",
        porcentajeDescuento: 0,
        impuestoCargo: "IVA_19",
        impuestoRetencion: "",
        tarifaIVA: 0,
        tarifaINC: 0,
        tarifaRetencion: 0,
      },
    ]);

  const actualizarProducto = (index, campo, valor) => {
    const nuevos = [...productosSeleccionados];
    nuevos[index][campo] = valor;
    if (campo === "productoId") {
      const prod = productos.find((p) => p.id === parseInt(valor));
      if (prod) {
        nuevos[index].precioUnitario = prod.precioUnitario;
        nuevos[index].descripcion = prod.nombre;
        nuevos[index].unidadMedida = prod.unidadMedida;
        nuevos[index].tarifaIVA = prod.tarifaIVA;
        nuevos[index].tarifaINC = prod.tarifaINC || 0;
      }
    }
    setProductosSeleccionados(nuevos);
  };

  const eliminarProducto = (index) =>
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));

  // ── Cálculos ─────────────────────────────────────────────────────
  const calcularLinea = useCallback(
    (item, tarifaICAParam = tarifaICAEmpresa) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precioUnitario) || 0;
      const descuento = parseFloat(item.porcentajeDescuento) || 0;
      const tarifaIVA = parseFloat(item.tarifaIVA) || 0;
      const tarifaINC = parseFloat(item.tarifaINC) || 0;
      const tarifaRetencion = parseFloat(item.tarifaRetencion) || 0;
      const tarifaICA = tarifaICAParam;

      const subtotalLinea = cantidad * precio;
      const valorDescuento = subtotalLinea * (descuento / 100);
      const baseImponible = subtotalLinea - valorDescuento;

      const valorIVA = baseImponible * (tarifaIVA / 100);
      const valorINC = baseImponible * (tarifaINC / 100);
      const valorICA = baseImponible * (tarifaICA / 100);
      const valorRetencion = baseImponible * (tarifaRetencion / 100);

      return {
        subtotalLinea,
        valorDescuento,
        baseImponible,
        valorIVA,
        valorINC,
        valorICA,
        valorRetencion,
        totalLinea:
          baseImponible + valorIVA + valorINC + valorICA - valorRetencion,
      };
    },
    [tarifaICAEmpresa], // ← solo se recrea si cambia la tarifa ICA
  );

  const calcularTotales = useCallback(() => {
    let subtotal = 0,
      totalDescuentos = 0,
      totalIVA = 0,
      totalINC = 0,
      totalICA = 0,
      totalRetenciones = 0;

    productosSeleccionados.forEach((item) => {
      const l = calcularLinea(item);
      subtotal += l.subtotalLinea;
      totalDescuentos += l.valorDescuento;
      totalIVA += l.valorIVA;
      totalINC += l.valorINC;
      totalICA += l.valorICA;
      totalRetenciones += l.valorRetencion;
    });

    return {
      subtotal,
      totalDescuentos,
      totalIVA,
      totalINC,
      totalICA,
      totalRetenciones,
      totalFactura:
        subtotal -
        totalDescuentos +
        totalIVA +
        totalINC +
        totalICA -
        totalRetenciones,
    };
  }, [productosSeleccionados, calcularLinea]); // ← dependencias completas

  // ✅ Ahora useMemo tiene todas sus dependencias correctas
  const totalesMemo = useMemo(calcularTotales, [calcularTotales]);
  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e, estadoOverride = "Pendiente") => {
    if (e) e.preventDefault();

    // ✅ usuarioGuardado ya existe en el scope del hook, no hace falta redeclarar
    if (!usuarioGuardado?.id) {
      alert("Usuario no autenticado.");
      return;
    }
    if (!factura.tipoFactura) {
      alert("Selecciona el tipo de factura.");
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

    if (estadoOverride !== "Borrador") {
      if (Math.abs(totalFormasPago - totales.totalFactura) > 0.01) {
        alert("El total de formas de pago no coincide con el total neto.");
        return;
      }
    }

    const prefijo = factura.prefijo?.trim() || "FAC";
    const numeroGenerado = `${prefijo}-${Date.now()}`;
    const fechaEmision = factura.fechaEmision;
    const horaEmision = new Date().toTimeString().split(" ")[0];

    let fechaVencimiento = null;
    if (factura.formaPago === "2" && factura.diasCredito) {
      const fv = new Date(fechaEmision);
      fv.setDate(fv.getDate() + parseInt(factura.diasCredito));
      fechaVencimiento = fv.toISOString().split("T")[0];
    }

    const payload = {
      usuarioId: usuarioGuardado.id,
      clienteId: parseInt(factura.clienteId),
      contactoId: factura.contactoId || null,
      tipoFactura: factura.tipoFactura,
      prefijo,
      numeroFactura: numeroGenerado,
      fechaEmision: `${fechaEmision}T${horaEmision}`,
      horaEmision,
      formaPago: factura.formaPago || "1",
      medioPago: factura.medioPago || "10",
      diasCredito: factura.diasCredito ?? null,
      fechaVencimiento,
      subtotal: totales.subtotal,
      totalIVA: totales.totalIVA,
      totalINC: totales.totalINC,
      totalICA: totales.totalICA,
      totalDescuentos: totales.totalDescuentos,
      totalRetenciones: totales.totalRetenciones,
      totalFactura: totales.totalFactura,
      observaciones: factura.observaciones || "",
      estado: estadoOverride,
      enviadaDIAN: false,
      moneda: "COP",

      formasPago: formasPago
        .filter((fp) => fp.metodo)
        .map((fp) => ({
          metodoPagoCodigo: fp.metodo,
          valor: parseFloat(fp.valor) || 0,
        })),

      detalleFacturas: productosSeleccionados.map((item) => {
        const linea = calcularLinea(item);
        return {
          productoId: parseInt(item.productoId) || 0,
          descripcion: item.descripcion || "",
          cantidad: parseFloat(item.cantidad) || 1,
          unidadMedida: item.unidadMedida || "Unidad",
          precioUnitario: parseFloat(item.precioUnitario) || 0,
          porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
          valorDescuento: linea.valorDescuento,
          subtotalLinea: linea.baseImponible,
          tarifaIVA: parseFloat(item.tarifaIVA) || 0,
          valorIVA: linea.valorIVA,
          tarifaINC: parseFloat(item.tarifaINC) || 0,
          valorINC: linea.valorINC,
          tarifaICA: tarifaICAEmpresa, // ✅ fix 2 — no item.tarifaICA
          valorICA: linea.valorICA,
          tarifaRetencion: parseFloat(item.tarifaRetencion) || 0,
          valorRetencion: linea.valorRetencion,
          totalLinea: linea.totalLinea,
          codigoUNSPSC: item.codigoUNSPSC || "",
          codigoInterno: item.codigoInterno || "",
        };
      }),
    };

    try {
      await axiosClient.post("/Facturas", payload);
      alert(
        estadoOverride === "Borrador"
          ? "Borrador guardado correctamente"
          : "Factura creada exitosamente",
      );
      navigate("/ventas");
    } catch (error) {
      alert(
        "Error al crear factura: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // ── Agregar desde modales ─────────────────────────────────────────
  const agregarClienteLocal = (nuevoCliente) => {
    setClientes((prev) => [...prev, nuevoCliente]);
    setFactura((f) => ({ ...f, clienteId: nuevoCliente.id, contactoId: "" }));
  };

  const agregarContactoLocal = (nuevoContacto) => {
    setContactos((prev) => [...prev, nuevoContacto]);
    setFactura((f) => ({ ...f, contactoId: nuevoContacto.id }));
  };

  const agregarProductoLocal = (nuevoProducto) => {
    setProductos((prev) => [...prev, nuevoProducto]);
    setProductosSeleccionados((prev) => [
      ...prev,
      {
        productoId: nuevoProducto.id,
        descripcion: nuevoProducto.nombre,
        cantidad: 1,
        precioUnitario: nuevoProducto.precioUnitario ?? 0,
        unidadMedida: nuevoProducto.unidadMedida ?? "Unidad",
        porcentajeDescuento: 0,
        impuestoCargo: "IVA_19",
        impuestoRetencion: "",
        tarifaIVA: nuevoProducto.tarifaIVA ?? 0,
        tarifaINC: nuevoProducto.tarifaINC ?? 0,
        tarifaRetencion: 0,
      },
    ]);
  };

  return {
    factura,
    setFactura,
    clientes,
    productos,
    contactos,
    facturasUsadas,
    productosSeleccionados,
    codigoBarras,
    setCodigoBarras,
    barcodeInputRef,
    formasPago,
    totalFormasPago,
    retelCA,
    setRetelCA,
    totales: totalesMemo,
    agregarFormaPago,
    actualizarFormaPago,
    eliminarFormaPago,
    agregarPorCodigoBarras,
    handleBarcodeInput,
    agregarProductoManual,
    actualizarProducto,
    eliminarProducto,
    calcularLinea,
    agregarClienteLocal,
    agregarContactoLocal,
    agregarProductoLocal,
    handleSubmit,
    navigate,
  };
};
