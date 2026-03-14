import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosClient from "../api/axiosClient";
import { getAccessToken } from "../api/axiosClient";
export const useFactura = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [codigoBarras, setCodigoBarras] = useState("");
  const barcodeInputRef = useRef(null);
  const { isAuthenticated, loading } = useAuth();
  const [facturasUsadas, setFacturasUsadas] = useState({
    usadas: 0,
    limite: 0,
  });
  const [contactos, setContactos] = useState([]);

  const [factura, setFactura] = useState({
    tipoFactura: "",
    clienteId: "",
    contactoId: "",
    fechaElaboracion: new Date().toISOString().split("T")[0],
    numeroFactura: "",
    prefijo: "",
    observaciones: "",
  });

  const [formasPago, setFormasPago] = useState([{ metodo: "", valor: "" }]);

  const [retelCA, setRetelCA] = useState({ tipo: "", valor: 0 });

  // ── Formas de pago ──────────────────────────────────────────────
  const agregarFormaPago = () =>
    setFormasPago((prev) => [...prev, { metodo: "", valor: "" }]);

  const actualizarFormaPago = (index, campo, valor) => {
    setFormasPago((prev) => {
      const nuevas = [...prev];
      nuevas[index][campo] = valor;
      return nuevas;
    });
  };

  const eliminarFormaPago = (index) =>
    setFormasPago((prev) => prev.filter((_, i) => i !== index));

  const totalFormasPago = formasPago.reduce(
    (acc, fp) => acc + (parseFloat(fp.valor) || 0),
    0,
  );

  // ── Cargar prefijo del usuario ──────────────────────────────────
  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioData) {
      setFactura((f) => ({
        ...f,
        prefijo: usuarioData.prefijoAutorizadoDIAN || "",
      }));
    }
  }, []);

  // ── Cargar datos iniciales ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || loading) return; // ← agrega || loading

    const cargarDatos = async () => {
      try {
        const [resClientes, resProductos, resStats] = await Promise.all([
          axiosClient.get("/Clientes"),
          axiosClient.get("/Productos"),
          axiosClient.get("/Planes/estadisticas"),
        ]);
        setClientes(resClientes.data);
        setProductos(resProductos.data);
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

  // ── Cargar contactos al cambiar de cliente ──────────────────────
  // ✅ Solo UNO — borra el duplicado que tenías arriba
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

  // ── Agregar contacto desde modal ────────────────────────────────
  const agregarContactoLocal = (nuevoContacto) => {
    setContactos((prev) => [...prev, nuevoContacto]);
    setFactura((f) => ({ ...f, contactoId: nuevoContacto.id }));
  };

  // ── Código de barras ────────────────────────────────────────────
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
          tarifaIVA: producto.tarifaIVA ?? 19,
          tarifaINC: producto.tarifaINC ?? 0,
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

  // ── Productos ───────────────────────────────────────────────────
  const agregarProductoManual = () => {
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

  const eliminarProducto = (index) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((_, i) => i !== index),
    );
  };

  // ── Cálculos ────────────────────────────────────────────────────
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
    let subtotal = 0,
      totalDescuentos = 0,
      totalIVA = 0,
      totalINC = 0;

    productosSeleccionados.forEach((item) => {
      const l = calcularLinea(item);
      subtotal += l.subtotalLinea;
      totalDescuentos += l.valorDescuento;
      totalIVA += l.valorIVA;
      totalINC += l.valorINC;
    });

    return {
      subtotal,
      totalDescuentos,
      totalIVA,
      totalINC,
      totalFactura: subtotal - totalDescuentos + totalIVA + totalINC,
    };
  };

  // ── Submit ──────────────────────────────────────────────────────
const handleSubmit = async (e) => {
  e.preventDefault();

  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  if (!usuarioGuardado) { alert("Usuario no autenticado."); return; }
  if (!factura.tipoFactura) { alert("Selecciona el tipo de factura."); return; }
  if (!factura.clienteId)   { alert("Selecciona un cliente."); return; }
  if (productosSeleccionados.length === 0) { alert("Agrega al menos un producto."); return; }

  const totales    = calcularTotales();
  const diferencia = Math.abs(totalFormasPago - totales.totalFactura);
  if (diferencia > 0.01) {
    alert(`El total de formas de pago no coincide con el total neto.`);
    return;
  }

  // ✅ Genera AQUÍ — justo antes del fetch
  const prefijo        = (factura.prefijo?.trim()) || "FAC";
  const consecutivo    = Date.now();
  const numeroGenerado = `${prefijo}-${consecutivo}`;  // ← "FAC-1710000000000"

  console.log("numeroFactura generado:", numeroGenerado); // verifica en consola

  try {
    const token = localStorage.getItem("token");

    const payload = {
        usuarioId:        usuarioGuardado.id,
        clienteId:        parseInt(factura.clienteId),
        contactoId:       factura.contactoId || null,
        tipoFactura:      factura.tipoFactura,
        prefijo:          prefijo,
        numeroFactura:    numeroGenerado,   // ✅ nunca vacío
        fechaEmision:     new Date(factura.fechaElaboracion).toISOString(),
        horaEmision:      new Date().toTimeString().split(" ")[0],
        subtotal:         totales.subtotal,
        totalIVA:         totales.totalIVA,
        totalINC:         totales.totalINC,
        totalDescuentos:  totales.totalDescuentos,
        totalRetenciones: retelCA.valor || 0,
        totalFactura:     totales.totalFactura,
        formasPago: formasPago
          .filter((fp) => fp.metodo)
          .map((fp) => ({
            metodoPagoCodigo: fp.metodo,
            valor:            parseFloat(fp.valor) || 0,
          })),
        retelCA:       retelCA.tipo ? retelCA : null,
        observaciones: factura.observaciones || "",
        estado:        "Pendiente",
        enviadaDIAN:   false,
        moneda:        "COP",
        fechaVencimiento: null,
        CUFE: "", QR: "", ambienteDIAN: "",
        detalleFacturas: productosSeleccionados.map((item) => {
          const linea = calcularLinea(item);
          return {
            productoId:          parseInt(item.productoId)            || 0,
            descripcion:         item.descripcion,
            cantidad:            parseInt(item.cantidad)              || 1,
            unidadMedida:        item.unidadMedida,
            precioUnitario:      parseFloat(item.precioUnitario)      || 0,
            porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
            valorDescuento:      linea.valorDescuento,
            subtotalLinea:       linea.baseImponible,
            tarifaIVA:           parseFloat(item.tarifaIVA)           || 0,
            valorIVA:            linea.valorIVA,
            tarifaINC:           parseFloat(item.tarifaINC)           || 0,
            valorINC:            linea.valorINC,
            totalLinea:          linea.totalLinea,
            codigoUNSPSC:        "",
            codigoInterno:       "",
          };
        }),
       
    };   

    console.log("payload enviado:", JSON.stringify(payload, null, 2)); // debug

    const res = await fetch(`${API_URL}/Facturas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("Factura creada exitosamente");
    navigate("/ventas");
  } catch (error) {
    alert("Error al crear factura: " + error.message);
  }
};

// ── Agregar cliente desde modal ─────────────────────────────────
const agregarClienteLocal = (nuevoCliente) => {
  setClientes((prev) => [...prev, nuevoCliente]);
  setFactura((f) => ({ ...f, clienteId: nuevoCliente.id, contactoId: "" }));
};

// ── Agregar producto desde modal ────────────────────────────────
const agregarProductoLocal = (nuevoProducto) => {
  setProductos((prev) => [...prev, nuevoProducto]);
  setProductosSeleccionados((prev) => [
    ...prev,
    {
      productoId:          nuevoProducto.id,
      descripcion:         nuevoProducto.nombre,
      cantidad:            1,
      precioUnitario:      nuevoProducto.precioUnitario ?? 0,
      unidadMedida:        nuevoProducto.unidadMedida ?? "Unidad",
      porcentajeDescuento: 0,
      tarifaIVA:           nuevoProducto.tarifaIVA ?? 0,
      tarifaINC:           nuevoProducto.tarifaINC ?? 0,
    },
  ]);
};
const totalesMemo = useMemo(
  () => calcularTotales(),
  [productosSeleccionados]  // solo recalcula cuando cambian productos
);


  // ── Agregar producto desde modal ────────────────────────────────
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
        tarifaIVA: nuevoProducto.tarifaIVA ?? 0,
        tarifaINC: nuevoProducto.tarifaINC ?? 0,
      },
    ]);
  };

  return {
    // Datos base
    factura,
    setFactura,
    clientes,
    productos,
    contactos,
    facturasUsadas,
    productosSeleccionados,
    // Código de barras
    codigoBarras,
    setCodigoBarras,
    barcodeInputRef,
    agregarClienteLocal,
    agregarProductoLocal,
    formasPago,
    totalFormasPago,
    agregarFormaPago,
    actualizarFormaPago,
    eliminarFormaPago,
    // ✅ RetelCA (faltaba esto)
    retelCA,
    setRetelCA,
    // Contactos
    agregarContactoLocal,
    // Productos
    agregarPorCodigoBarras,
    handleBarcodeInput,
    agregarProductoManual,
    actualizarProducto,
    eliminarProducto,
    calcularLinea,
      totales: totalesMemo,
    // Submit
    handleSubmit,
    navigate,
  };
};
