import { useState } from "react";
import {
  XCircle, Calendar3, Trash,
  CheckCircle, XCircleFill, Paperclip,
} from "react-bootstrap-icons";
import SearchDrop from "../shared/SearchDrop";
import "../../styles/pages/DocBase.css";

const TIPOS_DOC = [
  { value: "",    label: "— Seleccionar —"                 },
  { value: "DS",  label: "Documento soporte"               },
  { value: "DSA", label: "Documento soporte de ajuste"     },
];
const MOTIVOS_DS = [
  { value: "DS-1", label: "DS-1 — Adquisición de bienes"    },
  { value: "DS-2", label: "DS-2 — Adquisición de servicios" },
  { value: "DS-3", label: "DS-3 — Nómina electrónica"       },
  { value: "DS-4", label: "DS-4 — Otros"                    },
];
const FORMAS_PAGO = [
  { value: "",   label: "Selecciona forma de pago" },
  { value: "10", label: "Efectivo"                 },
  { value: "42", label: "Transferencia bancaria"   },
  { value: "48", label: "Tarjeta de crédito"       },
  { value: "20", label: "Crédito"                  },
];
const IMPUESTOS_C = [
  { value: "",      label: "—"        },
  { value: "IVA5",  label: "IVA 5%"  },
  { value: "IVA19", label: "IVA 19%" },
];
const IMPUESTOS_R = [
  { value: "",        label: "—"          },
  { value: "RTE2.5",  label: "Rete. 2.5%" },
  { value: "RTE10",   label: "Rete. 10%"  },
];

const CREAR_NUEVO = "__CREAR_NUEVO__";
const ITEM_VACIO  = {
  productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0,
  porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0,
  impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad",
};

export default function FormDocumentoSoporte({
  documento,
  setDocumento,
  productosSeleccionados,
  setProductosSeleccionados,
  formasPago,
  setFormasPago,
  proveedores,
  productos,
  documentoEditando,
  saving       = false,
  onSubmit,
  onCancel,
  onCrearProveedor,
  onCrearProducto,
  onCrearContacto,
}) {
  // ✅ GUARDS — protegen contra undefined en cualquier render previo
  const _doc       = documento                              ?? {};
  const _items     = Array.isArray(productosSeleccionados)  ? productosSeleccionados : [];
  const _pagos     = Array.isArray(formasPago)              ? formasPago             : [];
  const _provs     = Array.isArray(proveedores)             ? proveedores            : [];
  const _productos = Array.isArray(productos)               ? productos              : [];

  const [proveedorBusqueda, setProveedorBusqueda] = useState(
    documentoEditando?.proveedorNombre || ""
  );
  const [archivo, setArchivo] = useState(null);

  const proveedoresFiltrados = _provs.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(proveedorBusqueda.toLowerCase()) ||
      p.numeroIdentificacion?.includes(proveedorBusqueda)
  );

  // ── Items ────────────────────────────────────────────────────────
  const addItem = () => setProductosSeleccionados([..._items, { ...ITEM_VACIO }]);
  const delItem = (i) => setProductosSeleccionados(_items.length > 1 ? _items.filter((_, j) => j !== i) : _items);
  const updItem = (i, k, v) => setProductosSeleccionados(_items.map((it, j) => j === i ? { ...it, [k]: v } : it));

  const handleProductoChange = (idx, val) => {
    if (val === CREAR_NUEVO) { onCrearProducto?.(); return; }
    const prod = _productos.find((p) => p.id === parseInt(val));
    updItem(idx, "productoId", val);
    if (prod) {
      updItem(idx, "precioUnitario", prod.precioUnitario ?? 0);
      updItem(idx, "descripcion",    prod.descripcion    ?? "");
      updItem(idx, "tarifaIVA",      prod.tarifaIva      ?? 19);
    }
  };

  // ── Pagos ────────────────────────────────────────────────────────
  const addPago = () => setFormasPago([..._pagos, { metodo: "", valor: 0 }]);
  const delPago = (i) => setFormasPago(_pagos.length > 1 ? _pagos.filter((_, j) => j !== i) : _pagos);
  const updPago = (i, k, v) => setFormasPago(_pagos.map((fp, j) => j === i ? { ...fp, [k]: v } : fp));

  // ── Cálculos ─────────────────────────────────────────────────────
  const calcLinea = (it) => {
    const base = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
    const desc = base * ((parseFloat(it.porcentajeDescuento) || 0) / 100);
    const neto = base - desc;
    return neto + neto * ((parseFloat(it.tarifaIVA) || 0) / 100)
                + neto * ((parseFloat(it.tarifaINC) || 0) / 100);
  };

  const totalBruto = _items.reduce(
    (s, it) => s + (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0), 0
  );
  const totalDesc = _items.reduce((s, it) => {
    const base = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
    return s + base * ((parseFloat(it.porcentajeDescuento) || 0) / 100);
  }, 0);
  const subtotal     = totalBruto - totalDesc;
  const totalPagos   = _pagos.reduce((s, fp) => s + (parseFloat(fp.valor) || 0), 0);
  const pagosCuadran = Math.abs(totalPagos - subtotal) < 0.01;
  const fmt = (n) => (n || 0).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="doc-container">
      <div className="doc-titulo-row">
        <div>
          <h4 className="doc-titulo">
            {documentoEditando ? "Editar documento soporte" : "Nuevo documento soporte"}
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--doc-gray)", margin: "2px 0 0" }}>
            Información básica
          </p>
        </div>
        <button className="doc-btn-secundario" type="button">Ver tutoriales ▾</button>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="doc-header-grid">
          <div className="doc-col">

            {/* Tipo */}
            <div className="doc-field">
              <label className="doc-label doc-label-req">Tipo de documento</label>
              <select
                className="form-select form-select-sm"
                value={_doc.tipo || ""}
                onChange={(e) => setDocumento((p) => ({ ...(p ?? {}), tipo: e.target.value }))}>
                {TIPOS_DOC.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            <div className="doc-field">
              <label className="doc-label doc-label-req">Proveedor</label>
              <SearchDrop
                value={proveedorBusqueda}
                onChange={setProveedorBusqueda}
                onSelect={(p) => {
                  setProveedorBusqueda(p.nombre);
                  setDocumento((d) => ({ ...(d ?? {}), proveedorId: p.id, proveedorNombre: p.nombre }));
                }}
                onClear={() => {
                  setProveedorBusqueda("");
                  setDocumento((d) => ({ ...(d ?? {}), proveedorId: "", proveedorNombre: "" }));
                }}
                placeholder="Buscar proveedor..."
                items={proveedoresFiltrados}
                keyExtractor={(p) => p.id}
                renderItem={(p) => (
                  <>
                    <span className="fw-semibold">{p.nombre}</span>
                    <span className="text-muted ms-2 small">{p.numeroIdentificacion}</span>
                  </>
                )}
                emptyLabel="No se encontraron proveedores"
                onCrear={onCrearProveedor}
                crearLabel={proveedorBusqueda ? `Crear proveedor "${proveedorBusqueda}"` : "Crear nuevo proveedor"}
              />
            </div>

            {/* Contacto */}
            <div className="doc-field">
              <label className="doc-label">Contacto</label>
              <select
                className="form-select form-select-sm"
                value={_doc.contactoId || ""}
                onChange={(e) => {
                  if (e.target.value === CREAR_NUEVO) { onCrearContacto?.(); return; }
                  setDocumento((p) => ({ ...(p ?? {}), contactoId: e.target.value }));
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
                  value={_doc.fechaElaboracion || ""}
                  onChange={(e) => setDocumento((p) => ({ ...(p ?? {}), fechaElaboracion: e.target.value }))}
                />
                <button
                  type="button" className="doc-icon-btn"
                  onClick={() => setDocumento((p) => ({ ...(p ?? {}), fechaElaboracion: "" }))}>
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
            <div className="doc-field">
              <label className="doc-label">Número</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={documentoEditando?.numeroDocumento || ""}
                placeholder="Se asigna automáticamente"
                readOnly
              />
            </div>
            <div className="doc-field">
              <label className="doc-label">Motivo DIAN</label>
              <select
                className="form-select form-select-sm"
                value={_doc.motivoDIAN || "DS-1"}
                onChange={(e) => setDocumento((p) => ({ ...(p ?? {}), motivoDIAN: e.target.value }))}>
                {MOTIVOS_DS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ══ TABLA ══ */}
        <div style={{ marginBottom: 28 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="doc-section-title mb-0">Detalle de productos / servicios</h6>
            <button type="button" className="btn btn-primary btn-sm px-3" onClick={addItem}>
              + Agregar fila
            </button>
          </div>
          <div className="doc-table-scroll">
            <table className="doc-tabla">
              <thead>
                <tr>
                  <th className="doc-th-num">#</th>
                  <th style={{ minWidth: 180 }}>Producto / Servicio</th>
                  <th style={{ minWidth: 140 }}>Descripción</th>
                  <th className="text-end" style={{ width: 76  }}>Cant</th>
                  <th className="text-end" style={{ width: 114 }}>Precio Unit.</th>
                  <th className="text-end" style={{ width: 80  }}>% Desc.</th>
                  <th style={{ width: 110 }}>Imp. Cargo</th>
                  <th style={{ width: 120 }}>Retención</th>
                  <th className="text-end" style={{ width: 114 }}>Total</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {_items.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="doc-tabla-empty">
                      No hay ítems. Haz clic en "+ Agregar fila" para empezar.
                    </td>
                  </tr>
                ) : (
                  _items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="doc-td-num">{idx + 1}</td>
                      <td>
                        <select
                          className="form-select form-select-sm doc-select-item"
                          value={it.productoId}
                          onChange={(e) => handleProductoChange(idx, e.target.value)}>
                          <option value="">
                            {_productos.length === 0 ? "Cargando..." : "— Seleccionar —"}
                          </option>
                          {_productos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                          <option disabled>──────────────</option>
                          <option value={CREAR_NUEVO} style={{ color: "#27ae60", fontWeight: 600 }}>
                            ➕ Crear nuevo producto
                          </option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text" className="form-control form-control-sm"
                          value={it.descripcion} placeholder="Descripción..."
                          onChange={(e) => updItem(idx, "descripcion", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number" min="0"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.cantidad}
                          onChange={(e) => updItem(idx, "cantidad", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number" min="0" step="0.01"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.precioUnitario}
                          onChange={(e) => updItem(idx, "precioUnitario", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number" min="0" max="100" step="0.01"
                          className="form-control form-control-sm text-end doc-num-input"
                          value={it.porcentajeDescuento}
                          onChange={(e) => updItem(idx, "porcentajeDescuento", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm doc-select-item"
                          value={it.impuestoCargo}
                          onChange={(e) => updItem(idx, "impuestoCargo", e.target.value)}>
                          {IMPUESTOS_C.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm doc-select-item"
                          value={it.impuestoRetencion}
                          onChange={(e) => updItem(idx, "impuestoRetencion", e.target.value)}>
                          {IMPUESTOS_R.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end fw-semibold">{fmt(calcLinea(it))}</td>
                      <td>
                        <button
                          type="button" className="doc-btn-trash"
                          onClick={() => delItem(idx)}
                          disabled={_items.length === 1}>
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

        {/* ══ FORMAS DE PAGO + TOTALES ══ */}
        <div className="doc-pago-totales">
          <div>
            <h6 className="doc-section-title">Formas de pago</h6>
            <div className="doc-hr" />
            {_pagos.map((fp, idx) => (
              <div key={idx} className="doc-pago-fila">
                <select
                  className="form-select form-select-sm doc-pago-select"
                  value={fp.metodo}
                  onChange={(e) => updPago(idx, "metodo", e.target.value)}>
                  {FORMAS_PAGO.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <input
                  type="number" min="0" step="0.01"
                  className="form-control form-control-sm text-end doc-pago-valor"
                  value={fp.valor}
                  onChange={(e) => updPago(idx, "valor", e.target.value)}
                />
                <button
                  type="button" className="doc-btn-trash"
                  onClick={() => delPago(idx)}
                  disabled={_pagos.length === 1}>
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
                  ? <CheckCircle size={18} className="doc-check-ok ms-1"  />
                  : <XCircleFill size={18} className="doc-check-err ms-1" />}
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
              <span style={{ color: "var(--doc-red)" }}>-$ {fmt(totalDesc)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Subtotal</span><span>$ {fmt(subtotal)}</span>
            </div>
            <div className="doc-totales-fila doc-totales-neto">
              <span>Total Neto</span><strong>$ {fmt(subtotal)}</strong>
            </div>
          </div>
        </div>

        {/* ══ OBSERVACIONES ══ */}
        <div className="doc-observaciones">
          <h6 className="doc-section-title">Observaciones</h6>
          <textarea
            className="form-control doc-textarea" rows={3}
            placeholder="Notas adicionales sobre este documento..."
            value={_doc.observaciones || ""}
            onChange={(e) => setDocumento((p) => ({ ...(p ?? {}), observaciones: e.target.value }))}
          />
          <label className="doc-adjuntar mt-2">
            <input type="file" className="d-none" onChange={(e) => setArchivo(e.target.files[0])} />
            <Paperclip size={14} />
            {archivo
              ? <span className="doc-archivo-nombre ms-1">{archivo.name}</span>
              : " Adjuntar soporte"}
          </label>
        </div>

        {/* ✅ FOOTER sticky — mismo ancho que el contenido, sin tocar sidebar */}
        <div className="doc-footer">
          <button
            type="button" className="doc-btn-cancelar"
            onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="doc-btn-guardar" disabled={saving}>
            {saving
              ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
              : "Guardar"}
          </button>
          <button
            type="submit" className="doc-btn-guardar-enviar"
            disabled={saving}
            onClick={() => setDocumento((p) => ({ ...(p ?? {}), enviar: true }))}>
            {saving
              ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
              : "Guardar y enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
