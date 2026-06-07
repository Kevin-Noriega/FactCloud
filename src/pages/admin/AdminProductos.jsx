import { useState, useMemo } from "react";
import {
  BoxSeamFill,
  Search,
  PlusCircleFill,
  TrashFill,
  PencilFill,
  TagFill,
  ArrowRepeat,
} from "react-bootstrap-icons";
import {
  useAdminProductos,
  useAdminEliminarProducto,
} from "../../hooks/useAdmin";
import axiosClient from "../../api/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const useEditarProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await axiosClient.patch(`/Admin/productos/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "productos"] });
      toast.success("Producto actualizado correctamente");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.mensaje || err?.message || "Error al actualizar producto");
    },
  });
};

const useCrearProductoAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/Admin/productos", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "productos"] });
      toast.success("Producto creado correctamente");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.mensaje || err?.message || "Error al crear producto");
    },
  });
};

// ── Modal editar / crear producto ─────────────────────────────
function ModalProducto({ producto, onClose, onGuardar, loading }) {
  const esEdicion = !!producto?.id;
  const [form, setForm] = useState({
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    precioUnitario: producto?.precioUnitario ?? "",
    unidadMedida: producto?.unidadMedida ?? "UND",
    tarifaIVA: producto?.tarifaIVA ?? 19,
    codigoInterno: producto?.codigoInterno ?? "",
    codigoBarras: producto?.codigoBarras ?? "",
    usuarioId: producto?.usuarioId ?? "",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Requerido";
    if (!form.precioUnitario || isNaN(Number(form.precioUnitario)))
      errs.precioUnitario = "Precio inválido";
    if (!esEdicion && !form.usuarioId) errs.usuarioId = "Requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onGuardar({ ...form, precioUnitario: Number(form.precioUnitario) });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <BoxSeamFill size={16} />
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="row g-3">
              {!esEdicion && (
                <div className="col-12">
                  <label className="admin-form-label">ID de usuario *</label>
                  <input
                    type="number"
                    className={`admin-form-control ${errors.usuarioId ? "border-danger" : ""}`}
                    value={form.usuarioId}
                    onChange={set("usuarioId")}
                    placeholder="ID del usuario propietario"
                    min={1}
                  />
                  {errors.usuarioId && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.usuarioId}</div>}
                </div>
              )}
              <div className="col-12">
                <label className="admin-form-label">Nombre *</label>
                <input
                  className={`admin-form-control ${errors.nombre ? "border-danger" : ""}`}
                  value={form.nombre}
                  onChange={set("nombre")}
                  placeholder="Nombre del producto o servicio"
                />
                {errors.nombre && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.nombre}</div>}
              </div>

              <div className="col-12">
                <label className="admin-form-label">Descripción</label>
                <textarea
                  className="admin-form-control"
                  rows={2}
                  value={form.descripcion}
                  onChange={set("descripcion")}
                  placeholder="Descripción opcional"
                />
              </div>

              <div className="col-6">
                <label className="admin-form-label">Precio unitario *</label>
                <input
                  type="number"
                  className={`admin-form-control ${errors.precioUnitario ? "border-danger" : ""}`}
                  value={form.precioUnitario}
                  onChange={set("precioUnitario")}
                  placeholder="0"
                  min="0"
                />
                {errors.precioUnitario && <div className="text-danger" style={{ fontSize: "0.78rem" }}>{errors.precioUnitario}</div>}
              </div>

              <div className="col-6">
                <label className="admin-form-label">IVA (%)</label>
                <select className="admin-form-select" value={form.tarifaIVA} onChange={set("tarifaIVA")}>
                  {[0, 5, 19].map((t) => (
                    <option key={t} value={t}>{t}%</option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="admin-form-label">Unidad de medida</label>
                <select className="admin-form-select" value={form.unidadMedida} onChange={set("unidadMedida")}>
                  {["UND", "KG", "LT", "MT", "M2", "CM", "HRS", "DIA", "MES"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="admin-form-label">Código interno</label>
                <input
                  className="admin-form-control"
                  value={form.codigoInterno}
                  onChange={set("codigoInterno")}
                  placeholder="Ej: PROD-001"
                />
              </div>

              <div className="col-12">
                <label className="admin-form-label">Código de barras</label>
                <input
                  className="admin-form-control"
                  value={form.codigoBarras}
                  onChange={set("codigoBarras")}
                  placeholder="EAN-13, UPC..."
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
                "Crear producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal eliminar ──────────────────────────────────────────────
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
          <div className="mt-3 p-3" style={{ background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#dc2626" }}>Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button className="admin-btn admin-btn-danger" onClick={onConfirmar} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 12;

export default function AdminProductos() {
  const { data: productos = [], isLoading, isError, refetch } = useAdminProductos();
  const eliminarMut = useAdminEliminarProducto();
  const editarMut = useEditarProducto();
  const crearMut = useCrearProductoAdmin();

  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalProducto, setModalProducto] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q) ||
        p.codigoInterno?.toLowerCase().includes(q) ||
        p.codigoBarras?.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  const totalPaginas = Math.ceil(productosFiltrados.length / PAGE_SIZE);
  const paginados = productosFiltrados.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  const handleGuardar = async (payload) => {
    if (modalProducto?.id) {
      await editarMut.mutateAsync({ id: modalProducto.id, ...payload });
    } else {
      await crearMut.mutateAsync({ ...payload, usuarioId: Number(payload.usuarioId) });
    }
    setModalProducto(null);
  };

  const handleEliminar = async () => {
    await eliminarMut.mutateAsync(modalEliminar.id);
    setModalEliminar(null);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary me-3" />
        <span className="text-muted">Cargando productos...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger m-3">Error al cargar productos.</div>;
  }

  return (
    <div>
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title"> Gestión de Productos</h2>

          <div className="d-flex gap-2">
            <button className="admin-btn admin-btn-ghost" onClick={() => refetch()}>
              <ArrowRepeat size={15} /> Actualizar
            </button>
            <button className="admin-btn admin-btn-primary" onClick={() => setModalProducto({})}>
              <PlusCircleFill size={15} /> Nuevo Producto
            </button>
          </div>
        </div>
        <p className="admin-page-subtitle">
          {productos.length} productos y servicios registrados
        </p>
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-3">
        <div className="admin-toolbar">
          <div className="admin-toolbar-search admin-search-bar">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-form-control"
              placeholder="Buscar por nombre, código..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            />
          </div>
          <span className="ms-auto text-muted" style={{ fontSize: "0.8rem" }}>
            {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? "s" : ""}
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
                <th>Producto / Servicio</th>
                <th>Código</th>
                <th>Precio unitario</th>
                <th>IVA</th>
                <th>Unidad</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                paginados.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--text-muted-light)", fontSize: "0.8rem" }}>
                      {(pagina - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-muted-light)" }}>{p.nombre}</div>
                      {p.descripcion && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted-light)" }}>
                          {p.descripcion.slice(0, 60)}{p.descripcion.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.codigoInterno ? (
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "1.1 rem",
                            border: "1px solid var(--border-admin-hero)",
                            padding: "4px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {p.codigoInterno}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700 }}>{fmt(p.precioUnitario)}</td>
                    <td>
                      <span className={`admin-badge ${p.impuestoCargo > 0 ? "info" : "neutral"}`}>
                        <TagFill size={10} /> {p.impuestoCargo ?? 0}%
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>{p.unidadMedida || "—"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Editar"
                          onClick={() => setModalProducto(p)}
                        >
                          <PencilFill size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Eliminar"
                          onClick={() => setModalEliminar(p)}
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

        {totalPaginas > 1 && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Página {pagina} de {totalPaginas}
            </span>
            <div className="admin-pagination">
              <button className="admin-page-btn" onClick={() => setPagina(1)} disabled={pagina === 1}>«</button>
              <button className="admin-page-btn" onClick={() => setPagina((p) => p - 1)} disabled={pagina === 1}>‹</button>
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPaginas - 4, pagina - 2)) + i;
                return (
                  <button key={p} className={`admin-page-btn ${pagina === p ? "active" : ""}`} onClick={() => setPagina(p)}>{p}</button>
                );
              })}
              <button className="admin-page-btn" onClick={() => setPagina((p) => p + 1)} disabled={pagina === totalPaginas}>›</button>
              <button className="admin-page-btn" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>»</button>
            </div>
          </div>
        )}
      </div>

      {modalProducto !== null && (
        <ModalProducto
          producto={modalProducto?.id ? modalProducto : null}
          onClose={() => setModalProducto(null)}
          onGuardar={handleGuardar}
          loading={editarMut.isPending || crearMut.isPending}
        />
      )}

      {modalEliminar && (
        <ModalConfirmar
          mensaje={`¿Eliminar el producto "${modalEliminar.nombre}"?`}
          onConfirmar={handleEliminar}
          onCancelar={() => setModalEliminar(null)}
          loading={eliminarMut.isPending}
        />
      )}
    </div>
  );
}
