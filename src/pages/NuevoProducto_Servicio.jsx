import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import axiosClient from "../api/axiosClient";
import unidadesMedidaDIAN from "../utils/UnidadesMedidas.json";
import "../styles/PageCrear.css";
import { BoxSeam, PlusCircle, PencilSquare } from "react-bootstrap-icons"; // ← agrega los iconos
function NuevoProducto_Servicio() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const productoEditando = state?.productoEditando || null;
  const [tabActiva, setTabActiva] = useState("impuestos");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

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
    incluyeIVA: false,
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
        incluyeIVA: productoEditando.incluyeIVA || false,
      });
    }
  }, [productoEditando]);

 /* const baseGravable = producto.baseGravable
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
*/
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!producto.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (producto.nombre.length < 3) {
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
        !producto.cantidadDisponible ||
        parseInt(producto.cantidadDisponible) < 0
      ) {
        nuevosErrores.cantidadDisponible =
          "La cantidad disponible es obligatoria para productos";
      }

      if (!producto.codigoBarras || producto.codigoBarras.trim() === "") {
        nuevosErrores.codigoBarras =
          "El código de barras es obligatorio para productos";
      } else if (producto.codigoBarras.length < 8) {
        nuevosErrores.codigoBarras =
          "El código de barras debe tener al menos 8 caracteres";
      }

      if (!producto.marca || producto.marca.trim() === "") {
        nuevosErrores.marca = "La marca es obligatoria para productos";
      }
    }

    if (producto.esServicio) {
      if (!producto.descripcion || producto.descripcion.trim() === "") {
        nuevosErrores.descripcion =
          "La descripción es obligatoria para servicios";
      } else if (producto.descripcion.length < 10) {
        nuevosErrores.descripcion =
          "La descripción debe tener al menos 10 caracteres";
      }
    }

    if (
      producto.codigoUNSPSC?.trim() &&
      !/^\d{8}$/.test(producto.codigoUNSPSC)
    ) {
      nuevosErrores.codigoUNSPSC =
        "El código UNSPSC debe tener exactamente 8 dígitos";
    }

    if (producto.productoExcluido && producto.productoExento) {
      nuevosErrores.impuestos =
        "Un producto no puede ser excluido y exento al mismo tiempo";
    }

    if (
      producto.gravaINC &&
      (!producto.tarifaINC || parseFloat(producto.tarifaINC) <= 0)
    ) {
      nuevosErrores.tarifaINC = "Debe especificar la tarifa INC";
    }

    if (
      producto.retencionFuente &&
      (parseFloat(producto.retencionFuente) < 0 ||
        parseFloat(producto.retencionFuente) > 100)
    ) {
      nuevosErrores.retencionFuente = "La retención debe estar entre 0 y 100%";
    }

    if (
      producto.retencionIVA &&
      (parseFloat(producto.retencionIVA) < 0 ||
        parseFloat(producto.retencionIVA) > 100)
    ) {
      nuevosErrores.retencionIVA = "La retención debe estar entre 0 y 100%";
    }

    if (
      producto.retencionICA &&
      (parseFloat(producto.retencionICA) < 0 ||
        parseFloat(producto.retencionICA) > 100)
    ) {
      nuevosErrores.retencionICA = "La retención debe estar entre 0 y 100%";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({ ...producto, [name]: type === "checkbox" ? checked : value });
    if (errores[name]) setErrores({ ...errores, [name]: null });
  };

  const handleTipoChange = (esServicio) => {
    setTabActiva("impuestos");
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
  const IMPUESTOS_CARGO = [
    { value: "", label: "No aplica" },
    { value: "IVA_19", label: "IVA 19%" },
    { value: "IVA_5", label: "IVA 5%" },
    { value: "IVA_0", label: "IVA 0%" },
    { value: "INC_8", label: "Impoconsumo 8%" },
    { value: "INC_VAL", label: "Impoconsumo por valor" },
    { value: "IVA_16", label: "IVA 16%" },
    { value: "ADV_20", label: "AdValorem 20%" },
    { value: "ADV_25", label: "AdValorem 25%" },
  ];

  const RETENCIONES = [
    { value: "", label: "No aplica" },
    { value: "RTE_11", label: "Retefuente 11%" },
    { value: "RTE_10", label: "Retefuente 10%" },
    { value: "RTE_7", label: "Retefuente 7%" },
    { value: "RTE_6", label: "Retefuente 6%" },
    { value: "RTE_4", label: "Retefuente 4%" },
    { value: "RTE_3_5", label: "Retefuente 3.5%" },
    { value: "RTE_2_5", label: "Retefuente 2.5%" },
    { value: "RTE_2", label: "Retefuente 2%" },
    { value: "RTE_1_5", label: "Retefuente 1.5%" },
    { value: "RTE_1", label: "Retefuente 1%" },
    { value: "RTE_0_5", label: "Retefuente 0.50%" },
    { value: "RTE_0_1", label: "Retefuente 0.10%" },
    { value: "RTE_20", label: "Retefuente 20%" },
  ];

  // Estado inicial extraído como constante para reutilizarlo al resetear
  const PRODUCTO_INICIAL = {
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
    impuestoCargo: "", 
    retencion: "",
    cantidadDisponible: "",
    cantidadMinima: 0,
    categoria: "",
    codigoBarras: "",
    tipoProducto: "",
    estado: true,
    incluyeIVA: false,
  };

  // ── Lógica base reutilizable ──
  const handleSubmitBase = async (crearNuevo = false) => {
    setGuardando(true);
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        return;
      }

      const payload = {
        ...(productoEditando && { id: productoEditando.id }),
        tipoProducto: producto.esServicio ? "02" : "01",
        esServicio: producto.esServicio,
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion.trim(),
        codigoInterno: producto.codigoInterno.trim(),

        codigoUNSPSC:
          producto.codigoUNSPSC?.trim() ||
          (producto.esServicio ? "85121500" : "01010101"), // Genérico DIAN

        unidadMedida: producto.unidadMedida,
        marca: producto.esServicio ? null : producto.marca?.trim(),
        modelo: producto.esServicio ? null : producto.modelo?.trim(),
        precioUnitario: parseFloat(producto.precioUnitario),
        costo: producto.costo ? parseFloat(producto.costo) : null,
        impuestoCargo: producto.impuestoCargo || null,
        retencion: producto.retencion || null,
        cantidadDisponible: producto.esServicio
          ? null
          : parseInt(producto.cantidadDisponible || 0),
        cantidadMinima: producto.esServicio
          ? 0
          : parseInt(producto.cantidadMinima || 0),
        categoria: producto.categoria?.trim() || "",
        codigoBarras: producto.esServicio
          ? null
          : producto.codigoBarras?.trim(),
        estado: producto.estado,
        incluyeIVA: producto.incluyeIVA,
        usuarioId: usuarioGuardado.id,
      };

      const url = productoEditando
        ? `/Productos/${productoEditando.id}`
        : `/Productos`;

      await axiosClient({
        method: productoEditando ? "PUT" : "POST",
        url,
        data: payload,
      });

      const mensaje = productoEditando
        ? `${producto.esServicio ? "Servicio" : "Producto"} modificado con éxito.`
        : `${producto.esServicio ? "Servicio" : "Producto"} agregado con éxito.`;

      if (crearNuevo) {
        setProducto(PRODUCTO_INICIAL);
        setErrores({});
        setTabActiva("impuestos");
        alert(mensaje + " Puedes crear otro.");
      } else {
        navigate("/productos", { state: { mensajeExito: mensaje } });
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      const mensaje =
        error.response?.data?.message || error.message || "Error al guardar";
      alert("Error al guardar: " + mensaje);
    } finally {
      setGuardando(false);
    }
  };

  // ── handleSubmit normal (botón guardar principal) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    await handleSubmitBase(false);
  };

  return (
    <div className="page-crear">
      {/* HEADER DE PÁGINA */}

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
                {productoEditando
                  ? `Editar ${producto.esServicio ? "Servicio" : "Producto"}`
                  : `Nuevo ${producto.esServicio ? "Servicio" : "Producto"}`}
              </h2>
              <p className="page-crear-banner-subtitle">
                {productoEditando
                  ? "Modifica la información del artículo seleccionado."
                  : "Completa el formulario para agregar un nuevo artículo al catálogo."}
              </p>
            </div>
            <div className="page-crear-banner-icon">
              {productoEditando ? (
                <PencilSquare size={70} />
              ) : (
                <PlusCircle size={70} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CUERPO DE PÁGINA */}
      <div className="page-crear-wrapper">
        <div className="page-crear-body">
          <form onSubmit={handleSubmit}>
            {/* Selector Producto / Servicio */}
            <div className="tipo-selector-container mb-4">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoItem"
                  id="tipoProducto"
                  checked={!producto.esServicio}
                  onChange={() => handleTipoChange(false)}
                />
                <label className="form-check-label" htmlFor="tipoProducto">
                  <strong>Producto</strong> (Bien físico con inventario)
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoItem"
                  id="tipoServicio"
                  checked={producto.esServicio}
                  onChange={() => handleTipoChange(true)}
                />
                <label className="form-check-label" htmlFor="tipoServicio">
                  <strong>Servicio</strong> (Intangible sin inventario)
                </label>
              </div>
            </div>

            {/* ── Información General ── */}
            <h6 className="section-title-primary">
              Información General
            </h6>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">
                  Nombre del {producto.esServicio ? "Servicio" : "Producto"} *
                </label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                  value={producto.nombre}
                  onChange={handleChange}
                />
                {errores.nombre && (
                  <div className="invalid-feedback">{errores.nombre}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Código Interno (SKU) *</label>
                <input
                  type="text"
                  name="codigoInterno"
                  className="form-control"
                  value={producto.codigoInterno}
                  onChange={handleChange}
                />
              </div>

              {/* Código de barras solo en Producto, Unidad de Medida sube en Servicio */}
              <div className="col-md-4">
                {!producto.esServicio ? (
                  <>
                    <label className="form-label">Código EAN/Barras *</label>
                    <input
                      type="text"
                      name="codigoBarras"
                      className={`form-control ${errores.codigoBarras ? "is-invalid" : ""}`}
                      value={producto.codigoBarras}
                      onChange={handleChange}
                    />
                    {errores.codigoBarras && (
                      <div className="invalid-feedback">
                        {errores.codigoBarras}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label className="form-label">Unidad de Medida</label>
                    <Select
                      name="unidadMedida"
                      options={unidadesMedidaDIAN.map((um) => ({
                        value: um.nombre,
                        label: `${um.codigo} - ${um.nombre}`,
                      }))}
                      value={
                        producto.unidadMedida
                          ? unidadesMedidaDIAN
                              .map((um) => ({
                                value: um.nombre,
                                label: `${um.codigo} - ${um.nombre}`,
                              }))
                              .find(
                                (opt) => opt.value === producto.unidadMedida,
                              )
                          : null
                      }
                      onChange={(opt) =>
                        setProducto((prev) => ({
                          ...prev,
                          unidadMedida: opt ? opt.value : "",
                        }))
                      }
                      isClearable
                      placeholder="Seleccionar unidad"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Unidad de medida solo visible en fila separada cuando es Producto */}
            {!producto.esServicio && (
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Unidad de Medida</label>
                  <Select
                    name="unidadMedida"
                    options={unidadesMedidaDIAN.map((um) => ({
                      value: um.nombre,
                      label: `${um.codigo} - ${um.nombre}`,
                    }))}
                    value={
                      producto.unidadMedida
                        ? unidadesMedidaDIAN
                            .map((um) => ({
                              value: um.nombre,
                              label: `${um.codigo} - ${um.nombre}`,
                            }))
                            .find((opt) => opt.value === producto.unidadMedida)
                        : null
                    }
                    onChange={(opt) =>
                      setProducto((prev) => ({
                        ...prev,
                        unidadMedida: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar unidad"
                  />
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="toggles-config mb-4">
              {/* Toggle inventariable — solo en producto */}
              <div className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-label">Producto inventariable</span>
                  <span className="toggle-desc">
                    {producto.esServicio
                      ? "Los servicios no manejan inventario"
                      : "Controla el stock de este producto"}
                  </span>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input toggle-switch"
                    type="checkbox"
                    role="switch"
                    checked={!producto.esServicio}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* ✅ Toggle visible en facturas — bloqueado si es servicio */}
              <div
                className={`toggle-item ${producto.esServicio ? "toggle-item--disabled" : ""}`}
              >
                <div className="toggle-info">
                  <span className="toggle-label">
                    Visible en facturas de venta
                  </span>
                  <span className="toggle-desc">
                    {producto.esServicio
                      ? "Los servicios siempre son visibles en facturas"
                      : "Aparece disponible al crear facturas"}
                  </span>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input toggle-switch"
                    type="checkbox"
                    role="switch"
                    name="estado"
                    checked={producto.esServicio ? true : producto.estado}
                    onChange={handleChange}
                    disabled={producto.esServicio} // ✅ bloqueado en servicio
                  />
                </div>
              </div>
            </div>

            {/* ── Datos Adicionales con tabs ── */}
            <h6 className="section-title-primary">
              Datos Adicionales
            </h6>

            {/* Tabs */}
            <div className="tabs-adicionales">
              <button
                type="button"
                className={`tab-btn ${tabActiva === "impuestos" ? "tab-btn--activo" : ""}`}
                onClick={() => setTabActiva("impuestos")}
              >
                Impuestos
              </button>
              <button
                type="button"
                className={`tab-btn ${tabActiva === "descripcion" ? "tab-btn--activo" : ""}`}
                onClick={() => setTabActiva("descripcion")}
              >
                {producto.esServicio ? "Descripción" : "Descripción y stock"}
              </button>
              {!producto.esServicio && (
                <button
                  type="button"
                  className={`tab-btn ${tabActiva === "fotos" ? "tab-btn--activo" : ""}`}
                  onClick={() => setTabActiva("fotos")}
                >
                  Subir imágenes
                </button>
              )}
            </div>

            {/* Contenido de cada tab */}
            <div className="tab-contenido">
              {/* ── TAB IMPUESTOS ── */}
              {tabActiva === "impuestos" && (
                <div>
                  <p className="text-muted small mb-3">
                    Estos impuestos aplican solo para documentos de ventas
                  </p>

                  {errores.impuestos && (
                    <div className="alert alert-danger py-2">
                      {errores.impuestos}
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col-md-5">
                      <label className="form-label">Impuesto cargo</label>
                      <select
                        name="impuestoCargo"
                        className="form-select"
                        value={producto.impuestoCargo}
                        onChange={handleChange}
                      >
                        {IMPUESTOS_CARGO.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Retención</label>
                      <select
                        name="retencion"
                        className="form-select"
                        value={producto.retencion}
                        onChange={handleChange}
                      >
                        {RETENCIONES.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB DESCRIPCIÓN Y STOCK / DESCRIPCIÓN ── */}
              {tabActiva === "descripcion" && (
                <div>
                  {/* Fila 1 — Referencia + Unidad de medida (readonly, viene de arriba) */}
                  <div className="row mb-3">
                    <div className="col-md-5">
                      <label className="form-label">Referencia</label>
                      <input
                        type="text"
                        name="codigoBarras"
                        className="form-control"
                        value={producto.esServicio ? "" : producto.codigoBarras}
                        onChange={handleChange}
                        placeholder=""
                        disabled={producto.esServicio}
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">
                        Unidad de medida de la factura
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={producto.unidadMedida || ""}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Fila 2 — Descripción larga */}
                  <div className="row mb-3">
                    <div className="col-12">
                      <label className="form-label">
                        Descripción larga {producto.esServicio ? "*" : ""}
                      </label>
                      <textarea
                        name="descripcion"
                        className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                        value={producto.descripcion}
                        onChange={handleChange}
                        rows={4}
                        placeholder={
                          producto.esServicio
                            ? "Describe el servicio en detalle"
                            : "Descripción larga del producto (opcional)"
                        }
                      />
                      {errores.descripcion && (
                        <div className="invalid-feedback">
                          {errores.descripcion}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Solo producto — Marca, Modelo, Código arancelario */}
                  {!producto.esServicio && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label className="form-label">Marca</label>
                          <input
                            type="text"
                            name="marca"
                            className={`form-control ${errores.marca ? "is-invalid" : ""}`}
                            value={producto.marca}
                            onChange={handleChange}
                            placeholder="Ej: Samsung"
                          />
                          {errores.marca && (
                            <div className="invalid-feedback">
                              {errores.marca}
                            </div>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Modelo</label>
                          <input
                            type="text"
                            name="modelo"
                            className="form-control"
                            value={producto.modelo}
                            onChange={handleChange}
                            placeholder="Ej: Galaxy S23"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">
                            Código arancelario
                          </label>
                          <input
                            type="text"
                            name="codigoUNSPSC"
                            className={`form-control ${errores.codigoUNSPSC ? "is-invalid" : ""}`}
                            value={producto.codigoUNSPSC}
                            onChange={handleChange}
                            placeholder="8 dígitos DIAN"
                            maxLength="8"
                          />
                          {errores.codigoUNSPSC && (
                            <div className="invalid-feedback">
                              {errores.codigoUNSPSC}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock */}
                      <h6 className="section-title mt-3">Stock</h6>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label className="form-label">
                            Cantidad Disponible *
                          </label>
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
                        <div className="col-md-4">
                          <label className="form-label">Cantidad Mínima</label>
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
                        <div className="col-md-4">
                          <label className="form-label">Categoría</label>
                          <input
                            type="text"
                            name="categoria"
                            className="form-control"
                            value={producto.categoria}
                            onChange={handleChange}
                            placeholder="Ej: Electrónica"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── TAB FOTOS (solo producto) ── */}
              {tabActiva === "fotos" && !producto.esServicio && (
                <div className="fotos-upload-area">
                  <div className="fotos-dropzone">
                    <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>
                    <p className="mt-2 text-muted">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="fotos-input"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mt-2"
                    >
                      Seleccionar imágenes
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* ── Lista de precios ── */}
            <h6 className="section-title-producto-primary">
              Lista de precios
            </h6>

            <div className="lista-precios-card">
              <div className="lista-precios-tab-header">
                <span className="lista-precios-tab-activo">
                  Moneda local (COP)
                </span>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Precio de venta * (
                    {producto.esServicio ? "Servicio" : "Producto"})
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
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
                    <span className="input-group-text">COP</span>
                    {errores.precioUnitario && (
                      <div className="invalid-feedback">
                        {errores.precioUnitario}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Costo de adquisición</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      name="costo"
                      className={`form-control ${errores.costo ? "is-invalid" : ""}`}
                      value={producto.costo}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                    <span className="input-group-text">COP</span>
                    {errores.costo && (
                      <div className="invalid-feedback">{errores.costo}</div>
                    )}
                  </div>
                </div>

                {/* Margen calculado automáticamente */}
                {producto.precioUnitario && producto.costo && (
                  <div className="col-md-4">
                    <label className="form-label">Margen de ganancia</label>
                    <div className="margen-display">
                      {(() => {
                        const precio = parseFloat(producto.precioUnitario);
                        const costo = parseFloat(producto.costo);
                        if (precio > 0 && costo >= 0) {
                          const margen = (
                            ((precio - costo) / precio) *
                            100
                          ).toFixed(1);
                          const ganancia = (precio - costo).toLocaleString(
                            "es-CO",
                          );
                          return (
                            <>
                              <span
                                className={`margen-porcentaje ${parseFloat(margen) >= 0 ? "margen-positivo" : "margen-negativo"}`}
                              >
                                {margen}%
                              </span>
                              <span className="margen-valor text-muted">
                                {" "}
                                (${ganancia} COP)
                              </span>
                            </>
                          );
                        }
                        return <span className="text-muted">—</span>;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="incluyeIVA"
                  name="incluyeIVA"
                  checked={producto.incluyeIVA || false}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="incluyeIVA">
                  Incluir IVA en el precio de venta
                </label>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="page-crear-footer">
              <div className="footer-acciones">
                {/* Botón izquierda */}
                <button
                  type="button"
                  className="btn btn-footer-secundario"
                  disabled={guardando}
                  onClick={()=> navigate("/productos/importar-excel")}
                >
                  Importar desde Excel
                </button>

                {/* Grupo botón guardar + dropdown */}
                <div className="btn-group position-relative">
                  {/* ✅ Botón principal GUARDAR */}
                  <button
                    type="button"
                    className="btn btn-footer-primario"
                    disabled={guardando}
                    onClick={async () => {
                      console.log("Estado producto:", producto);
                      console.log("Validación OK?", validarFormulario());
                      console.log("Errores:", errores);
                      if (!validarFormulario()) return;
                      await handleSubmitBase(false);
                    }}
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : productoEditando ? (
                      `Actualizar ${producto.esServicio ? "Servicio" : "Producto"}`
                    ) : (
                      "Guardar"
                    )}
                  </button>

                  {/* ✅ Dropdown solo en modo crear */}
                  {!productoEditando && (
                    <>
                      <button
                        type="button"
                        className="btn btn-footer-primario btn-footer-dropdown-toggle"
                        onClick={() => setDropdownAbierto(!dropdownAbierto)}
                        disabled={guardando}
                      >
                        ▾
                      </button>

                      {dropdownAbierto && (
                        <>
                          {/* Backdrop cierra al click fuera */}
                          <div
                            className="dropdown-backdrop"
                            onClick={() => setDropdownAbierto(false)}
                          />

                          {/* Dropdown con las dos opciones */}
                          <ul className="dropdown-menu dropdown-menu-end show">
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={async () => {
                                  setDropdownAbierto(false);
                                  if (!validarFormulario()) return;
                                  await handleSubmitBase(false); // ← Guardar normal
                                }}
                              >
                                Guardar
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={async () => {
                                  setDropdownAbierto(false);
                                  if (!validarFormulario()) return;
                                  await handleSubmitBase(true); // ← Guardar y nuevo
                                }}
                              >
                                Guardar y crear nuevo
                              </button>
                            </li>
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoProducto_Servicio
