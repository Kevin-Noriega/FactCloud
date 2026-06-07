import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Select from "../StyledSelect";
import unidadesMedidaDIAN from "../../utils/UnidadesMedidas.json";
import tipoProductoDIAN from "../../utils/TiposProducto.json";
import "../../styles/modals/ModalCrearProducto.css";

/* Opciones combinadas para "Impuesto cargo" */
const IMPUESTO_OPCIONES = [
  { value: "IVA_19", label: "IVA 19%" },
  { value: "IVA_5", label: "IVA 5%" },
  { value: "IVA_0", label: "IVA 0%" },
  { value: "INC", label: "INC (Impoconsumo)" },
  { value: "EXCLUIDO", label: "Excluido de IVA" },
  { value: "EXENTO", label: "Exento de IVA" },
];

function getImpuestoCargo(p) {
  if (p.productoExcluido) return "EXCLUIDO";
  if (p.productoExento) return "EXENTO";
  if (p.gravaINC) return "INC";
  return `${p.tipoImpuesto}_${p.tarifaIVA}`;
}

function ModalCrearProducto({ productoEditando, onClose, onGuardadoExitoso }) {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    esServicio: false,
    nombre: "",
    descripcion: "",
    codigoInterno: "",
    codigoUNSPSC: "",
    unidadMedida: "Unidad",
    marca: "",
    modelo: "",
    precioUnitario: "",
    costo: "",
    tipoImpuesto: "IVA",
    tarifaIVA: 19,
    productoExcluido: false,
    productoExento: false,
    gravaINC: false,
    tarifaINC: 0,
    cantidadDisponible: "",
    cantidadMinima: 0,
    categoria: "",
    codigoBarras: "",
    estado: true,
    tipoProducto: "",
    baseGravable: "",
    retencionFuente: "",
    retencionIVA: "",
    retencionICA: "",
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (productoEditando) {
      setProducto({
        esServicio: productoEditando.esServicio || false,
        nombre: productoEditando.nombre || "",
        descripcion: productoEditando.descripcion || "",
        codigoInterno: productoEditando.codigoInterno || "",
        codigoUNSPSC: productoEditando.codigoUNSPSC || "",
        unidadMedida: productoEditando.unidadMedida || "Unidad",
        marca: productoEditando.marca || "",
        modelo: productoEditando.modelo || "",
        precioUnitario: productoEditando.precioUnitario || "",
        costo: productoEditando.costo || "",
        tipoImpuesto: productoEditando.tipoImpuesto || "IVA",
        tarifaIVA: productoEditando.tarifaIVA ?? 19,
        productoExcluido: !!productoEditando.productoExcluido,
        productoExento: !!productoEditando.productoExento,
        gravaINC: !!productoEditando.gravaINC,
        tarifaINC: productoEditando.tarifaINC ?? 0,
        cantidadDisponible: productoEditando.cantidadDisponible || "",
        cantidadMinima: productoEditando.cantidadMinima ?? 0,
        categoria: productoEditando.categoria || "",
        codigoBarras: productoEditando.codigoBarras || "",
        estado:
          typeof productoEditando.estado === "boolean"
            ? productoEditando.estado
            : true,
        tipoProducto: productoEditando.tipoProducto || "",
        baseGravable: productoEditando.baseGravable || "",
        retencionFuente: productoEditando.retencionFuente || "",
        retencionIVA: productoEditando.retencionIVA || "",
        retencionICA: productoEditando.retencionICA || "",
      });
    }
  }, [productoEditando]);

  const baseGravable = producto.baseGravable
    ? parseFloat(producto.baseGravable)
    : 0;
  const porcentajeFuente = producto.retencionFuente
    ? parseFloat(producto.retencionFuente)
    : 0;
  const porcentajeIVA = producto.retencionIVA
    ? parseFloat(producto.retencionIVA)
    : 0;
  const porcentajeICA = producto.retencionICA
    ? parseFloat(producto.retencionICA)
    : 0;

  const valorRetencionFuente = +(
    (baseGravable * porcentajeFuente) /
    100
  ).toFixed(2);
  const valorRetencionIVA = +((baseGravable * porcentajeIVA) / 100).toFixed(2);
  const valorRetencionICA = +((baseGravable * porcentajeICA) / 100).toFixed(2);

  // Validación del modal RÁPIDO: solo los campos que este modal muestra.
  // (Los campos avanzados —UNSPSC, marca, código de barras, tipo DIAN, etc.—
  //  se piden en "Creación completa". El backend los acepta como opcionales.)
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!producto.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (producto.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!producto.precioUnitario || parseFloat(producto.precioUnitario) <= 0) {
      nuevosErrores.precioUnitario = "El precio debe ser mayor a 0";
    }

    if (
      producto.costo &&
      parseFloat(producto.costo) > parseFloat(producto.precioUnitario)
    ) {
      nuevosErrores.costo = "El costo no puede ser mayor al precio de venta";
    }

    if (!producto.esServicio) {
      if (
        producto.cantidadDisponible === "" ||
        producto.cantidadDisponible === null ||
        parseInt(producto.cantidadDisponible) < 0
      ) {
        nuevosErrores.cantidadDisponible =
          "La cantidad disponible es obligatoria para productos";
      }
    }

    if (producto.productoExcluido && producto.productoExento) {
      nuevosErrores.impuestos =
        "Un producto no puede ser excluido y exento al mismo tiempo";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errores[name]) {
      setErrores({ ...errores, [name]: null });
    }
  };

  const handleImpuestoCargo = (val) => {
    setProducto((prev) => ({
      ...prev,
      productoExcluido: val === "EXCLUIDO",
      productoExento: val === "EXENTO",
      gravaINC: val === "INC",
      tipoImpuesto: val.startsWith("IVA") ? "IVA" : "INC",
      tarifaIVA:
        val === "IVA_19"
          ? 19
          : val === "IVA_5"
            ? 5
            : val === "IVA_0"
              ? 0
              : prev.tarifaIVA,
    }));
  };

  const handleTipoChange = (esServicio) => {
    setProducto({
      ...producto,
      esServicio,
      ...(esServicio && {
        cantidadDisponible: "",
        cantidadMinima: 0,
        codigoBarras: "",
        marca: "",
        modelo: "",
      }),
    });
    setErrores({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      const payload = {
        ...(productoEditando && { id: productoEditando.id }),
        esServicio: producto.esServicio,
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion?.trim() || null,
        codigoInterno: producto.codigoInterno?.trim() || null,
        codigoUNSPSC: producto.codigoUNSPSC?.trim() || null,
        unidadMedida: producto.unidadMedida || "Unidad",
        marca: producto.esServicio ? null : producto.marca?.trim() || null,
        modelo: producto.esServicio ? null : producto.modelo?.trim() || null,
        precioUnitario: parseFloat(producto.precioUnitario),
        costo: producto.costo ? parseFloat(producto.costo) : null,
        incluyeIVA: !!producto.productoExento,
        impuestoCargo: getImpuestoCargo(producto),
        cantidadDisponible: producto.esServicio
          ? null
          : parseInt(producto.cantidadDisponible),
        cantidadMinima: producto.esServicio
          ? 0
          : parseInt(producto.cantidadMinima) || 0,
        categoria: producto.categoria?.trim() || null,
        codigoBarras: producto.esServicio
          ? null
          : producto.codigoBarras?.trim() || null,
        tipoProducto: producto.tipoProducto || null,
        // Necesario en edición: ProductoUpdateDto.Activo (si no, lo desactivaría).
        activo: producto.estado !== false,
      };

      // axiosClient ya inyecta el access token (en memoria) y refresca si caduca.
      const respuesta = productoEditando
        ? await axiosClient.put(`/Productos/${productoEditando.id}`, payload)
        : await axiosClient.post(`/Productos`, payload);

      const productoGuardado = respuesta?.data ?? null;

      const mensaje = productoEditando
        ? `${producto.esServicio ? "Servicio" : "Producto"} modificado con éxito.`
        : `${producto.esServicio ? "Servicio" : "Producto"} agregado con éxito.`;
      onGuardadoExitoso(mensaje, productoGuardado);
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.errorReal ||
        error.message ||
        "No se pudo guardar el producto";
      alert("Error al guardar: " + msg);
    } finally {
      setGuardando(false);
    }
  };

  const unidadOpts = unidadesMedidaDIAN.map((um) => ({
    value: um.nombre,
    label: `${um.codigo} - ${um.nombre}`,
  }));
  const tipoProductoOpts = tipoProductoDIAN.map((tp) => ({
    value: tp.descripcion,
    label: `${tp.codigo} - ${tp.descripcion}`,
  }));

  return (
    <div className="modal-crearNuevo-overlay" onClick={onClose}>
      <div
        className="modal-crearNuevo-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="modal-crearNuevo-header">
          <h5>
            {productoEditando
              ? `Editar ${producto.esServicio ? "servicio" : "producto"}`
              : "Crear producto o servicio"}
          </h5>
          <button
            className="btn-close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>

        {/* ── Body + Footer dentro del form ── */}
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="modal-crearNuevo-body">
            {/* Tipo selector */}
            <div className="tipo-selector">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoItem"
                  id="mpTipoProducto"
                  checked={!producto.esServicio}
                  onChange={() => handleTipoChange(false)}
                />
                <label className="form-check-label" htmlFor="mpTipoProducto">
                  Producto
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoItem"
                  id="mpTipoServicio"
                  checked={producto.esServicio}
                  onChange={() => handleTipoChange(true)}
                />
                <label className="form-check-label" htmlFor="mpTipoServicio">
                  Servicio
                </label>
              </div>
            </div>

            {/* ── Datos básicos ── */}
            <h6 className="section-title-producto-producto">Datos básicos</h6>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Código de producto (SKU)*</label>
                <input
                  type="text"
                  name="codigoInterno"
                  className="form-control"
                  value={producto.codigoInterno}
                  onChange={handleChange}
                  placeholder="Ej: PROD-001"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Nombre del {producto.esServicio ? "servicio" : "producto"}*
                </label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                  value={producto.nombre}
                  onChange={handleChange}
                  placeholder={
                    producto.esServicio
                      ? "Ej: Consultoría legal"
                      : "Ej: Laptop HP"
                  }
                />
                {errores.nombre && (
                  <div className="invalid-feedback">{errores.nombre}</div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Unidad de medida DIAN*</label>
                <Select
                  options={unidadOpts}
                  value={
                    unidadOpts.find((o) => o.value === producto.unidadMedida) ??
                    null
                  }
                  onChange={(o) =>
                    setProducto((p) => ({
                      ...p,
                      unidadMedida: o ? o.value : "",
                    }))
                  }
                  isClearable
                  placeholder="Seleccionar"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">
                  Descripción larga{producto.esServicio ? " *" : ""}
                </label>
                <textarea
                  name="descripcion"
                  className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                  value={producto.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder={
                    producto.esServicio
                      ? "Describe el servicio en detalle (mín. 10 caracteres)"
                      : "Descripción opcional del producto"
                  }
                />
                {errores.descripcion && (
                  <div className="invalid-feedback">{errores.descripcion}</div>
                )}
              </div>
            </div>

            

            {/* ── Impuestos ── */}
            <h6 className="section-title-producto-producto">Impuestos</h6>
            {errores.impuestos && (
              <div className="alert alert-danger">{errores.impuestos}</div>
            )}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Impuesto cargo</label>
                <select
                  className="form-select"
                  value={getImpuestoCargo(producto)}
                  onChange={(e) => handleImpuestoCargo(e.target.value)}
                >
                  {IMPUESTO_OPCIONES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Lista de precios de venta ── */}
            <h6 className="section-title-producto-producto">
              Lista de precios de venta
            </h6>
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="mpIncluirIVA"
                    className="form-check-input"
                    checked={producto.productoExento || false}
                    readOnly
                  />
                  <label className="form-check-label" htmlFor="mpIncluirIVA">
                    Incluir IVA en el precio de venta
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label">Lista de precio 1</label>
                <input
                  className="form-control"
                  value="Lista de precio por defecto"
                  readOnly
                  style={{ background: "#f5f5f5", color: "#9e9e9e" }}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Precio (COP)*</label>
                <input
                  type="number"
                  name="precioUnitario"
                  className={`form-control ${errores.precioUnitario ? "is-invalid" : ""}`}
                  value={producto.precioUnitario}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {errores.precioUnitario && (
                  <div className="invalid-feedback">
                    {errores.precioUnitario}
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  name="costo"
                  className={`form-control ${errores.costo ? "is-invalid" : ""}`}
                  value={producto.costo}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Costo de adquisición"
                />
                {errores.costo && (
                  <div className="invalid-feedback">{errores.costo}</div>
                )}
              </div>
            </div>

            {/* ── Inventario (solo productos) ── */}
            {!producto.esServicio && (
              <>
                <h6 className="section-title-producto">Inventario</h6>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Cantidad disponible*</label>
                    <input
                      type="number"
                      name="cantidadDisponible"
                      className={`form-control ${errores.cantidadDisponible ? "is-invalid" : ""}`}
                      value={producto.cantidadDisponible}
                      onChange={handleChange}
                      min="0"
                      placeholder="Stock actual"
                    />
                    {errores.cantidadDisponible && (
                      <div className="invalid-feedback">
                        {errores.cantidadDisponible}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cantidad mínima</label>
                    <input
                      type="number"
                      name="cantidadMinima"
                      className="form-control"
                      value={producto.cantidadMinima}
                      onChange={handleChange}
                      min="0"
                      placeholder="Alerta de stock bajo"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="modal-producto-footer">
            <button
              type="button"
              className="btn btn-cancelar-texto"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-creacion-completa"
              onClick={() => {
                onClose();
                navigate("/crearProducto");
              }}
              disabled={guardando}
            >
              <span className="mp-icon-external">↗</span> Creación completa
            </button>
            <button
              type="submit"
              className="btn btn-guardar-primary"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border-sm" /> Guardando...
                </>
              ) : productoEditando ? (
                `Actualizar ${producto.esServicio ? "servicio" : "producto"}`
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCrearProducto;
