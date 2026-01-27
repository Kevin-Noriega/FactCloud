import {
  LightningCharge,
  EnvelopeAt,
  ShieldLock,
  CreditCardFill
} from "react-bootstrap-icons";

const Caracteristicas = [
  {
    icono: <LightningCharge size={30} color="white" />,
    titulo: "Emisión instantánea",
    descripcion: " Genera y envía facturas en menos de 30 segundos. PDF y XML automáticos."
  },
  {
    icono: <EnvelopeAt size={30} color="white" />,
    titulo: "Email automático",
    descripcion: " Envío directo al cliente con tu branding. Seguimiento de entregas en tiempo real."
  },
  {
    icono: <ShieldLock size={30} color="white" />,
    titulo: "DIAN certificado",
    descripcion: "Cumplimiento 100% Resolución 165. CUFE y numeración automáticos."
  },
  {
    icono: <CreditCardFill size={30} color="white" />,
    titulo: "Múltiples métodos",
    descripcion: " Efectivo, tarjetas, PSE, Nequi. Conciliación bancaria automática."
  }
];

export default Caracteristicas;
