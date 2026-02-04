import React, { useState, useEffect } from "react";
import { API_URL } from "../api/config";
import Select from "react-select";
import unidadesMedidaDIAN from "../utils/UnidadesMedidas.json";
import tipoProductoDIAN from "../utils/TiposProducto.json";
import "../styles/ModalCrearProducto.css";

function ModalCrearProducto({ productoEditando, onClose, onGuardadoExitoso }) {
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
        estado: typeof productoEditando.estado === "boolean" ? productoEditando.estado : true,
        tipoProducto: productoEditando.tipoProducto || "",
        baseGravable: productoEditando.baseGravable || "",
        retencionFuente: productoEditando.retencionFuente || "",
        retencionIVA: productoEditando.retencionIVA || "",
        retencionICA: productoEditando.retencionICA || "",
      });
    }
  }, [productoEditando]);

  const baseGravable = producto.baseGravable ? parseFloat(producto.baseGravable) : 0;
  const porcentajeFuente = producto.retencionFuente ? parseFloat(producto.retencionFuente) : 0;
  const porcentajeIVA = producto.retencionIVA ? parseFloat(producto.retencionIVA) : 0;
  const porcentajeICA = producto.retencionICA ? parseFloat(producto.retencionICA) : 0;

  const valorRetencionFuente = +((baseGravable * porcentajeFuente) / 100).toFixed(2);
  const valorRetencionIVA = +((baseGravable * porcentajeIVA) / 100).toFixed(2);
  const valorRetencionICA = +((baseGravable * porcentajeICA) / 100).toFixed(2);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!producto.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (producto.nombre.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!producto.tipoProducto) {
      nuevosErrores.tipoProducto = "Debe seleccionar un tipo de producto";
    }

    if (!producto.precioUnitario || parseFloat(producto.precioUnitario) <= 0) {
      nuevosErrores.precioUnitario = "El precio debe ser mayor a 0";
    }

    if (!producto.baseGravable || parseFloat(producto.baseGravable) <= 0) {
      nuevosErrores.baseGravable = "La base gravable es obligatoria y debe ser mayor a 0";
    }

    if (producto.costo && parseFloat(producto.costo) > parseFloat(producto.precioUnitario)) {
      nuevosErrores.costo = "El costo no puede ser mayor al precio de venta";
    }

    if (!producto.esServicio) {
      if (!producto.cantidadDisponible || parseInt(producto.cantidadDisponible) < 0) {
        nuevosErrores.cantidadDisponible = "La cantidad disponible es obligatoria para productos";
      }

      if (!producto.codigoBarras || producto.codigoBarras.trim() === "") {
        nuevosErrores.codigoBarras = "El código de barras es obligatorio para productos";
      } else if (producto.codigoBarras.length < 8) {
        nuevosErrores.codigoBarras = "El código de barras debe tener al menos 8 caracteres";
      }

      if (!producto.marca || producto.marca.trim() === "") {
        nuevosErrores.marca = "La marca es obligatoria para productos";
      }
    }

    if (producto.esServicio) {
      if (!producto.descripcion || producto.descripcion.trim() === "") {
        nuevosErrores.descripcion = "La descripción es obligatoria para servicios";
      } else if (producto.descripcion.length < 10) {
        nuevosErrores.descripcion = "La descripción debe tener al menos 10 caracteres";
      }
    }

    if (!producto.codigoUNSPSC || producto.codigoUNSPSC.trim() === "") {
      nuevosErrores.codigoUNSPSC = "El código UNSPSC es obligatorio para facturación electrónica";
    } else if (!/^\d{8}$/.test(producto.codigoUNSPSC)) {
      nuevosErrores.codigoUNSPSC = "El código UNSPSC debe tener exactamente 8 dígitos";
    }

    if (producto.productoExcluido && producto.productoExento) {
      nuevosErrores.impuestos = "Un producto no puede ser excluido y exento al mismo tiempo";
    }

    if (producto.gravaINC && (!producto.tarifaINC || parseFloat(producto.tarifaINC) <= 0)) {
      nuevosErrores.tarifaINC = "Debe especificar la tarifa INC";
    }

    if (producto.retencionFuente && (parseFloat(producto.retencionFuente) < 0 || parseFloat(producto.retencionFuente) > 100)) {
      nuevosErrores.retencionFuente = "La retención debe estar entre 0 y 100%";
    }

    if (producto.retencionIVA && (parseFloat(producto.retencionIVA) < 0 || parseFloat(producto.retencionIVA) > 100)) {
      nuevosErrores.retencionIVA = "La retención debe estar entre 0 y 100%";
    }

    if (producto.retencionICA && (parseFloat(producto.retencionICA) < 0 || parseFloat(producto.retencionICA) > 100)) {
      nuevosErrores.retencionICA = "La retención debe estar entre 0 y 100%";
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
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        setGuardando(false);
        return;
      }

      const payload = {
        ...(productoEditando && { id: productoEditando.id }),
        esServicio: producto.esServicio,
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion.trim(),
        codigoInterno: producto.codigoInterno.trim(),
        codigoUNSPSC: producto.codigoUNSPSC.trim(),
        unidadMedida: producto.unidadMedida,
        marca: producto.esServicio ? null : producto.marca.trim(),
        modelo: producto.esServicio ? null : producto.modelo.trim(),
        precioUnitario: parseFloat(producto.precioUnitario),
        costo: producto.costo ? parseFloat(producto.costo) : null,
        tipoImpuesto: producto.tipoImpuesto,
        tarifaIVA: parseFloat(producto.tarifaIVA),
        productoExcluido: producto.productoExcluido,
        productoExento: producto.productoExento,
        gravaINC: producto.gravaINC,
        tarifaINC: producto.gravaINC ? parseFloat(producto.tarifaINC) : null,
        cantidadDisponible: producto.esServicio ? null : parseInt(producto.cantidadDisponible),
        cantidadMinima: producto.esServicio ? 0 : parseInt(producto.cantidadMinima),
        categoria: producto.categoria.trim(),
        codigoBarras: producto.esServicio ? null : producto.codigoBarras.trim(),
        tipoProducto: producto.tipoProducto,
        baseGravable: parseFloat(producto.baseGravable),
        retencionFuente: producto.retencionFuente ? parseFloat(producto.retencionFuente) : 0,
        retencionIVA: producto.retencionIVA ? parseFloat(producto.retencionIVA) : 0,
        retencionICA: producto.retencionICA ? parseFloat(producto.retencionICA) : 0,
        estado: producto.estado,
        usuarioId: usuarioGuardado.id,
      };

      const token = localStorage.getItem("token");
      const url = productoEditando
        ? `${API_URL}/Productos/${productoEditando.id}`
        : `${API_URL}/Productos`;
      const method = productoEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto);
      }

      const mensaje = productoEditando
        ? `${producto.esServicio ? 'Servicio' : 'Producto'} modificado con éxito.`
        : `${producto.esServicio ? 'Servicio' : 'Producto'} agregado con éxito.`;
      onGuardadoExitoso(mensaje);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-crearNuevo-overlay" onClick={onClose}>
      <div className="modal-crearNuevo-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-crearNuevo-header">
          <h5>
            {productoEditando
              ? `Editar ${producto.esServicio ? 'Servicio' : 'Producto'}`
              : `Nuevo ${producto.esServicio ? 'Servicio' : 'Producto'}`}
          </h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="modal-crearNuevo-body">
          <form onSubmit={handleSubmit}>
            <div className="tipo-selector">
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

            <h6 className="section-title-producto-producto">Información Básica</h6>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">
                  Nombre del {producto.esServicio ? 'Servicio' : 'Producto'} *
                </label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  value={producto.nombre}
                  onChange={handleChange}
                  placeholder={producto.esServicio ? "Ej: Consultoría legal" : "Ej: Laptop HP"}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Descripción {producto.esServicio ? '*' : ''}
                </label>
                <input
                  type="text"
                  name="descripcion"
                  className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                  value={producto.descripcion}
                  onChange={handleChange}
                  placeholder={producto.esServicio ? "Describe el servicio en detalle" : "Opcional"}
                />
                {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Tipo Producto/Servicio *</label>
                <Select
                  name="tipoProducto"
                  options={tipoProductoDIAN.map((um) => ({
                    value: um.descripcion,
                    label: `${um.codigo} - ${um.descripcion}`,
                  }))}
                  value={
                    producto.tipoProducto
                      ? tipoProductoDIAN
                          .map((um) => ({
                            value: um.descripcion,
                            label: `${um.codigo} - ${um.descripcion}`,
                          }))
                          .find((opt) => opt.value === producto.tipoProducto)
                      : null
                  }
                  onChange={(opt) => {
                    setProducto((prev) => ({
                      ...prev,
                      tipoProducto: opt ? opt.value : "",
                    }));
                    if (errores.tipoProducto) {
                      setErrores({ ...errores, tipoProducto: null });
                    }
                  }}
                  isClearable
                  placeholder="Seleccionar tipo"
                  className={errores.tipoProducto ? 'is-invalid' : ''}
                />
                {errores.tipoProducto && <div className="invalid-feedback d-block">{errores.tipoProducto}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Código Interno</label>
                <input
                  type="text"
                  name="codigoInterno"
                  className="form-control"
                  value={producto.codigoInterno}
                  onChange={handleChange}
                  placeholder="SKU o código interno"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Código UNSPSC * (DIAN)</label>
                <input
                  type="text"
                  name="codigoUNSPSC"
                  className={`form-control ${errores.codigoUNSPSC ? 'is-invalid' : ''}`}
                  value={producto.codigoUNSPSC}
                  onChange={handleChange}
                  placeholder="8 dígitos"
                  maxLength="8"
                />
                {errores.codigoUNSPSC && <div className="invalid-feedback">{errores.codigoUNSPSC}</div>}
              </div>
              {!producto.esServicio && (
                <div className="col-md-4">
                  <label className="form-label">Código EAN/Barras *</label>
                  <input
                    type="text"
                    name="codigoBarras"
                    className={`form-control ${errores.codigoBarras ? 'is-invalid' : ''}`}
                    value={producto.codigoBarras}
                    onChange={handleChange}
                    placeholder="EAN-13 o código de barras"
                  />
                  {errores.codigoBarras && <div className="invalid-feedback">{errores.codigoBarras}</div>}
                </div>
              )}
            </div>

            {!producto.esServicio && (
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    className={`form-control ${errores.marca ? 'is-invalid' : ''}`}
                    value={producto.marca}
                    onChange={handleChange}
                    placeholder="Ej: Samsung"
                  />
                  {errores.marca && <div className="invalid-feedback">{errores.marca}</div>}
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
            )}

            {producto.esServicio && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Categoría del Servicio</label>
                  <input
                    type="text"
                    name="categoria"
                    className="form-control"
                    value={producto.categoria}
                    onChange={handleChange}
                    placeholder="Ej: Consultoría, Mantenimiento, etc."
                  />
                </div>
              </div>
            )}

            <h6 className="section-title-producto-producto">Base Gravable y Retenciones</h6>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Base Gravable *</label>
                <input
                  type="number"
                  name="baseGravable"
                  className={`form-control ${errores.baseGravable ? 'is-invalid' : ''}`}
                  value={producto.baseGravable}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Ej: 100000"
                />
                {errores.baseGravable && <div className="invalid-feedback">{errores.baseGravable}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label">Retención Fuente (%)</label>
                <input
                  type="number"
                  name="retencionFuente"
                  className={`form-control ${errores.retencionFuente ? 'is-invalid' : ''}`}
                  value={producto.retencionFuente}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ej: 2.5"
                />
                {errores.retencionFuente && <div className="invalid-feedback">{errores.retencionFuente}</div>}
                <small className="text-muted">
                  Valor: ${valorRetencionFuente.toLocaleString("es-CO")}
                </small>
              </div>
              <div className="col-md-3">
                <label className="form-label">Retención IVA (%)</label>
                <input
                  type="number"
                  name="retencionIVA"
                  className={`form-control ${errores.retencionIVA ? 'is-invalid' : ''}`}
                  value={producto.retencionIVA}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ej: 15"
                />
                {errores.retencionIVA && <div className="invalid-feedback">{errores.retencionIVA}</div>}
                <small className="text-muted">
                  Valor: ${valorRetencionIVA.toLocaleString("es-CO")}
                </small>
              </div>
              <div className="col-md-3">
                <label className="form-label">Retención ICA (%)</label>
                <input
                  type="number"
                  name="retencionICA"
                  className={`form-control ${errores.retencionICA ? 'is-invalid' : ''}`}
                  value={producto.retencionICA}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ej: 6.9"
                />
                {errores.retencionICA && <div className="invalid-feedback">{errores.retencionICA}</div>}
                <small className="text-muted">
                  Valor: ${valorRetencionICA.toLocaleString("es-CO")}
                </small>
              </div>
            </div>

            <h6 className="section-title-producto-producto">Unidad y Precios</h6>
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
              <div className="col-md-4">
                <label className="form-label">Precio Unitario *</label>
                <input
                  type="number"
                  name="precioUnitario"
                  className={`form-control ${errores.precioUnitario ? 'is-invalid' : ''}`}
                  value={producto.precioUnitario}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Precio de venta"
                />
                {errores.precioUnitario && <div className="invalid-feedback">{errores.precioUnitario}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  name="costo"
                  className={`form-control ${errores.costo ? 'is-invalid' : ''}`}
                  value={producto.costo}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Costo de adquisición"
                />
                {errores.costo && <div className="invalid-feedback">{errores.costo}</div>}
              </div>
            </div>

            <h6 className="section-title-producto-producto">Impuestos - Configuración DIAN</h6>
            {errores.impuestos && (
              <div className="alert alert-danger py-2">{errores.impuestos}</div>
            )}
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Tipo de Impuesto</label>
                <select
                  name="tipoImpuesto"
                  className="form-select"
                  value={producto.tipoImpuesto}
                  onChange={handleChange}
                >
                  <option value="IVA">IVA</option>
                  <option value="INC">INC</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Tarifa IVA (%)</label>
                <select
                  name="tarifaIVA"
                  className="form-select"
                  value={producto.tarifaIVA}
                  onChange={handleChange}
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="19">19%</option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    name="productoExcluido"
                    className="form-check-input"
                    checked={producto.productoExcluido}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Producto Excluido</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    name="productoExento"
                    className="form-check-input"
                    checked={producto.productoExento}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Producto Exento</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="gravaINC"
                    className="form-check-input"
                    checked={producto.gravaINC}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Grava Impuesto al Consumo (INC)</label>
                </div>
              </div>
              {producto.gravaINC && (
                <div className="col-md-4">
                  <label className="form-label">Tarifa INC (%) *</label>
                  <input
                    type="number"
                    name="tarifaINC"
                    className={`form-control ${errores.tarifaINC ? 'is-invalid' : ''}`}
                    value={producto.tarifaINC}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                  />
                  {errores.tarifaINC && <div className="invalid-feedback">{errores.tarifaINC}</div>}
                </div>
              )}
            </div>

            {!producto.esServicio && (
              <>
                <h6 className="section-title-producto">Inventario</h6>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Cantidad Disponible *</label>
                    <input
                      type="number"
                      name="cantidadDisponible"
                      className={`form-control ${errores.cantidadDisponible ? 'is-invalid' : ''}`}
                      value={producto.cantidadDisponible}
                      onChange={handleChange}
                      min="0"
                      placeholder="Stock actual"
                    />
                    {errores.cantidadDisponible && <div className="invalid-feedback">{errores.cantidadDisponible}</div>}
                  </div>
                  <div className="col-md-6">
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
                </div>
              </>
            )}

            <div className="modal-producto-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success" disabled={guardando}>
                {guardando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  productoEditando ? `Actualizar ${producto.esServicio ? 'Servicio' : 'Producto'}` : `Guardar ${producto.esServicio ? 'Servicio' : 'Producto'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearProducto;
