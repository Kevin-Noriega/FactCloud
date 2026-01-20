  const Documentos = [
    {
      tipo: "Factura de venta",
      codigo: "01",
      descripcion: "Documento principal de venta con validación DIAN",
      uso: "Todas las ventas gravadas y exentas",
    },
    {
      tipo: "Nota crédito",
      codigo: "91",
      descripcion: "Anula o ajusta total/parcialmente una factura",
      uso: "Devoluciones, descuentos, correcciones",
    },
    {
      tipo: "Nota débito",
      codigo: "92",
      descripcion: "Incrementa el valor de una factura emitida",
      uso: "Intereses, gastos adicionales",
    },
    {
      tipo: "Factura de exportación",
      codigo: "02",
      descripcion: "Factura para ventas al exterior",
      uso: "Exportación de bienes y servicios",
    },
    {
      tipo: "Documento soporte",
      codigo: "05",
      descripcion: "Soporte de adquisiciones a no obligados",
      uso: "Compras a personas naturales no obligadas",
    },
    {
      tipo: "Documento equivalente",
      codigo: "04",
      descripcion: "Documentos que sustituyen la factura",
      uso: "Tiquetes, boletas, comprobantes",
    },
  ];
export default Documentos;