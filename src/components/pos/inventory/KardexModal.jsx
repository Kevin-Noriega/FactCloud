import { useEffect, useState } from "react";
import { posProductsApi } from "../../../Service/pos/posApi";

const TIPO_BADGE = {
  Entrada: { label: "Entrada", className: "bg-success" },
  Salida: { label: "Salida", className: "bg-danger" },
  Ajuste: { label: "Ajuste", className: "bg-secondary" },
  Traslado: { label: "Traslado", className: "bg-info text-dark" },
  Devolucion: { label: "Devolución", className: "bg-warning text-dark" },
};

const fmt = (n) =>
  Number(n ?? 0).toLocaleString("es-CO", { maximumFractionDigits: 4 });

/**
 * Modal de Kardex de un producto. Muestra el historial de movimientos de
 * inventario (saldo anterior → saldo nuevo) consumiendo /pos/products/:id/kardex.
 *
 * Props: { producto: {id, nombre} | null, onClose: fn }
 */
export default function KardexModal({ producto, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!producto?.id) return;
    let activo = true;
    setLoading(true);
    setError(null);
    posProductsApi
      .getKardex(producto.id)
      .then((res) => activo && setData(res))
      .catch(() => activo && setError("No se pudo cargar el Kardex."))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [producto?.id]);

  if (!producto) return null;

  const movimientos = data?.movimientos ?? [];

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Kardex — {data?.producto ?? producto.nombre}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {data && (
              <div className="d-flex gap-3 mb-3">
                <span className="badge bg-primary fs-6">
                  Stock actual: {fmt(data.stockActual)}
                </span>
                <span className="badge bg-light text-dark fs-6">
                  Stock mínimo: {fmt(data.stockMinimo)}
                </span>
              </div>
            )}

            {loading && <p className="text-muted">Cargando movimientos…</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && movimientos.length === 0 && (
              <p className="text-muted">Este producto aún no tiene movimientos.</p>
            )}

            {!loading && !error && movimientos.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th className="text-end">Cantidad</th>
                      <th className="text-end">Saldo ant.</th>
                      <th className="text-end">Saldo nuevo</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((m) => {
                      const badge = TIPO_BADGE[m.tipo] ?? {
                        label: m.tipo,
                        className: "bg-secondary",
                      };
                      return (
                        <tr key={m.id}>
                          <td>{new Date(m.fecha).toLocaleString("es-CO")}</td>
                          <td>
                            <span className={`badge ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="text-end">{fmt(m.cantidad)}</td>
                          <td className="text-end">{fmt(m.saldoAnterior)}</td>
                          <td className="text-end fw-semibold">
                            {fmt(m.saldoNuevo)}
                          </td>
                          <td>
                            {m.documento}
                            {m.documentoId ? ` #${m.documentoId}` : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
