// ── Años: dinámico desde 2020 hasta el año actual + 1 ────────────
export const ANOS = Array.from(
  { length: new Date().getFullYear() - 2020 + 2 },
  (_, i) => 2020 + i
);

// ── Períodos ──────────────────────────────────────────────────────
export const PERIODOS = [
  { value: "hoy",       label: "Hoy" },
  { value: "ayer",      label: "Ayer" },
  { value: "7dias",     label: "Últimos 7 días" },
  { value: "15dias",    label: "Últimos 15 días" },
  { value: "30dias",    label: "Últimos 30 días" },
  { value: "mes",       label: "Este mes" },
  { value: "trimestre", label: "Este trimestre" },
  { value: "anio",      label: "Este año" },
  { value: "rango",     label: "Rango personalizado" },
];

// ── Tipos de transacción ──────────────────────────────────────────
export const TIPOS_TRANSACCION = [
  { value: "",                    label: "Todos" },
  { value: "CompraProductos",     label: "Compra de productos" },
  { value: "CompraServicios",     label: "Compra de servicios" },
  { value: "GastosOperacionales", label: "Gastos operacionales" },
  { value: "ArrendamientosBienes",label: "Arrendamientos de bienes" },
  { value: "HonorariosProfesionales", label: "Honorarios profesionales" },
];

// ── Opciones Envío DIAN ───────────────────────────────────────────
export const OPCIONES_DIAN = [
  { value: "",           label: "Todos" },
  { value: "Enviado",    label: "Enviado" },
  { value: "NoEnviado",  label: "No enviado" },
  { value: "Error",      label: "Error" },
];
