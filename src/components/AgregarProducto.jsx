import React, { useState } from "react";

function AgregarProducto({ onSuccess }) {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    categoria: "",
    codigoBarras: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      // 🔹 Obtener el usuario logueado desde localStorage
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        setMensaje("⚠️ No se encontró un usuario autenticado.");
        return;
      }

      // 🔹 Usar el ID real del usuario autenticado
      const usuarioId = usuarioGuardado.id_Usuario;

      const respuesta = await fetch("http://localhost:5119/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precioUnitario: parseFloat(producto.precio),
          cantidadDisponible: parseInt(producto.cantidad),
          categoria: producto.categoria,
          codigoBarras: producto.codigoBarras,
          usuarioId: usuarioId, // 🔹 Asociado al usuario logueado
        }),
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        console.error("❌ Error al registrar producto:", errorTexto);
        setMensaje("Error al registrar producto: " + errorTexto);
        return;
      }

      const data = await respuesta.json();
      console.log("✅ Producto agregado correctamente:", data);
      setMensaje("✅ Producto agregado correctamente");

      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        categoria: "",
        codigoBarras: "",
      });

      if (onSuccess) onSuccess(); // refrescar lista
    } catch (error) {
      console.error("❌ Error de conexión con la API:", error);
      setMensaje("Error de conexión con la API");
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="text-success mb-3">Agregar Nuevo Producto</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={producto.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <input
              type="text"
              name="categoria"
              className="form-control"
              value={producto.categoria}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Precio unitario</label>
            <input
              type="number"
              name="precio"
              className="form-control"
              value={producto.precio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cantidad disponible</label>
            <input
              type="number"
              name="cantidad"
              className="form-control"
              value={producto.cantidad}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            rows="2"
            value={producto.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Código de barras</label>
          <input
            type="text"
            name="codigoBarras"
            className="form-control"
            value={producto.codigoBarras}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Guardar Producto
        </button>
      </form>

      {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
    </div>
  );
}

export default AgregarProducto;
