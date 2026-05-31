import React, { useState } from "react";
import {
  Calendar,
  Plus,
  ChevronDown,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function PosShiftsPage() {
  const [dateFrom, setDateFrom] = useState("2026-01-28");
  const [dateTo, setDateTo] = useState("2026-05-24");

  const mockShifts = [
    {
      id: "5",
      vendorName: "JHON ELKIN VARGAS PRADO",
      openedAt: "28 ene 2026 12:29 a. m.",
      closedAt: null,
      status: "open",
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
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e" }}>
          Turnos &gt; Registro de turnos
        </h1>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#1565C0",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Iniciar turno
        </button>
      </div>

      <div style={{ padding: 24, flex: 1 }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid #e0e7ef",
              borderRadius: 8,
              padding: "8px 14px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <Calendar size={16} color="#1565C0" />
            <span style={{ fontSize: 14, color: "#333" }}>Inicio</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#333",
              }}
            />
          </div>

          <span style={{ color: "#666", fontSize: 14 }}>a</span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid #e0e7ef",
              borderRadius: 8,
              padding: "8px 14px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <Calendar size={16} color="#1565C0" />
            <span style={{ fontSize: 14, color: "#333" }}>Fin</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#333",
              }}
            />
          </div>

          <div style={{ flex: 1 }} />

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
            Descargar Excel
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #e8f0fe",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1565C0" }}>
                {[
                  "N° Turno",
                  "Vendedor",
                  "Fecha/hora Inicio",
                  "Fecha/hora Fin",
                  "Estado",
                  "Acciones",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {col}
                      {col !== "Acciones" && (
                        <ChevronDown size={12} color="rgba(255,255,255,0.7)" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockShifts.map((shift) => (
                <tr
                  key={shift.id}
                  style={{ borderBottom: "1px solid #f0f4fc" }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "#333",
                      fontWeight: 500,
                    }}
                  >
                    {shift.id}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "#333",
                    }}
                  >
                    {shift.vendorName}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "#666",
                    }}
                  >
                    {shift.openedAt}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "#666",
                    }}
                  >
                    {shift.closedAt ?? "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <CheckCircle size={16} color="#4CAF50" />
                      <span
                        style={{
                          fontSize: 13,
                          color: "#2e7d32",
                          fontWeight: 500,
                        }}
                      >
                        Abierto
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 0 }}
                    >
                      <button
                        style={{
                          padding: "6px 14px",
                          background: "none",
                          border: "1.5px solid #e0e7ef",
                          borderRadius: "6px 0 0 6px",
                          color: "#1565C0",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Cerrar turno
                      </button>
                      <button
                        style={{
                          padding: "6px 8px",
                          background: "none",
                          border: "1.5px solid #e0e7ef",
                          borderLeft: "none",
                          borderRadius: "0 6px 6px 0",
                          color: "#666",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #f0f4fc",
            }}
          >
            <span style={{ fontSize: 13, color: "#666" }}>
              Mostrando 1 - 1 de 1 registros
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {["|‹", "‹", "›", "›|"].map((btn, i) => (
                <button
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid #e0e7ef",
                    borderRadius: 4,
                    background: "#fff",
                    cursor: "pointer",
                    color: "#666",
                    fontSize: 12,
                  }}
                >
                  {btn}
                </button>
              ))}
              <select
                style={{
                  border: "1px solid #e0e7ef",
                  borderRadius: 4,
                  padding: "4px 8px",
                  fontSize: 12,
                  color: "#1565C0",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option>10 por página</option>
                <option>25 por página</option>
                <option>50 por página</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
