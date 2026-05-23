import { PencilFill, TrashFill, ToggleOn, ToggleOff } from "react-bootstrap-icons";

export default function PlanAdminActions({ plan, onEditar, onEliminar, onToggle }) {
  return (
    <div className="plan-admin-actions">
      <button className="plan-admin-btn plan-admin-btn-edit" onClick={onEditar} type="button">
        <PencilFill size={12} />
        Editar
      </button>
      <button
        className={`plan-admin-btn ${plan.activo ? "plan-admin-btn-off" : "plan-admin-btn-on"}`}
        onClick={onToggle}
        type="button"
      >
        {plan.activo ? <ToggleOff size={14} /> : <ToggleOn size={14} />}
        {plan.activo ? "Desactivar" : "Activar"}
      </button>
      <button className="plan-admin-btn plan-admin-btn-delete" onClick={onEliminar} type="button">
        <TrashFill size={12} />
        Eliminar
      </button>
    </div>
  );
}
