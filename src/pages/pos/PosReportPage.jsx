import React from "react";
import {
  BarChart2,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function PosReportsPage() {
  const stats = [
    {
      label: "Ventas hoy",
      value: "$1.240.000",
      icon: <DollarSign size={20} />,
      color: "#1565C0",
    },
    {
      label: "Transacciones",
      value: "18",
      icon: <ShoppingBag size={20} />,
      color: "#2e7d32",
    },
    {
      label: "Ticket promedio",
      value: "$68.889",
      icon: <TrendingUp size={20} />,
      color: "#e65100",
    },
    {
      label: "Clientes atendidos",
      value: "15",
      icon: <Users size={20} />,
      color: "#6a1b9a",
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8fbff",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8f0fe",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <BarChart2 size={22} color="#1565C0" />
          Reportes POS
        </h1>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "1.5px solid #e0e7ef",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#1565C0",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <Download size={15} />
          Exportar Excel
        </button>
      </div>

      <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                border: "1.5px solid #e8f0fe",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${stat.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon notice */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e8f0fe",
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
            color: "#aaa",
          }}
        >
          <BarChart2 size={48} strokeWidth={1} />
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#555",
              marginTop: 12,
            }}
          >
            Reportes completos disponibles en Fase 4
          </p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Ventas por hora, por cajero, por producto, exportación Excel/PDF y
            más.
          </p>
        </div>
      </div>
    </div>
  );
}
