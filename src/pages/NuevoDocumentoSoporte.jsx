import React, { useState } from "react";
import Select from "react-select";
import {
  Trash,
  Paperclip,
  PlusCircle,
  CheckCircleFill,
  XCircleFill,
  FileEarmarkText,
} from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";
import { useId } from "react";
import { useDocumentoSoporte } from "../hooks/useDocumentoSoporte";
import ModalCrearProducto from "../components/modals/ModalCrearProducto";
import ModalCrearContacto from "../components/modals/ModalCrearContacto";
import "../styles/pages/DocBase.css";
import ModalCrearCliente from "../components/modals/ModalCrearCliente";

/* ── Tooltip reutilizable ─────────────────────────────────────── */
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

/* ── NoOptions personalizados ─────────────────────────────────── */
const NoOptionsProveedor = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && <div className="doc-select-empty">No se encontró "{inputValue}"</div>}
    <div
      className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => { e.preventDefault(); onCrear(inputValue); }}
    >
      <PlusCircle size={13} /> Crear proveedor "{inputValue || "nuevo"}"
    </div>
  </div>
);

const NoOptionsProducto = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && <div className="doc-select-empty">No se encontró "{inputValue}"</div>}
    <div
      className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => { e.preventDefault(); onCrear(inputValue); }}
    >
      <PlusCircle size={13} /> Crear producto "{inputValue || "nuevo"}"
    </div>
  </div>
);

const NoOptionsContacto = ({ onAbrirModal }) => (
  <div
    className="doc-dropdown-item doc-dropdown-crear"
    onMouseDown={(e) => { e.preventDefault(); onAbrirModal(); }}
  >
    <PlusCircle size={13} /> Crear nuevo contacto
  </div>
);

/* ── Constantes ───────────────────────────────────────────────── */
const TIPOS_DOCUMENTO = [
  { value: "DS-1", label: "DS-1 — Documento Soporte de Compra" },
  { value: "DS-2", label: "DS-2 — Nota de Ajuste Documento Soporte" },
];

const MOTIVOS_DIAN = [
  { value: "DS-1", label: "DS-1 — Adquisición de bienes y servicios" },
  { value: "DS-2", label: "DS-2 — Nota de ajuste" },
];

const OPCIONES_FORMA_PAGO = [
  { value: "10",  label: "Efectivo" },
  { value: "42",  label: "Transferencia bancaria" },
  { value: "48",  label: "Tarjeta de crédito" },
  { value: "49",  label: "Tarjeta débito" },
  { value: "20",  label: "Crédito" },
  { value: "ZZZ", label: "Otro" },
];

/* ── Valores vacíos ───────────────────────────────────────────── */
const DOC_VACIO = {
  tipo:             "",
  proveedorId:      "",
  contactoId:       "",
  fechaElaboracion: new Date().toISOString().split("T")[0],
  motivoDIAN:       "DS-1",
  observaciones:    "",
  archivo:          null,
};

const ITEM_VACIO = {
  productoId:          "",
  descripcion:         "",
  cantidad:            1,
  precioUnitario:      0,
  porcentajeDescuento: 0,
  tarifaIVA:           19,
  tarifaINC:           0,
  unidadMedida:        "Unidad",
};

/* ── Estilos react-select ─────────────────────────────────────── */
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
  input:          (b) => ({ ...b, margin: 0, padding: 0 }),
  dropdownIndicator: (b) => ({ ...b, padding: "0 6px" }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (b) => ({ ...b, zIndex: 9999, fontSize: "0.875rem" }),
});

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════ */
export default function NuevoDocumentoSoporte() {
  const navigate = useNavigate();

  const {
    proveedores      = [],
    contactos        = [],
    productos        = [],
    saving,
    errorCrud,
    limpiarErrorCrud,
    crearDocumento,
    agregarProveedorLocal,
    agregarProductoLocal,
    agregarContactoLocal,
  } = useDocumentoSoporte();

  /* ── Estado local ─────────────────────────────────────────────── */
  const [documento,              setDocumento]              = useState({ ...DOC_VACIO });
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ ...ITEM_VACIO }]);
  const [formasPago,             setFormasPago]             = useState([{ metodo: "", valor: "" }]);
  const [mensajeExito,           setMensajeExito]           = useState("");
  const [touched,                setTouched]                = useState({});
  const [submitIntentado,        setSubmitIntentado]        = useState(false);

  /* ── Modales ─────────────────────────────────────────────────── */
  const [mostrarModalContacto,   setMostrarModalContacto]  = useState(false);
  const [mostrarModalProveedor,  setMostrarModalProveedor] = useState(false);
  const [mostrarModalProducto,   setMostrarModalProducto]  = useState(false);
  const [nombreSugeridoProv,     setNombreSugeridoProv]    = useState("");
  const [nombreSugeridoProd,     setNombreSugeridoProd]    = useState("");

  /* ── Helpers validación ──────────────────────────────────────── */
  const marcar       = (campo) => setTouched((p) => ({ ...p, [campo]: true }));
  const mostrarError = (campo) => submitIntentado || !!touched[campo];

  const handleCrearProv = (n) => { setNombreSugeridoProv(n || ""); setMostrarModalProveedor(true); };
  const handleCrearProd = (n) => { setNombreSugeridoProd(n || ""); setMostrarModalProducto(true); };

  /* ── Formato moneda ──────────────────────────────────────────── */
  const fmt = (n) => (Number(n) || 0).toLocaleString("es-CO", { minimumFractionDigits: 2 });

  /* ── Opciones Select ─────────────────────────────────────────── */
  const opcionesProveedores = (proveedores || []).map((p) => ({
    value: p.id,
    label: `${p.nombre}${p.apellido ? " " + p.apellido : ""} — ${p.nit || p.numeroIdentificacion || ""}`,
  }));

  const opcionesContactos = (contactos || []).map((c) => ({
    value: c.id,
    label: `${c.nombre}${c.cargo ? " — " + c.cargo : ""}`,
  }));

  const opcionesProductos = () =>
    (productos || []).map((p) => ({
      value: p.id,
      label: `${p.nombre} — $${(p.precioUnitario || 0).toLocaleString("es-CO")}`,
    }));

  /* ── Formas de pago ──────────────────────────────────────────── */
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
    (acc, fp) => acc + (parseFloat(fp.valor) || 0), 0
  );

  /* ── Productos ───────────────────────────────────────────────── */
  const agregarItemManual = () =>
    setProductosSeleccionados((prev) => [...prev, { ...ITEM_VACIO }]);

  const actualizarItem = (index, campo, valor) => {
    const nuevos = [...productosSeleccionados];
    nuevos[index][campo] = valor;
    if (campo === "productoId") {
      const prod = (productos || []).find((p) => p.id === parseInt(valor));
      if (prod) {
        nuevos[index].precioUnitario = prod.precioUnitario;
        nuevos[index].descripcion    = prod.nombre;
        nuevos[index].unidadMedida   = prod.unidadMedida || "Unidad";
        nuevos[index].tarifaIVA      = prod.tarifaIVA    ?? 19;
        nuevos[index].tarifaINC      = prod.tarifaINC    ?? 0;
      }
    }
    setProductosSeleccionados(nuevos);
  };

  const eliminarItem = (index) =>
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));

  /* ── Cálculos ────────────────────────────────────────────────── */
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
    let subtotal = 0, totalDescuentos = 0, totalIVA = 0, totalINC = 0;
    productosSeleccionados.forEach((item) => {
      const l = calcularLinea(item);
      subtotal        += l.subtotalLinea;
      totalDescuentos += l.valorDescuento;
      totalIVA        += l.valorIVA;
      totalINC        += l.valorINC;
    });
    return {
      subtotal,
      totalDescuentos,
      totalIVA,
      totalINC,
      totalFactura: subtotal - totalDescuentos + totalIVA + totalINC,
    };
  };

  const totales      = calcularTotales();
  const pagoCoincide = Math.abs(totalFormasPago - totales.totalFactura) <= 0.01;

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitIntentado(true);

    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!user?.id)               { alert("Usuario no autenticado.");                  return; }
    if (!documento.tipo)         { alert("Selecciona el tipo de documento.");          return; }
    if (!documento.proveedorId)  { alert("Selecciona un proveedor.");                  return; }
    if (productosSeleccionados.length === 0) { alert("Agrega al menos un ítem.");      return; }
    if (Math.abs(totalFormasPago - totales.totalFactura) > 0.01) {
      alert("El total de formas de pago no coincide con el total neto."); return;
    }

    const payload = {
      usuarioId:        user.id,
      proveedorId:      parseInt(documento.proveedorId),
      contactoId:       documento.contactoId || null,
      numeroDocumento:  `DS-${Date.now()}`,
      tipo:             documento.tipo,
      motivoDIAN:       documento.motivoDIAN,
      fechaElaboracion: documento.fechaElaboracion,
      observaciones:    documento.observaciones || "",
      estado:           "Pendiente",
      ...totales,
      detalleDocumentoSoporte: productosSeleccionados.map((item) => {
        const l = calcularLinea(item);
        return {
          productoId:          parseInt(item.productoId) || 0,
          descripcion:         item.descripcion          || "",
          cantidad:            parseFloat(item.cantidad),
          unidadMedida:        item.unidadMedida         || "Unidad",
          precioUnitario:      parseFloat(item.precioUnitario),
          porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
          ...l,
        };
      }),
      formasPago: formasPago
        .filter((fp) => fp.metodo)
        .map((fp) => ({ metodoPagoCodigo: fp.metodo, valor: parseFloat(fp.valor) || 0 })),
    };

    try {
      await crearDocumento(payload);
      setMensajeExito("Documento soporte creado exitosamente");
      setTimeout(() => navigate("/compras/documentos-soporte"), 1800);
    } catch {
      // errorCrud se maneja en el hook
    }
  };

  return (
    <div className="page-crear">
      <div className="page-crear-header">
        {/* Botón volver */}
        <button
          className="btn btn-volver btn-sm mb-3"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {/* Banner */}
        <div className="page-crear-banner">
          <div className="page-crear-banner-content">
            <div className="page-crear-banner-text">
              <h2 className="page-crear-banner-title">
                Nuevo documento soporte
              </h2>
              <p className="page-crear-banner-subtitle">
                Completa el formulario para registrar un documento soporte de compra
              </p>
            </div>
            <div className="page-crear-banner-icon">
              <FileEarmarkText size={70} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-crear-wrapper">
        <div className="page-crear-body">

          {/* Alerta error CRUD */}
          {errorCrud && (
            <div className="alert alert-danger alert-dismissible fade show mb-3">
              {errorCrud}
              <button className="btn-close" onClick={limpiarErrorCrud} />
            </div>
          )}

          {/* Alerta éxito */}
          {mensajeExito && (
            <div className="alert alert-success alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
              <CheckCircleFill size={18} />
              {mensajeExito}
              <button className="btn-close ms-auto" onClick={() => setMensajeExito("")} />
            </div>
          )}

          <form onSubmit={(e) => { setSubmitIntentado(true); handleSubmit(e); }}>

            {/* ══ Información básica ══ */}
            <h6 className="section-title-primary">Información básica</h6>
            <div className="doc-header-grid" style={{ marginTop: 12 }}>

              {/* Columna izquierda */}
              <div className="doc-col">

                {/* Tipo de documento */}
                <div className="doc-field">
                  <label className="doc-label">
                    Tipo de documento *
                    <TooltipInfo texto="DS-1 para documentos soporte de compra. DS-2 para notas de ajuste." />
                  </label>
                  <select
                    className={`form-select form-select-sm ${mostrarError("tipo") && !documento.tipo ? "is-invalid" : ""}`}
                    value={documento.tipo}
                    onChange={(e) => setDocumento({ ...documento, tipo: e.target.value })}
                    onBlur={() => marcar("tipo")}
                  >
                    <option value="" disabled>Seleccionar tipo...</option>
                    {TIPOS_DOCUMENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {mostrarError("tipo") && !documento.tipo && (
                    <div className="invalid-feedback d-block">
                      El tipo de documento es obligatorio
                    </div>
                  )}
                </div>

                {/* Proveedor */}
                <div className="doc-field">
                  <label className="doc-label">
                    Proveedor *
                    <TooltipInfo texto="Selecciona el proveedor del cual recibes los bienes o servicios." />
                  </label>
                  <Select
                    styles={mkSelectStyles(mostrarError("proveedorId") && !documento.proveedorId)}
                    menuPortalTarget={document.body}
                    options={opcionesProveedores}
                    value={opcionesProveedores.find((o) => o.value === documento.proveedorId) ?? null}
                    onChange={(opt) =>
                      setDocumento((p) => ({ ...p, proveedorId: opt?.value ?? "", contactoId: "" }))
                    }
                    onBlur={() => marcar("proveedorId")}
                    noOptionsMessage={({ inputValue }) => (
                      <NoOptionsProveedor inputValue={inputValue} onCrear={handleCrearProv} />
                    )}
                    isClearable
                    placeholder="Buscar proveedor..."
                  />
                  {mostrarError("proveedorId") && !documento.proveedorId && (
                    <small style={{ color: "var(--danger)", fontSize: "0.78rem" }}>
                      El proveedor es obligatorio
                    </small>
                  )}
                </div>

                {/* Contacto */}
                <div className="doc-field">
                  <label className="doc-label">
                    Contacto
                    <TooltipInfo texto="Persona de contacto del proveedor (opcional)." />
                  </label>
                  <Select
                    styles={mkSelectStyles()}
                    menuPortalTarget={document.body}
                    options={opcionesContactos}
                    value={opcionesContactos.find((o) => o.value === documento.contactoId) ?? null}
                    onChange={(opt) =>
                      setDocumento((p) => ({ ...p, contactoId: opt?.value ?? "" }))
                    }
                    noOptionsMessage={() => (
                      <NoOptionsContacto onAbrirModal={() => setMostrarModalContacto(true)} />
                    )}
                    isDisabled={!documento.proveedorId}
                    isClearable
                    placeholder={
                      documento.proveedorId
                        ? "Seleccionar contacto..."
                        : "Selecciona un proveedor primero"
                    }
                  />
                </div>

                {/* Fecha */}
                <div className="doc-field">
                  <label className="doc-label">Fecha de elaboración</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    style={{ borderLeft: "3px solid #1a73e8" }}
                    value={documento.fechaElaboracion}
                    onChange={(e) =>
                      setDocumento({ ...documento, fechaElaboracion: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="doc-col">

                {/* Número (auto) */}
                <div className="doc-field">
                  <label className="doc-label">
                    Número
                    <TooltipInfo texto="Generado automáticamente al guardar el documento." />
                  </label>
                  <div className="doc-comprobante-inputs">
                    <input
                      type="text"
                      className="form-control form-control-sm doc-prefijo text-center fw-bold"
                      value="DS"
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

                {/* Motivo DIAN */}
                <div className="doc-field">
                  <label className="doc-label">
                    Motivo DIAN
                    <TooltipInfo texto="Código de motivo requerido por la DIAN para el documento soporte." />
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={documento.motivoDIAN}
                    onChange={(e) => setDocumento({ ...documento, motivoDIAN: e.target.value })}
                  >
                    {MOTIVOS_DIAN.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ══ Tabla de ítems ══ */}
            <div style={{ marginBottom: 28 }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="section-title-primary">Detalle de productos / servicios</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={agregarItemManual}
                >
                  + Agregar fila
                </button>
              </div>

              <div className="doc-table-scroll">
                <table className="doc-tabla">
                  <thead>
                    <tr>
                      <th className="doc-th-num">#</th>
                      <th>Producto / Servicio</th>
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
                          No hay ítems. Agrega una fila para comenzar.
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
                                onChange={(opt) =>
                                  actualizarItem(idx, "productoId", opt?.value ?? "")
                                }
                                noOptionsMessage={({ inputValue }) => (
                                  <NoOptionsProducto
                                    inputValue={inputValue}
                                    onCrear={handleCrearProd}
                                  />
                                )}
                                isClearable
                                placeholder="Buscar producto..."
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.cantidad}
                                min="1"
                                onChange={(e) => actualizarItem(idx, "cantidad", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.precioUnitario}
                                step="0.01"
                                min="0"
                                onChange={(e) => actualizarItem(idx, "precioUnitario", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.porcentajeDescuento}
                                min="0"
                                max="100"
                                step="0.01"
                                onChange={(e) => actualizarItem(idx, "porcentajeDescuento", e.target.value)}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm doc-select-item"
                                value={item.tarifaIVA}
                                onChange={(e) => actualizarItem(idx, "tarifaIVA", e.target.value)}
                              >
                                <option value="0">0%</option>
                                <option value="5">5%</option>
                                <option value="19">19%</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm doc-select-item"
                                value={item.tarifaINC}
                                onChange={(e) => actualizarItem(idx, "tarifaINC", e.target.value)}
                              >
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
                              <button
                                type="button"
                                className="doc-btn-trash"
                                onClick={() => eliminarItem(idx)}
                              >
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
                <h6 className="section-title-primary">Formas de pago</h6>
                <div className="doc-hr" />

                {formasPago.map((fp, idx) => (
                  <div key={idx} className="doc-pago-fila">
                    <select
                      className="form-select form-select-sm doc-pago-select"
                      value={fp.metodo}
                      onChange={(e) => actualizarFormaPago(idx, "metodo", e.target.value)}
                    >
                      <option value="">Selecciona forma de pago</option>
                      {OPCIONES_FORMA_PAGO.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm text-end doc-pago-valor"
                      value={fp.valor}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={(e) => actualizarFormaPago(idx, "valor", e.target.value)}
                    />
                    <button
                      type="button"
                      className="doc-btn-trash"
                      onClick={() => eliminarFormaPago(idx)}
                    >
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
                  <span className="doc-total-pagos-label">Total formas de pago:</span>
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
                    El total debe coincidir con el total neto ({fmt(totales.totalFactura)})
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
                  <span className="text-danger">-{fmt(totales.totalDescuentos)}</span>
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
                <div className="doc-totales-fila doc-totales-neto">
                  <span>Total Neto:</span>
                  <strong>{fmt(totales.totalFactura)}</strong>
                </div>
              </div>
            </div>

            {/* ══ Observaciones ══ */}
            <div className="doc-observaciones">
              <h6 className="section-title-primary">Observaciones</h6>
              <textarea
                className="form-control doc-textarea"
                rows={4}
                placeholder="Aquí puedes ingresar comentarios adicionales o información sobre la compra..."
                value={documento.observaciones}
                onChange={(e) =>
                  setDocumento({ ...documento, observaciones: e.target.value })
                }
              />
              <label className="doc-adjuntar">
                <input
                  type="file"
                  className="d-none"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setDocumento((p) => ({ ...p, archivo: f }));
                  }}
                />
                <Paperclip size={14} /> Adjuntar archivo
                {documento.archivo && (
                  <span className="doc-archivo-nombre">{documento.archivo.name}</span>
                )}
              </label>
            </div>

            {/* ══ Footer sticky ══ */}
            <div className="page-crear-footer">
              <div className="footer-acciones">
                <button
                  type="button"
                  className="doc-btn-cancelar"
                  onClick={() => navigate("/compras/documentos-soporte")}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="doc-btn-guardar-enviar"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar documento soporte"}
                </button>
              </div>
            </div>
          </form>

          {/* ══ Modales ══ */}
          {mostrarModalContacto && (
            <ModalCrearContacto
              clienteId={documento.proveedorId}
              onClose={() => setMostrarModalContacto(false)}
              onSuccess={(c) => {
                agregarContactoLocal?.(c);
                setMostrarModalContacto(false);
              }}
            />
          )}
          {mostrarModalProveedor && (
            <ModalCrearCliente
              open
              nombreSugerido={nombreSugeridoProv}
              onClose={() => setMostrarModalProveedor(false)}
              onSuccess={(p) => {
                agregarProveedorLocal?.(p);
                setMostrarModalProveedor(false);
              }}
            />
          )}
          {mostrarModalProducto && (
            <ModalCrearProducto
              open
              nombreSugerido={nombreSugeridoProd}
              onClose={() => setMostrarModalProducto(false)}
              onSuccess={(p) => {
                agregarProductoLocal?.(p);
                setMostrarModalProducto(false);
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
}