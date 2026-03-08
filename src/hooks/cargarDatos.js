import { API_URL } from "../api/config";

export const cargarClientes = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/clientes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setClientesCount(data.length);
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
};
export const cargarProductos = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/productos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProductosCount(data.length);
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
};
export const cargarFacturas = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/facturas`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setFacturasCount(data.length);

    const pendientes = data.filter(
      (f) => f.estado === "Pendiente" || f.estado === "Emitida"
    ).length;

    setFacturasPendientes(pendientes);

    const total = data.reduce(
      (sum, f) => sum + f.totalFactura,
      0
    );

    setTotalVentas(total);

  } catch (error) {
    console.error("Error cargando facturas:", error);
  }
};