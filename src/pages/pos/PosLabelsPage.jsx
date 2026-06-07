import React, { useState } from "react";
import { Plus, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import {
  useLabels,
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
} from "../../hooks/pos/usePosHooks";

export default function PosLabelsPage() {
  const { data: labels = [], isLoading } = useLabels();
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nombre, setNombre] = useState("");
  const [activa, setActiva] = useState(true);

  const openNew = () => {
    setEditing(null);
    setNombre("");
    setActiva(true);
    setOpenDialog(true);
  };

  const openEdit = (label) => {
    setEditing(label);
    setNombre(label.nombre);
    setActiva(label.activa);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!nombre.trim()) return;
    const onDone = {
      onSuccess: () => setOpenDialog(false),
      onError: (err) => alert(err.response?.data?.message || "No se pudo guardar la etiqueta."),
    };
    if (editing) {
      updateLabel.mutate({ id: editing.id, nombre: nombre.trim(), activa }, onDone);
    } else {
      createLabel.mutate({ nombre: nombre.trim(), activa }, onDone);
    }
  };

  const handleDelete = (label) => {
    if (!window.confirm(`¿Eliminar la etiqueta "${label.nombre}"?`)) return;
    deleteLabel.mutate(label.id, {
      onError: (err) => alert(err.response?.data?.message || "No se pudo eliminar."),
    });
  };

  const saving = createLabel.isPending || updateLabel.isPending;

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f8fbff" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Etiquetas</h1>
          <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>
            Administra tus etiquetas para identificar fácil tus ventas.
          </p>
        </div>
        <button onClick={openNew} style={primaryBtn}>
          <Plus size={16} /> Nueva etiqueta
        </button>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0fe", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1565C0" }}>
                {["N°", "Nombre de etiqueta", "Estado", "Acciones"].map((c) => (
                  <th key={c} style={th}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: "center" }}><CircularProgress size={24} /></td></tr>
              ) : labels.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#888" }}>No hay etiquetas. Crea la primera con "Nueva etiqueta".</td></tr>
              ) : (
                labels.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid #f0f4fc" }}>
                    <td style={td("#333", 500)}>{i + 1}</td>
                    <td style={td()}>{l.nombre}</td>
                    <td style={td()}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: l.activa ? "#2e7d32" : "#888" }}>
                        {l.activa ? <CheckCircle size={15} color="#4CAF50" /> : <XCircle size={15} color="#888" />}
                        {l.activa ? "En uso" : "Inactiva"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(l)} style={iconBtn} title="Editar"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(l)} style={{ ...iconBtn, color: "#e53935", borderColor: "#f3c6c6" }} title="Eliminar"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editing ? "Editar etiqueta" : "Nueva etiqueta"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1, pt: "8px !important", minWidth: 340 }}>
          <TextField label="Nombre de etiqueta" value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus fullWidth />
          <FormControlLabel control={<Switch checked={activa} onChange={(e) => setActiva(e.target.checked)} />} label="Activa (en uso)" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !nombre.trim()}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#fff" };
const td = (color = "#333", weight = 400) => ({ padding: "14px 16px", fontSize: 14, color, fontWeight: weight });
const primaryBtn = { display: "flex", alignItems: "center", gap: 6, background: "#1565C0", border: "none", borderRadius: 8, padding: "9px 16px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const iconBtn = { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "#fff", border: "1.5px solid #e0e7ef", borderRadius: 6, color: "#1565C0", cursor: "pointer" };
