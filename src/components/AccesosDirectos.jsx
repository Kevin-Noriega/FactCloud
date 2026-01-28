import { useNavigate } from "react-router-dom";
import "../styles/QuickActions.css";
import { quickActions } from "../utils/acessosDirectos";
import * as Icons from "react-bootstrap-icons";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions-inside">
      {quickActions.map((action, index) => {
        const Icon = Icons[action.icon]; // 👈 magia aquí

        return (
          <div
            key={index}
            className="quick-action-inside"
            onClick={() => navigate(action.route)}
          >
            <div className="icon">
              {Icon && <Icon size={20} />}
            </div>
            <span>{action.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActions;
