import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportarProductosExcel = async (filtrados, negocio) => {
  const nombreEmpresa =
    negocio?.razonSocial || negocio?.nombreNegocio || "MI EMPRESA";
  const nit = negocio?.nit
    ? `${negocio.nit}${negocio.dvNit ? `-${negocio.dvNit}` : ""}`
    : "Sin NIT";

  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet("Gestión de productos y servici");

  hoja.columns = [
    { width: 14 },
    { width: 22 },
    { width: 38 },
    { width: 14 },
    { width: 16 },
    { width: 16 },
    { width: 10 },
    { width: 12 },
  ];

  // Fila 1: Título
  hoja.mergeCells("A1:H1");
  const filaTitulo = hoja.getRow(1);
  filaTitulo.getCell(1).value = "Gestión de productos y servicios";
  filaTitulo.getCell(1).style = {
    font: { bold: true, size: 16, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF0099CC" } },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  filaTitulo.height = 30;

  // Fila 2: Empresa
  hoja.mergeCells("A2:H2");
  const filaEmpresa = hoja.getRow(2);
  filaEmpresa.getCell(1).value = nombreEmpresa;
  filaEmpresa.getCell(1).style = {
    font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF0099CC" } },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  filaEmpresa.height = 22;

  // Fila 3: NIT
  hoja.mergeCells("A3:H3");
  const filaNit = hoja.getRow(3);
  filaNit.getCell(1).value = nit;
  filaNit.getCell(1).style = {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF0099CC" } },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  filaNit.height = 20;

  // Fila 4: Cabeceras
  const cabeceras = [
    "Tipo",
    "Código",
    "Nombre",
    "Unidad",
    "Precios",
    "Impuestos",
    "Stock",
    "Estado",
  ];
  const filaCabecera = hoja.getRow(4);
  cabeceras.forEach((cab, i) => {
    const celda = filaCabecera.getCell(i + 1);
    celda.value = cab;
    celda.style = {
      font: { bold: true, size: 11 },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: { bottom: { style: "thin", color: { argb: "FF999999" } } },
    };
  });
  filaCabecera.height = 18;

  // Filas de datos
  filtrados.forEach((prod) => {
    hoja.addRow([
      prod.esServicio ? "Servicio" : "Producto",
      prod.codigoInterno || "",
      prod.nombre || "",
      prod.unidadMedida || "",
      prod.precioUnitario || 0,
      prod.impuestoCargo || "",
      prod.cantidadDisponible ?? 0,
      prod.activo ? "Active" : "Inactive",
    ]);
  });

  const fecha = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
  const buffer = await libro.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Gestion-de-productos-y-servicios-${fecha}.xlsx`);
};

export default exportarProductosExcel;
