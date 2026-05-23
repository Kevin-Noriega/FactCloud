import { useState, useMemo } from "react";
import {
  CreditCard2FrontFill,
  PlusCircleFill,
  TrashFill,
  XCircleFill,
  Search,
  CheckCircleFill,
  XLg,
} from "react-bootstrap-icons";
import {
  useAdminSuscripciones,
  useAdminCrearSuscripcion,
  useAdminCancelarSuscripcion,
  useAdminEliminarSuscripcion,
} from "../../hooks/useAdmin";
import { useAdminPlanes } from "../../hooks/useAdmin";

const fmt = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const diasRestantes = (fechaFin) => {
  if (!fechaFin) return null;
  const diff = Math.ceil((new Date(fechaFin) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

// ── Modal crear suscripción ────────────────────────────────────
function ModalCrear({ planes, onClose, onGuardar, loading }) {
  const [form, setForm] = useState({
    usuarioId: "",
    planId: planes[0]?.id ?? "",
    fechaInicio: new Date().toISOString().slice(0, 10),
    fechaFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.usuarioId || isNaN(Number(form.usuarioId))) errs.usuarioId = "Requerido";
    if (!form.planId) errs.planId = "Selecciona un plan";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onGuardar({
      usuarioId: Number(form.usuarioId),
      planId: Number(form.planId),
      fechaInicio: form.fechaInicio ? new Date(form.fechaInicio).toISOString() : undefined,
      fechaFin: form.fechaFin ? new Date(form.fechaFin).toISOString() : undefined,
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title"><CreditCard2FrontFill size={16} /> Asignar Plan</div>
          <button className="admin-modal-close" onClick={onClose}><XLg size={14} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="admin-form-label">ID de usuario *</label>
                <input
                  type="number"
                  className={`admin-form-control ${errors.usuarioId ? "border-danger" : ""}`}
                  value={form.usuarioId}
                  onChange={set("usuarioId")}
                  placeholder="ID del usuario"
                  min={1}
                />
                {errors.usuarioId && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.usuarioId}</div>}
              </div>

              <div className="col-12">
                <label className="admin-form-label">Plan *</label>
                <select
                  className={`admin-form-select ${errors.planId ? "border-danger" : ""}`}
                  value={form.planId}
                  onChange={set("planId")}
                >
                  {planes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {errors.planId && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.planId}</div>}
              </div>

              <div className="col-6">
                <label className="admin-form-label">Fecha inicio</label>
                <input
                  type="date"
                  className="admin-form-control"
                  value={form.fechaInicio}
                  onChange={set("fechaInicio")}
                />
              </div>

              <div className="col-6">
                <label className="admin-form-label">Fecha fin</label>
                <input
                  type="date"
                  className="admin-form-control"
                  value={form.fechaFin}
                  onChange={set("fechaFin")}
                />
              </div>

              <div className="col-12">
                <div className="p-3 rounded" style={{ background: "#f0f9ff", border: "1px solid #bae6fd", fontSize: "0.8rem", color: "#0369a1" }}>
                  La suscripción activa anterior del usuario será desactivada automáticamente.
                </div>
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : "Asignar plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal confirmar ────────────────────────────────────────────
function ModalConfirmar({ mensaje, onConfirmar, onCancelar, loading, danger = true }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancelar}>
      <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">Confirmar acción</div>
          <button className="admin-modal-close" onClick={onCancelar}><XLg size={14} /></button>
        </div>
        <div className="admin-modal-body">
          <p style={{ fontSize: "0.9rem", color: "#374151" }}>{mensaje}</p>
          {danger && (
            <div className="mt-3 p-3" style={{ background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#dc2626" }}>Esta acción no se puede deshacer.</p>
            </div>
          )}
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-secondary" onClick={onCancelar}>Cancelar</button>
          <button className="admin-btn admin-btn-danger" onClick={onConfirmar} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 15;

export default function AdminSuscripciones() {
  const [filtroActiva, setFiltroActiva] = useState(undefined);
  const { data: suscripciones = [], isLoading, isError } = useAdminSuscripciones(filtroActiva);
  const { data: planes = [] } = useAdminPlanes();
  const crearMut = useAdminCrearSuscripcion();
  const cancelarMut = useAdminCancelarSuscripcion();
  const eliminarMut = useAdminEliminarSuscripcion();

  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase();
    if (!q) return suscripciones;
    return suscripciones.filter(
      (s) =>
        s.usuarioNombre?.toLowerCase().includes(q) ||
        s.usuarioCorreo?.toLowerCase().includes(q) ||
        s.planNombre?.toLowerCase().includes(q)
    );
  }, [suscripciones, busqueda]);

  const totalPaginas = Math.ceil(filtradas.length / PAGE_SIZE);
  const paginadas = filtradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (isError) {
    return <div className="admin-page-container"><div className="alert alert-danger">Error al cargar suscripciones.</div></div>;
  }

  const activas = suscripciones.filter((s) => s.activa).length;
  const inactivas = suscripciones.length - activas;

  return (
    <div className="admin-page-container">
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Suscripciones</h2>

          <button className="admin-btn admin-btn-primary" onClick={() => setModalCrear(true)}>
            <PlusCircleFill size={15} /> Asignar Plan
          </button>
        </div>
        <p className="admin-page-subtitle">
          {suscripciones.length} suscripciones en el sistema
        </p>
      </div>

      {/* Filtros rápidos */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {[
          { label: `Todas (${suscripciones.length})`, val: undefined },
          { label: `Activas (${activas})`, val: true },
          { label: `Inactivas (${inactivas})`, val: false },
        ].map(({ label, val }) => (
          <button
            key={String(val)}
            className={`admin-btn admin-btn-sm ${filtroActiva === val ? "admin-btn-primary" : "admin-btn-secondary"}`}
            onClick={() => { setFiltroActiva(val); setPagina(1); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-3">
        <div className="admin-toolbar">
          <div className="admin-toolbar-search admin-search-bar">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-form-control"
              placeholder="Buscar por usuario o plan..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            />
          </div>
          <span className="ms-auto text-muted" style={{ fontSize: "0.8rem" }}>
            {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Plan</th>
                <th>Inicio</th>
                <th>Vence</th>
                <th>Docs usados</th>
                <th>Estado</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginadas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">Sin suscripciones</td>
                </tr>
              ) : (
                paginadas.map((s, i) => {
                  const dias = diasRestantes(s.fechaFin);
                  return (
                    <tr key={s.id}>
                      <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>#{s.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{s.usuarioNombre}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{s.usuarioCorreo}</div>
                        <div style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>ID: {s.usuarioId}</div>
                      </td>
                      <td>
                        <span className="admin-badge info">{s.planNombre}</span>
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{fmt(s.fechaInicio)}</td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {fmt(s.fechaFin)}
                        {dias !== null && s.activa && (
                          <div style={{ fontSize: "0.72rem", color: dias < 30 ? "#dc2626" : "#64748b" }}>
                            {dias > 0 ? `${dias} días restantes` : "Vencida"}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{s.documentosUsados ?? 0}</td>
                      <td>
                        <span className={`admin-badge ${s.activa ? "success" : "neutral"}`}>
                          {s.activa ? <CheckCircleFill size={10} /> : <XCircleFill size={10} />}
                          {s.activa ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {s.activa && (
                            <button
                              className="admin-btn admin-btn-warning admin-btn-sm"
                              title="Cancelar"
                              onClick={() => setModalCancelar(s)}
                              disabled={cancelarMut.isPending}
                            >
                              <XCircleFill size={13} />
                            </button>
                          )}
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Eliminar"
                            onClick={() => setModalEliminar(s)}
                          >
                            <TrashFill size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Página {pagina} de {totalPaginas}</span>
            <div className="admin-pagination">
              <button className="admin-page-btn" onClick={() => setPagina(1)} disabled={pagina === 1}>«</button>
              <button className="admin-page-btn" onClick={() => setPagina((p) => p - 1)} disabled={pagina === 1}>‹</button>
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPaginas - 4, pagina - 2)) + i;
                return <button key={p} className={`admin-page-btn ${pagina === p ? "active" : ""}`} onClick={() => setPagina(p)}>{p}</button>;
              })}
              <button className="admin-page-btn" onClick={() => setPagina((p) => p + 1)} disabled={pagina === totalPaginas}>›</button>
              <button className="admin-page-btn" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>»</button>
            </div>
          </div>
        )}
      </div>

      {modalCrear && (
        <ModalCrear
          planes={planes}
          onClose={() => setModalCrear(false)}
          onGuardar={async (payload) => { await crearMut.mutateAsync(payload); setModalCrear(false); }}
          loading={crearMut.isPending}
        />
      )}

      {modalCancelar && (
        <ModalConfirmar
          mensaje={`¿Cancelar la suscripción de ${modalCancelar.usuarioNombre} (plan: ${modalCancelar.planNombre})?`}
          onConfirmar={async () => { await cancelarMut.mutateAsync(modalCancelar.id); setModalCancelar(null); }}
          onCancelar={() => setModalCancelar(null)}
          loading={cancelarMut.isPending}
          danger={false}
        />
      )}

      {modalEliminar && (
        <ModalConfirmar
          mensaje={`¿Eliminar permanentemente la suscripción #${modalEliminar.id} de ${modalEliminar.usuarioNombre}?`}
          onConfirmar={async () => { await eliminarMut.mutateAsync(modalEliminar.id); setModalEliminar(null); }}
          onCancelar={() => setModalEliminar(null)}
          loading={eliminarMut.isPending}
        />
      )}
    </div>
  );
}
