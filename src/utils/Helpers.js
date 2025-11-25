import ciudades from "./Ciudades.json";
import tiposDocumentoDIAN  from "./TiposDocumentos.json";

export const obtenerSiglas = (codigo) => {
  const tipo = tiposDocumentoDIAN.find(t => t.codigo === codigo);
  return tipo ? tipo.sigla : codigo;
};

export const obtenerNombre = (codigo) => {
  const tipo = tiposDocumentoDIAN.find(t => t.codigo === codigo);
  return tipo ? tipo.nombre : codigo;
};

export const departamentosOptions = [
  ...new Map(
    ciudades.map(dep => [dep.codigoDepartamento, dep])
  ).values()
].map(dep => ({
  value: dep.departamento,
  label: `${dep.codigoDepartamento} - ${dep.departamento}`,
  departamentoCodigo: String(dep.codigoDepartamento)
}));

export function ciudadesOptionsPorDepartamento(departamento) {
  return ciudades
    .filter(c => c.departamento === departamento)
    .map(c => ({
      value: c.ciudad,                          // nombre (para mostrar / guardar como nombre)
      label: `${c.codigoCiudad} - ${c.ciudad}`,
      ciudadCodigo: String(c.codigoCiudad)
    }));
}
/// Convierte números hasta billones y maneja decimales
export function numeroALetras(valor) {
  if (isNaN(valor)) return "";

  const unidades = [
    "", "UNO", "DOS", "TRES", "CUATRO", "CINCO",
    "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ",
    "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE",
    "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"
  ];

  const decenas = [
    "", "", "VEINTE", "TREINTA", "CUARENTA",
    "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"
  ];

  const centenas = [
    "", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS",
    "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS",
    "OCHOCIENTOS", "NOVECIENTOS"
  ];

  const convertirMenorMil = (num) => {
    if (num === 0) return "";
    if (num === 100) return "CIEN";

    let texto = "";

    texto += centenas[Math.floor(num / 100)] + " ";
    num %= 100;

    if (num < 20) {
      texto += unidades[num];
    } else {
      texto += decenas[Math.floor(num / 10)];

      if (num % 10 !== 0 && Math.floor(num / 10) !== 2) {
        texto += " Y " + unidades[num % 10];
      } else if (Math.floor(num / 10) === 2 && num % 10 !== 0) {
        texto = texto.replace("VEINTE", "VEINTI") + unidades[num % 10];
      }
    }

    return texto.trim();
  };

  const convertir = (num) => {
    if (num === 0) return "CERO";

    let resultado = "";
    const grupos = [
      { valor: 1_000_000_000_000, texto: "BILLONES" },
      { valor: 1_000_000_000, texto: "MIL MILLONES" },
      { valor: 1_000_000, texto: "MILLONES" },
      { valor: 1_000, texto: "MIL" },
      { valor: 1, texto: "" }
    ];

    for (let g of grupos) {
      if (num >= g.valor) {
        let cantidad = Math.floor(num / g.valor);
        let letras = convertirMenorMil(cantidad);

        if (g.texto === "MILLONES" && cantidad === 1) {
          resultado += "UN MILLÓN ";
        } else if (g.texto === "BILLONES" && cantidad === 1) {
          resultado += "UN BILLÓN ";
        } else if (g.texto) {
          resultado += letras + " " + g.texto + " ";
        } else {
          resultado += letras + " ";
        }

        num %= g.valor;
      }
    }

    return resultado.trim();
  };

  const partes = valor.toString().split(".");
  const pesos = parseInt(partes[0], 10);
  const centavos = partes[1] ? partes[1].padEnd(2, "0").slice(0, 2) : "00";

  const letrasPesos = convertir(pesos) + " PESOS";
  const letrasCentavos =
    centavos === "00"
      ? ""
      : ` CON ${convertir(parseInt(centavos))} PESOS`;

  return (letrasPesos + letrasCentavos).trim();
}
