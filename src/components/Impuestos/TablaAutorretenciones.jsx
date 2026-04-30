import React from "react";
import { XLg, Floppy, ArrowCounterclockwise } from "react-bootstrap-icons";
import BuscadorCuenta from "./BuscadorCuenta";
import {
  useAutorretenciones,
  TIPOS_AUTORETENCION,
} from "../../hooks/useAutorretenciones";

export default function TablaAutorretenciones() {
  const {
    autorretenciones,
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
  } = useAutorretenciones();

  if (loading)
    return <div className="imp-loading">Cargando autoretenciones...</div>;

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
              <th className="imp-th-xs">Tarifa</th>
              <th className="imp-th-cuenta">Cuenta débito</th>
              <th className="imp-th-cuenta">Cuenta crédito</th>
              <th className="imp-th-acciones"></th>
            </tr>
          </thead>

          <tbody>
            {autorretenciones.map((ar) => (
              <tr key={ar.id} className={ar.enUso ? "" : "imp-row-inactiva"}>
                {/* En uso */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="imp-check"
                    checked={ar.enUso}
                    onChange={() => toggleEnUso(ar.id, ar.enUso)}
                  />
                </td>

                <td className="imp-td-codigo">{ar.codigo}</td>
                <td className="imp-td-nombre">{ar.nombre}</td>

                <td>
                  <span className="imp-badge-tipo imp-badge-autorret">
                    {ar.tipoAutoretencion}
                  </span>
                </td>

                <td className="imp-td-tarifa">{ar.tarifa}</td>

                {/* Cuenta débito */}
                <td className="imp-td-cuenta">
                  {ar.cuentaDebito ? (
                    <span className="imp-cuenta-tag">
                      {ar.cuentaDebito.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                {/* Cuenta crédito */}
                <td className="imp-td-cuenta">
                  {ar.cuentaCredito ? (
                    <span className="imp-cuenta-tag">
                      {ar.cuentaCredito.codigoNombre}
                    </span>
                  ) : (
                    <span className="imp-cuenta-vacia">—</span>
                  )}
                </td>

                <td className="imp-td-acciones">
                  <button
                    className="imp-btn-eliminar"
                    title="Eliminar"
                    onClick={() => eliminar(ar.id)}
                  >
                    <XLg size={12} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Fila nueva */}
            <FilaNuevaAutoretencion
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

      {!filaNueva && (
        <button className="imp-btn-adicionar" onClick={iniciarFilaNueva}>
          + Adicionar impuesto
        </button>
      )}
    </div>
  );
}

function FilaNuevaAutoretencion({
  filaNueva,
  onChange,
  onIniciar,
  onGuardar,
  onCancelar,
  saving,
}) {
  if (!filaNueva) {
    return (
      <tr className="imp-fila-nueva-placeholder">
        <td className="text-center">
          <input type="checkbox" className="imp-check" defaultChecked />
        </td>
        <td>
          <input
            type="text"
            className="imp-input-nuevo"
            disabled
            placeholder=""
          />
        </td>
        <td>
          <input
            type="text"
            className="imp-input-nuevo"
            disabled
            placeholder=""
          />
        </td>
        <td>
          <select className="imp-select-nuevo">
            {TIPOS_AUTORETENCION.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="text"
            className="imp-input-nuevo imp-input-tarifa"
            disabled
          />
        </td>
        <td>
          <BuscadorCuenta
            value={null}
            onChange={() => {}}
            placeholder="Buscar"
          />
        </td>
        <td>
          <BuscadorCuenta
            value={null}
            onChange={() => {}}
            placeholder="Buscar"
          />
        </td>
        <td className="imp-td-acciones">
          <button
            className="imp-btn-guardar"
            title="Guardar"
            onClick={onIniciar}
          >
            <Floppy size={14} />
          </button>
          <button className="imp-btn-cancelar-fila" title="Cancelar" disabled>
            <ArrowCounterclockwise size={14} />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="imp-fila-nueva">
      <td className="text-center">
        <input
          type="checkbox"
          className="imp-check"
          checked={filaNueva.enUso}
          onChange={(e) => onChange("enUso", e.target.checked)}
        />
      </td>
      <td>
        <input
          type="number"
          className="imp-input-nuevo"
          placeholder="Cód."
          value={filaNueva.codigo}
          onChange={(e) => onChange("codigo", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          className="imp-input-nuevo"
          placeholder="Nombre"
          value={filaNueva.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />
      </td>
      <td>
        <select
          className="imp-select-nuevo"
          value={filaNueva.tipoAutoretencion}
          onChange={(e) => onChange("tipoAutoretencion", e.target.value)}
        >
          {TIPOS_AUTORETENCION.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </td>
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
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaDebitoObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaDebitoId", c?.id ?? null);
            onChange("cuentaDebitoObj", c ?? null);
          }}
        />
      </td>
      <td>
        <BuscadorCuenta
          value={filaNueva.cuentaCreditoObj}
          placeholder="Buscar"
          onChange={(c) => {
            onChange("cuentaCreditoId", c?.id ?? null);
            onChange("cuentaCreditoObj", c ?? null);
          }}
        />
      </td>
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
