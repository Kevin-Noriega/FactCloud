import { useState } from "react";
import { Calendar3, XCircle, Trash, CheckCircle, XCircleFill, Paperclip } from "react-bootstrap-icons";
import SearchDrop from "../shared/SearchDrop";
import "../../styles/pages/DocBase.css";

const TIPOS_ND    = [{ value: "", label: "— Seleccionar —" }, { value: "interes", label: "Intereses" }, { value: "gastos", label: "Gastos adicionales" }, { value: "ajuste", label: "Ajuste de precio" }];
const MOTIVOS_ND  = [{ value: "ND-1", label: "ND-1 — Intereses" }, { value: "ND-2", label: "ND-2 — Gastos adicionales" }, { value: "ND-3", label: "ND-3 — Cambio de condiciones" }];
const IMPUESTOS_C = [{ value: "", label: "—" }, { value: "IVA5", label: "IVA 5%" }, { value: "IVA19", label: "IVA 19%" }];
const IMPUESTOS_R = [{ value: "", label: "—" }, { value: "RET2.5", label: "Ret. 2.5%" }, { value: "RET10", label: "Ret. 10%" }];
const FORMAS_PAGO = [{ value: "", label: "Selecciona forma de pago" }, { value: "10", label: "Efectivo" }, { value: "42", label: "Transferencia bancaria" }, { value: "48", label: "Tarjeta de crédito" }, { value: "20", label: "Crédito" }];
const ITEM_VACIO  = { productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0, porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0, impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad" };

export default function FormNotaDebito({
  notaDebito, setNotaDebito,
  productosSeleccionados = [], setProductosSeleccionados,
  formasPago = [], setFormasPago,
  facturaSeleccionada, setFacturaSeleccionada,
  facturas = [], productos = [], clientes = [],
  notaEditando, saving = false,
  onSubmit, onCancel,
  onCrearProducto, onCrearCliente, onCrearContacto,
}) {
  const [facturaBusqueda, setFacturaBusqueda] = useState(facturaSeleccionada?.numeroFactura || "");
  const [clienteBusqueda, setClienteBusqueda] = useState(facturaSeleccionada?.clienteNombre || "");
  const [vendedor,        setVendedor]        = useState("");
  const [archivo,         setArchivo]         = useState(null);

  const facturasFiltradas = facturas.filter(f =>
    f.numeroFactura?.toLowerCase().includes(facturaBusqueda.toLowerCase()) ||
    f.clienteNombre?.toLowerCase().includes(facturaBusqueda.toLowerCase())
  );
  const clientesFiltrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(clienteBusqueda.toLowerCase()) ||
    c.numeroIdentificacion?.includes(clienteBusqueda)
  );

  const seleccionarFactura = (f) => {
    setFacturaSeleccionada(f);
    setFacturaBusqueda(f.numeroFactura);
    setClienteBusqueda(f.clienteNombre || "");
    setNotaDebito(p => ({ ...p, facturaId: f.id }));
  };
  const limpiarFactura = () => {
    setFacturaSeleccionada(null);
    setFacturaBusqueda("");
    setClienteBusqueda("");
    setNotaDebito(p => ({ ...p, facturaId: "" }));
  };

  const addItem = () => setProductosSeleccionados(p => [...p, { ...ITEM_VACIO }]);
  const delItem = (i) => setProductosSeleccionados(p => p.length > 1 ? p.filter((_, j) => j !== i) : p);
  const updItem = (i, k, v) => setProductosSeleccionados(p => p.map((it, j) => j === i ? { ...it, [k]: v } : it));

  const handleProductoChange = (idx, val) => {
    if (val === "__CREAR__") { onCrearProducto?.(); return; }
    const prod = productos.find(p => String(p.id) === String(val));
    updItem(idx, "productoId", val);
    if (prod) {
      updItem(idx, "precioUnitario", prod.precioUnitario ?? 0);
      updItem(idx, "descripcion",    prod.descripcion    ?? "");
      updItem(idx, "tarifaIVA",      prod.tarifaIva      ?? 19);
    }
  };

  const addPago = () => setFormasPago(p => [...p, { metodo: "", valor: 0 }]);
  const delPago = (i) => setFormasPago(p => p.length > 1 ? p.filter((_, j) => j !== i) : p);
  const updPago = (i, k, v) => setFormasPago(p => p.map((fp, j) => j === i ? { ...fp, [k]: v } : fp));

  const calcLinea = (it) => {
    const base = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
    const desc = base * ((parseFloat(it.porcentajeDescuento) || 0) / 100);
    const neto = base - desc;
    return neto + neto * ((parseFloat(it.tarifaIVA) || 0) / 100) + neto * ((parseFloat(it.tarifaINC) || 0) / 100);
  };
  const totalBruto = productosSeleccionados.reduce((s, it) => s + (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0), 0);
  const totalDesc  = productosSeleccionados.reduce((s, it) => { const b = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0); return s + b * ((parseFloat(it.porcentajeDescuento) || 0) / 100); }, 0);
  const subtotal     = totalBruto - totalDesc;
  const totalPagos   = formasPago.reduce((s, fp) => s + (parseFloat(fp.valor) || 0), 0);
  const pagosCuadran = Math.abs(totalPagos - subtotal) < 0.01;
  const fmt = (n) => (n || 0).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="doc-container">
      <div className="doc-titulo-row">
        <h4 className="doc-titulo">{notaEditando ? "Editar nota débito" : "Nueva nota débito (Ventas)"}</h4>
        <button type="button" className="doc-btn-secundario">Ver tutoriales ▾</button>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="doc-header-grid">
          <div className="doc-col">

            <div className="doc-field">
              <label className="doc-label">Factura</label>
              <SearchDrop
                value={facturaBusqueda}
                onChange={setFacturaBusqueda}
                onSelect={seleccionarFactura}
                onClear={facturaSeleccionada ? limpiarFactura : null}
                placeholder="Buscar por número o cliente..."
                items={facturasFiltradas}
                keyExtractor={f => f.id}
                renderItem={f => (<><span className="fw-semibold">{f.numeroFactura}</span><span className="text-muted ms-2 small">{f.clienteNombre}</span></>)}
                emptyLabel={facturas.length === 0 ? "Cargando facturas..." : `"${facturaBusqueda}" sin resultados`}
                readOnly={!!facturaSeleccionada}
              />
            </div>

            <div className="doc-field">
              <label className="doc-label">Tipo</label>
              <select className="form-select form-select-sm"
                value={notaDebito.tipo || ""}
                onChange={e => setNotaDebito(p => ({ ...p, tipo: e.target.value }))}>
                {TIPOS_ND.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="doc-field">
              <label className="doc-label">Cliente</label>
              <SearchDrop
                value={clienteBusqueda}
                onChange={setClienteBusqueda}
                onSelect={c => { setClienteBusqueda(c.nombre); setNotaDebito(p => ({ ...p, clienteId: c.id })); }}
                onClear={!facturaSeleccionada ? () => { setClienteBusqueda(""); setNotaDebito(p => ({ ...p, clienteId: "" })); } : null}
                placeholder="Buscar cliente..."
                items={clientesFiltrados}
                keyExtractor={c => c.id}
                renderItem={c => (<><span className="fw-semibold">{c.nombre}</span><span className="text-muted ms-2 small">{c.numeroIdentificacion}</span></>)}
                emptyLabel={`"${clienteBusqueda}" no encontrado`}
                onCrear={onCrearCliente}
                crearLabel="Crear nuevo cliente"
                readOnly={!!facturaSeleccionada}
              />
            </div>

            <div className="doc-field">
              <label className="doc-label">Contacto</label>
              <select className="form-select form-select-sm"
                value={notaDebito.contactoId || ""}
                onChange={e => { if (e.target.value === "__CREAR__") { onCrearContacto?.(); return; } setNotaDebito(p => ({ ...p, contactoId: e.target.value })); }}>
                <option value="">— Sin contacto —</option>
                <option disabled>──────────────</option>
                <option value="__CREAR__" style={{ color: "#27ae60", fontWeight: 600 }}>➕ Agregar nuevo contacto</option>
              </select>
            </div>

            <div className="doc-field">
              <label className="doc-label">Fecha de elaboración</label>
              <div className="doc-fecha-wrap">
                <input type="date" className="form-control form-control-sm"
                  value={notaDebito.fechaElaboracion || ""}
                  onChange={e => setNotaDebito(p => ({ ...p, fechaElaboracion: e.target.value }))} />
                <button type="button" className="doc-icon-btn" onClick={() => setNotaDebito(p => ({ ...p, fechaElaboracion: "" }))}><XCircle size={13} /></button>
                <button type="button" className="doc-icon-btn"><Calendar3 size={13} /></button>
              </div>
            </div>

            <div className="doc-field">
              <label className="doc-label">Vendedor</label>
              <SearchDrop value={vendedor} onChange={setVendedor} onSelect={() => {}}
                placeholder="Buscar vendedor..." items={[]} keyExtractor={() => {}}
                renderItem={() => {}} emptyLabel="Sin vendedores" />
            </div>
          </div>

          <div className="doc-col">
            <div className="doc-field">
              <label className="doc-label">Número</label>
              <input type="text" className="form-control form-control-sm"
                value={notaEditando?.numeroNota || ""} placeholder="Se asigna automáticamente" readOnly />
            </div>
            <div className="doc-field">
              <label className="doc-label">Motivo DIAN</label>
              <select className="form-select form-select-sm"
                value={notaDebito.motivoDIAN || "ND-1"}
                onChange={e => setNotaDebito(p => ({ ...p, motivoDIAN: e.target.value }))}>
                {MOTIVOS_ND.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ══ TABLA ══ */}
        <div style={{ marginBottom: 28 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="doc-section-title mb-0">Detalle de productos</h6>
            <button type="button" className="btn btn-sm btn-primary px-3" onClick={addItem}>+ Agregar fila</button>
          </div>
          <div className="doc-table-scroll">
            <table className="doc-tabla">
              <thead>
                <tr>
                  <th className="doc-th-num">#</th>
                  <th style={{ minWidth: 180 }}>Producto</th>
                  <th style={{ minWidth: 150 }}>Descripción</th>
                  <th className="text-end" style={{ width: 76 }}>Cant</th>
                  <th className="text-end" style={{ width: 114 }}>Precio Unit.</th>
                  <th className="text-end" style={{ width: 82 }}>% Desc.</th>
                  <th style={{ width: 112 }}>Imp. Cargo</th>
                  <th style={{ width: 122 }}>Imp. Retención</th>
                  <th className="text-end" style={{ width: 114 }}>Total</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.length === 0 ? (
                  <tr><td colSpan="10" className="doc-tabla-empty">Agrega al menos un producto</td></tr>
                ) : productosSeleccionados.map((it, idx) => (
                  <tr key={idx}>
                    <td className="doc-td-num">{idx + 1}</td>
                    <td>
                      <select className="form-select form-select-sm doc-select-item"
                        value={it.productoId}
                        onChange={e => handleProductoChange(idx, e.target.value)}>
                        <option value="">{productos.length === 0 ? "Cargando..." : "— Seleccionar —"}</option>
                        {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        <option disabled>──────────────</option>
                        <option value="__CREAR__" style={{ color: "#27ae60", fontWeight: 600 }}>➕ Crear nuevo producto</option>
                      </select>
                    </td>
                    <td><input type="text" className="form-control form-control-sm" value={it.descripcion} placeholder="Descripción..." onChange={e => updItem(idx, "descripcion", e.target.value)} /></td>
                    <td><input type="number" min="0" className="form-control form-control-sm text-end doc-num-input" value={it.cantidad} onChange={e => updItem(idx, "cantidad", e.target.value)} /></td>
                    <td><input type="number" min="0" step="0.01" className="form-control form-control-sm text-end doc-num-input" value={it.precioUnitario} onChange={e => updItem(idx, "precioUnitario", e.target.value)} /></td>
                    <td><input type="number" min="0" max="100" step="0.01" className="form-control form-control-sm text-end doc-num-input" value={it.porcentajeDescuento} onChange={e => updItem(idx, "porcentajeDescuento", e.target.value)} /></td>
                    <td><select className="form-select form-select-sm doc-select-item" value={it.impuestoCargo} onChange={e => updItem(idx, "impuestoCargo", e.target.value)}>{IMPUESTOS_C.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}</select></td>
                    <td><select className="form-select form-select-sm doc-select-item" value={it.impuestoRetencion} onChange={e => updItem(idx, "impuestoRetencion", e.target.value)}>{IMPUESTOS_R.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}</select></td>
                    <td className="text-end fw-semibold">{fmt(calcLinea(it))}</td>
                    <td><button type="button" className="doc-btn-trash" onClick={() => delItem(idx)} disabled={productosSeleccionados.length === 1}><Trash size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ PAGOS + TOTALES ══ */}
        <div className="doc-pago-totales">
          <div>
            <h6 className="doc-section-title">Formas de pago</h6>
            <div className="doc-hr" />
            {formasPago.map((fp, idx) => (
              <div key={idx} className="doc-pago-fila">
                <select className="form-select form-select-sm doc-pago-select" value={fp.metodo} onChange={e => updPago(idx, "metodo", e.target.value)}>{FORMAS_PAGO.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                <input type="number" min="0" step="0.01" className="form-control form-control-sm text-end doc-pago-valor" value={fp.valor} onChange={e => updPago(idx, "valor", e.target.value)} />
                <button type="button" className="doc-btn-trash" onClick={() => delPago(idx)} disabled={formasPago.length === 1}><Trash size={13} /></button>
              </div>
            ))}
            <div className="doc-hr" />
            <button type="button" className="doc-btn-agregar-pago" onClick={addPago}>+ Agregar otra forma de pago</button>
            <div className="doc-hr" />
            <div className="doc-total-pagos">
              <span className="doc-total-pagos-label">Total formas de pago:</span>
              <span className="doc-total-pagos-valor">
                $ {fmt(totalPagos)}
                {pagosCuadran ? <CheckCircle size={18} className="doc-check-ok ms-2" /> : <XCircleFill size={18} className="doc-check-err ms-2" />}
              </span>
            </div>
            {!pagosCuadran && totalPagos > 0 && <p className="doc-pagos-error">Diferencia de $ {fmt(Math.abs(subtotal - totalPagos))}</p>}
          </div>
          <div className="doc-totales">
            <div className="doc-totales-fila"><span>Total Bruto</span><span>$ {fmt(totalBruto)}</span></div>
            <div className="doc-totales-fila"><span>Descuentos</span><span style={{ color: "#e05c6a" }}>-$ {fmt(totalDesc)}</span></div>
            <div className="doc-totales-fila"><span>Subtotal</span><span>$ {fmt(subtotal)}</span></div>
            <div className="doc-totales-fila doc-totales-neto"><span>Total Neto</span><strong>$ {fmt(subtotal)}</strong></div>
          </div>
        </div>

        {/* ══ OBSERVACIONES ══ */}
        <div className="doc-observaciones">
          <h6 className="doc-section-title">Observaciones</h6>
          <textarea className="form-control doc-textarea" rows={3} placeholder="Comentarios adicionales..." value={notaDebito.observaciones || ""} onChange={e => setNotaDebito(p => ({ ...p, observaciones: e.target.value }))} />
          <label className="doc-adjuntar mt-2">
            <input type="file" className="d-none" onChange={e => setArchivo(e.target.files[0])} />
            <Paperclip size={14} />{archivo ? <span className="doc-archivo-nombre ms-1">{archivo.name}</span> : " Adjuntar soporte"}
          </label>
        </div>

        {/* ✅ FOOTER */}
        <div className="doc-footer">
          <button type="button" className="doc-btn-cancelar" onClick={onCancel} disabled={saving}>Cancelar</button>
          <button type="submit" className="doc-btn-guardar" disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : "Guardar"}
          </button>
          <button type="submit" className="doc-btn-guardar-enviar" disabled={saving}
            onClick={() => setNotaDebito(p => ({ ...p, enviar: true }))}>
            {saving ? "Enviando..." : "Guardar y enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
