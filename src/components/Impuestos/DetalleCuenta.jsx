// components/cuentas/DetalleCuenta.jsx
import React, { useState, useEffect } from "react";

const CATEGORIAS = [
  "Caja - Bancos",
  "Cuentas por cobrar",
  "Inventarios",
  "Otros activos",
  "Cuentas por pagar",
  "Obligaciones financieras",
  "Otros pasivos corrientes",
  "Patrimonio",
  "Ingresos",
  "Gastos",
  "Costos",
];

export default function DetalleCuenta({
  cuenta,
  onGuardar,
  //onEliminar,
  saving,
}) {
  const [form, setForm] = useState({ ...cuenta });

  useEffect(() => {
    setForm({ ...cuenta });
  }, [cuenta]);

  const handleChange = (campo, valor) =>
    setForm((p) => ({ ...p, [campo]: valor }));

  const handleGuardar = () => onGuardar(form);

  return (
    <div className="cc-detalle">
      {/* Encabezado */}
      <div className="cc-detalle-header">
        <div className="cc-detalle-codigo-row">
          <span className="cc-detalle-label-blue">Código</span>
          <span className="cc-detalle-label-blue">Nombre</span>
          <span className="cc-detalle-label-blue cc-detalle-transaccional">
            {cuenta.permiteMovimiento ? "Transaccional" : ""}
          </span>
        </div>
        <div className="cc-detalle-codigo-row cc-detalle-vals">
          <span className="cc-detalle-clase">Clase</span>
          <input
            className="cc-detalle-input-codigo"
            value={form.codigo}
            readOnly
          />
          <input
            className="cc-detalle-input-nombre"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
        </div>
        <button className="cc-btn-crear-grupo">+ Crear Grupo</button>
      </div>

      {/* Característica transaccional */}
      <div className="cc-detalle-seccion">
        <h4 className="cc-detalle-seccion-titulo">
          Característica transaccional
        </h4>

        <div className="cc-detalle-campo">
          <label>Relacionado con</label>
          <span className="cc-detalle-valor-readonly">
            {cuenta.tipoAjuste || "Sin asignar"}{" "}
            <a href="#" className="cc-link-ver">
              Ver detalle
            </a>
          </span>
        </div>

        <div className="cc-detalle-campo">
          <label>Categoría</label>
          <select
            className="cc-detalle-select"
            value={form.categoria || ""}
            onChange={(e) => handleChange("categoria", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="cc-detalle-campo">
          <label>Detallar saldos de cartera o proveedores</label>
          <select
            className="cc-detalle-select"
            value={form.detallarSaldos || "Sin detalle de vencimientos"}
            onChange={(e) => handleChange("detallarSaldos", e.target.value)}
          >
            <option>Sin detalle de vencimientos</option>
            <option>Con vencimiento en cartera</option>
            <option>Con vencimiento en proveedores</option>
          </select>
        </div>

        <div className="cc-detalle-campo cc-detalle-campo-check">
          <label>Cuenta de diferencia fiscal o ajustes NIIF</label>
          <input
            type="checkbox"
            checked={form.tipoAjuste === "fiscal" || false}
            onChange={(e) =>
              handleChange("tipoAjuste", e.target.checked ? "fiscal" : null)
            }
          />
        </div>

        <div className="cc-detalle-campo cc-detalle-campo-check">
          <label>Activa</label>
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) => handleChange("activa", e.target.checked)}
          />
        </div>

        <p className="cc-detalle-nota">
          * Todas las cuentas contables se manejan a nivel de tercero
        </p>
      </div>

      {/* Guardar */}
      <button
        className="cc-btn-guardar"
        onClick={handleGuardar}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
