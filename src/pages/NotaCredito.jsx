import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles//NotaCredito.css";

function NotaCredito() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facturaId: "",
    motivo: "",
    tipo: "anulacion",
    valor: 0,
    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    console.log("Nota crédito:", formData);
    
    setTimeout(() => {
      setGuardando(false);
      alert("Nota crédito generada exitosamente");
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>Nota Crédito</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="nota-credito-info">
            <p>
              <strong>Información importante:</strong> La nota crédito afectará 
              directamente la factura seleccionada y modificará los registros contables. 
              Este proceso es irreversible una vez validado con la DIAN.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="nota-credito-form">
            <div className="nota-credito-card card">
              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label">Factura a Afectar</label>
                  <select
                    className="form-select"
                    value={formData.facturaId}
                    onChange={(e) =>
                      setFormData({ ...formData, facturaId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar factura...</option>
                  </select>
                </div>

                <div className="tipo-nota-container">
                  <label className="tipo-nota-label">Tipo de Nota Crédito</label>
                  <div className="tipo-nota-opciones">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        value="anulacion"
                        checked={formData.tipo === "anulacion"}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                        id="anulacion"
                      />
                      <label className="form-check-label" htmlFor="anulacion">
                        Anulación Total
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        value="devolucion"
                        checked={formData.tipo === "devolucion"}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                        id="devolucion"
                      />
                      <label className="form-check-label" htmlFor="devolucion">
                        Devolución Parcial
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        value="descuento"
                        checked={formData.tipo === "descuento"}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                        id="descuento"
                      />
                      <label className="form-check-label" htmlFor="descuento">
                        Descuento/Rebaja
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Motivo</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={formData.motivo}
                    onChange={(e) =>
                      setFormData({ ...formData, motivo: e.target.value })
                    }
                    required
                    placeholder="Describe detalladamente el motivo de la nota crédito. Ej: Devolución de producto defectuoso, error en facturación, descuento acordado..."
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Valor</label>
                  <div className="input-group-valor">
                    <input
                      type="number"
                      className="form-control input-moneda"
                      min="0"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) =>
                        setFormData({ ...formData, valor: e.target.value })
                      }
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#6b7280' }}>
                    Observaciones <span style={{ color: '#9ca3af' }}>(Opcional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, observaciones: e.target.value })
                    }
                    placeholder="Información adicional relevante..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className={`btn btn-success ${guardando ? 'btn-loading' : ''}`}
                    disabled={guardando}
                  >
                    {guardando ? 'Generando...' : 'Generar Nota Crédito'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotaCredito;
