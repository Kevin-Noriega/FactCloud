// constants.js
// CORRECCIÓN: añadido bloque "numeracion" al INITIAL_FORM para el Step4.
// Antes no existía y actualizarCampo("numeracion", ...) fallaba silenciosamente.

export const ETAPAS = [
  { id: 1, label: "Perfil empresa" },
  { id: 2, label: "Certificado" },
  { id: 3, label: "Set de pruebas" },
  { id: 4, label: "Resolución DIAN" },
  { id: 5, label: "Asociar prefijos" },
  { id: 6, label: "Finalizar" },
];

export const INITIAL_FORM = {
  perfil: {
    tipoPersona: "empresa",
    correoAcceso: "",
    tipoIdentificacion: "",
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
    representanteTipoId: "",
    representanteNumeroId: "",
    ciudadExpedicion: "",
    ciudadResidencia: "",
  },

  certificado: {
    opcion: "", // "propio" | "Nubee"
    archivoCertificado: null, // File object
    nombreArchivo: "", // nombre del archivo ya guardado
    passwordCertificado: "",
    aceptarExoneracion: false,
  },

  setPruebas: {
    testSetId: "",
    resolucionPrueba: "",
  },

  // CORRECCIÓN: este bloque faltaba completamente.
  numeracion: {
    numeroAutorizacion: "",
    prefijo: "",
    rangoDesde: "",
    rangoHasta: "",
    fechaInicio: "",
    fechaFin: "",
    claveTecnica: "",
    tipoAmbiente: "1",
  },

  sincronizacion: {
    sincronizado: false,
  },
};

// ── Opciones de regímen IVA ───────────────────────────────────────────────
export const REGIMEN_IVA_OPTIONS = [
  { value: "48", label: "48 - Responsable del IVA" },
  { value: "49", label: "49 - No responsable del IVA" },
];

// ── Tributos más comunes ──────────────────────────────────────────────────
export const TRIBUTOS_OPTIONS = [
  { value: "01", label: "01 - IVA" },
  { value: "04", label: "04 - INC" },
  { value: "ZA", label: "ZA - No aplica" },
];

// ── Responsabilidades fiscales ────────────────────────────────────────────
export const RESPONSABILIDADES_OPTIONS = [
  { value: "O-13", label: "O-13 - Gran contribuyente" },
  { value: "O-15", label: "O-15 - Autorretenedor" },
  { value: "O-23", label: "O-23 - Agente de retención IVA" },
  { value: "O-47", label: "O-47 - Régimen simple" },
  { value: "R-99-PN", label: "R-99-PN - No aplica" },
];

// ── Mapeo automático de tributos según régimen ────────────────────────────
export const MAPEO_REGIMEN = {
  48: {
    tributos: ["01"],
    responsabilidadesFiscales: ["O-23"],
  },
  49: {
    tributos: ["ZA"],
    responsabilidadesFiscales: ["R-99-PN"],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────
export const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

export const normalizarFormulario = (data) => data;
