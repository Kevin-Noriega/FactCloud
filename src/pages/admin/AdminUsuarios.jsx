import { useState, useMemo } from "react";
import {
  PeopleFill,
  PlusCircleFill,
  PencilFill,
  TrashFill,
  LockFill,
  Search,
  PersonFillCheck,
  PersonFillX,
  ShieldFillCheck,
  Person,
  KeyFill,
} from "react-bootstrap-icons";
import {
  useAdminUsuarios,
  useAdminCrearUsuario,
  useAdminEditarUsuario,
  useAdminEliminarUsuario,
  useAdminCambiarEstadoUsuario,
  useAdminCambiarRolUsuario,
  useAdminResetPassword,
} from "../../hooks/useAdmin";

const ROLES = ["usuario", "admin"];

// estado llega como bool desde el backend
const estadoBadge = (estado) => {
  if (estado === true) return "success";
  if (estado === false) return "danger";
  return "neutral";
};

const estadoLabel = (estado) => (estado === true ? "Activo" : "Inactivo");

const rolBadge = (rol) => {
  if (!rol) return "neutral";
  return rol.toLowerCase() === "admin" ? "info" : "neutral";
};

// ── Modal: Crear / Editar usuario ─────────────────────────────
function ModalUsuario({ usuario, onClose, onGuardar, loading }) {
  const esEdicion = !!usuario?.id;
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? "",
    apellido: usuario?.apellido ?? "",
    correo: usuario?.correo ?? "",
    telefono: usuario?.telefono ?? "",
    rol: usuario?.rol ?? "usuario",
    estado: usuario?.estado ?? true,
    contrasena: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Requerido";
    if (!form.correo.trim()) errs.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      errs.correo = "Email inválido";
    if (!esEdicion && !form.contrasena.trim()) errs.contrasena = "Requerido";
    if (form.contrasena && form.contrasena.length < 6)
      errs.contrasena = "Mínimo 6 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (!payload.contrasena) delete payload.contrasena;
    onGuardar(payload);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <PeopleFill size={18} />
            {esEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label className="admin-form-label">Nombre *</label>
                <input
                  className={`admin-form-control ${errors.nombre ? "border-danger" : ""}`}
                  value={form.nombre}
                  onChange={set("nombre")}
                  placeholder="Juan"
                />
                {errors.nombre && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.nombre}</div>}
              </div>

              <div className="col-6">
                <label className="admin-form-label">Apellido</label>
                <input
                  className="admin-form-control"
                  value={form.apellido}
                  onChange={set("apellido")}
                  placeholder="Pérez"
                />
              </div>

              <div className="col-12">
                <label className="admin-form-label">Correo electrónico *</label>
                <input
                  type="email"
                  className={`admin-form-control ${errors.correo ? "border-danger" : ""}`}
                  value={form.correo}
                  onChange={set("correo")}
                  placeholder="usuario@empresa.com"
                />
                {errors.correo && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.correo}</div>}
              </div>

              <div className="col-12">
                <label className="admin-form-label">
                  Contraseña {esEdicion ? "(dejar vacío para no cambiar)" : "*"}
                </label>
                <input
                  type="password"
                  className={`admin-form-control ${errors.contrasena ? "border-danger" : ""}`}
                  value={form.contrasena}
                  onChange={set("contrasena")}
                  placeholder={esEdicion ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                />
                {errors.contrasena && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.contrasena}</div>}
              </div>

              <div className="col-6">
                <label className="admin-form-label">Rol</label>
                <select className="admin-form-select" value={form.rol} onChange={set("rol")}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="admin-form-label">Estado</label>
                <select
                  className="admin-form-select"
                  value={form.estado === true ? "true" : "false"}
                  onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value === "true" }))}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div className="col-12">
                <label className="admin-form-label">Teléfono</label>
                <input
                  className="admin-form-control"
                  value={form.telefono}
                  onChange={set("telefono")}
                  placeholder="300 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : esEdicion ? (
                "Guardar cambios"
              ) : (
                "Crear usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal: Reset contraseña ────────────────────────────────────
function ModalResetPassword({ usuario, onClose }) {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const resetMutation = useAdminResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass.length < 6) return setError("Mínimo 6 caracteres");
    if (pass !== confirm) return setError("Las contraseñas no coinciden");
    setError("");
    await resetMutation.mutateAsync({ id: usuario.id, nuevaContrasena: pass });
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <KeyFill size={16} /> Resetear Contraseña
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
              Cambiar contraseña de: <strong>{usuario.nombre} {usuario.apellido}</strong>
            </p>
            <div className="mb-3">
              <label className="admin-form-label">Nueva contraseña *</label>
              <input
                type="password"
                className="admin-form-control"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="mb-2">
              <label className="admin-form-label">Confirmar contraseña *</label>
              <input
                type="password"
                className="admin-form-control"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
              />
            </div>
            {error && <div className="text-danger" style={{ fontSize: "0.8rem" }}>{error}</div>}
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "Cambiar contraseña"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal: Confirmar eliminación ───────────────────────────────
function ModalConfirmar({ mensaje, onConfirmar, onCancelar, loading }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancelar}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <TrashFill size={16} style={{ color: "#dc2626" }} /> Confirmar eliminación
          </div>
          <button className="admin-modal-close" onClick={onCancelar}>✕</button>
        </div>
        <div className="admin-modal-body">
          <p style={{ fontSize: "0.9rem", color: "#374151" }}>{mensaje}</p>
          <div
            className="mt-3 p-3"
            style={{ background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#dc2626" }}>
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={onConfirmar}
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────
const PAGE_SIZE = 10;

export default function AdminUsuarios() {
  const { data: usuarios = [], isLoading, isError } = useAdminUsuarios();
  const crearMut = useAdminCrearUsuario();
  const editarMut = useAdminEditarUsuario();
  const eliminarMut = useAdminEliminarUsuario();
  const cambiarEstadoMut = useAdminCambiarEstadoUsuario();
  const cambiarRolMut = useAdminCambiarRolUsuario();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const [modalUsuario, setModalUsuario] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalReset, setModalReset] = useState(null);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const q = busqueda.toLowerCase();
      const coincideBusqueda =
        !q ||
        u.nombre?.toLowerCase().includes(q) ||
        u.apellido?.toLowerCase().includes(q) ||
        u.correo?.toLowerCase().includes(q);
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activo" && u.estado === true) ||
        (filtroEstado === "inactivo" && u.estado === false);
      const coincideRol =
        filtroRol === "todos" ||
        u.rol?.toLowerCase() === filtroRol.toLowerCase();
      return coincideBusqueda && coincideEstado && coincideRol;
    });
  }, [usuarios, busqueda, filtroEstado, filtroRol]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / PAGE_SIZE);
  const paginados = usuariosFiltrados.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  const handleGuardar = async (payload) => {
    if (modalUsuario?.id) {
      await editarMut.mutateAsync({ id: modalUsuario.id, ...payload });
    } else {
      await crearMut.mutateAsync(payload);
    }
    setModalUsuario(null);
  };

  const handleEliminar = async () => {
    await eliminarMut.mutateAsync(modalEliminar.id);
    setModalEliminar(null);
  };

  const toggleEstado = async (u) => {
    await cambiarEstadoMut.mutateAsync({ id: u.id, estado: !u.estado });
  };

  const toggleRol = async (u) => {
    const nuevoRol =
      u.rol === "admin" || u.rol === "Admin" ? "usuario" : "admin";
    await cambiarRolMut.mutateAsync({ id: u.id, rol: nuevoRol });
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary me-3" role="status" />
        <span className="text-muted">Cargando usuarios...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger m-3">
        Error al cargar usuarios. Verifica los permisos de administrador.
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Ventas</h2>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setModalUsuario({})}
          >
            <PlusCircleFill size={16} />
            Nuevo Usuario
          </button>
        </div>

        <p className="admin-page-subtitle">
          {usuarios.length} usuarios registrados en el sistema
        </p>
      </div>


      {/* Toolbar */}
      <div className="admin-card mb-3">
        <div className="admin-toolbar">
          {/* Búsqueda */}
          <div className="admin-toolbar-search admin-search-bar">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-form-control"
              placeholder="Buscar por nombre, apellido o correo..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            />
          </div>

          <select
            className="admin-form-select"
            style={{ width: 165 }}
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <select
            className="admin-form-select"
            style={{ width: 150 }}
            value={filtroRol}
            onChange={(e) => { setFiltroRol(e.target.value); setPagina(1); }}
          >
            <option value="todos">Todos los roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <span className="ms-auto text-muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
            {usuariosFiltrados.length} resultado{usuariosFiltrados.length !== 1 ? "s" : ""}
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
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Plan</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                paginados.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                      {(pagina - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-muted-light)" }}>
                        {u.nombre} {u.apellido}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        ID: {u.id}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>{u.correo}</td>
                    <td>
                      <span className={`admin-badge ${rolBadge(u.rol)}`}>
                        {u.rol === "admin" || u.rol === "Admin" ? (
                          <ShieldFillCheck size={11} />
                        ) : (
                          <Person size={11} />
                        )}
                        {u.rol || "usuario"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${estadoBadge(u.estado)}`}>
                        {estadoLabel(u.estado)}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted-light)" }}>
                      {u.planNombre || "—"}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {/* Editar */}
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Editar"
                          onClick={() => setModalUsuario(u)}
                        >
                          <PencilFill size={13} />
                        </button>

                        {/* Toggle estado */}
                        <button
                          className={`admin-btn admin-btn-sm ${u.estado === true ? "admin-btn-danger" : "admin-btn-success"}`}
                          title={u.estado === true ? "Desactivar" : "Activar"}
                          onClick={() => toggleEstado(u)}
                          disabled={cambiarEstadoMut.isPending}
                        >
                          {u.estado === true ? (
                            <PersonFillX size={13} />
                          ) : (
                            <PersonFillCheck size={13} />
                          )}
                        </button>

                        {/* Toggle rol */}
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title={u.rol === "admin" ? "Quitar Admin" : "Hacer Admin"}
                          onClick={() => toggleRol(u)}
                          disabled={cambiarRolMut.isPending}
                        >
                          <ShieldFillCheck
                            size={13}
                            style={{ color: u.rol === "admin" ? "#2563eb" : "#94a3b8" }}
                          />
                        </button>

                        {/* Reset password */}
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Resetear contraseña"
                          onClick={() => setModalReset(u)}
                        >
                          <LockFill size={13} />
                        </button>

                        {/* Eliminar */}
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Eliminar"
                          onClick={() => setModalEliminar(u)}
                        >
                          <TrashFill size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Página {pagina} de {totalPaginas}
            </span>
            <div className="admin-pagination">
              <button
                className="admin-page-btn"
                onClick={() => setPagina(1)}
                disabled={pagina === 1}
              >
                «
              </button>
              <button
                className="admin-page-btn"
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina === 1}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPaginas - 4, pagina - 2)) + i;
                return (
                  <button
                    key={p}
                    className={`admin-page-btn ${pagina === p ? "active" : ""}`}
                    onClick={() => setPagina(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                className="admin-page-btn"
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina === totalPaginas}
              >
                ›
              </button>
              <button
                className="admin-page-btn"
                onClick={() => setPagina(totalPaginas)}
                disabled={pagina === totalPaginas}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {modalUsuario !== null && (
        <ModalUsuario
          usuario={modalUsuario?.id ? modalUsuario : null}
          onClose={() => setModalUsuario(null)}
          onGuardar={handleGuardar}
          loading={crearMut.isPending || editarMut.isPending}
        />
      )}

      {modalEliminar && (
        <ModalConfirmar
          mensaje={`¿Estás seguro de que deseas eliminar a ${modalEliminar.nombre} ${modalEliminar.apellido}?`}
          onConfirmar={handleEliminar}
          onCancelar={() => setModalEliminar(null)}
          loading={eliminarMut.isPending}
        />
      )}

      {modalReset && (
        <ModalResetPassword
          usuario={modalReset}
          onClose={() => setModalReset(null)}
        />
      )}
    </div>
  );
}
