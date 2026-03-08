import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan");
    const user = localStorage.getItem("userData");

    if (!plan || !user) {
      navigate("/planes");
      return;
    }

    setSelectedPlan(JSON.parse(plan));
    setUserData(JSON.parse(user));
  }, [navigate]);

  const handlePayment = async () => {
    try {
      console.log("Procesando pago...", {
        plan: selectedPlan,
        user: userData
      });

      alert("¡Pago procesado exitosamente!");

      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("userData");

      navigate("/dashboard");

    } catch (error) {
      console.error("Error en el pago:", error);
      alert("Error al procesar el pago. Intenta nuevamente.");
    }
  };

  if (!selectedPlan || !userData) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Finalizar Compra</h1>

        <div className="checkout-content">
          <div className="user-info-section">
            <h2>Datos de facturación</h2>
            <div className="info-card">
              <p><strong>Nombre:</strong> {userData.nombre}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Documento:</strong> {userData.documento}</p>
            </div>
          </div>
          <div className="checkout-summary">
            <h2>Resumen de tu compra</h2>
            <div className="summary-card">
              <div className="summary-item">
                <span>Plan seleccionado:</span>
                <strong>{selectedPlan.planName}</strong>
              </div>
              <div className="summary-item">
                <span>Total a pagar:</span>
                <strong className="total-amount">
                  ${(selectedPlan.planPrice * 0.91).toLocaleString("es-CO")}
                </strong>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="btn-finalizar-pago"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}