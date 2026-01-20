 const Especificaciones = [
    {
      componente: "Formato XML",
      especificacion: "UBL 2.1 (Universal Business Language)",
      detalle: "Estándar internacional ISO/IEC 19845",
    },
    {
      componente: "Firma digital",
      especificacion: "XMLDSig con algoritmo SHA-256",
      detalle: "Certificado X.509 emitido por AC autorizada",
    },
    {
      componente: "CUFE",
      especificacion: "Código Único de Factura Electrónica",
      detalle: "Hash SHA-384 de campos específicos",
    },
    {
      componente: "QR Code",
      especificacion: "Enlace a validación DIAN",
      detalle: "URL + CUFE para verificación pública",
    },
    {
      componente: "Transmisión",
      especificacion: "Web Service SOAP o API REST",
      detalle: "TLS 1.2+ con autenticación mutua",
    },
    {
      componente: "Tiempo de respuesta",
      especificacion: "Validación sincrónica < 3 segundos",
      detalle: "Asincrónica con notificación posterior",
    },
  ];
export default Especificaciones;