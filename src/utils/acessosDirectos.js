
 export const quickActions = [
  {
    title: "Crea una Factura Electrónica",
    icon: "FileEarmarkText",
    route: "/nueva-factura",
  },
  {
    title: "Crear Documento Soporte",
    icon: "FileCheck",
    route: "/nuevo-documento-soporte",
  },
  {
    title: "Agregar Tercero",
    icon: "PersonPlus",
    route: "/nuevo-cliente",
  },
  {
    title: "Habilitación DIAN",
    icon: "ShieldCheck",
    route: "/habilitacion-dian",
  },
  {
    title: "Tienda Nubee",
    icon: "Cart",
    route: "/tienda",
  },
   {
    title: "Entrar al POS",
    icon: "Cart4",
    route: "/pos-login",
    onlyIfPos: true,
  },
];

