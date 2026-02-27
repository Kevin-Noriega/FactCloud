import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../api/config";
import Select from "react-select";
import unidadesMedidaDIAN from "../../utils/UnidadesMedidas.json";
import tipoProductoDIAN from "../../utils/TiposProducto.json";
import "../../styles/CrearProductoPage.css";

function CrearProductoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const productoEditando = location.state?.productoEditando || null;

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
      nuevosErrores.baseGravable =
        "La base gravable es obligatoria y debe ser mayor a 0";
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
    if (!producto.codigoUNSPSC || producto.codigoUNSPSC.trim() === "") {
      nuevosErrores.codigoUNSPSC =
        "El código UNSPSC es obligatorio para facturación electrónica";
    } else if (!/^\d{8}$/.test(producto.codigoUNSPSC)) {
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
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({ ...producto, [name]: type === "checkbox" ? checked : value });
    if (errores[name]) setErrores({ ...errores, [name]: null });
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
    if (!validarFormulario()) return;
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
        cantidadDisponible: producto.esServicio
          ? null
          : parseInt(producto.cantidadDisponible),
        cantidadMinima: producto.esServicio
          ? 0
          : parseInt(producto.cantidadMinima),
        categoria: producto.categoria.trim(),
        codigoBarras: producto.esServicio ? null : producto.codigoBarras.trim(),
        tipoProducto: producto.tipoProducto,
        baseGravable: parseFloat(producto.baseGravable),
        retencionFuente: producto.retencionFuente
          ? parseFloat(producto.retencionFuente)
          : 0,
        retencionIVA: producto.retencionIVA
          ? parseFloat(producto.retencionIVA)
          : 0,
        retencionICA: producto.retencionICA
          ? parseFloat(producto.retencionICA)
          : 0,
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
      // Redirige de vuelta a productos con mensaje de éxito
      navigate("/productos", {
        state: {
          mensaje: productoEditando
            ? `${producto.esServicio ? "Servicio" : "Producto"} modificado con éxito.`
            : `${producto.esServicio ? "Servicio" : "Producto"} agregado con éxito.`,
        },
      });
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="crear-producto-page">
      {/* Header de página */}
      <div className="header-card mb-4">
        <div className="header-content">
          <div className="header-text">
            <h2 className="header-title mb-4">
              {productoEditando
                ? `Editar ${producto.esServicio ? "Servicio" : "Producto"}`
                : `Nuevo ${producto.esServicio ? "Servicio" : "Producto"}`}
            </h2>
            <p className="header-subtitle">
              {productoEditando
                ? "Modifica los datos del producto o servicio."
                : "Completa el formulario para agregar un nuevo producto o servicio."}
            </p>
          </div>
          <div className="header-icon">
            <BoxSeam size={80} />
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="page-card">
        <form onSubmit={handleSubmit}>
          {/* Selector Producto / Servicio */}
          <div className="tipo-selector mb-4">
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

          {/* Secciones del formulario — idénticas al modal original */}
          {/* ... (mismo JSX del modal desde "Información Básica" hasta "Inventario") ... */}

          {/* Footer con botones */}
          <div className="page-footer-btns d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/productos")}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-purple-header"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Guardando...
                </>
              ) : productoEditando ? (
                `Actualizar ${producto.esServicio ? "Servicio" : "Producto"}`
              ) : (
                `Guardar ${producto.esServicio ? "Servicio" : "Producto"}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearProductoPage;
