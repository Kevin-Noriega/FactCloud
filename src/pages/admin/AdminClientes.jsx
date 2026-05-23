import { useState, useMemo } from "react";
import {
  PersonLinesFill,
  Search,
  TrashFill,
  EnvelopeFill,
  TelephoneFill,
  GeoAltFill,
  FileEarmarkTextFill,
  Download,
} from "react-bootstrap-icons";
import { useAdminClientes, useAdminEliminarCliente } from "../../hooks/useAdmin";

const exportarCSV = (clientes) => {
  const headers = ["ID", "Nombre", "NIT/Doc", "Correo", "Teléfono", "Ciudad", "Dirección"];
  const rows = clientes.map((c) => [
    c.id, c.nombre || "", c.nit || "", c.correo || "", c.telefono || "", c.ciudad || "", c.direccion || ""
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
  a.download = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

// ── Modal confirmar eliminación ────────────────────────────────
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
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#dc2626" }}>
              Esta acción no se puede deshacer.
            </p>
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

// ── Modal detalle cliente ──────────────────────────────────────
function ModalDetalle({ cliente, onClose }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <PersonLinesFill size={18} /> Detalle del Cliente
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <div className="row g-3">
            <div className="col-12">
              <h5 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                {cliente.nombre || cliente.razonSocial}
              </h5>
              <span className={`admin-badge ${cliente.tipoPersona === "Jurídica" ? "info" : "neutral"}`}>
                {cliente.tipoPersona || "Natural"}
              </span>
            </div>

            {[
              { icon: <EnvelopeFill size={14} />, label: "Correo", val: cliente.correo || cliente.email },
              { icon: <TelephoneFill size={14} />, label: "Teléfono", val: cliente.telefono },
              { icon: <GeoAltFill size={14} />, label: "Dirección", val: cliente.direccion },
              { label: "NIT / Documento", val: cliente.nit || cliente.numeroDocumento },
              { label: "Ciudad", val: cliente.ciudad },
              { label: "Departamento", val: cliente.departamento },
              { label: "Régimen fiscal", val: cliente.regimenFiscal },
            ]
              .filter((f) => f.val)
              .map((f, i) => (
                <div key={i} className="col-12 col-md-6">
                  <label className="admin-form-label">
                    {f.icon && <span className="me-1">{f.icon}</span>}
                    {f.label}
                  </label>
                  <div
                    style={{
                      padding: "9px 14px",
                      background: "#f8fafc",
                      borderRadius: 9,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {f.val}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 12;

export default function AdminClientes() {
  const { data: clientes = [], isLoading, isError } = useAdminClientes();
  const eliminarMut = useAdminEliminarCliente();

  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(q) ||
        c.razonSocial?.toLowerCase().includes(q) ||
        c.correo?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.nit?.toLowerCase().includes(q) ||
        c.numeroDocumento?.toString().includes(q)
    );
  }, [clientes, busqueda]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / PAGE_SIZE);
  const paginados = clientesFiltrados.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  const handleEliminar = async () => {
    await eliminarMut.mutateAsync(modalEliminar.id);
    setModalEliminar(null);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary me-3" />
        <span className="text-muted">Cargando clientes...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger m-3">Error al cargar clientes.</div>;
  }

  return (
    <div>
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Gestión de Clientes</h2>

          <button
            className="admin-btn admin-btn-primary"
            onClick={() => exportarCSV(clientesFiltrados)}
            title="Exportar CSV"
          >
            <Download size={14} /> Exportar CSV
          </button>
        </div>
        <p className="admin-page-subtitle">
          {clientes.length} clientes registrados
        </p>
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-3">
        <div className="admin-toolbar">
          <div className="admin-toolbar-search admin-search-bar">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-form-control"
              placeholder="Buscar por nombre, correo o NIT..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            />
          </div>
          <span className="ms-auto text-muted" style={{ fontSize: "0.8rem" }}>
            {clientesFiltrados.length} resultado{clientesFiltrados.length !== 1 ? "s" : ""}
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
                <th>Nombre / Razón Social</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                paginados.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                      {(pagina - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td>
                      <button
                        className="link-button"
                        onClick={() => setModalDetalle(c)}
                        style={{ fontWeight: 600 }}
                      >
                        {c.nombre || c.razonSocial || "—"}
                      </button>
                    </td>
                    <td style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>
                      {c.nit || c.numeroDocumento || "—"}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {c.correo || c.email || "—"}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>{c.telefono || "—"}</td>
                    <td style={{ fontSize: "0.85rem" }}>{c.ciudad || "—"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Ver facturas"
                          onClick={() => setModalDetalle(c)}
                        >
                          <FileEarmarkTextFill size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Eliminar"
                          onClick={() => setModalEliminar(c)}
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

      {modalEliminar && (
        <ModalConfirmar
          mensaje={`¿Eliminar a ${modalEliminar.nombre || modalEliminar.razonSocial}?`}
          onConfirmar={handleEliminar}
          onCancelar={() => setModalEliminar(null)}
          loading={eliminarMut.isPending}
        />
      )}

      {modalDetalle && (
        <ModalDetalle cliente={modalDetalle} onClose={() => setModalDetalle(null)} />
      )}
    </div>
  );
}
