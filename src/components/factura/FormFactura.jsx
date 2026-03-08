import { useState } from "react";
import {
  XCircle, Calendar3, Trash,
  CheckCircle, XCircleFill, Paperclip, Upc,
} from "react-bootstrap-icons";
import SearchDrop from "../shared/SearchDrop";
import "../../styles/pages/DocBase.css";

// ── Constantes ────────────────────────────────────────────────────
const TIPOS_FACTURA = [
  { value: "",    label: "Seleccionar tipo..."          },
  { value: "FV",  label: "Factura de venta electrónica" },
  { value: "FE",  label: "Factura de exportación"       },
  { value: "FC",  label: "Factura contingencia"         },
];
const FORMAS_PAGO = [
  { value: "",   label: "Selecciona forma de pago" },
  { value: "10", label: "Efectivo"                 },
  { value: "42", label: "Transferencia bancaria"   },
  { value: "48", label: "Tarjeta de crédito"       },
  { value: "20", label: "Crédito"                  },
  { value: "71", label: "Cheque"                   },
];
const IMPUESTOS_C = [
  { value: "",      label: "—"        },
  { value: "IVA0",  label: "IVA 0%"  },
  { value: "IVA5",  label: "IVA 5%"  },
  { value: "IVA19", label: "IVA 19%" },
  { value: "INC8",  label: "INC 8%"  },
];
const IMPUESTOS_R = [
  { value: "",       label: "—"          },
  { value: "RTE2.5", label: "Rete. 2.5%" },
  { value: "RTE10",  label: "Rete. 10%"  },
  { value: "RTE11",  label: "Rete. 11%"  },
];

const CREAR_NUEVO = "__CREAR_NUEVO__";
const ITEM_VACIO  = {
  productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0,
  porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0,
  impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad",
};

export default function FormFactura({
  factura, setFactura,
  productosSeleccionados = [], setProductosSeleccionados,
  formasPago = [],              setFormasPago,
  clientes   = [],
  productos  = [],
  facturaEditando,
  saving     = false,
  onSubmit,
  onCancel,
  onCrearCliente,
  onCrearProducto,
  onCrearContacto,
}) {
  const [clienteBusqueda, setClienteBusqueda] = useState(
    facturaEditando?.clienteNombre || ""
  );
  const [codigoBarras, setCodigoBarras] = useState("");
  const [archivo,      setArchivo]      = useState(null);
  const [touched,      setTouched]      = useState({});

  const marcar = (k) => setTouched((p) => ({ ...p, [k]: true }));
  const errTipo    = (touched.tipo    || false) && !factura.tipo;
  const errCliente = (touched.cliente || false) && !factura.clienteId;

  // ── Filtros ──────────────────────────────────────────────────
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre?.toLowerCase().includes(clienteBusqueda.toLowerCase()) ||
      c.numeroIdentificacion?.includes(clienteBusqueda)
  );

  // ── Escaneo de código de barras ──────────────────────────────
  const handleEscanear = () => {
    const prod = productos.find(
      (p) =>
        p.codigoBarras === codigoBarras ||
        p.referencia  === codigoBarras
    );
    if (!prod) { alert(`No se encontró producto con código: ${codigoBarras}`); return; }
    const existe = productosSeleccionados.findIndex(
      (it) => it.productoId === String(prod.id)
    );
    if (existe >= 0) {
      updItem(existe, "cantidad", productosSeleccionados[existe].cantidad + 1);
    } else {
      setProductosSeleccionados((p) => [
        ...p,
        { ...ITEM_VACIO, productoId: String(prod.id),
          descripcion: prod.descripcion || "",
          precioUnitario: prod.precioUnitario || 0,
          tarifaIVA: prod.tarifaIva || 19 },
      ]);
    }
    setCodigoBarras("");
  };

  // ── Items ────────────────────────────────────────────────────
  const addItem  = () => setProductosSeleccionados((p) => [...p, { ...ITEM_VACIO }]);
  const delItem  = (i) => setProductosSeleccionados((p) => p.length > 1 ? p.filter((_, j) => j !== i) : p);
  const updItem  = (i, k, v) => setProductosSeleccionados((p) => p.map((it, j) => j === i ? { ...it, [k]: v } : it));

  const handleProductoChange = (idx, val) => {
    if (val === CREAR_NUEVO) { onCrearProducto?.(); return; }
    const prod = productos.find((p) => p.id === parseInt(val));
    updItem(idx, "productoId",    val);
    if (prod) {
      updItem(idx, "precioUnitario", prod.precioUnitario ?? 0);
      updItem(idx, "descripcion",    prod.descripcion    ?? "");
      updItem(idx, "tarifaIVA",      prod.tarifaIva      ?? 19);
    }
  };

  // ── Pagos ────────────────────────────────────────────────────
  const addPago  = () => setFormasPago((p) => [...p, { metodo: "", valor: 0 }]);
  const delPago  = (i) => setFormasPago((p) => p.length > 1 ? p.filter((_, j) => j !== i) : p);
  const updPago  = (i, k, v) => setFormasPago((p) => p.map((fp, j) => j === i ? { ...fp, [k]: v } : fp));

  // ── Cálculos ─────────────────────────────────────────────────
  const calcLinea = (it) => {
    const base = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
    const desc = base * ((parseFloat(it.porcentajeDescuento) || 0) / 100);
    const neto = base - desc;
    return neto
      + neto * ((parseFloat(it.tarifaIVA) || 0) / 100)
      + neto * ((parseFloat(it.tarifaINC) || 0) / 100);
  };
  const totalBruto = productosSeleccionados.reduce(
    (s, it) => s + (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0), 0
  );
  const totalDescuento = productosSeleccionados.reduce((s, it) => {
    const base = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
    return s + base * ((parseFloat(it.porcentajeDescuento) || 0) / 100);
  }, 0);
  const subtotal     = totalBruto - totalDescuento;
  const totalPagos   = formasPago.reduce((s, fp) => s + (parseFloat(fp.valor) || 0), 0);
  const pagosCuadran = Math.abs(totalPagos - subtotal) < 0.01;
  const fmt = (n) => (n || 0).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="doc-container">

      {/* ── Título ── */}
      <div className="doc-titulo-row">
        <div>
          <h4 className="doc-titulo">
            {facturaEditando ? "Editar factura de venta" : "Nueva factura de venta"}
          </h4>
          <p className="doc-section-title" style={{ fontSize: "0.85rem", marginBottom: 0, marginTop: 2 }}>
            Información básica
          </p>
        </div>
        <button className="doc-btn-secundario" type="button">Ver tutoriales ▾</button>
      </div>

      <form onSubmit={onSubmit} noValidate>

        {/* ══════════════════════════
            ENCABEZADO
        ══════════════════════════ */}
        <div className="doc-header-grid">
          <div className="doc-col">

            {/* Tipo */}
            <div className="doc-field">
              <label className="doc-label doc-label-req">Tipo de factura</label>
              <div style={{ position: "relative" }}>
                <select
                  className={`form-select form-select-sm${errTipo ? " is-invalid" : ""}`}
                  value={factura.tipo || ""}
                  onBlur={() => marcar("tipo")}
                  onChange={(e) => setFactura((p) => ({ ...p, tipo: e.target.value }))}>
                  {TIPOS_FACTURA.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errTipo && (
                  <div className="invalid-feedback">El tipo de factura es obligatorio</div>
                )}
              </div>
            </div>

            {/* Cliente */}
            <div className="doc-field">
              <label className="doc-label doc-label-req">Cliente</label>
              <SearchDrop
                value={clienteBusqueda}
                onChange={setClienteBusqueda}
                onSelect={(c) => {
                  setClienteBusqueda(c.nombre);
                  setFactura((p) => ({ ...p, clienteId: c.id, clienteNombre: c.nombre }));
                }}
                onClear={() => {
                  setClienteBusqueda("");
                  setFactura((p) => ({ ...p, clienteId: "", clienteNombre: "" }));
                }}
                placeholder="Buscar cliente..."
                items={clientesFiltrados}
                keyExtractor={(c) => c.id}
                renderItem={(c) => (
                  <>
                    <span className="fw-semibold">{c.nombre}</span>
                    <span className="text-muted ms-2 small">{c.numeroIdentificacion}</span>
                  </>
                )}
                emptyLabel="No se encontraron clientes"
                onCrear={onCrearCliente}
                crearLabel={`Crear cliente "${clienteBusqueda}"`}
                invalid={errCliente}
              />
              {errCliente && (
                <small className="text-danger mt-1">El cliente es obligatorio</small>
              )}
            </div>

            {/* Contacto */}
            <div className="doc-field">
              <label className="doc-label">Contacto</label>
              <select
                className="form-select form-select-sm"
                value={factura.contactoId || ""}
                onChange={(e) => {
                  if (e.target.value === CREAR_NUEVO) { onCrearContacto?.(); return; }
                  setFactura((p) => ({ ...p, contactoId: e.target.value }));
                }}>
                <option value="">— Sin contacto —</option>
                <option disabled>──────────────</option>
                <option value={CREAR_NUEVO} style={{ color: "#27ae60", fontWeight: 600 }}>
                  ➕ Agregar nuevo contacto
                </option>
              </select>
            </div>

            {/* Fecha */}
            <div className="doc-field">
              <label className="doc-label">Fecha de elaboración</label>
              <div className="doc-fecha-wrap">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={factura.fechaElaboracion}
                  onChange={(e) => setFactura((p) => ({ ...p, fechaElaboracion: e.target.value }))}
                />
                <button type="button" className="doc-icon-btn"
                  onClick={() => setFactura((p) => ({ ...p, fechaElaboracion: "" }))}>
                  <XCircle size={13} />
                </button>
                <button type="button" className="doc-icon-btn">
                  <Calendar3 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="doc-col">
            {/* Número */}
            <div className="doc-field">
              <label className="doc-label">Número</label>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8 }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={factura.numero || ""}
                  placeholder="Prefijo"
                  onChange={(e) => setFactura((p) => ({ ...p, numero: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value="Auto"
                  readOnly
                  style={{ fontWeight: 700, color: "#555", background: "#f8f9fb" }}
                />
              </div>
            </div>

            {/* Escanear producto */}
            <div className="doc-field">
              <label className="doc-label">Escanear producto</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Código de barras..."
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleEscanear())}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-success px-3 d-flex align-items-center gap-1"
                  onClick={handleEscanear}
                  style={{ whiteSpace: "nowrap" }}>
                  <Upc size={14} /> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            DETALLE DE PRODUCTOS
        ══════════════════════════ */}
        <div style={{ marginBottom: 28 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="doc-section-title mb-0">Detalle de productos</h6>
            <button type="button" className="btn btn-primary btn-sm px-3" onClick={addItem}>
              + Agregar fila
            </button>
          </div>

          <div className="doc-table-scroll">
            <table className="doc-tabla">
              <thead>
                <tr>
                  <th className="doc-th-num">#</th>
                  <th style={{ minWidth: 180 }}>Producto</th>
                  <th className="text-end" style={{ width: 76 }}>Cant</th>
                  <th className="text-end" style={{ width: 114 }}>Precio</th>
                  <th className="text-end" style={{ width: 80 }}>Desc %</th>
                  <th style={{ width: 110 }}>IVA %</th>
                  <th style={{ width: 110 }}>INC %</th>
                  <th className="text-end" style={{ width: 114 }}>Total</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="doc-tabla-empty">
                      No hay productos. Escanea un código o agrega una fila manual.
                    </td>
                  </tr>
                ) : (
                  productosSeleccionados.map((it, idx) => (
                    <tr key={idx}>
                      <td className="doc-td-num">{idx + 1}</td>
                      <td>
                        <select
                          className="form-select form-select-sm doc-select-item"
                          value={it.productoId}
                          onChange={(e) => handleProductoChange(idx, e.target.value)}>
                          <option value="">
                            {productos.length === 0 ? "Cargando..." : "— Seleccionar —"}
                          </option>
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                          {/* ✅ Crear nuevo al final */}
                          <option disabled>──────────────</option>
                          <option value={CREAR_NUEVO} style={{ color: "#27ae60", fontWeight: 600 }}>
                            ➕ Crear nuevo producto
                          </option>
                        </select>
                      </td>
                      <td>
                        <input type="number" min="0"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.cantidad}
                          onChange={(e) => updItem(idx, "cantidad", e.target.value)} />
                      </td>
                      <td>
                        <input type="number" min="0" step="0.01"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.precioUnitario}
                          onChange={(e) => updItem(idx, "precioUnitario", e.target.value)} />
                      </td>
                      <td>
                        <input type="number" min="0" max="100" step="0.01"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.porcentajeDescuento}
                          onChange={(e) => updItem(idx, "porcentajeDescuento", e.target.value)} />
                      </td>
                      <td>
                        <select className="form-select form-select-sm doc-select-item"
                          value={it.impuestoCargo}
                          onChange={(e) => updItem(idx, "impuestoCargo", e.target.value)}>
                          {IMPUESTOS_C.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select className="form-select form-select-sm doc-select-item"
                          value={it.impuestoRetencion}
                          onChange={(e) => updItem(idx, "impuestoRetencion", e.target.value)}>
                          {IMPUESTOS_R.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end fw-semibold">{fmt(calcLinea(it))}</td>
                      <td>
                        <button type="button" className="doc-btn-trash"
                          onClick={() => delItem(idx)}
                          disabled={productosSeleccionados.length === 1}>
                          <Trash size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════
            FORMAS DE PAGO + TOTALES
        ══════════════════════════ */}
        <div className="doc-pago-totales">
          <div>
            <h6 className="doc-section-title">Formas de pago</h6>
            <div className="doc-hr" />
            {formasPago.map((fp, idx) => (
              <div key={idx} className="doc-pago-fila">
                <select className="form-select form-select-sm"
                  value={fp.metodo} onChange={(e) => updPago(idx, "metodo", e.target.value)}>
                  {FORMAS_PAGO.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <input type="number" min="0" step="0.01"
                  className="form-control form-control-sm text-end"
                  value={fp.valor} onChange={(e) => updPago(idx, "valor", e.target.value)} />
                <button type="button" className="doc-btn-trash"
                  onClick={() => delPago(idx)} disabled={formasPago.length === 1}>
                  <Trash size={13} />
                </button>
              </div>
            ))}
            <div className="doc-hr" />
            <button type="button" className="doc-btn-agregar-pago" onClick={addPago}>
              + Agregar otra forma de pago
            </button>
            <div className="doc-hr" />
            <div className="doc-total-pagos">
              <span className="doc-total-pagos-label">Total formas de pago:</span>
              <span className="doc-total-pagos-valor">
                $ {fmt(totalPagos)}
                {pagosCuadran
                  ? <CheckCircle  size={18} className="doc-check-ok ms-1" />
                  : <XCircleFill  size={18} className="doc-check-err ms-1" />}
              </span>
            </div>
            {!pagosCuadran && totalPagos > 0 && (
              <p className="doc-pagos-error">
                Diferencia $ {fmt(Math.abs(subtotal - totalPagos))} — debe ser $ {fmt(subtotal)}
              </p>
            )}
          </div>

          <div className="doc-totales">
            <div className="doc-totales-fila">
              <span>Total Bruto</span><span>$ {fmt(totalBruto)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Descuentos</span>
              <span style={{ color: "var(--doc-red)" }}>-$ {fmt(totalDescuento)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Subtotal</span><span>$ {fmt(subtotal)}</span>
            </div>
            <div className="doc-totales-fila doc-totales-neto">
              <span>Total Neto</span><strong>$ {fmt(subtotal)}</strong>
            </div>
          </div>
        </div>

        {/* ── Observaciones ── */}
        <div className="doc-observaciones">
          <h6 className="doc-section-title">Observaciones</h6>
          <textarea className="form-control doc-textarea" rows={3}
            placeholder="Notas adicionales para la factura..."
            value={factura.observaciones || ""}
            onChange={(e) => setFactura((p) => ({ ...p, observaciones: e.target.value }))} />
          <label className="doc-adjuntar mt-2">
            <input type="file" className="d-none"
              onChange={(e) => setArchivo(e.target.files[0])} />
            <Paperclip size={14} />
            {archivo ? <span className="doc-archivo-nombre">{archivo.name}</span>
                     : "Adjuntar soporte"}
          </label>
        </div>

        {/* ✅ FOOTER sticky — mismo ancho que contenido, no toca sidebar */}
        <div className="doc-footer">
          <button type="button" className="doc-btn-cancelar"
            onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="doc-btn-guardar-enviar"
            disabled={saving}>
            {saving
              ? <><span className="spinner-border spinner-border-sm me-2" />Creando...</>
              : "Guardar y crear factura"}
          </button>
        </div>
      </form>
    </div>
  );
}
