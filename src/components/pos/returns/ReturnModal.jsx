import { useEffect, useMemo, useState } from "react";
import { posSalesApi } from "../../../Service/pos/posApi";

const METODOS = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "PagosLinea", label: "Transferencia / PSE" },
  { value: "Otros", label: "Otros" },
];

const cop = (n) =>
  Number(n ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Modal de devolución de una venta POS. Carga las líneas devolvibles, deja
 * elegir cantidades por línea y registra la devolución.
 *
 * Props: { venta: {id, numeroVenta} | null, onClose: fn, onDone?: fn }
 */
export default function ReturnModal({ venta, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [motivo, setMotivo] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");

  useEffect(() => {
    if (!venta?.id) return;
    let activo = true;
    setLoading(true);
    setError(null);
    posSalesApi
      .getReturnable(venta.id)
      .then((res) => activo && setLineas(res ?? []))
      .catch(() => activo && setError("No se pudieron cargar las líneas devolvibles."))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [venta?.id]);

  const claveDe = (l) => (l.productoId != null ? `p${l.productoId}` : `n${l.nombre}`);

  const total = useMemo(
    () =>
      lineas.reduce((acc, l) => {
        const c = Number(cantidades[claveDe(l)] ?? 0);
        return acc + c * Number(l.precioUnitario ?? 0);
      }, 0),
    [lineas, cantidades]
  );

  const setCantidad = (l, valor) => {
    const max = Number(l.cantidadDevolvible ?? 0);
    let v = Number(valor);
    if (isNaN(v) || v < 0) v = 0;
    if (v > max) v = max;
    setCantidades((prev) => ({ ...prev, [claveDe(l)]: v }));
  };

  const items = lineas
    .map((l) => ({
      productoId: l.productoId ?? null,
      nombre: l.nombre,
      cantidad: Number(cantidades[claveDe(l)] ?? 0),
    }))
    .filter((i) => i.cantidad > 0);

  const guardar = async () => {
    if (items.length === 0) {
      setError("Indica al menos una cantidad a devolver.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await posSalesApi.return(venta.id, { items, motivo, metodoReembolso: metodo });
      onDone?.(res);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.mensaje ?? "No se pudo registrar la devolución.");
    } finally {
      setSaving(false);
    }
  };

  if (!venta) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.5)" }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Devolución — Venta #{venta.numeroVenta ?? venta.id}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {loading && <p className="text-muted">Cargando…</p>}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            {!loading && lineas.length === 0 && !error && (
              <p className="text-muted">Esta venta no tiene líneas devolvibles.</p>
            )}

            {!loading && lineas.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Vendida</th>
                      <th className="text-end">Devuelta</th>
                      <th className="text-end">Devolvible</th>
                      <th className="text-end">Precio</th>
                      <th style={{ width: 110 }} className="text-end">A devolver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineas.map((l) => {
                      const k = claveDe(l);
                      return (
                        <tr key={k} className={l.cantidadDevolvible <= 0 ? "text-muted" : ""}>
                          <td>{l.nombre}</td>
                          <td className="text-end">{l.cantidadVendida}</td>
                          <td className="text-end">{l.cantidadDevuelta}</td>
                          <td className="text-end">{l.cantidadDevolvible}</td>
                          <td className="text-end">{cop(l.precioUnitario)}</td>
                          <td className="text-end">
                            <input
                              type="number"
                              className="form-control form-control-sm text-end"
                              min={0}
                              max={l.cantidadDevolvible}
                              disabled={l.cantidadDevolvible <= 0}
                              value={cantidades[k] ?? 0}
                              onChange={(e) => setCantidad(l, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="row g-2 mt-2">
              <div className="col-md-7">
                <label className="form-label mb-1">Motivo (opcional)</label>
                <input
                  className="form-control form-control-sm"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Producto defectuoso, cambio, etc."
                />
              </div>
              <div className="col-md-5">
                <label className="form-label mb-1">Reembolso</label>
                <select
                  className="form-select form-select-sm"
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  {METODOS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer justify-content-between">
            <span className="fw-semibold">Total a reembolsar: {cop(total)}</span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={guardar}
                disabled={saving || items.length === 0}
              >
                {saving ? "Registrando…" : "Registrar devolución"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
