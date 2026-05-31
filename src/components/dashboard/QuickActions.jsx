import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/QuickActions.css";
import { quickActions } from "../../utils/acessosDirectos";
import * as Icons from "react-bootstrap-icons";
import { useAuth } from "../../hooks/useAuth";
import axiosClient from "../../api/axiosClient";

const QuickActions = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [tienePOS, setTienePOS] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axiosClient.get("/planes/actual");
        // data.incluyePOS viene del backend
        setTienePOS(!!data.incluyePOS);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Error obteniendo plan actual:", err);
        }
        setTienePOS(false);
      }
    };

    // solo si hay usuario logueado
    if (usuarioId) {
      fetchPlan();
    } else {
      setTienePOS(false);
    }
  }, [usuarioId]);

  return (
    <div className="quick-actions-inside">
      {quickActions
        .filter((action) => !action.onlyIfPos || tienePOS)
        .map((action, index) => {
          const Icon = Icons[action.icon];
          return (
            <div
              key={index}
              className="quick-action-inside"
              onClick={() => navigate(action.route)}
            >
              <div className="icon">{Icon && <Icon size={20} />}</div>
              <span>{action.title}</span>
            </div>
          );
        })}
    </div>
  );
};

export default QuickActions;
