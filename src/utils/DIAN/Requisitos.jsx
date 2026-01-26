import {
  ListCheck,
  ShieldLock,
  ClipboardCheck,
  ShieldCheck,
  Laptop
} from "react-bootstrap-icons";

const Requisitos = [
  {
    titulo: "Inscripción RUT actualizado",
    descripcion:
      "Registro Único Tributario debe incluir responsabilidad 49 (facturador electrónico)",
    pasos: [
      "Ingresar a portal DIAN con firma electrónica o usuario",
      "Actualizar RUT agregando responsabilidad 49",
      "Descargar PDF actualizado con sello digital",
      "Tiempo estimado: 15 minutos",
    ],
    icono: <ListCheck size={50} />
  },
  {
    titulo: "Certificado digital de firma",
    descripcion:
      "Firma electrónica emitida por entidad certificadora autorizada por la DIAN",
    pasos: [
      "Solicitar certificado a Certicámara, GSE, Andes SCD o similar",
      "Presentar documentos (RUT, Cédula, Cámara de Comercio)",
      "Pagar valor anual (~$150.000 - $250.000)",
      "Recibir archivo .pfx con contraseña en 1-3 días hábiles",
    ],
    icono: <ShieldLock size={50} />
  },
  {
    titulo: "Habilitación ante DIAN",
    descripcion: "Registro como facturador electrónico en plataforma DIAN",
    pasos: [
      "Ingresar al portal DIAN > Facturación electrónica",
      "Crear set de pruebas y enviar facturas de testing",
      "DIAN valida conformidad técnica (5-10 facturas)",
      "Solicitar habilitación en producción",
    ],
    icono: <ClipboardCheck size={50} />
  },
  {
    titulo: "Resolución de facturación",
    descripcion: "Autorización oficial con prefijo, numeración y vigencia",
    pasos: [
      "Solicitar resolución en portal DIAN tras habilitación",
      "Definir prefijo (ej: FACT, FE, etc.)",
      "Asignar rango numérico (ej: del 1 al 5000)",
      "Descargar resolución PDF con fecha de vigencia",
    ],
    icono: <ShieldCheck size={50} />
  },
  {
    titulo: "Software validado",
    descripcion:
      "Sistema que genere XML según estándar UBL 2.1 y anexo técnico vigente",
    pasos: [
      "Usar software certificado como FactCloud",
      "O desarrollar propia solución siguiendo especificaciones",
      "Validar generación correcta de XML y firma digital",
      "Probar envío y recepción de respuestas DIAN",
    ],
    icono: <Laptop size={50} />
  }
];

export default Requisitos;
