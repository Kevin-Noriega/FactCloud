import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgregarProducto from "../components/AgregarProducto";

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const API_URL = "http://localhost:5119/api/Productos";

  // 🔹 Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los productos");
        const data = await response.json();
        console.log("📦 Productos obtenidos:", data);
        setProductos(data);
      } catch (error) {
        console.error("❌ Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // 🔹 Formato de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // 🔹 Acciones de botones
  const handleAction = (id, action) => {
    console.log(`Acción: ${action} → Producto ID: ${id}`);
    if (action === "Detalle") navigate(`/productos/${id}`);
    if (action === "Editar") navigate(`/editar-producto/${id}`);
    if (action === "Eliminar") {
      if (window.confirm("¿Deseas eliminar este producto?")) {
        console.log("Producto eliminado:", id);
        // Aquí puedes agregar la petición DELETE
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p>Cargando Productos...</p>
      </div>
    );
  }

  return (
    <div className="productos-page">
      <h2 className="mb-4 text-success border-bottom pb-2">
        Inventario de Productos
      </h2>

      <div className="mb-4">
        <button
          className="btn btn-success shadow-sm mb-3"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cerrar Formulario" : "Nuevo Producto"}
        </button>

        {mostrarFormulario && (
          <AgregarProducto onSuccess={() => window.location.reload()} />
        )}
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio Unitario</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>{producto.idProducto}</td>
                    <td className="fw-medium">{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>{producto.cantidadDisponible} uds</td>
                    <td className="fw-bold text-success">
                      {formatCurrency(producto.precioUnitario)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleAction(producto.idProducto, "Detalle")}
                      >
                        Ver Detalle
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2 text-white"
                        onClick={() => handleAction(producto.idProducto, "Editar")}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleAction(producto.idProducto, "Eliminar")}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Productos;
