
export const Impuestos = [

  // IVA - Impuesto sobre las Ventas
  {
    codigo: "01",
    nombre: "IVA",
    descripcion: "Impuesto sobre las Ventas",
    tarifas: [
      {
        codigoTarifa: "19",
        nombre: "IVA General",
        porcentaje: 19
      },
      {
        codigoTarifa: "05",
        nombre: "IVA Reducido",
        porcentaje: 5
      },
      {
        codigoTarifa: "00",
        nombre: "IVA Exento",
        porcentaje: 0
      }
    ]
  },

  // INC - Impuesto Nacional al Consumo
  {
    codigo: "02",
    nombre: "INC",
    descripcion: "Impuesto Nacional al Consumo",
    tarifas: [
      {
        codigoTarifa: "08",
        nombre: "INC General",
        porcentaje: 8
      },
      {
        codigoTarifa: "04",
        nombre: "INC Restaurantes",
        porcentaje: 4
      },
      {
        codigoTarifa: "00",
        nombre: "INC Exento",
        porcentaje: 0
      }
    ]
  },

  // ICA - Impuesto de Industria y Comercio
  {
    codigo: "03",
    nombre: "ICA",
    descripcion: "Impuesto de Industria y Comercio",
    tarifas: [
      {
        codigoTarifa: "0.966",
        nombre: "ICA Promedio",
        porcentaje: 0.966
      },
      {
        codigoTarifa: "0.414",
        nombre: "ICA Reducido",
        porcentaje: 0.414
      }
    ]
  },

  // Retención en la fuente
  {
    codigo: "04",
    nombre: "ReteFuente",
    descripcion: "Retención en la fuente",
    tarifas: [
      {
        codigoTarifa: "2.5",
        nombre: "Servicios",
        porcentaje: 2.5
      },
      {
        codigoTarifa: "3.5",
        nombre: "Compras",
        porcentaje: 3.5
      },
      {
        codigoTarifa: "11",
        nombre: "Honorarios",
        porcentaje: 11
      }
    ]
  },

  // Retención IVA
  {
    codigo: "05",
    nombre: "ReteIVA",
    descripcion: "Retención sobre IVA",
    tarifas: [
      {
        codigoTarifa: "15",
        nombre: "Retención IVA 15%",
        porcentaje: 15
      }
    ]
  }

];