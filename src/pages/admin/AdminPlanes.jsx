import { useState } from "react";
import {
  PlusCircleFill,
  PencilFill,
  TrashFill,
  ToggleOn,
  ToggleOff,
  StarFill,
  XLg,
  CheckLg,
} from "react-bootstrap-icons";
import {
  useAdminPlanes,
  useAdminCrearPlan,
  useAdminEditarPlan,
  useAdminEliminarPlan,
  useAdminTogglePlan,
} from "../../hooks/useAdmin";
import PlanCard from "../../components/plans/PlanCard";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

const PLAN_VACIO = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precioAnual: 0,
  limiteDocumentosAnuales: null,
  limiteUsuarios: 1,
  destacado: false,
  descuentoActivo: false,
  descuentoPorcentaje: null,
  activo: true,
  caracteristicas: [],
};

export default function AdminPlanes() {
  const { data: planes = [], isLoading } = useAdminPlanes();
  const crearPlan = useAdminCrearPlan();
  const editarPlan = useAdminEditarPlan();
  const eliminarPlan = useAdminEliminarPlan();
  const togglePlan = useAdminTogglePlan();

  const [modal, setModal] = useState(null); // null | "crear" | "editar" | "confirmarEliminar"
  const [planSel, setPlanSel] = useState(null);
  const [form, setForm] = useState(PLAN_VACIO);
  const [nuevaCaract, setNuevaCaract] = useState("");

  const abrirCrear = () => {
    setForm(PLAN_VACIO);
    setNuevaCaract("");
    setModal("crear");
  };

  const abrirEditar = (plan) => {
    setForm({
      codigo: plan.codigo,
      nombre: plan.nombre,
      descripcion: plan.descripcion ?? "",
      precioAnual: plan.precioAnual,
      limiteDocumentosAnuales: plan.limiteDocumentosAnuales,
      limiteUsuarios: plan.limiteUsuarios,
      destacado: plan.destacado,
      descuentoActivo: plan.descuentoActivo,
      descuentoPorcentaje: plan.descuentoPorcentaje,
      activo: plan.activo,
      caracteristicas: plan.caracteristicas?.map((c) => c.texto ?? c) ?? [],
    });
    setPlanSel(plan);
    setNuevaCaract("");
    setModal("editar");
  };

  const abrirEliminar = (plan) => {
    setPlanSel(plan);
    setModal("confirmarEliminar");
  };

  const cerrar = () => {
    setModal(null);
    setPlanSel(null);
  };

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const agregarCaract = () => {
    const t = nuevaCaract.trim();
    if (!t) return;
    setForm((p) => ({ ...p, caracteristicas: [...p.caracteristicas, t] }));
    setNuevaCaract("");
  };

  const quitarCaract = (i) =>
    setForm((p) => ({ ...p, caracteristicas: p.caracteristicas.filter((_, idx) => idx !== i) }));

  const payload = () => ({
    ...form,
    precioAnual: parseFloat(form.precioAnual) || 0,
    limiteDocumentosAnuales: form.limiteDocumentosAnuales ? parseInt(form.limiteDocumentosAnuales) : null,
    limiteUsuarios: parseInt(form.limiteUsuarios) || 1,
    descuentoPorcentaje: form.descuentoActivo ? parseInt(form.descuentoPorcentaje) || null : null,
  });

  const handleGuardar = async () => {
    if (modal === "crear") {
      await crearPlan.mutateAsync(payload());
    } else {
      await editarPlan.mutateAsync({ id: planSel.id, ...payload() });
    }
    cerrar();
  };

  const handleEliminar = async () => {
    await eliminarPlan.mutateAsync(planSel.id);
    cerrar();
  };

  const handleToggle = (plan) =>
    togglePlan.mutate({ id: plan.id, activo: !plan.activo });

  const cargando = crearPlan.isPending || editarPlan.isPending;

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Gestión de Planes</h2>

          <button className="admin-btn admin-btn-primary" onClick={abrirCrear}>
            <PlusCircleFill size={16} />
            Nuevo plan
          </button>
        </div>
        <p className="admin-page-subtitle">
          {planes.length} planes en el sistema
        </p>
      </div>


      {/* Grid de planes */}
      <div className="row g-4">
        {planes.map((plan) => (
          <div key={plan.id} className="col-12 col-md-6 col-xl-4">
            <PlanCard
              plan={plan}
              adminMode
              onEditar={() => abrirEditar(plan)}
              onEliminar={() => abrirEliminar(plan)}
              onToggle={() => handleToggle(plan)}
            />
          </div>
        ))}
      </div>

      {/* ── Modal Crear / Editar ── */}
      {(modal === "crear" || modal === "editar") && (
        <div className="admin-modal-overlay" onClick={cerrar}>
          <div className="admin-modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h5 className="admin-modal-title">{modal === "crear" ? "Nuevo plan" : "Editar plan"}</h5>
              <button className="admin-modal-close" onClick={cerrar}><XLg size={16} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="row g-3">
                <div className="col-6">
                  <label className="admin-form-label">Código *</label>
                  <input className="admin-form-control" value={form.codigo} onChange={set("codigo")} placeholder="BASICO" />
                </div>
                <div className="col-6">
                  <label className="admin-form-label">Nombre *</label>
                  <input className="admin-form-control" value={form.nombre} onChange={set("nombre")} placeholder="Plan Básico" />
                </div>
                <div className="col-12">
                  <label className="admin-form-label">Descripción</label>
                  <input className="admin-form-control" value={form.descripcion} onChange={set("descripcion")} placeholder="Descripción corta" />
                </div>
                <div className="col-6">
                  <label className="admin-form-label">Precio anual (COP) *</label>
                  <input type="number" className="admin-form-control" value={form.precioAnual} onChange={set("precioAnual")} min={0} />
                </div>
                <div className="col-6">
                  <label className="admin-form-label">Límite de documentos/año</label>
                  <input type="number" className="admin-form-control" value={form.limiteDocumentosAnuales ?? ""} onChange={set("limiteDocumentosAnuales")} placeholder="Dejar vacío = ilimitado" min={0} />
                </div>
                <div className="col-6">
                  <label className="admin-form-label">Límite de usuarios</label>
                  <input type="number" className="admin-form-control" value={form.limiteUsuarios ?? ""} onChange={set("limiteUsuarios")} placeholder="Dejar vacío = ilimitado" min={1} />
                </div>
                <div className="col-6 d-flex flex-column gap-2 justify-content-end">
                  <label className="d-flex align-items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.destacado} onChange={set("destacado")} />
                    <span className="admin-form-label mb-0">Destacado</span>
                  </label>
                  <label className="d-flex align-items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.activo} onChange={set("activo")} />
                    <span className="admin-form-label mb-0">Activo</span>
                  </label>
                </div>

                {/* Descuento */}
                <div className="col-12">
                  <label className="d-flex align-items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={form.descuentoActivo} onChange={set("descuentoActivo")} />
                    <span className="admin-form-label mb-0">Activar descuento</span>
                  </label>
                  {form.descuentoActivo && (
                    <div className="input-group" style={{ maxWidth: 180 }}>
                      <input type="number" className="admin-form-control" value={form.descuentoPorcentaje ?? ""} onChange={set("descuentoPorcentaje")} placeholder="%" min={1} max={99} />
                      <span className="input-group-text">%</span>
                    </div>
                  )}
                </div>

                {/* Características */}
                <div className="col-12">
                  <label className="admin-form-label">Características del plan</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      className="admin-form-control"
                      value={nuevaCaract}
                      onChange={(e) => setNuevaCaract(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarCaract())}
                      placeholder="Ej: Soporte prioritario"
                    />
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={agregarCaract}>
                      <PlusCircleFill size={14} />
                    </button>
                  </div>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                    {form.caracteristicas.map((c, i) => (
                      <li key={i} className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <CheckLg size={13} className="text-success" />
                        <span className="flex-fill small">{c}</span>
                        <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => quitarCaract(i)}>
                          <XLg size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={cerrar}>Cancelar</button>
              <button className="admin-btn admin-btn-primary" onClick={handleGuardar} disabled={cargando || !form.nombre || !form.codigo}>
                {cargando ? <span className="spinner-border spinner-border-sm" /> : modal === "crear" ? "Crear plan" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar Eliminar ── */}
      {modal === "confirmarEliminar" && (
        <div className="admin-modal-overlay" onClick={cerrar}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h5 className="admin-modal-title">Eliminar plan</h5>
              <button className="admin-modal-close" onClick={cerrar}><XLg size={16} /></button>
            </div>
            <div className="admin-modal-body">
              <p>¿Eliminar el plan <strong>{planSel?.nombre}</strong>?</p>
              <p className="text-muted small">Esta acción es irreversible. Los usuarios con este plan activo no serán afectados inmediatamente.</p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={cerrar}>Cancelar</button>
              <button className="admin-btn admin-btn-danger" onClick={handleEliminar} disabled={eliminarPlan.isPending}>
                {eliminarPlan.isPending ? <span className="spinner-border spinner-border-sm" /> : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
