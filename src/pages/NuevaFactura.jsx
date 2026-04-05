import React, { useState } from "react";
import Select from "../components/StyledSelect";
import {
  Trash,
  Paperclip,
  PlusCircle,
  CheckCircleFill,
  XCircleFill,
  PlusCircleFill,
  FileEarmarkText,
} from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useFactura } from "../hooks/useFactura";
import ModalCrearContacto from "../components/modals/ModalCrearContacto";
import ModalCrearCliente from "../components/modals/ModalCrearCliente";
import ModalCrearProducto from "../components/modals/ModalCrearProducto";
import "../styles/pages/DocBase.css";
import { useId } from "react";

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

const IMPUESTOS_CARGO = [
  { value: "", label: "Sin impuesto" },
  { value: "IVA_0", label: "IVA 0%", tarifaIVA: 0, tarifaINC: 0 },
  { value: "IVA_5", label: "IVA 5%", tarifaIVA: 5, tarifaINC: 0 },
  { value: "IVA_19", label: "IVA 19%", tarifaIVA: 19, tarifaINC: 0 },
  { value: "INC_8", label: "Impoconsumo 8%", tarifaIVA: 0, tarifaINC: 8 },
  { value: "INC_16", label: "Impoconsumo 16%", tarifaIVA: 0, tarifaINC: 16 },
  { value: "IVA_16", label: "IVA 16%", tarifaIVA: 16, tarifaINC: 0 },
  {
    value: "ULTRA_15",
    label: "Comestibles ultraprocesados 15%",
    tarifaIVA: 0,
    tarifaINC: 15,
  },
  {
    value: "ULTRA_20",
    label: "Comestibles ultraprocesados 20%",
    tarifaIVA: 0,
    tarifaINC: 20,
  },
];

const IMPUESTOS_RETENCION = [
  { value: "", label: "Ninguno", tarifa: 0 },
  { value: "RTE_0_10", label: "Retefuente 0.10%", tarifa: 0.1 },
  { value: "RTE_0_50", label: "Retefuente 0.50%", tarifa: 0.5 },
  { value: "RTE_1", label: "Retefuente 1%", tarifa: 1 },
  { value: "RTE_1_5", label: "Retefuente 1.5%", tarifa: 1.5 },
  { value: "RTE_2", label: "Retefuente 2%", tarifa: 2 },
  { value: "RTE_2_5", label: "Retefuente 2.5%", tarifa: 2.5 },
  { value: "RTE_3_5", label: "Retefuente 3.5%", tarifa: 3.5 },
  { value: "RTE_4", label: "Retefuente 4%", tarifa: 4 },
  { value: "RTE_6", label: "Retefuente 6%", tarifa: 6 },
  { value: "RTE_7", label: "Retefuente 7%", tarifa: 7 },
  { value: "RTE_10", label: "Retefuente 10%", tarifa: 10 },
  { value: "RTE_11", label: "Retefuente 11%", tarifa: 11 },
  { value: "RTE_20", label: "Retefuente 20%", tarifa: 20 },
];

const NoOptionsCliente = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && (
      <div className="doc-select-empty">No se encontró "{inputValue}"</div>
    )}
    <div
      className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => {
        e.preventDefault();
        onCrear(inputValue);
      }}
    >
      <PlusCircle size={13} /> Crear cliente "{inputValue || "nuevo"}"
    </div>
  </div>
);

const NoOptionsProducto = ({ inputValue, onCrear }) => (
  <div>
    {inputValue && (
      <div className="doc-select-empty">No se encontró "{inputValue}"</div>
    )}
    <div
      className="doc-dropdown-item doc-dropdown-crear"
      onMouseDown={(e) => {
        e.preventDefault();
        onCrear(inputValue);
      }}
    >
      <PlusCircle size={13} /> Crear producto "{inputValue || "nuevo"}"
    </div>
  </div>
);

const NoOptionsContacto = ({ onAbrirModal }) => (
  <div
    className="doc-dropdown-item doc-dropdown-crear"
    onMouseDown={(e) => {
      e.preventDefault();
      onAbrirModal();
    }}
  >
    <PlusCircle size={13} /> Crear nuevo contacto
  </div>
);

/* ── Constantes ───────────────────────────────────── */
const TIPOS_FACTURA = [
  { value: "01", label: "Factura Electrónica de Venta (FEV)" },
  { value: "02", label: "Documento de Ingreso" },
  //{ value: "03", label: "Factura en Contingencia" },
];

// ✅ Medio de pago (cbc:PaymentMeansCode) — separado de la condición
const OPCIONES_MEDIO_PAGO = [
  { value: "10", label: "Efectivo" },
  { value: "30", label: "Crédito" },
  { value: "49", label: "Tarjeta Débito" },
  { value: "48", label: "Tarjeta Crédito" },
  { value: "CNA99", label: "Clientes Nacionales" },
  { value: "CEX99", label: "Clientes Extranjero" },
  { value: "20", label: "Cheque" },
  { value: "42", label: "Transferencia" },
  { value: "8", label: "Consignación" },
  { value: "ZZZ", label: "Otros" },
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
    formasPago,
    totalFormasPago,
    agregarFormaPago,
    actualizarFormaPago,
    eliminarFormaPago,
    //retelCA,
    //setRetelCA,
    agregarContactoLocal,
    agregarClienteLocal,
    agregarProductoLocal,
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
  // ✅ Correcto — sincronizado con el estado del hook
  // ✅ Ambos tipos muestran impuestos
  const mostrarImpuestos =
    factura.tipoFactura === "01" || factura.tipoFactura === "02";

  const [touched, setTouched] = useState({});
  const [submitIntentado, setSubmitIntentado] = useState(false);

  const marcar = (campo) => setTouched((p) => ({ ...p, [campo]: true }));
  const mostrarError = (campo) => submitIntentado || !!touched[campo];

  const handleCrearCli = (n) => {
    setNombreSugeridoCliente(n || "");
    setMostrarModalCliente(true);
  };
  const handleCrearPro = (n) => {
    setNombreSugeridoProducto(n || "");
    setMostrarModalProducto(true);
  };

  const pagoCoincide = Math.abs(totalFormasPago - totales.totalFactura) <= 0.01;
  const fmt = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", { minimumFractionDigits: 2 });
  // En consola del navegador — solo para testing
  //const u = JSON.parse(localStorage.getItem("usuario"));
  //u.prefijoAutorizadoDIAN = "FACT";
  //localStorage.setItem("usuario", JSON.stringify(u));

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
      codigoInterno: p.codigoInterno, // ← campo extra para formatOptionLabel
      label: `${p.nombre} — $${(p.precioUnitario || 0).toLocaleString("es-CO")}`,
    }));
  return (
    <div className="page-crear">
      <div className="page-crear-header">
        {/* Botón FUERA del banner */}
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
                Nueva factura de venta
              </h2>
              <p className="page-crear-banner-subtitle">
                Completa el formulario para crear una factura
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
          {/* ── Banner uso ── */}
          {facturasUsadas.limite > 0 &&
            (() => {
              const pct = Math.round(
                (facturasUsadas.usadas / facturasUsadas.limite) * 100,
              );
              const enPeligro = pct >= 80;
              const agotado = facturasUsadas.usadas >= facturasUsadas.limite;
              return (
                <div
                  className={`doc-uso-banner ${agotado ? "agotado" : enPeligro ? "peligro" : ""}`}
                >
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

          <form
            onSubmit={(e) => {
              setSubmitIntentado(true);
              handleSubmit(e);
            }}
          >
            {/* ══ Información básica ══ */}
            <h6 className="section-title-primary">Información básica</h6>
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
                    onChange={(e) => {
                      setFactura({ ...factura, tipoFactura: e.target.value });
                      marcar("tipoFactura");
                    }}
                    onBlur={() => marcar("tipoFactura")}
                  >
                    <option value="" disabled>
                      Seleccionar tipo...
                    </option>
                    {TIPOS_FACTURA.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
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
                    value={
                      opcionesClientes.find(
                        (o) => o.value === factura.clienteId,
                      ) ?? null
                    }
                    onChange={(opt) =>
                      setFactura((p) => ({
                        ...p,
                        clienteId: opt?.value ?? "",
                        contactoId: "",
                      }))
                    }
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
                    <small
                      style={{ color: "var(--danger)", fontSize: "0.78rem" }}
                    >
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
                    value={
                      opcionesContactos.find(
                        (o) => o.value === factura.contactoId,
                      ) ?? null
                    }
                    onChange={(opt) =>
                      setFactura((p) => ({
                        ...p,
                        contactoId: opt?.value ?? "",
                      }))
                    }
                    noOptionsMessage={() => (
                      <NoOptionsContacto
                        onAbrirModal={() => setMostrarModalContacto(true)}
                      />
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
              </div>

              {/* Columna derecha */}
              <div className="doc-col">
                {/* Número - sin cambios */}
                <div className="doc-field">
                  <label className="doc-label">
                    Número
                    <TooltipInfo texto="Generado automáticamente según el rango autorizado por la DIAN." />
                  </label>
                  <div className="doc-comprobante-inputs">
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

                {/* Fecha de elaboración (única) */}
                <div className="doc-field">
                  <label className="doc-label">Fecha de elaboración</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    style={{ borderLeft: "3px solid #1a73e8" }}
                    value={factura.fechaEmision}
                    onChange={(e) =>
                      setFactura({ ...factura, fechaEmision: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            {/* ══ Tabla de productos ══ */}
            <div style={{ marginBottom: 28 }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="section-title-primary">Detalle de productos</h6>
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
                      <th style={{ minWidth: 180 }}>Producto</th>
                      <th style={{ minWidth: 140 }}>Descripción</th>
                      <th className="text-end" style={{ width: 80 }}>
                        Cant
                      </th>
                      <th className="text-end" style={{ width: 110 }}>
                        Valor Unitario
                      </th>
                      <th className="text-end" style={{ width: 80 }}>
                        % Desc.
                      </th>
                      {/* Solo para electrónica */}
                      {mostrarImpuestos && (
                        <>
                          <th style={{ minWidth: 180 }}>Impuesto Cargo</th>
                          <th style={{ minWidth: 180 }}>Impuesto Retención</th>
                        </>
                      )}
                      <th className="text-end" style={{ width: 100 }}>
                        Valor Total
                      </th>
                      <th style={{ width: 32 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosSeleccionados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={mostrarImpuestos ? 10 : 8}
                          className="doc-tabla-empty"
                        >
                          No hay productos. Haz clic en "+ Agregar fila" para
                          empezar.
                        </td>
                      </tr>
                    ) : (
                      productosSeleccionados.map((item, idx) => {
                        const linea = calcularLinea(item);
                        const opts = opcionesProductos();
                        return (
                          <tr key={idx}>
                            {/* # */}
                            <td className="doc-td-num">{idx + 1}</td>

                            {/* Producto */}
                            <td>
                              <Select
                                menuPortalTarget={document?.body ?? null} // ← seguro
                                styles={{
                                  ...mkSelectStyles(),
                                  control: (b, s) => ({
                                    ...mkSelectStyles().control(b, s),
                                    minWidth: 180,
                                  }),
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }), // ← evita que quede detrás
                                }}
                                options={opts}
                                value={
                                  opts.find(
                                    (o) =>
                                      String(o.value) ===
                                      String(item.productoId),
                                  ) ?? null
                                }
                                onChange={(opt) =>
                                  actualizarProducto(
                                    idx,
                                    "productoId",
                                    opt?.value ?? "",
                                  )
                                }
                                formatOptionLabel={(option, { context }) =>
                                  context === "menu" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                      }}
                                    >
                                      
                                      <span>{option.label}</span>
                                    </div>
                                  ) : (
                                    // context === "value" → valor seleccionado en el input
                                    <span>
                                      <span
                                        style={{
                                          fontSize: 14,
                                          color: "#000000",
                                          marginRight: 6,
                                        }}
                                      >
                                        {option.codigoInterno}
                                      </span>
                                     
                                    </span>
                                  )
                                }
                                noOptionsMessage={({ inputValue }) => (
                                  <NoOptionsProducto
                                    inputValue={inputValue}
                                    onCrear={handleCrearPro}
                                  />
                                )}
                                isClearable
                                placeholder="Buscar..."
                              />
                            </td>

                            {/* Descripción */}
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={item.descripcion ?? ""}
                                placeholder="Descripción..."
                                onChange={(opt) => {
                                  actualizarProducto(
                                    idx,
                                    "productoId",
                                    opt?.value ?? "",
                                  );
                                  // ✅ Auto-poblar descripción con el nombre del producto
                                  const prod = productos.find(
                                    (p) => p.id === opt?.value,
                                  );
                                  if (prod) {
                                    actualizarProducto(
                                      idx,
                                      "descripcion",
                                      prod.nombre,
                                    );
                                  }
                                }}
                              />
                            </td>

                            {/* Cantidad */}
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.cantidad}
                                min="0.001"
                                step="0.001"
                                onChange={(e) =>
                                  actualizarProducto(
                                    idx,
                                    "cantidad",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>

                            {/* Valor Unitario */}
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.precioUnitario}
                                step="0.01"
                                min="0"
                                onChange={(e) =>
                                  actualizarProducto(
                                    idx,
                                    "precioUnitario",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>

                            {/* % Desc */}
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm text-end doc-num-input"
                                value={item.porcentajeDescuento}
                                min="0"
                                max="100"
                                step="0.01"
                                onChange={(e) =>
                                  actualizarProducto(
                                    idx,
                                    "porcentajeDescuento",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>

                            {/* Impuesto Cargo + Retención — solo electrónica */}
                            {mostrarImpuestos && (
                              <>
                                {/* Impuesto Cargo */}
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    value={item.impuestoCargo ?? "IVA_19"}
                                    onChange={(e) => {
                                      const sel = IMPUESTOS_CARGO.find(
                                        (x) => x.value === e.target.value,
                                      );
                                      // Actualiza el código visual Y las tarifas reales
                                      actualizarProducto(
                                        idx,
                                        "impuestoCargo",
                                        e.target.value,
                                      );
                                      actualizarProducto(
                                        idx,
                                        "tarifaIVA",
                                        sel?.tarifaIVA ?? 0,
                                      );
                                      actualizarProducto(
                                        idx,
                                        "tarifaINC",
                                        sel?.tarifaINC ?? 0,
                                      );
                                    }}
                                  >
                                    {IMPUESTOS_CARGO.map((op) => (
                                      <option key={op.value} value={op.value}>
                                        {op.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* Impuesto Retención */}
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    value={item.impuestoRetencion ?? ""}
                                    onChange={(e) => {
                                      const sel = IMPUESTOS_RETENCION.find(
                                        (x) => x.value === e.target.value,
                                      );
                                      actualizarProducto(
                                        idx,
                                        "impuestoRetencion",
                                        e.target.value,
                                      );
                                      actualizarProducto(
                                        idx,
                                        "tarifaRetencion",
                                        sel?.tarifa ?? 0,
                                      );
                                    }}
                                  >
                                    {IMPUESTOS_RETENCION.map((op) => (
                                      <option key={op.value} value={op.value}>
                                        {op.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </>
                            )}

                            {/* Valor Total */}
                            <td className="text-end fw-semibold">
                              ${fmt(linea.totalLinea)}
                            </td>

                            {/* Eliminar */}
                            <td>
                              <button
                                type="button"
                                className="doc-btn-trash"
                                onClick={() => eliminarProducto(idx)}
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
              <div>
                <h6 className="doc-section-title">Forma de pago</h6>
                <div className="doc-hr" />

                {/* ✅ Días crédito — obligatorio si condición = Crédito */}
                {factura.formaPago === "2" && (
                  <div className="doc-field mb-2">
                    <label className="doc-label">
                      Días de crédito *
                      <TooltipInfo texto="La DIAN exige PaymentDueDate cuando la condición es Crédito." />
                    </label>
                    <input
                      type="number"
                      className={`form-control form-control-sm ${mostrarError("diasCredito") && !factura.diasCredito ? "is-invalid" : ""}`}
                      value={factura.diasCredito ?? ""}
                      min="1"
                      placeholder="Ej: 30"
                      onChange={(e) =>
                        setFactura((p) => ({
                          ...p,
                          diasCredito: parseInt(e.target.value) || null,
                        }))
                      }
                      onBlur={() => marcar("diasCredito")}
                    />
                    {mostrarError("diasCredito") && !factura.diasCredito && (
                      <div className="invalid-feedback d-block">
                        Ingresa los días de plazo para el crédito
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ Medio de pago (PaymentMeansCode) — ya no mezcla con condición */}
                {formasPago.map((fp, idx) => (
                  <div key={idx} className="doc-pago-fila">
                    <select
                      className="form-select form-select-sm doc-pago-select"
                      value={fp.metodo}
                      onChange={(e) =>
                        actualizarFormaPago(idx, "metodo", e.target.value)
                      }
                    >
                      <option value="">Selecciona medio de pago</option>
                      {OPCIONES_MEDIO_PAGO.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm text-end doc-pago-valor"
                      value={fp.valor}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={(e) =>
                        actualizarFormaPago(idx, "valor", e.target.value)
                      }
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
                    <span>IVA (01):</span>
                    <span>{fmt(totales.totalIVA)}</span>
                  </div>
                )}
                {totales.totalINC > 0 && (
                  <div className="doc-totales-fila">
                    <span>INC (04):</span>
                    <span>{fmt(totales.totalINC)}</span>
                  </div>
                )}
                {/* ✅ ICA — requerido para fórmula CUFE */}
                {totales.totalICA > 0 && (
                  <div className="doc-totales-fila">
                    <span>ICA (03):</span>
                    <span>{fmt(totales.totalICA)}</span>
                  </div>
                )}
                {totales.totalRetenciones > 0 && (
                  <div className="doc-totales-fila">
                    <span>Retenciones:</span>
                    <span className="text-danger">
                      -{fmt(totales.totalRetenciones)}
                    </span>
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
                placeholder="Aquí puedes ingresar comentarios adicionales o información para tu cliente..."
                value={factura.observaciones}
                onChange={(e) =>
                  setFactura({ ...factura, observaciones: e.target.value })
                }
              />
              <label className="doc-adjuntar">
                <input
                  type="file"
                  className="d-none"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setFactura((p) => ({ ...p, archivo: f }));
                  }}
                />
                <Paperclip size={14} /> Adjuntar archivo
                {factura.archivo && (
                  <span className="doc-archivo-nombre">
                    {factura.archivo.name}
                  </span>
                )}
              </label>
            </div>

            {/* ══ sticky ══ */}
            <div className="page-crear-footer">
              <div className="footer-acciones">
                <button
                  type="button"
                  className="doc-btn-cancelar"
                  onClick={() => navigate("/ventas")}
                >
                  Cancelar
                </button>

                {/* ✅ Guarda como borrador — NO se envía a la DIAN */}
                <button
                  type="button"
                  className="doc-btn-borrador"
                  onClick={() => handleSubmit(null, "Borrador")}
                >
                  Guardar
                </button>

                {/* Guarda y marca lista para enviar */}
                <button type="submit" className="doc-btn-guardar-enviar">
                  Guardar y enviar
                </button>
              </div>
            </div>
          </form>

          {/* ══ Modales ══ */}
          {mostrarModalContacto && (
            <ModalCrearContacto
              clienteId={factura.clienteId}
              onClose={() => setMostrarModalContacto(false)}
              onSuccess={(c) => {
                agregarContactoLocal(c);
                setMostrarModalContacto(false);
              }}
            />
          )}
          {mostrarModalCliente && (
            <ModalCrearCliente
              open
              nombreSugerido={nombreSugeridoCliente}
              onClose={() => setMostrarModalCliente(false)}
              onSuccess={(c) => {
                agregarClienteLocal(c);
                setMostrarModalCliente(false);
              }}
            />
          )}
          {mostrarModalProducto && (
            <ModalCrearProducto
              open
              nombreSugerido={nombreSugeridoProducto}
              onClose={() => setMostrarModalProducto(false)}
              onSuccess={(p) => {
                agregarProductoLocal(p);
                setMostrarModalProducto(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
