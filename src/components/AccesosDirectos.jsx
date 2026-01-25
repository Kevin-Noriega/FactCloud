import { useNavigate } from "react-router-dom";
import "../styles/QuickActions.css";
import { quickActions } from "../utils/acessosDirectos";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div
      className="card text-white shadow-lg border-0"
      style={{
        background: "linear-gradient(135deg, #00a2ff, #025b8f)",
      }}
    >
      <div className="card-body p-4">
        {/* TEXTO SUPERIOR */}
        <h2 className="mb-2">¡Bienvenido a FactCloud!</h2>

        <p className="mb-1">
          Sistema de Facturación Electrónica - Cumplimiento DIAN 2025
        </p>

        <small className="opacity-75 d-block mb-4">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </small>

        <h4 className="mb-2">Acessos Directos!</h4>

        {/* ACCESOS DIRECTOS DENTRO DE LA BARRA */}
        <div className="quick-actions-inside">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="quick-action-inside"
              onClick={() => navigate(action.route)}
            >
              <div className="icon">{action.icon}</div>
              <span>{action.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
