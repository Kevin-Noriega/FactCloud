import React from "react";
import { XLg, Floppy, ArrowCounterclockwise } from "react-bootstrap-icons";
import BuscadorCuenta from "./BuscadorCuenta";
import { useImpuestos, TIPOS_IMPUESTO } from "../../hooks/useImpuestos";

export default function TablaImpuestos() {
  const {
    impuestos,
    loading,
    error,
    saving,
    filaNueva,
    toggleEnUso,
    iniciarFilaNueva,
    actualizarFilaNueva,
    cancelarFilaNueva,
    guardarNuevo,
    eliminar,
    setError,
  } = useImpuestos();

  if (loading) return <div className="imp-loading">Cargando impuestos...</div>;

  return (
    <div className="imp-tabla-wrapper">
      {error && (
        <div className="imp-alert-error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="imp-table-scroll">
        <table className="imp-tabla">
          <thead>
            <tr>
              <th className="imp-th-check">En uso</th>
              <th className="imp-th-sm">Código</th>
              <th className="imp-th-md">Nombre</th>
              <th className="imp-th-md">Tipo de impuesto</th>
              <th className="imp-th-xs">Por valor</th>
              <th className="imp-th-xs">Tarifa</th>
              <th className="imp-th-cuenta">Ventas</th>
              <th className="imp-th-cuenta">Compras</th>
              <th className="imp-th-cuenta">Devolución ventas</th>
              <th className="imp-th-cuenta">Devolución compras</th>
              <th className="imp-th-acciones"></th>
            </tr>
          </thead>

          <tbody>
            {/* ── Filas existentes ── */}
            {impuestos.map((imp) => (
              <tr key={imp.id} className={imp.enUso ? "" : "imp-row-inactiva"}>
                {/* En uso */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="imp-check"
                    checked={imp.enUso}
                    onChange={() => toggleEnUso(imp.id, imp.enUso)}
                  />
                </td>

                {/* Código */}
                <td className="imp-td-codigo">{imp.codigo}</td>

                {/* Nombre */}
                <td className="imp-td-nombre">{imp.nombre}</td>

                {/* Tipo */}
                <td>
                  <span className="imp-badge-tipo">{imp.tipoImpuesto}</span>
                </td>

                {/* Por valor */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="imp-check"
                    checked={imp.porValor}
                    readOnly
                  />
                </td>

                {/* Tarifa */}
                <td className="imp-td-tarifa">{imp.tarifa}</td>

                {/* Ventas */}
                <td className="imp-td-cuenta">
                  {imp.cuentaDebitoVentas ? (
                    <span className="imp-cuenta-tag">
                      {imp.cuentaDebitoVentas.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                {/* Compras */}
                <td className="imp-td-cuenta">
                  {imp.cuentaCreditoCompras ? (
                    <span className="imp-cuenta-tag">
                      {imp.cuentaCreditoCompras.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                {/* Dev. ventas */}
                <td className="imp-td-cuenta">
                  {imp.cuentaDevolucionVentas ? (
                    <span className="imp-cuenta-tag">
                      {imp.cuentaDevolucionVentas.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                {/* Dev. compras */}
                <td className="imp-td-cuenta">
                  {imp.cuentaDevolucionCompras ? (
                    <span className="imp-cuenta-tag">
                      {imp.cuentaDevolucionCompras.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                {/* Eliminar */}
                <td className="imp-td-acciones">
                  <button
                    className="imp-btn-eliminar"
                    title="Eliminar impuesto"
                    onClick={() => eliminar(imp.id)}
                  >
                    <XLg size={12} />
                  </button>
                </td>
              </tr>
            ))}

            {/* ── Fila de ingreso nuevo (siempre visible al fondo) ── */}
            <FilaNuevaImpuesto
              filaNueva={filaNueva}
              onChange={actualizarFilaNueva}
              onIniciar={iniciarFilaNueva}
              onGuardar={guardarNuevo}
              onCancelar={cancelarFilaNueva}
              saving={saving}
            />
          </tbody>
        </table>
      </div>

      {/* Botón adicionar */}
      {!filaNueva && (
        <button className="imp-btn-adicionar" onClick={iniciarFilaNueva}>
          + Adicionar impuesto
        </button>
      )}
    </div>
  );
}

// ─── Fila de ingreso inline ───────────────────────────────────────────────────
function FilaNuevaImpuesto({
  filaNueva,
  onChange,
  onIniciar,
  onGuardar,
  onCancelar,
  saving,
}) {
  if (!filaNueva) {
    // Fila placeholder vacía (igual que Siigo — checkbox + tipo dropdown)
    return (
      <tr className="imp-fila-nueva-placeholder">
        <td className="text-center">
          <input type="checkbox" className="imp-check" defaultChecked />
        </td>
        <td colSpan={9}>
          <button className="imp-btn-fila-iniciar" onClick={onIniciar}>
            Adicionar impuesto
          </button>
        </td>
        <td></td>
      </tr>
    );
  }

  return (
    <tr className="imp-fila-nueva">
      {/* En uso */}
      <td className="text-center">
        <input
          type="checkbox"
          className="imp-check"
          checked={filaNueva.enUso}
          onChange={(e) => onChange("enUso", e.target.checked)}
        />
      </td>

      {/* Código */}
      <td>
        <input
          type="number"
          className="imp-input-nuevo"
          placeholder="Cód."
          value={filaNueva.codigo}
          onChange={(e) => onChange("codigo", e.target.value)}
        />
      </td>

      {/* Nombre */}
      <td>
        <input
          type="text"
          className="imp-input-nuevo"
          placeholder="Nombre del impuesto"
          value={filaNueva.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />
      </td>

      {/* Tipo */}
      <td>
        <select
          className="imp-select-nuevo"
          value={filaNueva.tipoImpuesto}
          onChange={(e) => onChange("tipoImpuesto", e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {TIPOS_IMPUESTO.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </td>

      {/* Por valor */}
      <td className="text-center">
        <input
          type="checkbox"
          className="imp-check"
          checked={filaNueva.porValor}
          onChange={(e) => onChange("porValor", e.target.checked)}
        />
      </td>

      {/* Tarifa */}
      <td>
        <input
          type="number"
          className="imp-input-nuevo imp-input-tarifa"
          placeholder="0"
          value={filaNueva.tarifa}
          onChange={(e) => onChange("tarifa", e.target.value)}
          step="0.01"
          min="0"
        />
      </td>

      {/* Ventas */}
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaDebitoVentasObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaDebitoVentasId", c?.id ?? null);
            onChange("cuentaDebitoVentasObj", c ?? null);
          }}
        />
      </td>

      {/* Compras */}
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaCreditoComprasObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaCreditoComprasId", c?.id ?? null);
            onChange("cuentaCreditoComprasObj", c ?? null);
          }}
        />
      </td>

      {/* Dev. ventas */}
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaDevolucionVentasObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaDevolucionVentasId", c?.id ?? null);
            onChange("cuentaDevolucionVentasObj", c ?? null);
          }}
        />
      </td>

      {/* Dev. compras */}
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaDevolucionComprasObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaDevolucionComprasId", c?.id ?? null);
            onChange("cuentaDevolucionComprasObj", c ?? null);
          }}
        />
      </td>

      {/* Acciones guardar / cancelar */}
      <td className="imp-td-acciones">
        <button
          className="imp-btn-guardar"
          title="Guardar"
          onClick={onGuardar}
          disabled={saving}
        >
          <Floppy size={14} />
        </button>
        <button
          className="imp-btn-cancelar-fila"
          title="Cancelar"
          onClick={onCancelar}
          disabled={saving}
        >
          <ArrowCounterclockwise size={14} />
        </button>
      </td>
    </tr>
  );
}
