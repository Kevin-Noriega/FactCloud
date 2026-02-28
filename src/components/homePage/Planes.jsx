import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "../PlanCard";
import Stepper from "../Stepper";
import { usePlanes } from "../../hooks/usePlanes";
import "../../styles/HomePage/PlanHome.css";

export const Planes = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  const { data: planes = [], isLoading, error } = usePlanes();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSelectPlan = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify({
      ...plan,
      timestamp: new Date().toISOString()
    }));
    navigate("/registro");
  };

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error cargando planes</div>;

  const normalizedPlanes = (planes ?? []).map(plan => ({
    ...plan,
    pricing: {
      original: plan.compare_price ?? plan.price,
      current: plan.price,
      hasDiscount: plan.compare_price > plan.price,
    },
  }));

  const top3Planes = normalizedPlanes.slice(0, 3);
  const plansToShow = isMobile 
    ? [top3Planes[index] || top3Planes[0]] 
    : top3Planes;

  const next = () => index < top3Planes.length - 1 && setIndex(index + 1);
  const prev = () => index > 0 && setIndex(index - 1);

  return (
    <section id="planes" className="pricing-section">
      <div className="container">
        <span className="section-label">Precios Transparentes</span>
        <h2>Planes que se ajustan a tu crecimiento</h2>
        <Stepper currentStep={1} />
        
        {/* Navegación móvil */}
        {isMobile && index > 0 && (
          <button className="arrow-left" onClick={prev}>‹</button>
        )}
        
        <div className="pricing-cards">
          {plansToShow.map(plan => (
            <PlanCard
              key={plan.Id || plan.id}
              plan={plan}
              onCheckout={handleSelectPlan}
            />
          ))}
        </div>
        
        {isMobile && index < top3Planes.length - 1 && (
          <button className="arrow-right" onClick={next}>›</button>
        )}
        
        {/* CTA Ver todos */}
       
      </div>
       <div className="pricing-footer">
        <div className="pricing-footer-content">
          <p>
            Tenemos los planes ideales para tu pyme. Todos los planes anuales incluyen descuento.
          </p>
          <a href="/planes" className="btn-ver-planes ">
            Ver todos los planes
          </a>
        </div>
      </div>
    </section>
  );
};
