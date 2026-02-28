import {
  Laptop,
  Cpu,
  Cloud,
  Broadcast,
} from "react-bootstrap-icons";

const Tecnologias = [
  {
    icono: <Laptop size={40} />,
    titulo: "Frontend moderno",
    descripcion:
      "Aplicación web progresiva (PWA) con React 18, funcionamiento offline y sincronización automática.",
  },
  {
    icono: <Cpu size={40} />,
    titulo: "Backend robusto",
    descripcion:
      "API REST en ASP.NET Core 8.0 con arquitectura hexagonal y patrones enterprise.",
  },
  {
    icono: <Cloud size={40} />,
    titulo: "Infraestructura Cloud",
    descripcion:
      "Servidores distribuidos con balanceo de carga, CDN global y backups automáticos cada 6 horas.",
  },
  {
    icono: <Broadcast size={40} />,
    titulo: "Integración DIAN",
    descripcion:
      "Conexión directa con Web Services DIAN mediante protocolo SOAP con reintentos inteligentes.",
  },
];

export default Tecnologias;
