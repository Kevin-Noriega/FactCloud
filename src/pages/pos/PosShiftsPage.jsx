import React, { useMemo, useState } from "react";
import {
  Calendar,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  MoreVertical,
  Printer,
  Eye,
  X,
} from "lucide-react";
import {
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  useShiftHistory,
  useCurrentShift,
  useOpenShift,
  useCloseShift,
  useShiftSummary,
  useCurrency,
} from "../../hooks/pos/usePosHooks";

// ── Helpers ───────────────────────────────────────────────────────────────────

const firstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toNumber = (v) => {
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// ════════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════════

export default function PosShiftsPage() {
  const { format } = useCurrency();

  const [dateFrom, setDateFrom] = useState(firstDayOfMonth());
  const [dateTo, setDateTo] = useState(today());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(
    () => ({ from: dateFrom, to: dateTo, page, pageSize }),
    [dateFrom, dateTo, page, pageSize],
  );

  const { data, isLoading, isFetching } = useShiftHistory(params);
  const { data: currentShift } = useCurrentShift();
  const openShift = useOpenShift();
  const closeShift = useCloseShift();

  const shifts = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Modales / drawers
  const [openDialog, setOpenDialog] = useState(false);
  const [baseInicial, setBaseInicial] = useState("");

  const [drawerShift, setDrawerShift] = useState(null);
  const [drawerMode, setDrawerMode] = useState("view"); // "view" | "close"

  // Menú de acciones por fila
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuShift, setMenuShift] = useState(null);

  const hasOpenShift = !!currentShift;

  // ── Acciones ────────────────────────────────────────────────────────────────

  const handleOpenShift = () => {
    openShift.mutate(
      { baseInicial: toNumber(baseInicial) },
      {
        onSuccess: () => {
          setOpenDialog(false);
          setBaseInicial("");
          setPage(1);
        },
        onError: (err) => {
          alert(
            err.response?.data?.message ||
              "No se pudo iniciar el turno. Intenta de nuevo.",
          );
        },
      },
    );
  };

  const openDrawer = (shift, mode) => {
    setDrawerShift(shift);
    setDrawerMode(mode);
  };

  const closeDrawer = () => setDrawerShift(null);

  const handlePrint = (shift) => {
    printShift(shift, format);
  };

  const handleExportExcel = () => {
    exportShiftsCsv(shifts);
  };

  // ── Render ────────────────────────────────────────────────────────────────

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
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          Turnos &gt; Registro de turnos
        </h1>
        <button
          onClick={() => setOpenDialog(true)}
          disabled={hasOpenShift}
          title={
            hasOpenShift
              ? "Ya tienes un turno abierto. Ciérralo antes de abrir otro."
              : "Iniciar un nuevo turno"
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: hasOpenShift ? "#9bbfe6" : "#1565C0",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: hasOpenShift ? "not-allowed" : "pointer",
          }}
        >
          <Plus size={16} />
          Iniciar turno
        </button>
      </div>

      <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <DateField
            label="Inicio"
            value={dateFrom}
            onChange={(v) => {
              setDateFrom(v);
              setPage(1);
            }}
          />
          <span style={{ color: "#666", fontSize: 14 }}>a</span>
          <DateField
            label="Fin"
            value={dateTo}
            onChange={(v) => {
              setDateTo(v);
              setPage(1);
            }}
          />

          <div style={{ flex: 1 }} />

          {isFetching && (
            <CircularProgress size={18} style={{ color: "#1565C0" }} />
          )}

          <button
            onClick={handleExportExcel}
            disabled={shifts.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "1.5px solid #e0e7ef",
              borderRadius: 8,
              padding: "8px 14px",
              color: shifts.length === 0 ? "#aaa" : "#1565C0",
              fontSize: 14,
              cursor: shifts.length === 0 ? "not-allowed" : "pointer",
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
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: "center" }}>
                    <CircularProgress size={26} style={{ color: "#1565C0" }} />
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#888",
                      fontSize: 14,
                    }}
                  >
                    No hay turnos en el rango seleccionado.
                  </td>
                </tr>
              ) : (
                shifts.map((shift) => {
                  const abierto = shift.estado === "Abierto";
                  return (
                    <tr
                      key={shift.id}
                      style={{ borderBottom: "1px solid #f0f4fc" }}
                    >
                      <td style={td("#333", 500)}>{shift.numeroTurno}</td>
                      <td style={td("#333")}>{shift.vendedorNombre}</td>
                      <td style={td("#666")}>
                        {fmtDateTime(shift.fechaApertura)}
                      </td>
                      <td style={td("#666")}>{fmtDateTime(shift.fechaCierre)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {abierto ? (
                            <CheckCircle size={16} color="#4CAF50" />
                          ) : (
                            <XCircle size={16} color="#888" />
                          )}
                          <span
                            style={{
                              fontSize: 13,
                              color: abierto ? "#2e7d32" : "#666",
                              fontWeight: 500,
                            }}
                          >
                            {abierto ? "Abierto" : "Cerrado"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 0 }}
                        >
                          {abierto && (
                            <button
                              onClick={() => openDrawer(shift, "close")}
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
                          )}
                          <button
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setMenuShift(shift);
                            }}
                            style={{
                              padding: "6px 8px",
                              background: "none",
                              border: "1.5px solid #e0e7ef",
                              borderLeft: abierto ? "none" : "1.5px solid #e0e7ef",
                              borderRadius: abierto
                                ? "0 6px 6px 0"
                                : "6px",
                              color: "#666",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                            title="Más acciones"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
              {total === 0
                ? "Sin registros"
                : `Mostrando ${(page - 1) * pageSize + 1} - ${Math.min(
                    page * pageSize,
                    total,
                  )} de ${total} registros`}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <PagBtn label="|‹" disabled={page <= 1} onClick={() => setPage(1)} />
              <PagBtn
                label="‹"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <span style={{ fontSize: 13, color: "#666", padding: "0 8px" }}>
                {page} / {totalPages}
              </span>
              <PagBtn
                label="›"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
              <PagBtn
                label="›|"
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
              />
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
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
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de acciones */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            openDrawer(menuShift, "view");
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <Eye size={16} />
          </ListItemIcon>
          Ver detalle
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlePrint(menuShift);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <Printer size={16} />
          </ListItemIcon>
          Imprimir
        </MenuItem>
      </Menu>

      {/* Diálogo: Iniciar turno */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Iniciar turno</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "8px !important",
            minWidth: 340,
          }}
        >
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
            Ingresa la base de efectivo con la que abres la caja.
          </p>
          <TextField
            label="Base inicial de caja"
            type="number"
            value={baseInicial}
            onChange={(e) => setBaseInicial(e.target.value)}
            autoFocus
            fullWidth
            inputProps={{ min: 0, step: "any" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleOpenShift}
            variant="contained"
            disabled={openShift.isPending}
          >
            {openShift.isPending ? "Abriendo..." : "Iniciar turno"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawer: Detalle / Cierre de turno */}
      <ShiftDrawer
        shift={drawerShift}
        mode={drawerMode}
        onClose={closeDrawer}
        closeShift={closeShift}
        format={format}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Drawer de detalle / cierre
// ════════════════════════════════════════════════════════════════════════════

function ShiftDrawer({ shift, mode, onClose, closeShift, format }) {
  const isClose = mode === "close" && shift?.estado === "Abierto";
  const { data: summary, isLoading } = useShiftSummary(shift?.id);

  const [efectivo, setEfectivo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [pagosLinea, setPagosLinea] = useState("");
  const [otros, setOtros] = useState("");
  const [obs, setObs] = useState("");

  // Reset al cambiar de turno
  React.useEffect(() => {
    setEfectivo("");
    setTarjeta("");
    setPagosLinea("");
    setOtros("");
    setObs("");
  }, [shift?.id]);

  if (!shift) return null;

  const totalIngresado =
    toNumber(efectivo) +
    toNumber(tarjeta) +
    toNumber(pagosLinea) +
    toNumber(otros);
  const totalEsperado = summary?.totalEsperado ?? shift.baseInicial ?? 0;
  const diferencia = totalIngresado - totalEsperado;

  const handleClose = () => {
    closeShift.mutate(
      {
        turnoId: Number(shift.id),
        totalEfectivoReal: toNumber(efectivo),
        totalTarjeta: toNumber(tarjeta),
        totalPagosLinea: toNumber(pagosLinea),
        totalOtros: toNumber(otros),
        observaciones: obs || null,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          alert(
            err.response?.data?.message || "No se pudo cerrar el turno.",
          ),
      },
    );
  };

  return (
    <Drawer anchor="right" open={!!shift} onClose={onClose}>
      <div style={{ width: 460, maxWidth: "90vw", display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
            Detalle del turno
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1565C0" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {/* Info del turno */}
          <div
            style={{
              background: "#f6f9fe",
              border: "1px solid #e8f0fe",
              borderRadius: 10,
              padding: 16,
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#1a1a2e" }}>Turno {shift.numeroTurno}</strong>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  background: shift.estado === "Abierto" ? "#4CAF50" : "#888",
                  borderRadius: 20,
                  padding: "2px 10px",
                }}
              >
                {shift.estado}
              </span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#333" }}>
              {shift.vendedorNombre}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
              Inicio: {fmtDateTime(shift.fechaApertura)}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666" }}>
              Fin: {fmtDateTime(shift.fechaCierre)}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666" }}>
              Base inicial: {format(shift.baseInicial ?? 0)}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666" }}>
              Cierre realizado por: {shift.cerradoPorNombre || "—"}
            </p>
          </div>

          {isClose ? (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                Arqueo de cierre
              </h3>
              <p style={{ fontSize: 13, color: "#666", marginTop: 0 }}>
                Ingrese el valor de las ventas registradas en el turno.
              </p>

              <MoneyInput label="Total real de efectivo en caja" value={efectivo} onChange={setEfectivo} />
              <MoneyInput label="Total ventas con tarjeta" value={tarjeta} onChange={setTarjeta} />
              <MoneyInput label="Total ventas con pagos en línea" value={pagosLinea} onChange={setPagosLinea} />
              <MoneyInput label="Total ventas otros medios de pago" value={otros} onChange={setOtros} />
              <TextField
                label="Observaciones (opcional)"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 1 }}
              />

              <SummaryRows
                format={format}
                totalIngresado={totalIngresado}
                totalEsperado={totalEsperado}
                diferencia={diferencia}
              />
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
                Resumen
              </h3>
              {isLoading ? (
                <CircularProgress size={22} style={{ color: "#1565C0" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <DetailRow label="Total efectivo en caja" value={format(shift.totalEfectivoReal ?? 0)} />
                  <DetailRow label="Total ventas con tarjeta" value={format(shift.totalTarjeta ?? 0)} />
                  <DetailRow label="Total ventas pagos en línea" value={format(shift.totalPagosLinea ?? 0)} />
                  <DetailRow label="Total ventas otros medios" value={format(shift.totalOtros ?? 0)} />
                  <div style={{ height: 1, background: "#eef2f7", margin: "8px 0" }} />
                  <DetailRow label="Total esperado en cierre de caja" value={format(shift.totalEsperado ?? shift.baseInicial ?? 0)} />
                  <DetailRow
                    label="Diferencia"
                    value={format(shift.diferencia ?? 0)}
                    danger={(shift.diferencia ?? 0) < 0}
                  />
                  {shift.observaciones && (
                    <p style={{ fontSize: 13, color: "#666", marginTop: 10 }}>
                      <strong>Observaciones:</strong> {shift.observaciones}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 24px",
            borderTop: "1px solid #eef2f7",
          }}
        >
          <Button onClick={onClose} color="inherit">
            {isClose ? "Cancelar" : "Cerrar"}
          </Button>
          {isClose && (
            <Button
              variant="contained"
              onClick={handleClose}
              disabled={closeShift.isPending}
            >
              {closeShift.isPending ? "Cerrando..." : "Cerrar turno"}
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function SummaryRows({ format, totalIngresado, totalEsperado, diferencia }) {
  return (
    <div
      style={{
        marginTop: 16,
        border: "1px solid #e8f0fe",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <DetailRow label="Total ingresado en cierre de caja" value={format(totalIngresado)} padded />
      <DetailRow label="Total esperado en cierre de caja" value={format(totalEsperado)} padded />
      <DetailRow label="Diferencia" value={format(diferencia)} danger={diferencia < 0} padded />
    </div>
  );
}

function DetailRow({ label, value, danger, padded }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: padded ? "10px 14px" : "5px 0",
        fontSize: 14,
        borderBottom: padded ? "1px solid #f3f6fb" : "none",
      }}
    >
      <span style={{ color: danger ? "#e53935" : "#555" }}>{label}</span>
      <strong style={{ color: danger ? "#e53935" : "#1a1a2e" }}>{value}</strong>
    </div>
  );
}

function MoneyInput({ label, value, onChange }) {
  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      sx={{ mt: 1.5 }}
      inputProps={{ min: 0, step: "any" }}
      InputProps={{ startAdornment: <span style={{ color: "#888", marginRight: 6 }}>$</span> }}
    />
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: "1.5px solid #e0e7ef",
        borderRadius: 8,
        padding: "8px 14px",
        background: "#fff",
      }}
    >
      <Calendar size={16} color="#1565C0" />
      <span style={{ fontSize: 14, color: "#333" }}>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ border: "none", outline: "none", fontSize: 14, color: "#333" }}
      />
    </div>
  );
}

function PagBtn({ label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        border: "1px solid #e0e7ef",
        borderRadius: 4,
        background: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#ccc" : "#666",
        fontSize: 12,
      }}
    >
      {label}
    </button>
  );
}

const td = (color, weight = 400) => ({
  padding: "14px 16px",
  fontSize: 14,
  color,
  fontWeight: weight,
});

// ── Utilidades de impresión / exportación ───────────────────────────────────

function printShift(shift, format) {
  if (!shift) return;
  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) return;
  win.document.write(`
    <html><head><title>Turno ${shift.numeroTurno}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:20px;color:#222;font-size:13px}
      h1{font-size:18px;margin:0 0 4px}
      .row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #ddd}
      .muted{color:#666}
    </style></head><body>
      <h1>Turno ${shift.numeroTurno}</h1>
      <p class="muted">${shift.vendedorNombre}</p>
      <div class="row"><span>Estado</span><strong>${shift.estado}</strong></div>
      <div class="row"><span>Inicio</span><span>${fmtDateTime(shift.fechaApertura)}</span></div>
      <div class="row"><span>Fin</span><span>${fmtDateTime(shift.fechaCierre)}</span></div>
      <div class="row"><span>Base inicial</span><span>${format(shift.baseInicial ?? 0)}</span></div>
      <div class="row"><span>Efectivo en caja</span><span>${format(shift.totalEfectivoReal ?? 0)}</span></div>
      <div class="row"><span>Tarjeta</span><span>${format(shift.totalTarjeta ?? 0)}</span></div>
      <div class="row"><span>Pagos en línea</span><span>${format(shift.totalPagosLinea ?? 0)}</span></div>
      <div class="row"><span>Otros medios</span><span>${format(shift.totalOtros ?? 0)}</span></div>
      <div class="row"><span>Total esperado</span><strong>${format(shift.totalEsperado ?? shift.baseInicial ?? 0)}</strong></div>
      <div class="row"><span>Diferencia</span><strong>${format(shift.diferencia ?? 0)}</strong></div>
      <p class="muted">Cierre realizado por: ${shift.cerradoPorNombre || "—"}</p>
    </body></html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

function exportShiftsCsv(shifts) {
  if (!shifts.length) return;
  const header = [
    "N° Turno",
    "Vendedor",
    "Inicio",
    "Fin",
    "Estado",
    "Base inicial",
    "Efectivo",
    "Tarjeta",
    "Pagos en línea",
    "Otros",
    "Total esperado",
    "Diferencia",
  ];
  const rows = shifts.map((s) => [
    s.numeroTurno,
    s.vendedorNombre,
    fmtDateTime(s.fechaApertura),
    fmtDateTime(s.fechaCierre),
    s.estado,
    s.baseInicial ?? 0,
    s.totalEfectivoReal ?? 0,
    s.totalTarjeta ?? 0,
    s.totalPagosLinea ?? 0,
    s.totalOtros ?? 0,
    s.totalEsperado ?? 0,
    s.diferencia ?? 0,
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `turnos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
