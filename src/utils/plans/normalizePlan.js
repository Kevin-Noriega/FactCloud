// Canonical plan normalizer — called once in hooks, never in components.
// Accepts any shape from any endpoint and returns the consistent PlanNormalizado type.

export const normalizeFeature = (item) => {
  if (typeof item === "string") return { texto: item, tooltip: null };
  return {
    texto: item.texto ?? item.text ?? String(item),
    tooltip: item.tooltip ?? null,
  };
};

export const normalizePlan = (raw) => ({
  id: raw.id,
  codigo: raw.codigo ?? "",
  nombre: raw.nombre ?? raw.name ?? "",
  // tipo: "FACTURACION" | "POS" — el POS es un producto aparte.
  tipo: (raw.tipo ?? raw.type ?? "FACTURACION").toUpperCase(),
  // Módulos/capacidades habilitados por el plan
  incluyePOS: raw.incluyePOS ?? raw.includesPOS ?? false,
  incluyeInventario: raw.incluyeInventario ?? false,
  incluyeNomina: raw.incluyeNomina ?? false,
  incluyeContabilidad: raw.incluyeContabilidad ?? false,
  incluyeSucursales: raw.incluyeSucursales ?? false,
  descripcion: raw.descripcion ?? raw.description ?? "",
  // precioMensual: always present (computed from annual if missing)
  precioMensual: raw.precioMensual ?? raw.monthlyPrice ?? (raw.precioAnual ?? 0) / 12,
  precioAnual: raw.precioAnual ?? raw.annualPrice ?? 0,
  destacado: raw.destacado ?? raw.featured ?? false,
  activo: raw.activo ?? true,
  descuentoActivo: raw.descuentoActivo ?? raw.hasDiscount ?? false,
  descuentoPorcentaje: raw.descuentoPorcentaje ?? raw.discountPercentage ?? null,
  limiteDocumentosAnuales: raw.limiteDocumentosAnuales ?? null,
  limiteUsuarios: raw.limiteUsuarios ?? null,
  caracteristicas: (raw.caracteristicas ?? raw.features ?? []).map(normalizeFeature),
});
