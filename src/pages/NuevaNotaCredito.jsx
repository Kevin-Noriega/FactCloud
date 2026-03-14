import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Trash, Paperclip, PlusCircle,
  CheckCircleFill, XCircleFill,
  InfoCircleFill,
} from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNotas } from "../hooks/useNotas";
import "../styles/pages/DocBase.css";

/* ── Tooltip ──────────────────────────────────────── */
function TooltipInfo({ texto }) {
  const id = useId();
  return (
    <>
      <InfoCircleFill
        className="doc-info-icon"
        data-tooltip-id={id}
        data-tooltip-place="top"
        size={13}
      />
      <Tooltip id={id} opacity={1} style={{ maxWidth: 260, fontSize: "0.8rem", zIndex: 9999 }}>
        {texto}
      </Tooltip>
    </>
  );
}

/* ── NoOptions ────────────────────────────────────── */
const NoOptionsFactura = ({ inputValue }) => (
  <div className="doc-select-empty">
    {inputValue ? `No se encontró "${inputValue}"` : "No hay facturas disponibles"}
  </div>
);

const NoOptionsProducto = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && <div className="doc-select-empty">No se encontró "{inputValue}"</div>}
    <div className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => { e.preventDefault(); onCrear(inputValue); }}>
      <PlusCircle size={13} /> Crear producto "{inputValue || "nuevo"}"
    </div>
  </div>
);

/* ── Constantes ───────────────────────────────────── */
const TIPOS_NOTA = [
  { value: "devolucion",  label: "Devolución de mercancía" },
  { value: "descuento",   label: "Descuento comercial"     },
  { value: "anulacion",   label: "Anulación de factura"    },
  { value: "ajuste",      label: "Ajuste de precio"        },
];

const MOTIVOS_DIAN = [
  { value: "NC-1", label: "NC-1 — Devolución parcial de bienes" },
  { value: "NC-2", label: "NC-2 — Anulación de factura electrónica" },
  { value: "NC-3", label: "NC-3 — Rebaja total aplicada" },
  { value: "NC-4", label: "NC-4 — Descuento total aplicado" },
  { value: "NC-5", label: "NC-5 — Rescisión: nulidad por error" },
  { value: "NC-6", label: "NC-6 — Otros" },
];

const OPCIONES_FORMA_PAGO = [
  { value: "10",  label: "Efectivo"              },
  { value: "42",  label: "Transferencia bancaria" },
  { value: "48",  label: "Tarjeta de crédito"    },
  { value: "49",  label: "Tarjeta débito"        },
  { value: "20",  label: "Crédito"               },
  { value: "ZZZ", label: "Otro"                  },
];

/* ── Estilos react-select ─────────────────────────── */
const mkSelectStyles = (invalid = false) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "34px",
    height: "34px",
    borderRadius: "6px",
    borderColor: invalid ? "#dc3545" : state.isFocused ? "#1a73e8" : "#ced4da",
    boxShadow: invalid
      ? "0 0 0 0.2rem rgba(220,53,69,0.15)"
      : state.isFocused ? "0 0 0 0.2rem rgba(26,115,232,0.15)" : "none",
    fontSize: "0.875rem",
  }),
  valueContainer:     (b) => ({ ...b, padding: "0 10px" }),
  input:              (b) => ({ ...b, margin: 0, padding: 0 }),
  dropdownIndicator:  (b) => ({ ...b, padding: "0 6px" }),
  indicatorSeparator: ()  => ({ display: "none" }),
  menu:               (b) => ({ ...b, zIndex: 9999, fontSize: "0.875rem" }),
});

/* ── Estado inicial ───────────────────────────────── */
const NOTA_VACIA = {
  facturaId:        "",
  tipo:             "devolucion",
  motivoDIAN:       "NC-1",
  fechaElaboracion: new Date().toISOString().split("T")[0],
  cufe:             "",
  observaciones:    "",
  retelCA:          0,
};

const ITEM_VACIO = {
  productoId: "", descripcion: "", cantidad: 1,
  precioUnitario: 0, porcentajeDescuento: 0,
  tarifaIVA: 19, tarifaINC: 0, unidadMedida: "Unidad",
};

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════ */
export default function NuevaNotaCredito() {
  const navigate = useNavigate();

  const {
    facturas   = [],
    productos  = [],
    loading,
    error,
    saving,
    crearNotaCredito,
    recargarDatos,
  } = useNotas();

  const [notaCredito,            setNotaCredito]            = useState({ ...NOTA_VACIA });
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ ...ITEM_VACIO }]);
  const [formasPago,             setFormasPago]             = useState([{ metodo: "10", valor: "" }]);
  const [facturaSeleccionada,    setFacturaSeleccionada]    = useState(null);
  const [touched,                setTouched]                = useState({});
  const [submitIntentado,        setSubmitIntentado]        = useState(false);

  const marcar       = (campo) => setTouched((p) => ({ ...p, [campo]: true }));
  const mostrarError = (campo) => submitIntentado || !!touched[campo];

  const fmt = (n) => (Number(n) || 0).toLocaleString("es-CO", { minimumFractionDigits: 2 });

  /* ── Opciones Select ─────────────────────────── */
  const opcionesFacturas = facturas.map((f) => ({
    value: f.id,
    label: `${f.numeroFactura} — ${f.cliente?.nombre ?? "Sin cliente"} — $${(f.totalFactura || 0).toLocaleString("es-CO")}`,
  }));

  const opcionesProductos = () =>
    productos.map((p) => ({
      value: p.id,
      label: `${p.nombre} — $${(p.precioUnitario || 0).toLocaleString("es-CO")}`,
    }));

  /* ── Cálculos ────────────────────────────────── */
  const calcularLinea = (item) => {
    const cantidad  = parseFloat(item.cantidad)            || 0;
    const precio    = parseFloat(item.precioUnitario)      || 0;
    const descuento = parseFloat(item.porcentajeDescuento) || 0;
    const tarifaIVA = parseFloat(item.tarifaIVA)           || 0;
    const tarifaINC = parseFloat(item.tarifaINC)           || 0;
    const base      = cantidad * precio;
    const valDesc   = base * (descuento / 100);
    const neto      = base - valDesc;
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
    productosSeleccionados.forEach((item) => {
      const l = calcularLinea(item);
      totalBruto      += l.subtotalLinea;
      totalDescuentos += l.valorDescuento;
      subtotal        += l.baseImponible;
      totalIVA        += l.valorIVA;
      totalINC        += l.valorINC;
    });
    const retelCA   = subtotal * ((parseFloat(notaCredito.retelCA) || 0) / 100);
    const totalNeto = subtotal + totalIVA + totalINC - retelCA;
    return { totalBruto, totalDescuentos, subtotal, totalIVA, totalINC, retelCA, totalNeto };
  };

  const totales       = calcularTotales();
  const totalFormasPago = formasPago.reduce((s, f) => s + (parseFloat(f.valor) || 0), 0);
  const pagoCoincide  = Math.abs(totalFormasPago - totales.totalNeto) <= 0.01;

  /* ── Productos ───────────────────────────────── */
  const agregarProducto = () =>
    setProductosSeleccionados((p) => [...p, { ...ITEM_VACIO }]);

  const actualizarProducto = (idx, campo, valor) => {
    setProductosSeleccionados((prev) => {
      const nuevos = [...prev];
      nuevos[idx] = { ...nuevos[idx], [campo]: valor };
      if (campo === "productoId") {
        const prod = productos.find((p) => p.id === parseInt(valor));
        if (prod) {
          nuevos[idx].descripcion    = prod.nombre;
          nuevos[idx].precioUnitario = prod.precioUnitario;
          nuevos[idx].unidadMedida   = prod.unidadMedida;
          nuevos[idx].tarifaIVA      = prod.tarifaIVA;
          nuevos[idx].tarifaINC      = prod.tarifaINC || 0;
        }
      }
      return nuevos;
    });
  };

  const eliminarProducto = (idx) =>
    setProductosSeleccionados((p) => p.filter((_, i) => i !== idx));

  /* ── Formas de pago ──────────────────────────── */
  const agregarFormaPago    = () => setFormasPago((p) => [...p, { metodo: "10", valor: "" }]);
  const eliminarFormaPago   = (idx) => setFormasPago((p) => p.filter((_, i) => i !== idx));
  const actualizarFormaPago = (idx, campo, valor) =>
    setFormasPago((prev) => { const n = [...prev]; n[idx][campo] = valor; return n; });

  /* ── Submit ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitIntentado(true);

    if (!notaCredito.facturaId) { alert("Selecciona una factura.");       return; }
    if (productosSeleccionados.length === 0) { alert("Agrega al menos un producto."); return; }
    if (productosSeleccionados.some((p) => !p.productoId)) {
      alert("Todos los productos deben estar seleccionados."); return;
    }
    if (!pagoCoincide) {
      alert(`Las formas de pago ($${fmt(totalFormasPago)}) no coinciden con el total neto ($${fmt(totales.totalNeto)}).`);
      return;
    }

    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!user?.id) { alert("No se pudo obtener el usuario."); return; }

    const payload = {
      usuarioId:        user.id,
      facturaId:        parseInt(notaCredito.facturaId),
      numeroNota:       `NC-${Date.now()}`,
      tipo:             notaCredito.tipo,
      motivoDIAN:       notaCredito.motivoDIAN,
      fechaElaboracion: notaCredito.fechaElaboracion,
      cufe:             notaCredito.cufe          || null,
      observaciones:    notaCredito.observaciones || "",
      estado:           "Pendiente",
      totalBruto:       totales.totalBruto,
      totalDescuentos:  totales.totalDescuentos,
      subtotal:         totales.subtotal,
      totalIVA:         totales.totalIVA,
      totalINC:         totales.totalINC,
      retelCA:          totales.retelCA,
      totalNeto:        totales.totalNeto,
      detalleNotaCredito: productosSeleccionados.map((item) => {
        const l = calcularLinea(item);
        return {
          productoId:          parseInt(item.productoId),
          descripcion:         item.descripcion         || "",
          cantidad:            parseFloat(item.cantidad),
          unidadMedida:        item.unidadMedida        || "Unidad",
          precioUnitario:      parseFloat(item.precioUnitario),
          porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
          valorDescuento:      l.valorDescuento,
          subtotalLinea:       l.baseImponible,
          tarifaIVA:           parseFloat(item.tarifaIVA) || 0,
          valorIVA:            l.valorIVA,
          tarifaINC:           parseFloat(item.tarifaINC) || 0,
          valorINC:            l.valorINC,
          totalLinea:          l.totalLinea,
        };
      }),
      formasPago: formasPago.map((f) => ({
        metodo: f.metodo,
        valor:  parseFloat(f.valor) || 0,
      })),
    };

    try {
      await crearNotaCredito(payload);
      alert("Nota crédito creada exitosamente");
      navigate("/ventas");
    } catch (err) {
      alert("Error al crear nota crédito: " + err.message);
    }
  };

  /* ── Loading / Error ─────────────────────────── */
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
      <button className="btn btn-sm btn-primary" onClick={recargarDatos}>Reintentar</button>
    </div>
  );

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div className="doc-container">

      {/* ── Título ── */}
      <div className="doc-titulo-row">
        <h4 className="doc-titulo">Nueva nota crédito</h4>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ══ Información básica ══ */}
        <h6 className="doc-section-title">Información básica</h6>
        <div className="doc-header-grid" style={{ marginTop: 12 }}>

          {/* Columna izquierda */}
          <div className="doc-col">

            {/* Factura origen */}
            <div className="doc-field">
              <label className="doc-label">
                Factura origen *
                <TooltipInfo texto="Selecciona la factura a la que se le aplicará la nota crédito." />
              </label>
              <Select
                styles={mkSelectStyles(mostrarError("facturaId") && !notaCredito.facturaId)}
                menuPortalTarget={document.body}
                options={opcionesFacturas}
                value={opcionesFacturas.find((o) => o.value === notaCredito.facturaId) ?? null}
                onChange={(opt) => {
                  const factura = facturas.find((f) => f.id === opt?.value);
                  setNotaCredito((p) => ({ ...p, facturaId: opt?.value ?? "" }));
                  setFacturaSeleccionada(factura ?? null);
                }}
                onBlur={() => marcar("facturaId")}
                noOptionsMessage={({ inputValue }) => <NoOptionsFactura inputValue={inputValue} />}
                isClearable
                placeholder="Buscar factura..."
              />
              {mostrarError("facturaId") && !notaCredito.facturaId && (
                <small style={{ color: "var(--doc-red)", fontSize: "0.78rem" }}>
                  La factura es obligatoria
                </small>
              )}
              {/* Info factura seleccionada */}
              {facturaSeleccionada && (
                <div style={{
                  marginTop: 6, padding: "6px 10px", background: "#f0f9fb",
                  borderRadius: 6, fontSize: "0.8rem", color: "#555",
                  borderLeft: "3px solid var(--doc-blue)",
                }}>
                  Cliente: <strong>{facturaSeleccionada.cliente?.nombre}</strong>
                  {" · "}Total: <strong>${fmt(facturaSeleccionada.totalFactura)}</strong>
                  {" · "}Estado: <strong>{facturaSeleccionada.estado}</strong>
                </div>
              )}
            </div>

            {/* Tipo de nota */}
            <div className="doc-field">
              <label className="doc-label">
                Tipo de nota
                <TooltipInfo texto="Define el motivo general de la nota crédito." />
              </label>
              <select
                className="form-select form-select-sm"
                value={notaCredito.tipo}
                onChange={(e) => setNotaCredito((p) => ({ ...p, tipo: e.target.value }))}
              >
                {TIPOS_NOTA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div className="doc-field">
              <label className="doc-label">Fecha de elaboración</label>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ borderLeft: "3px solid #1a73e8" }}
                value={notaCredito.fechaElaboracion}
                onChange={(e) => setNotaCredito((p) => ({ ...p, fechaElaboracion: e.target.value }))}
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="doc-col">

            {/* Número (auto) */}
            <div className="doc-field">
              <label className="doc-label">
                Número
                <TooltipInfo texto="Generado automáticamente al crear la nota crédito." />
              </label>
              <div className="doc-comprobante-inputs">
                <input
                  type="text"
                  className="form-control form-control-sm doc-prefijo text-center fw-bold"
                  value="NC"
                  readOnly
                />
                <input
                  type="text"
                  className="form-control form-control-sm text-center text-primary fw-bold"
                  value=""
                  placeholder="Auto"
                  readOnly
                />
              </div>
            </div>

            {/* Motivo DIAN */}
            <div className="doc-field">
              <label className="doc-label">
                Motivo DIAN
                <TooltipInfo texto="Código de concepto exigido por la DIAN para notas crédito electrónicas." />
              </label>
              <select
                className="form-select form-select-sm"
                value={notaCredito.motivoDIAN}
                onChange={(e) => setNotaCredito((p) => ({ ...p, motivoDIAN: e.target.value }))}
              >
                {MOTIVOS_DIAN.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* CUFE */}
            <div className="doc-field">
              <label className="doc-label">
                CUFE factura origen
                <TooltipInfo texto="Código Único de Factura Electrónica de la factura que se está afectando (opcional)." />
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={notaCredito.cufe}
                onChange={(e) => setNotaCredito((p) => ({ ...p, cufe: e.target.value }))}
                placeholder="Opcional..."
              />
            </div>
          </div>
        </div>

        {/* ══ Tabla de productos ══ */}
        <div style={{ marginBottom: 28 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="doc-section-title mb-0">Detalle de productos</h6>
            <button type="button" className="btn btn-sm btn-primary" onClick={agregarProducto}>
              + Agregar fila
            </button>
          </div>

          <div className="doc-table-scroll">
            <table className="doc-tabla">
              <thead>
                <tr>
                  <th className="doc-th-num">#</th>
                  <th>Producto</th>
                  <th className="text-end">Cant</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Desc %</th>
                  <th className="text-center">IVA %</th>
                  <th className="text-center">INC %</th>
                  <th className="text-end">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="doc-tabla-empty">
                      No hay productos. Agrega una fila para comenzar.
                    </td>
                  </tr>
                ) : (
                  productosSeleccionados.map((item, idx) => {
                    const linea = calcularLinea(item);
                    const opts  = opcionesProductos();
                    return (
                      <tr key={idx}>
                        <td className="doc-td-num">{idx + 1}</td>
                        <td>
                          <Select
                            menuPortalTarget={document.body}
                            styles={{
                              ...mkSelectStyles(),
                              control: (b, s) => ({ ...mkSelectStyles().control(b, s), minWidth: 200 }),
                            }}
                            options={opts}
                            value={opts.find((o) => o.value === item.productoId) ?? null}
                            onChange={(opt) => actualizarProducto(idx, "productoId", opt?.value ?? "")}
                            noOptionsMessage={({ inputValue }) => (
                              <NoOptionsProducto inputValue={inputValue} onCrear={() => {}} />
                            )}
                            isClearable
                            placeholder="Buscar producto..."
                          />
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm text-end doc-num-input"
                            value={item.cantidad} min="1"
                            onChange={(e) => actualizarProducto(idx, "cantidad", e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm text-end doc-num-input"
                            value={item.precioUnitario} step="0.01" min="0"
                            onChange={(e) => actualizarProducto(idx, "precioUnitario", e.target.value)} />
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm text-end doc-num-input"
                            value={item.porcentajeDescuento} min="0" max="100" step="0.01"
                            onChange={(e) => actualizarProducto(idx, "porcentajeDescuento", e.target.value)} />
                        </td>
                        <td>
                          <select className="form-select form-select-sm doc-select-item"
                            value={item.tarifaIVA}
                            onChange={(e) => actualizarProducto(idx, "tarifaIVA", e.target.value)}>
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="19">19%</option>
                          </select>
                        </td>
                        <td>
                          <select className="form-select form-select-sm doc-select-item"
                            value={item.tarifaINC}
                            onChange={(e) => actualizarProducto(idx, "tarifaINC", e.target.value)}>
                            <option value="0">0%</option>
                            <option value="2">2%</option>
                            <option value="8">8%</option>
                            <option value="16">16%</option>
                          </select>
                        </td>
                        <td className="text-end fw-semibold">${fmt(linea.totalLinea)}</td>
                        <td>
                          <button type="button" className="doc-btn-trash"
                            onClick={() => eliminarProducto(idx)}
                            disabled={productosSeleccionados.length === 1}>
                            <Trash size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ Formas de pago + Totales ══ */}
        <div className="doc-pago-totales">

          {/* Formas de pago */}
          <div>
            <h6 className="doc-section-title">Formas de pago</h6>
            <div className="doc-hr" />

            {formasPago.map((fp, idx) => (
              <div key={idx} className="doc-pago-fila">
                <select className="form-select form-select-sm doc-pago-select"
                  value={fp.metodo}
                  onChange={(e) => actualizarFormaPago(idx, "metodo", e.target.value)}>
                  {OPCIONES_FORMA_PAGO.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input type="number" className="form-control form-control-sm text-end doc-pago-valor"
                  value={fp.valor} placeholder="0.00" step="0.01" min="0"
                  onChange={(e) => actualizarFormaPago(idx, "valor", e.target.value)} />
                <button type="button" className="doc-btn-trash" onClick={() => eliminarFormaPago(idx)}>
                  <Trash size={13} />
                </button>
              </div>
            ))}

            <div className="doc-hr" />
            <button type="button" className="doc-btn-agregar-pago" onClick={agregarFormaPago}>
              + Agregar otra forma de pago
            </button>
            <div className="doc-hr" />

            <div className="doc-total-pagos">
              <span className="doc-total-pagos-label">Total formas de pago:</span>
              <span className="doc-total-pagos-valor">
                {fmt(totalFormasPago)}
                {pagoCoincide
                  ? <CheckCircleFill size={18} className="doc-check-ok" />
                  : <XCircleFill     size={18} className="doc-check-err" />}
              </span>
            </div>
            {!pagoCoincide && totalFormasPago > 0 && (
              <p className="doc-pagos-error">
                El total debe coincidir con el total neto ({fmt(totales.totalNeto)})
              </p>
            )}
          </div>

          {/* Totales */}
          <div className="doc-totales">
            <div className="doc-totales-fila">
              <span>Total Bruto:</span>
              <span>{fmt(totales.totalBruto)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Descuentos:</span>
              <span className="text-danger">-{fmt(totales.totalDescuentos)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Subtotal:</span>
              <span>{fmt(totales.subtotal)}</span>
            </div>
            {totales.totalIVA > 0 && (
              <div className="doc-totales-fila">
                <span>IVA:</span>
                <span>{fmt(totales.totalIVA)}</span>
              </div>
            )}
            {totales.totalINC > 0 && (
              <div className="doc-totales-fila">
                <span>INC:</span>
                <span>{fmt(totales.totalINC)}</span>
              </div>
            )}
            <div className="doc-totales-fila">
              <span>RetelCA %:</span>
              <div className="doc-retelca-row">
                <input
                  type="number" min="0" max="100" step="0.1"
                  className="form-control form-control-sm doc-retelca-select"
                  value={notaCredito.retelCA}
                  onChange={(e) => setNotaCredito((p) => ({ ...p, retelCA: e.target.value }))}
                  placeholder="0"
                />
                <span className="doc-retelca-valor text-danger">-{fmt(totales.retelCA)}</span>
              </div>
            </div>
            <div className="doc-totales-fila doc-totales-neto">
              <span>Total Neto:</span>
              <strong>{fmt(totales.totalNeto)}</strong>
            </div>
          </div>
        </div>

        {/* ══ Observaciones ══ */}
        <div className="doc-observaciones">
          <h6 className="doc-section-title">Observaciones</h6>
          <textarea className="form-control doc-textarea" rows={4}
            placeholder="Comentarios adicionales sobre la nota crédito..."
            value={notaCredito.observaciones}
            onChange={(e) => setNotaCredito((p) => ({ ...p, observaciones: e.target.value }))} />
        </div>

        {/* ══ Footer sticky ══ */}
        <div className="doc-footer">
          <button type="button" className="doc-btn-cancelar"
            onClick={() => navigate("/ventas")}>
            Cancelar
          </button>
          <button type="submit" className="doc-btn-guardar-enviar" disabled={saving}>
            {saving ? "Guardando..." : "Guardar nota crédito"}
          </button>
        </div>
      </form>
    </div>
  );
}
