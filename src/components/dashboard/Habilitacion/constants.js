// ─────────────────────────────────────────────────────────────
// constants.js
// Todas las constantes, catálogos y helpers del wizard de
// habilitación.
// ─────────────────────────────────────────────────────────────

export const ETAPAS = [
  { id: 1, label: "Perfil de la empresa" },
  { id: 2, label: "Certificado digital" },
  { id: 3, label: "Set de pruebas DIAN" },
  { id: 4, label: "Solicitar numeración DIAN" },
  { id: 5, label: "Asociar prefijos DIAN" },
  { id: 6, label: "Sincronizar" },
];

export const INITIAL_FORM = {
  perfil: {
    tipoPersona: "empresa",
    correoAcceso: "",
    tipoIdentificacion: "31",
    numeroIdentificacion: "",
    dv: "",
    nombreComercial: "",
    razonSocial: "",
    nombres: "",
    apellidos: "",
    correo: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    regimenIva: "",
    actividadEconomica: "",
    tributos: [],
    responsabilidadesFiscales: [],
    representanteNombre: "",
    representanteApellidos: "",
    representanteTipoId: "13",
    representanteNumeroId: "",
    ciudadExpedicion: "",
    ciudadResidencia: "",
  },
  certificado: {
    usarCertificadoSiigo: true,
    aceptarExoneracion: false,
  },
  setPruebas: {
    testSetId: "",
    resolucionPrueba: "",
  },
  numeracion: {
    prefijo: "",
    tipoFacturacion: "Factura electrónica de venta",
  },
  prefijos: {
    prefijoAsociado: "",
  },
  sincronizacion: {
    sincronizado: false,
  },
};

export const REGIMEN_IVA_OPTIONS = [
  { value: "004", label: "004 - Empresa del Estado" },
  { value: "001", label: "001 - Gran contribuyente" },
  { value: "003", label: "003 - No responsable de IVA" },
  { value: "099", label: "099 - Régimen simple de tributación" },
  { value: "002", label: "002 - Responsable de IVA" },
];

export const TRIBUTOS_OPTIONS = [
  { value: "IVA", label: "IVA" },
  { value: "IC", label: "IC" },
  { value: "ICA", label: "ICA" },
  { value: "INC", label: "INC" },
];

export const RESPONSABILIDADES_OPTIONS = [
  { value: "gran-contribuyente", label: "Gran contribuyente" },
  { value: "autorretenedor", label: "Autorretenedor" },
  { value: "agente-retencion-iva", label: "Agente de retención IVA" },
  { value: "regimen-simple", label: "Régimen simple de tributación" },
  { value: "no-aplica-otros", label: "No aplica - Otros" },
];

export const MAPEO_REGIMEN = {
  "002": { tributos: ["IVA"], responsabilidadesFiscales: ["no-aplica-otros"] },
  "003": { tributos: [], responsabilidadesFiscales: ["no-aplica-otros"] },
  "099": { tributos: [], responsabilidadesFiscales: ["regimen-simple"] },
  "001": { tributos: ["IVA"], responsabilidadesFiscales: ["gran-contribuyente"] },
  "004": { tributos: ["IVA"], responsabilidadesFiscales: ["no-aplica-otros"] },
};

// ── helpers ──────────────────────────────────────────────────

/** Convierte string CSV o array en array limpio. */
export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value.split(",").map((i) => i.trim()).filter(Boolean);
  return [];
};

/** Fusiona datos del servidor con INITIAL_FORM garantizando tipos correctos. */
export const normalizarFormulario = (data = {}) => ({
  ...INITIAL_FORM,
  ...data,
  perfil: {
    ...INITIAL_FORM.perfil,
    ...(data.perfil || {}),
    tributos: toArray(data?.perfil?.tributos),
    responsabilidadesFiscales: toArray(data?.perfil?.responsabilidadesFiscales),
  },
  certificado:   { ...INITIAL_FORM.certificado,   ...(data.certificado   || {}) },
  setPruebas:    { ...INITIAL_FORM.setPruebas,    ...(data.setPruebas    || {}) },
  numeracion:    { ...INITIAL_FORM.numeracion,    ...(data.numeracion    || {}) },
  prefijos:      { ...INITIAL_FORM.prefijos,      ...(data.prefijos      || {}) },
  sincronizacion:{ ...INITIAL_FORM.sincronizacion,...(data.sincronizacion|| {}) },
});
