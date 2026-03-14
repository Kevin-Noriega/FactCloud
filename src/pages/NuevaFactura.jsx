import React, { useState } from "react";
import Select from "react-select";
import {
  Trash,
  Paperclip,
  PlusCircle,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useFactura } from "../hooks/useFactura";
import ModalCrearContacto from "../components/modals/ModalCrearContacto";
import ModalCrearCliente from "../components/modals/ModalCrearCliente";
import ModalCrearProducto from "../components/modals/ModalCrearProducto";
import "../styles/pages/DocBase.css";
import { useId } from "react"; // ✅ built-in, siempre único

function TooltipInfo({ texto }) {
  const id = useId(); 

  return (
    <>
      <i
        className="doc-info-icon"
        data-tooltip-id={id}
        data-tooltip-place="top"
        aria-label="Más información"
      >
        i
      </i>
      <Tooltip
        id={id}
        opacity={1}
        style={{ maxWidth: 260, fontSize: "0.8rem", zIndex: 9999 }}
      >
        {texto}
      </Tooltip>
    </>
  );
}

/* ── NoOptions ────────────────────────────────────── */
const NoOptionsCliente = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && <div className="doc-select-empty">No se encontró "{inputValue}"</div>}
    <div className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => { e.preventDefault(); onCrear(inputValue); }}>
      <PlusCircle size={13} /> Crear cliente "{inputValue || "nuevo"}"
    </div>
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

const NoOptionsContacto = ({ onAbrirModal }) => (
  <div className="doc-dropdown-item doc-dropdown-crear"
    onMouseDown={(e) => { e.preventDefault(); onAbrirModal(); }}>
    <PlusCircle size={13} /> Crear nuevo contacto
  </div>
);

/* ── Constantes ───────────────────────────────────── */
const TIPOS_FACTURA = [
  { value: "FV-1", label: "FV-1 — Factura de Venta (No Electrónica)" },
  { value: "FV-2", label: "FV-2 — Factura Electrónica DIAN" },
];

const OPCIONES_FORMA_PAGO = [
  { value: "10", label: "Efectivo" },
  { value: "42", label: "Transferencia bancaria" },
  { value: "48", label: "Tarjeta de crédito" },
  { value: "49", label: "Tarjeta débito" },
  { value: "20", label: "Crédito" },
  { value: "ZZZ", label: "Otro" },
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
      : state.isFocused
        ? "0 0 0 0.2rem rgba(26,115,232,0.15)"
        : "none",
    fontSize: "0.875rem",
  }),
  valueContainer: (b) => ({ ...b, padding: "0 10px" }),
  input: (b) => ({ ...b, margin: 0, padding: 0 }),
  dropdownIndicator: (b) => ({ ...b, padding: "0 6px" }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (b) => ({ ...b, zIndex: 9999, fontSize: "0.875rem" }),
});

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════ */
export default function NuevaFactura() {
  const {
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
    agregarFormaPago,
    actualizarFormaPago,
    eliminarFormaPago,
    retelCA,
    setRetelCA,
    agregarContactoLocal,
    agregarClienteLocal,
    agregarProductoLocal,
    agregarPorCodigoBarras,
    handleBarcodeInput,
    agregarProductoManual,
    actualizarProducto,
    eliminarProducto,
    calcularLinea,
    totales,
    handleSubmit,
    navigate,
  } = useFactura();

  const [mostrarModalContacto, setMostrarModalContacto] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [nombreSugeridoCliente, setNombreSugeridoCliente] = useState("");
  const [nombreSugeridoProducto, setNombreSugeridoProducto] = useState("");
  const [touched, setTouched] = useState({});
  const [submitIntentado, setSubmitIntentado] = useState(false);

  const marcar       = (campo) => setTouched((p) => ({ ...p, [campo]: true }));
  const mostrarError = (campo) => submitIntentado || !!touched[campo];

  const handleCrearCli = (n) => { setNombreSugeridoCliente(n  || ""); setMostrarModalCliente(true);  };
  const handleCrearPro = (n) => { setNombreSugeridoProducto(n || ""); setMostrarModalProducto(true); };

  const pagoCoincide = Math.abs(totalFormasPago - totales.totalFactura) <= 0.01;
  const fmt = (n) => (Number(n) || 0).toLocaleString("es-CO", { minimumFractionDigits: 2 });
// En consola del navegador — solo para testing
const u = JSON.parse(localStorage.getItem("usuario"));
u.prefijoAutorizadoDIAN = "FACT";
localStorage.setItem("usuario", JSON.stringify(u));

  /* ── Opciones ────────────────────────────────── */
  const opcionesClientes = clientes.map((c) => ({
    value: c.id,
    label: `${c.nombre}${c.apellido ? " " + c.apellido : ""} — ${c.numeroIdentificacion}`,
  }));

  const opcionesContactos = contactos.map((c) => ({
    value: c.id,
    label: `${c.nombre}${c.cargo ? " — " + c.cargo : ""}`,
  }));

  const opcionesProductos = () =>
    productos.map((p) => ({
      value: p.id,
      label: `${p.nombre} — $${(p.precioUnitario || 0).toLocaleString("es-CO")}`,
    }));

  return (
    <div className="doc-container">
      {/* ── Título ── */}
      <div className="doc-titulo-row">
        <h4 className="doc-titulo">Nueva factura de venta</h4>
      </div>

      {/* ── Banner uso ── */}
      {facturasUsadas.limite > 0 && (() => {
        const pct       = Math.round((facturasUsadas.usadas / facturasUsadas.limite) * 100);
        const enPeligro = pct >= 80;
        const agotado   = facturasUsadas.usadas >= facturasUsadas.limite;
        return (
          <div className={`doc-uso-banner ${agotado ? "agotado" : enPeligro ? "peligro" : ""}`}>
            <div className="doc-uso-texto">
              <span className="doc-uso-label">Tus facturas usadas</span>
              <span className="doc-uso-nums">
                <strong>{facturasUsadas.usadas}</strong>
                <span className="doc-uso-sep">/</span>
                {facturasUsadas.limite}
              </span>
            </div>
          </div>
        );
      })()}

      <form onSubmit={(e) => { setSubmitIntentado(true); handleSubmit(e); }}>

        {/* ══ Información básica ══ */}
        <h6 className="doc-section-title">Información básica</h6>
        <div className="doc-header-grid" style={{ marginTop: 12 }}>
          {/* Columna izquierda */}
          <div className="doc-col">
            {/* Tipo de factura */}
            <div className="doc-field">
              <label className="doc-label">
                Tipo de factura *
                <TooltipInfo texto="FV-1 para facturas físicas. FV-2 para facturas electrónicas enviadas a la DIAN." />
              </label>
              <select
                className={`form-select form-select-sm ${mostrarError("tipoFactura") && !factura.tipoFactura ? "is-invalid" : ""}`}
                value={factura.tipoFactura}
                onChange={(e) => setFactura({ ...factura, tipoFactura: e.target.value })}
                onBlur={() => marcar("tipoFactura")}
              >
                <option value="" disabled>Seleccionar tipo...</option>
                {TIPOS_FACTURA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {mostrarError("tipoFactura") && !factura.tipoFactura && (
                <div className="invalid-feedback d-block">
                  El tipo de factura es obligatorio
                </div>
              )}
            </div>

            {/* Cliente */}
            <div className="doc-field">
              <label className="doc-label">
                Cliente *
                <TooltipInfo texto="Selecciona el cliente al que emitirás la factura." />
              </label>
              <Select
                styles={mkSelectStyles(
                  mostrarError("clienteId") && !factura.clienteId,
                )}
                menuPortalTarget={document.body}
                options={opcionesClientes}
                value={opcionesClientes.find((o) => o.value === factura.clienteId) ?? null}
                onChange={(opt) => setFactura((p) => ({ ...p, clienteId: opt?.value ?? "", contactoId: "" }))}
                onBlur={() => marcar("clienteId")}
                noOptionsMessage={({ inputValue }) => (
                  <NoOptionsCliente
                    inputValue={inputValue}
                    onCrear={handleCrearCli}
                  />
                )}
                isClearable
                placeholder="Buscar cliente..."
              />
              {mostrarError("clienteId") && !factura.clienteId && (
                <small style={{ color: "var(--danger)", fontSize: "0.78rem" }}>
                  El cliente es obligatorio
                </small>
              )}
            </div>

            {/* Contacto */}
            <div className="doc-field">
              <label className="doc-label">
                Contacto
                <TooltipInfo texto="Persona de contacto del cliente (opcional)." />
              </label>
              <Select
                styles={mkSelectStyles()}
                menuPortalTarget={document.body}
                options={opcionesContactos}
                value={opcionesContactos.find((o) => o.value === factura.contactoId) ?? null}
                onChange={(opt) => setFactura((p) => ({ ...p, contactoId: opt?.value ?? "" }))}
                noOptionsMessage={() => (
                  <NoOptionsContacto onAbrirModal={() => setMostrarModalContacto(true)} />
                )}
                isDisabled={!factura.clienteId}
                isClearable
                placeholder={
                  factura.clienteId
                    ? "Seleccionar contacto..."
                    : "Selecciona un cliente primero"
                }
              />
            </div>

            {/* Fecha elaboración */}
            <div className="doc-field">
              <label className="doc-label">Fecha de elaboración</label>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ borderLeft: "3px solid #1a73e8" }}
                value={factura.fechaElaboracion}
                onChange={(e) => setFactura({ ...factura, fechaElaboracion: e.target.value })}
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="doc-col">

            <div className="doc-field">
              <label className="doc-label">
                Número
                <TooltipInfo texto="Generado automáticamente según el rango autorizado por la DIAN." />
              </label>
              <div className="doc-comprobante-inputs">
                {/* Prefijo */}
                <input
                  type="text"
                  className="form-control form-control-sm doc-prefijo text-center fw-bold"
                  value={factura.prefijo}
                  placeholder="Prefijo"
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

            {/* Código de barras */}
            <div className="doc-field">
              <label className="doc-label">
                Escanear producto
                <TooltipInfo texto="Escanea el código de barras y presiona Enter para agregar el producto." />
              </label>
              <div className="input-group input-group-sm">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  className="form-control"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  onKeyDown={handleBarcodeInput}
                  placeholder="Código de barras..."
                  autoComplete="off"
                />
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
        </div>

        {/* ══ Tabla de productos ══ */}
        <div style={{ marginBottom: 28 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="doc-section-title mb-0">Detalle de productos</h6>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={agregarProductoManual}
            >
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
                      No hay productos. Escanea un código o agrega una fila
                      manual.
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
                              control: (b, s) => ({
                                ...mkSelectStyles().control(b, s),
                                minWidth: 200,
                              }),
                            }}
                            options={opts}
                            value={opts.find((o) => o.value === item.productoId) ?? null}
                            onChange={(opt) => actualizarProducto(idx, "productoId", opt?.value ?? "")}
                            noOptionsMessage={({ inputValue }) => (
                              <NoOptionsProducto
                                inputValue={inputValue}
                                onCrear={handleCrearPro}
                              />
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
                          <select
                            className="form-select form-select-sm doc-select-item"
                            value={item.tarifaIVA}
                            onChange={(e) => actualizarProducto(idx, "tarifaIVA", e.target.value)}>
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="19">19%</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm doc-select-item"
                            value={item.tarifaINC}
                            onChange={(e) => actualizarProducto(idx, "tarifaINC", e.target.value)}>
                            <option value="0">0%</option>
                            <option value="2">2%</option>
                            <option value="8">8%</option>
                            <option value="16">16%</option>
                          </select>
                        </td>
                        <td className="text-end fw-semibold">
                          ${fmt(linea.totalLinea)}
                        </td>
                        <td>
                          <button type="button" className="doc-btn-trash" onClick={() => eliminarProducto(idx)}>
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
                <select
                  className="form-select form-select-sm doc-pago-select"
                  value={fp.metodo}
                  onChange={(e) => actualizarFormaPago(idx, "metodo", e.target.value)}>
                  <option value="">Selecciona forma de pago</option>
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
            <button
              type="button"
              className="doc-btn-agregar-pago"
              onClick={agregarFormaPago}
            >
              + Agregar otra forma de pago
            </button>
            <div className="doc-hr" />

            <div className="doc-total-pagos">
              <span className="doc-total-pagos-label">
                Total formas de pago:
              </span>
              <span className="doc-total-pagos-valor">
                {fmt(totalFormasPago)}
                {pagoCoincide ? (
                  <CheckCircleFill size={18} className="doc-check-ok" />
                ) : (
                  <XCircleFill size={18} className="doc-check-err" />
                )}
              </span>
            </div>
            {!pagoCoincide && totalFormasPago > 0 && (
              <p className="doc-pagos-error">
                El total debe coincidir con el total neto (
                {fmt(totales.totalFactura)})
              </p>
            )}
          </div>

          {/* Totales */}
          <div className="doc-totales">
            <div className="doc-totales-fila">
              <span>Total Bruto:</span>
              <span>{fmt(totales.subtotal)}</span>
            </div>
            <div className="doc-totales-fila">
              <span>Descuentos:</span>
              <span className="text-danger">
                -{fmt(totales.totalDescuentos)}
              </span>
            </div>
            <div className="doc-totales-fila">
              <span>Subtotal:</span>
              <span>{fmt(totales.subtotal - totales.totalDescuentos)}</span>
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
              <span>RetelCA:</span>
              <div className="doc-retelca-row">
                <select
                  className="form-select form-select-sm doc-retelca-select"
                  value={retelCA.tipo}
                  onChange={(e) => setRetelCA({ tipo: e.target.value, valor: 0 })}>
                  <option value=""></option>
                  <option value="retefuente">Retefuente</option>
                  <option value="reteiva">ReteIVA</option>
                  <option value="reteica">ReteICA</option>
                </select>
                <span className="doc-retelca-valor">{fmt(retelCA.valor)}</span>
              </div>
            </div>
            <div className="doc-totales-fila doc-totales-neto">
              <span>Total Neto:</span>
              <strong>{fmt(totales.totalFactura)}</strong>
            </div>
          </div>
        </div>

        {/* ══ Observaciones ══ */}
        <div className="doc-observaciones">
          <h6 className="doc-section-title">Observaciones</h6>
          <textarea
            className="form-control doc-textarea"
            rows={4}
            placeholder="Aquí puedes ingresar comentarios adicionales o información para tu cliente..."
            value={factura.observaciones}
            onChange={(e) => setFactura({ ...factura, observaciones: e.target.value })} />
          <label className="doc-adjuntar">
            <input type="file" className="d-none"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setFactura((p) => ({ ...p, archivo: f }));
              }} />
            <Paperclip size={14} /> Adjuntar archivo
            {factura.archivo && (
              <span className="doc-archivo-nombre">{factura.archivo.name}</span>
            )}
          </label>
        </div>

        {/* ══ Footer sticky ══ */}
        <div className="doc-footer">
          <button type="button" className="doc-btn-cancelar" onClick={() => navigate("/ventas")}>
            Cancelar
          </button>
          <button type="submit" className="doc-btn-guardar-enviar">
            Guardar y crear factura
          </button>
        </div>
      </form>

      {/* ══ Modales ══ */}
      {mostrarModalContacto && (
        <ModalCrearContacto
          clienteId={factura.clienteId}
          onClose={() => setMostrarModalContacto(false)}
          onSuccess={(c) => { agregarContactoLocal(c); setMostrarModalContacto(false); }}
        />
      )}
      {mostrarModalCliente && (
        <ModalCrearCliente
          open
          nombreSugerido={nombreSugeridoCliente}
          onClose={() => setMostrarModalCliente(false)}
          onSuccess={(c) => { agregarClienteLocal(c); setMostrarModalCliente(false); }}
        />
      )}
      {mostrarModalProducto && (
        <ModalCrearProducto
          open
          nombreSugerido={nombreSugeridoProducto}
          onClose={() => setMostrarModalProducto(false)}
          onSuccess={(p) => { agregarProductoLocal(p); setMostrarModalProducto(false); }}
        />
      )}
    </div>
  );
}
