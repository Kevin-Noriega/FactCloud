import React, { useMemo, useState } from "react";
import { Search, Plus, Download, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  useCashMovements,
  useCreateCashMovement,
  useCurrency,
  useDebouncedValue,
} from "../../hooks/pos/usePosHooks";

const firstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function PosCashMovementsPage() {
  const { format } = useCurrency();

  const [dateFrom, setDateFrom] = useState(firstDayOfMonth());
  const [dateTo, setDateTo] = useState(today());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const debouncedSearch = useDebouncedValue(search, 350);

  const params = useMemo(
    () => ({ from: dateFrom, to: dateTo, search: debouncedSearch || undefined, page, pageSize }),
    [dateFrom, dateTo, debouncedSearch, page],
  );

  const { data, isLoading } = useCashMovements(params);
  const createMov = useCreateCashMovement();

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [openDialog, setOpenDialog] = useState(false);
  const [tipo, setTipo] = useState("Ingreso");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleCreate = () => {
    const value = parseFloat(monto);
    if (!Number.isFinite(value) || value <= 0) return;
    createMov.mutate(
      { tipo, monto: value, descripcion: descripcion || null },
      {
        onSuccess: () => {
          setOpenDialog(false);
          setMonto("");
          setDescripcion("");
          setTipo("Ingreso");
          setPage(1);
        },
        onError: (err) =>
          alert(err.response?.data?.message || "No se pudo registrar el movimiento."),
      },
    );
  };

  const exportCsv = () => {
    if (!items.length) return;
    const header = ["Comprobante", "Fecha", "Tipo", "Descripción", "Monto"];
    const rows = items.map((m) => [
      m.numeroComprobante,
      fmtDate(m.fecha),
      m.tipo,
      m.descripcion ?? "",
      m.monto,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimientos_caja_${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f8fbff" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "16px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          Ingresos y retiros de efectivo
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>
          Consulta los ingresos y retiros de efectivo de tu caja no asociados a ventas.
        </p>
      </div>

      <div style={{ padding: 24 }}>
        {/* Totales */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <TotalCard
            label="Total ingresos de efectivo"
            value={format(data?.totalIngresos ?? 0)}
            color="#2e7d32"
            icon={<ArrowDownCircle size={20} color="#2e7d32" />}
          />
          <TotalCard
            label="Total retiros de efectivo"
            value={format(data?.totalRetiros ?? 0)}
            color="#e53935"
            icon={<ArrowUpCircle size={20} color="#e53935" />}
          />
          <TotalCard
            label="Total ingresos - retiros"
            value={format(data?.neto ?? 0)}
            color="#1565C0"
          />
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1.5px solid #e0e7ef",
              borderRadius: 8,
              padding: "0 12px",
              height: 40,
              flex: 1,
              minWidth: 220,
            }}
          >
            <Search size={16} color="#999" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por N° de comprobante"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14 }}
            />
          </div>

          <DateField label="Desde" value={dateFrom} onChange={(v) => { setDateFrom(v); setPage(1); }} />
          <DateField label="Hasta" value={dateTo} onChange={(v) => { setDateTo(v); setPage(1); }} />

          <button onClick={exportCsv} disabled={!items.length} style={outlineBtn(!items.length)}>
            <Download size={15} /> Descargar Excel
          </button>
          <button onClick={() => setOpenDialog(true)} style={primaryBtn}>
            <Plus size={16} /> Crear ingreso o retiro
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0fe", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1565C0" }}>
                {["Comprobante", "Fecha", "Tipo", "Descripción", "Monto"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center" }}><CircularProgress size={24} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#888" }}>Sin movimientos en el rango seleccionado.</td></tr>
              ) : (
                items.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f0f4fc" }}>
                    <td style={td("#333", 500)}>{m.numeroComprobante}</td>
                    <td style={td("#666")}>{fmtDate(m.fecha)}</td>
                    <td style={td()}>
                      <span style={{ color: m.tipo === "Ingreso" ? "#2e7d32" : "#e53935", fontWeight: 600, fontSize: 13 }}>
                        {m.tipo}
                      </span>
                    </td>
                    <td style={td("#666")}>{m.descripcion || "—"}</td>
                    <td style={td(m.tipo === "Ingreso" ? "#2e7d32" : "#e53935", 600)}>
                      {m.tipo === "Ingreso" ? "+" : "-"}{format(m.monto)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} setPage={setPage} />
        </div>
      </div>

      {/* Dialog crear */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear ingreso o retiro</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important", minWidth: 360 }}>
          <TextField select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} fullWidth>
            <MenuItem value="Ingreso">Ingreso de efectivo</MenuItem>
            <MenuItem value="Retiro">Retiro de efectivo</MenuItem>
          </TextField>
          <TextField
            label="Monto"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: "any" }}
          />
          <TextField
            label="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" disabled={createMov.isPending || !(parseFloat(monto) > 0)}>
            {createMov.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ── Subcomponentes compartidos ──────────────────────────────────────────────────

function TotalCard({ label, value, color, icon }) {
  return (
    <div style={{ flex: 1, minWidth: 220, background: "#fff", border: "1px solid #e8f0fe", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
      </div>
      <p style={{ fontSize: 24, fontWeight: 700, color, margin: "8px 0 0" }}>{value}</p>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1.5px solid #e0e7ef", borderRadius: 8, padding: "8px 12px", background: "#fff" }}>
      <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: "#333" }} />
    </div>
  );
}

function Pagination({ page, totalPages, total, pageSize, setPage }) {
  return (
    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0f4fc" }}>
      <span style={{ fontSize: 13, color: "#666" }}>
        {total === 0 ? "Sin registros" : `Mostrando ${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, total)} de ${total}`}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <PagBtn label="‹" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
        <span style={{ fontSize: 13, color: "#666", padding: "0 8px" }}>{page} / {totalPages}</span>
        <PagBtn label="›" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
      </div>
    </div>
  );
}

function PagBtn({ label, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 28, height: 28, border: "1px solid #e0e7ef", borderRadius: 4, background: "#fff", cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#ccc" : "#666" }}>
      {label}
    </button>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#fff" };
const td = (color = "#333", weight = 400) => ({ padding: "14px 16px", fontSize: 14, color, fontWeight: weight });
const primaryBtn = { display: "flex", alignItems: "center", gap: 6, background: "#1565C0", border: "none", borderRadius: 8, padding: "9px 16px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const outlineBtn = (disabled) => ({ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid #e0e7ef", borderRadius: 8, padding: "9px 14px", color: disabled ? "#aaa" : "#1565C0", fontSize: 14, cursor: disabled ? "not-allowed" : "pointer" });
