import React, { useMemo, useState } from "react";
import {
  BarChart2,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { CircularProgress } from "@mui/material";
import { useDailyReport, useCurrency } from "../../hooks/pos/usePosHooks";

const today = () => new Date().toISOString().slice(0, 10);
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function PosReportsPage() {
  const { format } = useCurrency();
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());

  const params = useMemo(() => ({ from, to }), [from, to]);
  const { data, isLoading, isFetching } = useDailyReport(params);

  const stats = [
    {
      label: "Ventas",
      value: format(data?.totalVentas ?? 0),
      icon: <DollarSign size={20} />,
      color: "#1565C0",
    },
    {
      label: "Transacciones",
      value: String(data?.transacciones ?? 0),
      icon: <ShoppingBag size={20} />,
      color: "#2e7d32",
    },
    {
      label: "Ticket promedio",
      value: format(data?.ticketPromedio ?? 0),
      icon: <TrendingUp size={20} />,
      color: "#e65100",
    },
    {
      label: "Clientes atendidos",
      value: String(data?.clientes ?? 0),
      icon: <Users size={20} />,
      color: "#6a1b9a",
    },
  ];

  const metodos = [
    { label: "Efectivo", value: data?.porMetodo?.efectivo ?? 0 },
    { label: "Tarjeta", value: data?.porMetodo?.tarjeta ?? 0 },
    { label: "Pagos en línea", value: data?.porMetodo?.pagosLinea ?? 0 },
    { label: "Otros", value: data?.porMetodo?.otros ?? 0 },
    { label: "Crédito", value: data?.porMetodo?.credito ?? 0 },
  ];

  const exportCsv = () => {
    const ventas = data?.ventas ?? [];
    if (!ventas.length) return;
    const header = ["N° Venta", "Fecha", "Cliente", "Total"];
    const rows = ventas.map((v) => [v.numeroVenta, fmtDateTime(v.fecha), v.clienteNombre, v.total]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_pos_${from}_a_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f8fbff" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
          <BarChart2 size={22} color="#1565C0" />
          Reportes POS
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DateField label="Desde" value={from} onChange={setFrom} />
          <DateField label="Hasta" value={to} onChange={setTo} />
          {isFetching && <CircularProgress size={18} style={{ color: "#1565C0" }} />}
          <button onClick={exportCsv} disabled={!data?.ventas?.length} style={outlineBtn(!data?.ventas?.length)}>
            <Download size={15} /> Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ background: "#fff", border: "1.5px solid #e8f0fe", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>{stat.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e" }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <CircularProgress />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {/* Ventas por medio de pago */}
            <Card title="Ventas por medio de pago">
              {metodos.map((m) => (
                <Row key={m.label} label={m.label} value={format(m.value)} />
              ))}
            </Card>

            {/* Top productos */}
            <Card title="Productos más vendidos">
              {(data?.topProductos ?? []).length === 0 ? (
                <Empty />
              ) : (
                data.topProductos.map((p) => (
                  <Row key={p.nombre} label={`${p.nombre} (${p.cantidad})`} value={format(p.total)} />
                ))
              )}
            </Card>

            {/* Últimas ventas */}
            <Card title="Últimas ventas" wide>
              {(data?.ventas ?? []).length === 0 ? (
                <Empty />
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#888", fontSize: 12 }}>
                      <th style={{ padding: "6px 4px" }}>N°</th>
                      <th style={{ padding: "6px 4px" }}>Fecha</th>
                      <th style={{ padding: "6px 4px" }}>Cliente</th>
                      <th style={{ padding: "6px 4px", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ventas.map((v) => (
                      <tr key={v.numeroVenta} style={{ borderTop: "1px solid #f0f4fc" }}>
                        <td style={cell}>{v.numeroVenta}</td>
                        <td style={cell}>{fmtDateTime(v.fecha)}</td>
                        <td style={cell}>{v.clienteNombre}</td>
                        <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>{format(v.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children, wide }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e8f0fe", borderRadius: 12, padding: 20, gridColumn: wide ? "1 / -1" : "auto" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginTop: 0, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f6fb", fontSize: 14 }}>
      <span style={{ color: "#555" }}>{label}</span>
      <strong style={{ color: "#1a1a2e" }}>{value}</strong>
    </div>
  );
}

function Empty() {
  return <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", padding: 20 }}>Sin datos en el rango seleccionado.</p>;
}

function DateField({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1.5px solid #e0e7ef", borderRadius: 8, padding: "7px 12px", background: "#fff" }}>
      <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: "#333" }} />
    </div>
  );
}

const cell = { padding: "8px 4px", fontSize: 13, color: "#444" };
const outlineBtn = (disabled) => ({ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid #e0e7ef", borderRadius: 8, padding: "8px 14px", color: disabled ? "#aaa" : "#1565C0", fontSize: 14, cursor: disabled ? "not-allowed" : "pointer" });
