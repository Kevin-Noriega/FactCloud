import { MdOutlineMobileFriendly } from "react-icons/md";

  const Obligados = [
    {
      categoria: "Grandes contribuyentes",
      descripcion:
        "Todas las personas jurídicas y naturales calificadas como grandes contribuyentes",
      plazo: "Obligatorio desde 2019",
      estado: "activo",
    },
    {
      categoria: "Personas jurídicas > $100M/año",
      descripcion:
        "Empresas con ingresos anuales superiores a 100 millones de pesos",
      plazo: "Obligatorio desde 2022",
      estado: "activo",
    },
    {
      categoria: "Personas jurídicas < $100M/año",
      descripcion: "Pequeñas y medianas empresas según cronograma por NIT",
      plazo: "2024-2025 según últimos dígitos NIT",
      estado: "progresivo",
    },
    {
      categoria: "Personas naturales comerciantes",
      descripcion: "Comerciantes inscritos en Cámara de Comercio",
      plazo: "2025-2026 según ingresos",
      estado: "progresivo",
    },
    {
      categoria: "Obligados voluntarios",
      descripcion:
        "Cualquier contribuyente puede implementarlo anticipadamente",
      plazo: "Inmediato (sin restricciones)",
      estado: "voluntario",
    },
  ];
export default Obligados;
