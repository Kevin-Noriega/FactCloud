import { useState } from "react";
import { ClockHistory, PersonFill, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useAdminAuditoria } from "../../hooks/useAdmin";

const ACCION_COLOR = {
  CREAR_PLAN: "#22c55e",
  EDITAR_PLAN: "#3b82f6",
  ELIMINAR_PLAN: "#ef4444",
  ACTIVAR_PLAN: "#22c55e",
  DESACTIVAR_PLAN: "#f59e0b",
  CREAR: "#22c55e",
  EDITAR: "#3b82f6",
  ELIMINAR: "#ef4444",
};

const accionColor = (accion) => {
  for (const key of Object.keys(ACCION_COLOR)) {
    if (accion?.toUpperCase().includes(key)) return ACCION_COLOR[key];
  }
  return "#64748b";
};

const fmtFecha = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function AdminAuditoria() {
  const [pagina, setPagina] = useState(1);
  const { data, isLoading, isError } = useAdminAuditoria(pagina);

  const registros = data?.registros ?? [];
  const total = data?.total ?? 0;
  const tamano = data?.tamano ?? 20;
  const totalPaginas = Math.max(1, Math.ceil(total / tamano));

  return (
    <div className="admin-page-container">
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Auditoría</h2>
        </div>
        <p className="admin-page-subtitle">
          {total} acciones en el sistema
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {isError && (
        <div className="alert alert-danger">Error al cargar el historial de auditoría.</div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Administrador</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>
              <tbody>
                {registros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">Sin registros de auditoría</td>
                  </tr>
                ) : (
                  registros.map((r) => (
                    <tr key={r.id}>
                      <td className="text-muted" style={{ fontSize: "0.8rem" }}>{r.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 30, height: 30, borderRadius: "50%",
                            background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <PersonFill size={14} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{r.adminNombre}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID {r.adminId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: accionColor(r.accion) + "22",
                            color: accionColor(r.accion),
                            border: `1px solid ${accionColor(r.accion)}44`,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "4px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {r.accion}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "#475569", maxWidth: 300 }}>{r.detalle ?? "—"}</td>
                      <td style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap" }}>
                        <ClockHistory size={12} className="me-1" />
                        {fmtFecha(r.fechaHora)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Página {pagina} de {totalPaginas}
              </span>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
