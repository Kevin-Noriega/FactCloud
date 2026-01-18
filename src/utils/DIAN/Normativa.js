const Normativa = [
    {
      resolucion: "Resolución 000165 de 2023",
      fecha: "Noviembre 2023",
      tema: "Sistema técnico de control - Anexo técnico 1.9",
      contenido: [
        "Actualiza estándar de factura electrónica a UBL 2.1",
        "Define nuevos campos obligatorios y opcionales",
        "Establece reglas de validación XML Schema",
        "Implementa nuevos códigos de respuesta DIAN",
      ],
      impacto: "Alto - Todos los facturadores deben actualizar sistemas",
    },
    {
      resolucion: "Resolución 000042 de 2020",
      fecha: "Mayo 2020",
      tema: "Calendario de obligatoriedad progresiva",
      contenido: [
        "Amplía universo de obligados a facturar electrónicamente",
        "Define cronograma según ingresos y tipo de persona",
        "Establece sanciones por incumplimiento",
        "Permite facturación voluntaria anticipada",
      ],
      impacto: "Crítico - Define quiénes y cuándo deben implementar",
    },
    {
      resolucion: "Resolución 000020 de 2019",
      fecha: "Marzo 2019",
      tema: "Documento soporte en adquisiciones",
      contenido: [
        "Crea figura de documento soporte para compras",
        "Aplica cuando proveedor no está obligado a facturar",
        "Define estructura XML y campos requeridos",
        "Establece procedimiento de validación",
      ],
      impacto: "Medio - Afecta compras a no obligados",
    },
    {
      resolucion: "Decreto 358 de 2020",
      fecha: "Marzo 2020",
      tema: "Transmisión electrónica y validación previa",
      contenido: [
        "Reglamenta proceso de transmisión a DIAN",
        "Define tiempos máximos de respuesta (validación)",
        "Establece códigos de respuesta estándar",
        "Determina contingencias y procedimientos de respaldo",
      ],
      impacto: "Alto - Define operación técnica del sistema",
    },
  ];
  export default Normativa;