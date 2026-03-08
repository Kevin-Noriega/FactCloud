import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";
import { useNotas } from "../hooks/useNotas";
import FormNotaCredito from "../components/nota-credito/FormNotaCredito";

const NOTA_VACIA = {
  facturaId: "", tipo: "devolucion", motivoDIAN: "NC-1",
  fechaElaboracion: new Date().toISOString().split("T")[0],
  cufe: "", observaciones: "", retelCA: 0, enviar: false,
};
const ITEM_VACIO = {
  productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0,
  porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0,
  impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad",
};

export default function NuevaNotaCredito() {
  const navigate = useNavigate();

  const {
    facturas              = [],
    productos             = [],
    clientes              = [],
    loading,
    error,
    saving,
    errorCrud,
    limpiarErrorCrud,
    crearNotaCredito,
    recargarDatos,
  } = useNotas();

  const [notaCredito,            setNotaCredito]            = useState({ ...NOTA_VACIA });
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ ...ITEM_VACIO }]);
  const [formasPago,             setFormasPago]             = useState([{ metodo: "10", valor: 0 }]);
  const [facturaSeleccionada,    setFacturaSeleccionada]    = useState(null);
  const [mensajeExito,           setMensajeExito]           = useState("");


  // ── Cálculos ─────────────────────────────────────────────────────
  const calcularLinea = (item) => {
    const cantidad   = parseFloat(item.cantidad)            || 0;
    const precio     = parseFloat(item.precioUnitario)      || 0;
    const descuento  = parseFloat(item.porcentajeDescuento) || 0;
    const tarifaIVA  = parseFloat(item.tarifaIVA)           || 0;
    const tarifaINC  = parseFloat(item.tarifaINC)           || 0;
    const base       = cantidad * precio;
    const valDesc    = base * (descuento / 100);
    const neto       = base - valDesc;
    return {
      subtotalLinea:  base,
      valorDescuento: valDesc,
      baseImponible:  neto,
      valorIVA:       neto * (tarifaIVA / 100),
      valorINC:       neto * (tarifaINC / 100),
      totalLinea:     neto + neto * (tarifaIVA / 100) + neto * (tarifaINC / 100),
    };
  };

  const calcularTotales = () => {
    let totalBruto = 0, totalDescuentos = 0, subtotal = 0, totalIVA = 0, totalINC = 0;
    productosSeleccionados.forEach(item => {
      const l = calcularLinea(item);
      totalBruto     += l.subtotalLinea;
      totalDescuentos += l.valorDescuento;
      subtotal        += l.baseImponible;
      totalIVA        += l.valorIVA;
      totalINC        += l.valorINC;
    });
    const retelCA   = subtotal * ((parseFloat(notaCredito.retelCA) || 0) / 100);
    const totalNeto = subtotal + totalIVA + totalINC - retelCA;
    return { totalBruto, totalDescuentos, subtotal, totalIVA, totalINC, retelCA, totalNeto };
  };

  // ── Validación ───────────────────────────────────────────────────
  const validar = () => {
    if (!notaCredito.facturaId) {
      alert("Debes seleccionar una factura"); return false;
    }
    if (productosSeleccionados.length === 0) {
      alert("Agrega al menos un producto"); return false;
    }
    if (productosSeleccionados.some(p => !p.productoId)) {
      alert("Todos los productos deben estar seleccionados"); return false;
    }
    const { totalNeto } = calcularTotales();
    const totalPagos    = formasPago.reduce((s, f) => s + (parseFloat(f.valor) || 0), 0);
    if (Math.abs(totalNeto - totalPagos) > 0.01) {
      alert(
        `Las formas de pago no cuadran.\n` +
        `Total Neto: $${totalNeto.toFixed(2)}\n` +
        `Total Pagos: $${totalPagos.toFixed(2)}`
      );
      return false;
    }
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!user?.id) { alert("No se pudo obtener el usuario."); return; }

    const totales = calcularTotales();
    const payload = {
      usuarioId:        user.id,
      facturaId:        parseInt(notaCredito.facturaId),
      numeroNota:       `NC-${Date.now()}`,
      tipo:             notaCredito.tipo,
      motivoDIAN:       notaCredito.motivoDIAN,
      fechaElaboracion: notaCredito.fechaElaboracion,
      cufe:             notaCredito.cufe         || "",
      observaciones:    notaCredito.observaciones|| "",
      estado:           "Pendiente",
      ...totales,
      detalleNotaCredito: productosSeleccionados.map(item => {
        const l = calcularLinea(item);
        return {
          productoId:          parseInt(item.productoId),
          descripcion:         item.descripcion    || "",
          cantidad:            parseFloat(item.cantidad),
          unidadMedida:        item.unidadMedida   || "Unidad",
          precioUnitario:      parseFloat(item.precioUnitario),
          porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
          ...l,
        };
      }),
      formasPago: formasPago.map(f => ({
        metodo: f.metodo,
        valor:  parseFloat(f.valor),
      })),
    };

    try {
      await crearNotaCredito(payload);
      setMensajeExito("Nota crédito creada exitosamente ✓");
      setTimeout(() => navigate("/ventas/notas-credito"), 1800);
    } catch {
      // errorCrud se setea automáticamente en el hook
    }
  };

  // ── Reset ────────────────────────────────────────────────────────
  const handleCancel = () => navigate(-1);

  // ── Loading / Error ──────────────────────────────────────────────
  if (loading) return (
    <div className="text-center mt-5 pt-5">
      <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48 }} />
      <p className="mt-3 text-muted">Cargando datos...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-4">
      <h5>Error al cargar</h5>
      <p className="mb-2">{error}</p>
      <button className="btn btn-sm btn-primary" onClick={recargarDatos}>
        Reintentar
      </button>
    </div>
  );

  return (
    <div>
      {/* ── Alerta éxito ── */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show m-3 d-flex align-items-center gap-2">
          <CheckCircleFill size={18} />
          {mensajeExito}
          <button className="btn-close ms-auto" onClick={() => setMensajeExito("")} />
        </div>
      )}

      {/* ── Alerta error CRUD ── */}
      {errorCrud && (
        <div className="alert alert-danger alert-dismissible fade show m-3">
          {errorCrud}
          <button className="btn-close" onClick={limpiarErrorCrud} />
        </div>
      )}

      {/* ── Formulario ── */}
      <FormNotaCredito
        notaCredito={notaCredito}
        setNotaCredito={setNotaCredito}
        productosSeleccionados={productosSeleccionados}
        setProductosSeleccionados={setProductosSeleccionados}
        formasPago={formasPago}
        setFormasPago={setFormasPago}
        facturaSeleccionada={facturaSeleccionada}
        setFacturaSeleccionada={setFacturaSeleccionada}
        facturas={facturas}
        productos={productos}
        clientes={clientes}
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* ── Modales — conecta con tus componentes de modal ── */}
      {/* Ejemplo:
      {modalProducto && (
        <ModalCrearProducto
          open={modalProducto}
          onClose={() => setModalProducto(false)}
          onSuccess={() => { recargarDatos(); setModalProducto(false); }}
        />
      )}
      {modalCliente && (
        <ModalCrearCliente
          open={modalCliente}
          onClose={() => setModalCliente(false)}
          onSuccess={() => { recargarDatos(); setModalCliente(false); }}
        />
      )}
      {modalContacto && (
        <ModalCrearContacto
          open={modalContacto}
          onClose={() => setModalContacto(false)}
          onSuccess={() => { recargarDatos(); setModalContacto(false); }}
        />
      )}
      */}
    </div>
  );
}
