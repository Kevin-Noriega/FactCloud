// components/Impuestos/DetalleCuenta.jsx
import React, { useState, useEffect } from "react";
import { labelNivel, CATEGORIAS_PUC } from "../../hooks/useCuentasContables";

// ═══════════════════════════════════════════════════════════════
// PANEL DETALLE / EDICIÓN de cuenta existente
// ═══════════════════════════════════════════════════════════════
export function DetalleCuenta({
  cuenta,
  onGuardar,
  saving,
  onIniciarCreacion,
}) {
  const [form, setForm] = useState({ ...cuenta });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm({ ...cuenta });
    setSuccess(false);
  }, [cuenta]);

  const handleChange = (campo, valor) =>
    setForm((p) => ({ ...p, [campo]: valor }));

  const handleGuardar = async () => {
    const result = await onGuardar(form);
    if (result?.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const esPropietaria = cuenta.usuarioId != null; // solo las propias se editan
  const nivel = cuenta.nivel || 1;
  const labelN = labelNivel(nivel);

  // Botón "Crear hijo" — qué tipo crea según nivel actual
  const labelCrearHijo = () => {
    const m = {
      1: "+ Crear Grupo",
      2: "+ Crear Cuenta",
      3: "+ Crear Subcuenta",
      4: "+ Crear Auxiliar",
    };
    return m[nivel] ?? null;
  };

  return (
    <div className="cc-detalle">
      {/* ── Encabezado con breadcrumb de niveles ── */}
      <div className="cc-detalle-header">
        <div className="cc-detalle-meta-grid">
          {/* Fila de labels */}
          <div className="cc-detalle-label-row">
            <span className="cc-label-blue">Código</span>
            <span className="cc-label-blue cc-label-nombre">Nombre</span>
            {cuenta.permiteMovimiento && (
              <span className="cc-label-blue cc-label-trans">
                Transaccional
              </span>
            )}
          </div>

          {/* Fila de valores */}
          <div className="cc-detalle-value-row">
            {/* Clase heredada */}
            <span className="cc-chip-nivel">Clase</span>
            <span className="cc-chip-codigo-clase">{cuenta.codigo[0]}</span>
            <span className="cc-chip-nombre-clase">{cuenta.nombreClase}</span>
          </div>

          {/* Si es Grupo o más profundo, muestra el Grupo */}
          {nivel >= 2 && (
            <div className="cc-detalle-value-row">
              <span className="cc-chip-nivel">Grupo</span>
              <input
                className="cc-detalle-input-codigo"
                value={form.codigo}
                readOnly
              />
              <input
                className="cc-detalle-input-nombre"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                readOnly={!esPropietaria}
                placeholder="Nombre de la cuenta"
              />
            </div>
          )}
        </div>

        {/* Botón crear hijo (si no es auxiliar) */}
        {nivel < 5 && labelCrearHijo() && (
          <button
            className="cc-btn-crear-hijo"
            onClick={() => onIniciarCreacion(cuenta)}
          >
            {labelCrearHijo()}
          </button>
        )}
      </div>

      <div className="cc-detalle-divider" />

      {/* ── Sección: Característica transaccional ── */}
      <div className="cc-detalle-seccion">
        <h4 className="cc-seccion-titulo">Característica transaccional</h4>

        <div className="cc-campo-row">
          <label className="cc-campo-label">Relacionado con</label>
          <span className="cc-campo-readonly">
            {cuenta.tipoAjuste || "M"}
            <a href="#/" className="cc-link-ver" tabIndex={-1}>
              Ver detalle
            </a>
          </span>
        </div>

        <div className="cc-campo-row">
          <label className="cc-campo-label">Categoría</label>
          <select
            className="cc-select"
            value={form.categoria || ""}
            onChange={(e) => handleChange("categoria", e.target.value)}
            disabled={!esPropietaria}
          >
            <option value="">Seleccionar...</option>
            {CATEGORIAS_PUC.map((cat) => (
              <option key={cat.codigo} value={cat.codigo}>
                {cat.codigo} - {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="cc-campo-row">
          <label className="cc-campo-label">
            Detallar saldos de cartera o proveedores
          </label>
          <select
            className="cc-select"
            value={form.detallarSaldos || "Sin detalle de vencimientos"}
            onChange={(e) => handleChange("detallarSaldos", e.target.value)}
            disabled={!esPropietaria}
          >
            <option>Sin detalle de vencimientos</option>
            <option>Con vencimiento en cartera</option>
            <option>Con vencimiento en proveedores</option>
          </select>
        </div>

        <div className="cc-campo-row cc-campo-check-row">
          <label className="cc-campo-label">
            Cuenta de diferencia fiscal o ajustes NIIF
          </label>
          <input
            type="checkbox"
            className="cc-checkbox"
            checked={form.tipoAjuste === "fiscal" || false}
            onChange={(e) =>
              handleChange("tipoAjuste", e.target.checked ? "fiscal" : "M")
            }
            disabled={!esPropietaria}
          />
        </div>

        <div className="cc-campo-row cc-campo-check-row">
          <label className="cc-campo-label">Activa</label>
          <input
            type="checkbox"
            className="cc-checkbox"
            checked={form.activa ?? true}
            onChange={(e) => handleChange("activa", e.target.checked)}
            disabled={!esPropietaria}
          />
        </div>

        {!esPropietaria && (
          <p className="cc-nota-global">
            ⓘ Esta es una cuenta del plan de cuentas estándar (PUC). Solo puedes
            ver sus datos.
          </p>
        )}

        <p className="cc-nota-tercero">
          * Todas las cuentas contables se manejan a nivel de tercero
        </p>
      </div>

      {/* ── Botón guardar ── */}
      {esPropietaria && (
        <div className="cc-detalle-footer">
          {success && (
            <span className="cc-success-msg">✓ Guardado correctamente</span>
          )}
          <button
            className="cc-btn-guardar"
            onClick={handleGuardar}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL CREACIÓN de nueva cuenta
// ═══════════════════════════════════════════════════════════════
export function FormCrearCuenta({
  form,
  onChange,
  onCrear,
  onCancelar,
  saving,
  error,
}) {
  if (!form) return null;

  const nivel = form.nivel || 1;

  return (
    <div className="cc-detalle cc-form-crear">
      {/* Header */}
      <div className="cc-detalle-header">
        <div className="cc-crear-titulo-row">
          <span className="cc-crear-badge">
            {form._labelNivel || "Nueva cuenta"}
          </span>
          {form._padreNombre && (
            <span className="cc-crear-padre">
              en <strong>{form._padreNombre}</strong>
            </span>
          )}
        </div>

        <div className="cc-detalle-meta-grid">
          <div className="cc-detalle-label-row">
            <span className="cc-label-blue">Código</span>
            <span className="cc-label-blue cc-label-nombre">Nombre</span>
          </div>

          <div className="cc-detalle-value-row">
            <span className="cc-chip-nivel">
              {form._labelNivel || "Cuenta"}
            </span>
            <input
              className="cc-detalle-input-codigo cc-input-editable"
              value={form.codigo}
              onChange={(e) => onChange("codigo", e.target.value)}
              placeholder={placeholderCodigo(nivel)}
              maxLength={12}
              autoFocus
            />
            <input
              className="cc-detalle-input-nombre cc-input-editable"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              placeholder="Nombre de la cuenta"
              maxLength={200}
            />
          </div>
        </div>
      </div>

      <div className="cc-detalle-divider" />

      {/* Cuerpo */}
      <div className="cc-detalle-seccion">
        <h4 className="cc-seccion-titulo">Configuración</h4>

        {/* Código padre (readonly calculado) */}
        {form.codigoPadre && (
          <div className="cc-campo-row">
            <label className="cc-campo-label">Cuenta padre</label>
            <span className="cc-campo-readonly cc-codigo-padre">
              {form.codigoPadre}
              {form._padreNombre && ` — ${form._padreNombre}`}
            </span>
          </div>
        )}

        {/* Naturaleza */}
        <div className="cc-campo-row">
          <label className="cc-campo-label">Naturaleza</label>
          <div className="cc-radio-group">
            {[
              { v: "D", l: "Débito" },
              { v: "C", l: "Crédito" },
            ].map(({ v, l }) => (
              <label key={v} className="cc-radio-label">
                <input
                  type="radio"
                  name="naturaleza"
                  value={v}
                  checked={form.naturaleza === v}
                  onChange={() => onChange("naturaleza", v)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* Permite movimiento */}
        <div className="cc-campo-row cc-campo-check-row">
          <label className="cc-campo-label">
            Cuenta transaccional (permite movimiento)
          </label>
          <input
            type="checkbox"
            className="cc-checkbox"
            checked={form.permiteMovimiento || false}
            onChange={(e) => onChange("permiteMovimiento", e.target.checked)}
          />
        </div>

        {/* Requiere tercero */}
        <div className="cc-campo-row cc-campo-check-row">
          <label className="cc-campo-label">Requiere tercero</label>
          <input
            type="checkbox"
            className="cc-checkbox"
            checked={form.requiereTercero || false}
            onChange={(e) => onChange("requiereTercero", e.target.checked)}
          />
        </div>

        {/* Descripción */}
        <div className="cc-campo-row cc-campo-col">
          <label className="cc-campo-label">Descripción (opcional)</label>
          <textarea
            className="cc-textarea"
            value={form.descripcion || ""}
            onChange={(e) => onChange("descripcion", e.target.value)}
            placeholder="Descripción o notas..."
            rows={2}
          />
        </div>

        <p className="cc-nota-tercero">
          * Todas las cuentas contables se manejan a nivel de tercero
        </p>
      </div>

      {/* Error local */}
      {error && <div className="cc-error-inline">{error}</div>}

      {/* Footer */}
      <div className="cc-detalle-footer">
        <button
          className="cc-btn-cancelar"
          onClick={onCancelar}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          className="cc-btn-guardar"
          onClick={onCrear}
          disabled={saving || !form.codigo?.trim() || !form.nombre?.trim()}
        >
          {saving ? "Creando..." : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
}

// Placeholder de código según nivel
function placeholderCodigo(nivel) {
  const m = {
    1: "ej: 1",
    2: "ej: 11",
    3: "ej: 1105",
    4: "ej: 110505",
    5: "ej: 11050501",
  };
  return m[nivel] || "Código PUC";
}

export default DetalleCuenta;
