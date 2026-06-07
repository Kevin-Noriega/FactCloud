import React, { useEffect, useState } from "react";
import { Printer, Monitor, Check } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { usePrintConfig, useUpdatePrintConfig } from "../../hooks/pos/usePosHooks";

const TAMANOS = ["Carta", "Media carta", "Tirilla 80mm", "Tirilla 58mm"];

export default function PosPrintConfigPage() {
  const { data, isLoading } = usePrintConfig();
  const updateConfig = useUpdatePrintConfig();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const directa = form.metodoImpresion === "directa";

  const handleSave = () => {
    updateConfig.mutate(form, {
      onSuccess: () => alert("Configuración guardada."),
      onError: (err) => alert(err.response?.data?.message || "No se pudo guardar."),
    });
  };

  const handleTestPrint = () => {
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Documento de prueba</title>
      <style>body{font-family:Arial;padding:${form.margenSuperior}mm ${form.margenDerecho}mm ${form.margenInferior}mm ${form.margenIzquierdo}mm;}
      h1{font-size:18px}</style></head>
      <body><h1>Documento de prueba</h1>
      <p>Tamaño: ${form.tamanoPapel || "—"} · Copias: ${form.copias}</p>
      <p>Impresión ${form.impresionSimple ? "simple (sin logo)" : "con logo"}.</p>
      <p>Si ves esto correctamente, tu impresión funciona.</p>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f8fbff" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "16px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Configuración de impresión</h1>
        <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>
          Configura el tipo de impresión, tamaño de papel y las impresoras usadas por defecto.
        </p>
      </div>

      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
        {/* Método de impresión */}
        <div>
          <h3 style={sectionTitle}>Método de impresión</h3>
          <MethodCard
            active={!directa}
            onClick={() => set("metodoImpresion", "navegador")}
            icon={<Monitor size={22} />}
            title="Impresión por navegador"
            desc="Elige la impresora y ajustes desde el navegador antes de cada impresión."
          />
          <MethodCard
            active={directa}
            onClick={() => set("metodoImpresion", "directa")}
            icon={<Printer size={22} />}
            title="Impresión directa"
            badge="Recomendada"
            desc="Imprime automáticamente desde la impresora configurada sin pasos extra."
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={handleSave} disabled={updateConfig.isPending} style={primaryBtn}>
              {updateConfig.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        {/* Preferencias */}
        <div>
          <h3 style={sectionTitle}>Preferencias de impresión para factura y documentos</h3>
          <p style={{ fontSize: 13, color: "#888", marginTop: 0 }}>
            Podrás editar las preferencias usando el método: Impresión directa.
          </p>

          <Field label="Impresora por defecto">
            <input
              value={form.impresoraDefecto || ""}
              onChange={(e) => set("impresoraDefecto", e.target.value)}
              disabled={!directa}
              placeholder="Nombre de la impresora"
              style={input(!directa)}
            />
          </Field>

          <Field label="Tamaño del papel">
            <select value={form.tamanoPapel || ""} onChange={(e) => set("tamanoPapel", e.target.value)} disabled={!directa} style={input(!directa)}>
              <option value="">Seleccionar</option>
              {TAMANOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Copias">
            <input type="number" min={1} value={form.copias} onChange={(e) => set("copias", Math.max(1, parseInt(e.target.value, 10) || 1))} disabled={!directa} style={input(!directa)} />
          </Field>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#333", margin: "12px 0" }}>
            <input type="checkbox" checked={form.impresionSimple} onChange={(e) => set("impresionSimple", e.target.checked)} disabled={!directa} />
            Impresión simple (sin logo)
          </label>

          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: "8px 0 4px" }}>Márgenes (mm)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Superior"><input type="number" min={0} value={form.margenSuperior} onChange={(e) => set("margenSuperior", Number(e.target.value) || 0)} disabled={!directa} style={input(!directa)} /></Field>
            <Field label="Inferior"><input type="number" min={0} value={form.margenInferior} onChange={(e) => set("margenInferior", Number(e.target.value) || 0)} disabled={!directa} style={input(!directa)} /></Field>
            <Field label="Izquierda"><input type="number" min={0} value={form.margenIzquierdo} onChange={(e) => set("margenIzquierdo", Number(e.target.value) || 0)} disabled={!directa} style={input(!directa)} /></Field>
            <Field label="Derecha"><input type="number" min={0} value={form.margenDerecho} onChange={(e) => set("margenDerecho", Number(e.target.value) || 0)} disabled={!directa} style={input(!directa)} /></Field>
          </div>

          <button onClick={handleTestPrint} style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 16 }}>
            <Printer size={16} /> Imprimir documento de prueba
          </button>
        </div>
      </div>
    </div>
  );
}

function MethodCard({ active, onClick, icon, title, desc, badge }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        border: `2px solid ${active ? "#1565C0" : "#e0e7ef"}`,
        background: active ? "#f3f8ff" : "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        cursor: "pointer",
      }}
    >
      <div style={{ color: active ? "#1565C0" : "#888" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ color: "#1a1a2e" }}>{title}</strong>
          {badge && <span style={{ fontSize: 11, fontWeight: 600, color: "#b26a00", background: "#ffe9c7", borderRadius: 20, padding: "2px 8px" }}>{badge}</span>}
        </div>
        <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>{desc}</p>
      </div>
      <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${active ? "#1565C0" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {active && <Check size={14} color="#1565C0" />}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const sectionTitle = { fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginTop: 0 };
const primaryBtn = { display: "flex", alignItems: "center", gap: 6, background: "#1565C0", border: "none", borderRadius: 8, padding: "10px 18px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const input = (disabled) => ({
  width: "100%",
  border: "1.5px solid #e0e7ef",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  background: disabled ? "#f1f3f6" : "#fff",
  color: disabled ? "#999" : "#333",
});
