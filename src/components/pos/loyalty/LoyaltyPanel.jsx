import { useCallback, useEffect, useState } from "react";
import { posLoyaltyApi } from "../../../Service/pos/posApi";

const cop = (n) =>
  Number(n ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Panel de fidelización de un cliente: saldo de puntos, estado de cliente
 * frecuente, redención y historial. Consume /pos/clients/:id/loyalty.
 *
 * Props: { clienteId: number, onRedeemed?: (valorCop) => void }
 */
export default function LoyaltyPanel({ clienteId, onRedeemed }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [puntos, setPuntos] = useState("");
  const [redimiendo, setRedimiendo] = useState(false);

  const cargar = useCallback(() => {
    if (!clienteId) return;
    setLoading(true);
    setError(null);
    posLoyaltyApi
      .getClient(clienteId)
      .then(setData)
      .catch(() => setError("No se pudo cargar la fidelización del cliente."))
      .finally(() => setLoading(false));
  }, [clienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const redimir = async () => {
    const n = Number(puntos);
    if (!n || n <= 0) return;
    setRedimiendo(true);
    setError(null);
    try {
      const res = await posLoyaltyApi.redeem(clienteId, n);
      setPuntos("");
      onRedeemed?.(res.valorCop);
      cargar();
    } catch (e) {
      setError(e?.response?.data?.mensaje ?? "No se pudo redimir.");
    } finally {
      setRedimiendo(false);
    }
  };

  if (!clienteId) return null;
  if (loading && !data) return <p className="text-muted">Cargando fidelización…</p>;

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Fidelización</h6>
          {data?.esFrecuente && <span className="badge bg-success">Cliente frecuente</span>}
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {data && (
          <>
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div>
                <div className="text-muted small">Puntos</div>
                <div className="fs-4 fw-bold">{data.puntosAcumulados}</div>
              </div>
              <div>
                <div className="text-muted small">Equivalente</div>
                <div className="fs-5">{cop(data.saldoEnPesos)}</div>
              </div>
              <div>
                <div className="text-muted small">Compras</div>
                <div className="fs-5">{data.numeroCompras}</div>
              </div>
              <div>
                <div className="text-muted small">Total comprado</div>
                <div className="fs-5">{cop(data.totalComprado)}</div>
              </div>
            </div>

            <div className="input-group input-group-sm mb-3" style={{ maxWidth: 320 }}>
              <input
                type="number"
                className="form-control"
                placeholder="Puntos a redimir"
                min={1}
                max={data.puntosAcumulados}
                value={puntos}
                onChange={(e) => setPuntos(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={redimir}
                disabled={redimiendo || !puntos || data.puntosAcumulados <= 0}
              >
                {redimiendo ? "…" : "Redimir"}
              </button>
            </div>

            {data.historial?.length > 0 && (
              <div className="table-responsive" style={{ maxHeight: 220 }}>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th className="text-end">Puntos</th>
                      <th className="text-end">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.historial.map((m) => (
                      <tr key={m.id}>
                        <td>{new Date(m.fecha).toLocaleDateString("es-CO")}</td>
                        <td>{m.tipo}</td>
                        <td className={`text-end ${m.tipo === "Redencion" ? "text-danger" : "text-success"}`}>
                          {m.tipo === "Redencion" ? "-" : "+"}
                          {m.puntos}
                        </td>
                        <td className="text-end">{m.saldoNuevo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
