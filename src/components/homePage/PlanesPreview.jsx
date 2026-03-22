import { useNavigate } from "react-router-dom";
import PlanCard from "../PlanCard";
import { usePlanes } from "../../hooks/usePlanes";
import "../../styles/HomePage/PlanesPreview.css";

export function PlanesPreview() {
  const navigate = useNavigate();
  const { data: planes, isLoading, error, refetch } = usePlanes();

  const handleSelectPlan = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify({
      ...plan,
      timestamp: new Date().toISOString(),
    }));
    navigate("/registro");
  };

  if (isLoading) return (
    <section className="planes-preview-section">
      <div className="planes-preview-loading">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
        Cargando planes...
      </div>
    </section>
  );

  if (error) return (
    <section className="planes-preview-section">
      <div className="planes-preview-error">
        <p>Error al cargar los planes.</p>
        <button className="btn btn-outline-primary btn-sm mt-2" onClick={refetch}>
          Reintentar
        </button>
      </div>
    </section>
  );

  // Solo los primeros 3 planes
  const planesVisibles = (planes ?? []).slice(0, 3);

  return (
    <section className="planes-preview-section">
      <div className="container">

        {/* Encabezado */}
        <div className="planes-preview-header">
          <span className="planes-preview-label">Precios</span>
          <h2 className="planes-preview-title">
            Planes pensados para cada negocio
          </h2>
          <p className="planes-preview-subtitle">
            Comienza gratis y escala cuando lo necesites. Sin permanencia, sin sorpresas.
          </p>
        </div>

        {/* Grid 3 planes */}
        <div className="planes-preview-grid">
          {planesVisibles.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onCheckout={handleSelectPlan}
            />
          ))}
        </div>

        {/* CTA ver todos */}
        <div className="planes-preview-cta">
          <a href="/planes" className="btn-ver-todos">
            Ver todos los planes
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}