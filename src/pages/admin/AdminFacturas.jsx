import { useState, useMemo } from "react";
import {
  FileEarmarkTextFill,
  Search,
  TrashFill,
  PencilSquare,
  EyeFill,
  FunnelFill,
  Download,
} from "react-bootstrap-icons";
import { useAdminFacturas, useAdminCambiarEstadoFactura, useAdminEliminarFactura } from "../../hooks/useAdmin";

const exportarCSV = (facturas) => {
  const headers = ["ID", "N° Factura", "Cliente", "Fecha", "Subtotal", "IVA", "Total", "Estado", "Forma Pago"];
  const rows = facturas.map((f) => [
    f.id,
    `${f.prefijo || ""}${f.numeroFactura || ""}`,
    f.nombreCliente || "",
    f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString("es-CO") : "",
    f.subtotal || 0,
    f.totalIVA || 0,
    f.totalFactura || 0,
    f.estado || "",
    f.formaPago || ""
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
  a.download = `facturas_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

const ESTADOS_FACTURA = [
  "Borrador",
  "Pendiente",
  "Emitida",
  "Pagada",
  "Anulada",
  "Cancelada",
];

const estadoBadge = (estado) => {
  const map = {
    Emitida: "success",
    Pagada: "success",
    Pendiente: "warning",
    Borrador: "neutral",
    Anulada: "danger",
    Cancelada: "danger",
  };
  return map[estado] || "neutral";
};

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtFecha = (str) => {
  if (!str) return "—";
  return new Date(str.replace(" ", "T")).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Modal cambiar estado ────────────────────────────────────────
function ModalCambiarEstado({ factura, onClose, onGuardar, loading }) {
  const [estado, setEstado] = useState(factura.estado || "Borrador");

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <PencilSquare size={16} /> Cambiar Estado
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
            Factura: <strong>{factura.prefijo}{factura.numeroFactura || factura.id}</strong>
          </p>
          <label className="admin-form-label">Nuevo estado</label>
          <select
            className="admin-form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            {ESTADOS_FACTURA.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => onGuardar(estado)}
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal detalle factura ───────────────────────────────────────
function ModalDetalle({ factura, onClose }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <FileEarmarkTextFill size={16} />
            Factura {factura.prefijo}{factura.numeroFactura || factura.id}
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <div className="row g-3">
            <div className="col-6">
              <label className="admin-form-label">Estado</label>
              <div>
                <span className={`admin-badge ${estadoBadge(factura.estado)}`}>
                  {factura.estado || "—"}
                </span>
              </div>
            </div>
            <div className="col-6">
              <label className="admin-form-label">Fecha emisión</label>
              <div style={{ fontSize: "0.875rem", color: "#1e293b" }}>
                {fmtFecha(factura.fechaEmision)}
              </div>
            </div>
            <div className="col-12">
              <label className="admin-form-label">Cliente</label>
              <div style={{ fontSize: "0.875rem", color: "#1e293b" }}>
                {factura.nombreCliente || factura.cliente?.nombre || `ID: ${factura.clienteId}`}
              </div>
            </div>
            <div className="col-6">
              <label className="admin-form-label">Subtotal</label>
              <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{fmt(factura.subtotal)}</div>
            </div>
            <div className="col-6">
              <label className="admin-form-label">IVA</label>
              <div style={{ fontSize: "0.875rem" }}>{fmt(factura.totalIVA)}</div>
            </div>
            <div className="col-6">
              <label className="admin-form-label">Descuentos</label>
              <div style={{ fontSize: "0.875rem", color: "#dc2626" }}>-{fmt(factura.totalDescuentos)}</div>
            </div>
            <div className="col-6">
              <label className="admin-form-label">Forma de pago</label>
              <div style={{ fontSize: "0.875rem" }}>{factura.formaPago || "—"}</div>
            </div>
            <div className="col-12">
              <div
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, color: "#0369a1" }}>Total Factura</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  {fmt(factura.totalFactura)}
                </span>
              </div>
            </div>
            {factura.observaciones && (
              <div className="col-12">
                <label className="admin-form-label">Observaciones</label>
                <div
                  style={{
                    padding: "9px 14px",
                    background: "#f8fafc",
                    borderRadius: 9,
                    fontSize: "0.875rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {factura.observaciones}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
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

export default function AdminFacturas() {
  const { data: facturas = [], isLoading, isError } = useAdminFacturas();
  const cambiarEstadoMut = useAdminCambiarEstadoFactura();
  const eliminarMut = useAdminEliminarFactura();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const [modalEstado, setModalEstado] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) => {
      const q = busqueda.toLowerCase();
      const coincideBusqueda =
        !q ||
        (f.numeroFactura && String(f.numeroFactura).includes(q)) ||
        (f.nombreCliente && f.nombreCliente.toLowerCase().includes(q)) ||
        (f.cliente?.nombre && f.cliente.nombre.toLowerCase().includes(q));
      const coincideEstado =
        filtroEstado === "todos" || f.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }, [facturas, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(facturasFiltradas.length / PAGE_SIZE);
  const paginadas = facturasFiltradas.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  const totalFiltrado = facturasFiltradas.reduce(
    (sum, f) => sum + (f.totalFactura || 0),
    0
  );

  const handleCambiarEstado = async (nuevoEstado) => {
    await cambiarEstadoMut.mutateAsync({ id: modalEstado.id, estado: nuevoEstado });
    setModalEstado(null);
  };

  const handleEliminar = async () => {
    await eliminarMut.mutateAsync(modalEliminar.id);
    setModalEliminar(null);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary me-3" />
        <span className="text-muted">Cargando facturas...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger m-3">Error al cargar facturas.</div>;
  }

  return (
    <div>
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Gestión de Facturas</h2>

          <button
            className="admin-btn admin-btn-primary"
            onClick={() => exportarCSV(facturasFiltradas)}
            title="Exportar CSV"
          >
            <Download size={14} /> Exportar CSV
          </button>
        </div>
        <p className="admin-page-subtitle">
          {facturas.length} facturas en el sistema
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="row g-3 mb-4">
        {ESTADOS_FACTURA.slice(0, 4).map((e) => {
          const count = facturas.filter((f) => f.estado === e).length;
          const pct = facturas.length > 0 ? ((count / facturas.length) * 100).toFixed(0) : 0;
          return (
            <div key={e} className="col-6 col-md-3">
              <div
                className="admin-card text-center"
                style={{ cursor: "pointer", borderColor: filtroEstado === e ? "#2563eb" : "var(--border-admin)" }}
                onClick={() => { setFiltroEstado(filtroEstado === e ? "todos" : e); setPagina(1); }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-muted-light)" }}>{count}</div>
                <span className={`admin-badge ${estadoBadge(e)}`}>{e}</span>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted-light)", marginTop: 4 }}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-3">
        <div className="admin-toolbar">
          <div className="admin-toolbar-search admin-search-bar">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-form-control"
              placeholder="Buscar por N° factura o cliente..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="admin-form-select"
              style={{ width: 150 }}
              value={filtroEstado}
              onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}
            >
              <option value="todos">Todos los estados</option>
              {ESTADOS_FACTURA.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="ms-auto d-flex align-items-center gap-3">
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {facturasFiltradas.length} factura{facturasFiltradas.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted-light)" }}>
              Total: {fmt(totalFiltrado)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° Factura</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>Total</th>
                <th>Estado</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginadas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                paginadas.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                        {f.prefijo || ""}{f.numeroFactura || f.id}
                      </span>
                    </td>
                    <td>{f.nombreCliente || f.cliente?.nombre || `#${f.clienteId}`}</td>
                    <td style={{ fontSize: "0.85rem" }}>{fmtFecha(f.fechaEmision)}</td>
                    <td style={{ fontSize: "0.85rem" }}>{fmt(f.subtotal)}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(f.totalFactura)}</td>
                    <td>
                      <span className={`admin-badge ${estadoBadge(f.estado)}`}>
                        {f.estado || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Ver detalle"
                          onClick={() => setModalDetalle(f)}
                        >
                          <EyeFill size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Cambiar estado"
                          onClick={() => setModalEstado(f)}
                        >
                          <PencilSquare size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Eliminar"
                          onClick={() => setModalEliminar(f)}
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

      {modalEstado && (
        <ModalCambiarEstado
          factura={modalEstado}
          onClose={() => setModalEstado(null)}
          onGuardar={handleCambiarEstado}
          loading={cambiarEstadoMut.isPending}
        />
      )}

      {modalDetalle && (
        <ModalDetalle factura={modalDetalle} onClose={() => setModalDetalle(null)} />
      )}

      {modalEliminar && (
        <ModalConfirmar
          mensaje={`¿Eliminar la factura ${modalEliminar.prefijo || ""}${modalEliminar.numeroFactura || modalEliminar.id}?`}
          onConfirmar={handleEliminar}
          onCancelar={() => setModalEliminar(null)}
          loading={eliminarMut.isPending}
        />
      )}
    </div>
  );
}
