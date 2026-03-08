/**
 * Retorna { desde, hasta } en formato "YYYY-MM-DD" según el período.
 * Recibe también el año seleccionado para aplicarlo al cálculo.
 */
export function calcularFechasPorPeriodo(periodo, ano) {
  const anio = parseInt(ano) || new Date().getFullYear();
  const hoy  = new Date();
  const fmt  = (d) => d.toISOString().split("T")[0];

  // Referencia: último día del año elegido o hoy si es el año actual
  const esAnioActual = anio === hoy.getFullYear();
  const refHasta = esAnioActual ? hoy : new Date(anio, 11, 31);

  switch (periodo) {
    case "hoy":
      return { desde: fmt(hoy), hasta: fmt(hoy) };

    case "ayer": {
      const a = new Date(hoy);
      a.setDate(a.getDate() - 1);
      return { desde: fmt(a), hasta: fmt(a) };
    }

    case "7dias": {
      const d = new Date(refHasta);
      d.setDate(d.getDate() - 7);
      return { desde: fmt(d), hasta: fmt(refHasta) };
    }

    case "15dias": {
      const d = new Date(refHasta);
      d.setDate(d.getDate() - 15);
      return { desde: fmt(d), hasta: fmt(refHasta) };
    }

    case "30dias": {
      const d = new Date(refHasta);
      d.setDate(d.getDate() - 30);
      return { desde: fmt(d), hasta: fmt(refHasta) };
    }

    case "mes": {
      const d = new Date(refHasta.getFullYear(), refHasta.getMonth(), 1);
      return { desde: fmt(d), hasta: fmt(refHasta) };
    }

    case "trimestre": {
      const q = Math.floor(refHasta.getMonth() / 3);
      const d = new Date(refHasta.getFullYear(), q * 3, 1);
      return { desde: fmt(d), hasta: fmt(refHasta) };
    }

    case "anio": {
      const d = new Date(anio, 0, 1);
      const h = new Date(anio, 11, 31);
      return { desde: fmt(d), hasta: esAnioActual ? fmt(hoy) : fmt(h) };
    }

    default:
      return null; // "rango" — el usuario pone fechas manualmente
  }
}
