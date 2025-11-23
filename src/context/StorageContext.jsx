import React, { createContext, useState, useEffect, useContext } from "react";

// Crear contexto
// eslint-disable-next-line react-refresh/only-export-components
export const StorageContext = createContext();

// Provider
export const StorageProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    setClientes([
      { id: 1, nombre: "Juan Pérez", correo: "juan@gmail.com" },
      { id: 2, nombre: "Ana Torres", correo: "ana@gmail.com" },
    ]);
    setProductos([
      { id: 1, nombre: "Laptop HP", stock: 10, precio: 2500000 },
      { id: 2, nombre: "Mouse Logitech", stock: 4, precio: 80000 },
    ]);
    setFacturas([
      { id: 1, cliente_id: 1, total: 2580000, fecha: "2025-10-10", estado: "Pagada" },
      { id: 2, cliente_id: 2, total: 250000, fecha: "2025-10-11", estado: "Pendiente" },
    ]);
  }, []);

  const formatCOP = (value) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP" });

  return (
    <StorageContext.Provider value={{ clientes, productos, facturas, formatCOP }}>
      {children}
    </StorageContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage debe usarse dentro de un StorageProvider");
  }
  return context;
};

export default StorageContext;
