import { useState } from "react";
import {
  PeopleFill,
  PersonLinesFill,
  FileEarmarkTextFill,
  BoxSeamFill,
  CurrencyDollar,
  CheckCircleFill,
  ExclamationTriangleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAdminEstadisticas } from "../../hooks/useAdmin";
import { HeroBanner } from "../../components/dashboard/HeroBanner";


const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtNum = (n) => new Intl.NumberFormat("es-CO").format(n || 0);

const fmtFecha = (str) => {
  if (!str) return "—";
  return new Date(str.replace(" ", "T")).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"];

export default function AdminDashboard() {
  const {
    loading,
    totalUsuarios,
    usuariosActivos,
    totalClientes,
    totalProductos,
    totalFacturas,
    totalIngresos,
    facturasEmitidas,
    facturasPendientes,
    facturasAnuladas,
    ventasPorMes,
    ventasPorPlan,
    topClientes,
    tiposDocumentos,
    tiposProductos,
  } = useAdminEstadisticas();

  const [vistaGrafico, setVistaGrafico] = useState("barras");

  const pieData = [
    { name: "Emitidas", value: facturasEmitidas },
    { name: "Pendientes", value: facturasPendientes },
    { name: "Anuladas", value: facturasAnuladas },
    {
      name: "Otros",
      value: Math.max(
        0,
        totalFacturas - facturasEmitidas - facturasPendientes - facturasAnuladas
      ),
    },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary me-3" role="status" />
        <span className="text-muted">Cargando estadísticas del sistema...</span>
      </div>
    );
  }

  return (
    <div >
      {/* Encabezado */}
      <HeroBanner />

      {/* ── Métricas principales ── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <div className="admin-metric-card">
            <div className="admin-metric-icon teal">
              <CurrencyDollar size={22} />
            </div>
            <div className="admin-metric-body">
              <div className="admin-metric-value">
                {fmt(totalIngresos)}
              </div>
              <div className="admin-metric-label">Ingresos totales</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="admin-metric-card">
            <div className="admin-metric-icon blue">
              <PeopleFill size={22} />
            </div>
            <div className="admin-metric-body">
              <div className="admin-metric-value">{fmtNum(totalUsuarios)}</div>
              <div className="admin-metric-label">Usuarios registrados</div>
              <div className="admin-metric-change up">
                {usuariosActivos} activos
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="admin-metric-card">
            <div className="admin-metric-icon purple">
              <FileEarmarkTextFill size={22} />
            </div>
            <div className="admin-metric-body">
              <div className="admin-metric-value">{fmtNum(totalFacturas)}</div>
              <div className="admin-metric-label">Facturas totales</div>
              <div className="admin-metric-change up">
                {facturasEmitidas} emitidas
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="admin-metric-card">
            <div className="admin-metric-icon green">
              <PersonLinesFill size={22} />
            </div>
            <div className="admin-metric-body">
              <div className="admin-metric-value">{fmtNum(totalClientes)}</div>
              <div className="admin-metric-label">Clientes totales</div>
              <div className="admin-metric-change up">
                {totalClientes} activos
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="admin-metric-card">
            <div className="admin-metric-icon blue">
              <BoxSeamFill size={20} />
            </div>
            <div className="admin-metric-body">
              <div className="admin-metric-value">{fmtNum(totalProductos)}</div>
              <div className="admin-metric-label">Productos totales</div>
              <div className="admin-metric-change up">
                {totalProductos} activos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gráfico de ventas y distribución ── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Ventas por Mes</div>
                <div className="admin-card-subtitle">Año {new Date().getFullYear()}</div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`admin-btn admin-btn-sm ${vistaGrafico === "barras" ? "admin-btn-primary" : "admin-btn-ghost"}`}
                  onClick={() => setVistaGrafico("barras")}
                >
                  Barras
                </button>
                <button
                  className={`admin-btn admin-btn-sm ${vistaGrafico === "linea" ? "admin-btn-primary" : "admin-btn-ghost"}`}
                  onClick={() => setVistaGrafico("linea")}
                >
                  Línea
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              {vistaGrafico === "barras" ? (
                <BarChart data={ventasPorMes} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1_000_000
                        ? `$${(v / 1_000_000).toFixed(1)}M`
                        : v >= 1_000
                          ? `$${(v / 1_000).toFixed(0)}K`
                          : `$${v}`
                    }
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v) => [fmt(v), "Total"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="total" fill="#2563eb" radius={[5, 5, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={ventasPorMes} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1_000_000
                        ? `$${(v / 1_000_000).toFixed(1)}M`
                        : v >= 1_000
                          ? `$${(v / 1_000).toFixed(0)}K`
                          : `$${v}`
                    }
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v) => [fmt(v), "Total"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#2563eb" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div className="admin-card-title">Estado de Facturas</div>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span style={{ fontSize: 12, color: "#ffffffff" }}>{value}</span>
                    )}
                  />
                  <Tooltip formatter={(v) => [fmtNum(v), "Facturas"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted py-5">Sin datos de facturas</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Ventas por plan + Tipos de documentos ── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div className="admin-card-title">Tipos de Documentos</div>
            </div>
            {tiposDocumentos.filter((d) => d.cantidad > 0).length === 0 ? (
              <div className="text-center text-muted py-4">Sin documentos emitidos</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={tiposDocumentos.filter((d) => d.cantidad > 0)}
                    dataKey="cantidad"
                    nameKey="tipo"
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {tiposDocumentos.map((_, i) => (
                      <Cell key={i} fill={["#2563eb", "#16a34a", "#f59e0b", "#7c3aed"][i % 4]} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => <span style={{ fontSize: 12, color: "#ffffffff" }}>{value}</span>}
                  />
                  <Tooltip formatter={(v) => [fmtNum(v), "Documentos"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Suscriptores por Plan</div>
                <div className="admin-card-subtitle">Distribución de planes activos</div>
              </div>
            </div>
            {ventasPorPlan.length === 0 ? (
              <div className="text-center text-muted py-4">Sin suscripciones activas</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ventasPorPlan} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="plan" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip
                    formatter={(v) => [v, "Usuarios"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="cantidad" fill="#7c3aed" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>


      </div>

      {/* ── Top clientes + Tipos de productos ── */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Unidades de Medida más Usadas</div>
                <div className="admin-card-subtitle">En líneas de factura</div>
              </div>
            </div>
            {tiposProductos.length === 0 ? (
              <div className="text-center text-muted py-4">Sin datos de productos</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tiposProductos} layout="vertical" margin={{ top: 4, right: 16, left: 60, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <YAxis dataKey="tipo" type="category" tick={{ fontSize: 11, fill: "#64748b" }} width={60} />
                  <Tooltip
                    formatter={(v) => [fmtNum(v), "Líneas"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="cantidad" fill="#0d9488" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Top 5 Clientes</div>
                <div className="admin-card-subtitle">Por valor facturado</div>
              </div>
            </div>
            {topClientes.length === 0 ? (
              <div className="text-center text-muted py-4">Sin datos</div>
            ) : (
              <div>
                {topClientes.map((c, i) => {
                  const pct = totalIngresos > 0 ? (c.total / totalIngresos) * 100 : 0;
                  return (
                    <div key={i} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffffff" }}>{c.nombre}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{fmt(c.total)}</div>
                      </div>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#2563eb", borderRadius: 99, transition: "width 0.6s ease" }} />
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>
                        {c.count} facturas · {pct.toFixed(1)}% del total
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
