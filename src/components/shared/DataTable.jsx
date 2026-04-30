import React from "react";

/**
 * DataTable reutilizable — usa las clases base de SharedPage.css.
 * Mismo diseno visual que Facturas, Productos, Clientes, etc.
 *
 * @param {Array}  columns  - [{ key, label, align?, render?, width?, bold?, highlight? }]
 * @param {Array}  data     - Filas de datos
 * @param {boolean} loading - Estado de carga
 * @param {object}  totals  - { label, values: { key: formattedValue } }
 * @param {string}  emptyMessage - Mensaje cuando no hay datos
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  totals,
  emptyMessage = "No se encontraron resultados para los filtros seleccionados",
}) {
  const thClass = (col) => {
    let cls = "";
    if (col.align === "right") cls += " text-end";
    if (col.align === "center") cls += " text-center";
    return cls;
  };

  const tdClass = (col) => {
    let cls = "";
    if (col.align === "right") cls += " text-end";
    if (col.align === "center") cls += " text-center";
    if (col.bold) cls += " fw-bold";
    return cls;
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr className="facturas-table-header">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={thClass(col)}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center" style={{ padding: "3rem" }}>
                    <div className="loading-container" style={{ minHeight: "auto" }}>
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-3">Cargando reporte...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center text-muted" style={{ padding: "3rem" }}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.id || idx}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={tdClass(col)}
                        style={col.cellStyle || undefined}
                      >
                        {col.render ? col.render(row, idx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
            {!loading && data.length > 0 && totals && (
              <tfoot>
                <tr style={{ background: "#f9fafb", fontWeight: 700 }}>
                  {columns.map((col, i) => (
                    <td
                      key={col.key}
                      className={thClass(col)}
                      style={
                        i === columns.length - 1
                          ? { color: "var(--primary)", fontWeight: 800 }
                          : undefined
                      }
                    >
                      {i === 0
                        ? (totals.label || "Total general")
                        : (totals.values?.[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
