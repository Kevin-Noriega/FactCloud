
  const SlaData = [
    {
      prioridad: "Crítica",
      tiempo: "1 hora",
      descripcion:
        "Sistema completamente inoperativo, no se pueden crear facturas",
      ejemplos: [
        "Error 500 persistente",
        "Base de datos no accesible",
        "Certificados expirados",
      ],
      color: "#dc3545",
    },
    {
      prioridad: "Alta",
      tiempo: "4 horas",
      descripcion: "Funcionalidad importante afectada, workaround disponible",
      ejemplos: [
        "Reportes no generan",
        "Envío emails intermitente",
        "API lenta",
      ],
      color: "#ff6b35",
    },
    {
      prioridad: "Normal",
      tiempo: "24 horas",
      descripcion: "Problemas menores que no impiden operación principal",
      ejemplos: [
        "Error de formato PDF",
        "Filtro no funciona",
        "Diseño roto en mobile",
      ],
      color: "#0057ff",
    },
    {
      prioridad: "Baja",
      tiempo: "48 horas",
      descripcion: "Consultas generales, sugerencias, mejoras no urgentes",
      ejemplos: [
        "Pregunta sobre funcionalidad",
        "Solicitud de feature",
        "Optimización",
      ],
      color: "#6c757d",
    },
  ];
  export default SlaData;