// steps/Step6Sincronizar.jsx
import "../Habilitaciones.css";
import { RefreshCw, ExternalLink } from "lucide-react";

/*
  Props:
  ─ numeraciones       : [{
        tipoNumeracion   : "Factura Contingencia",
        prefijo          : "RGIY",
        numeracionDian   : "1256226398",
        fechaResolucion  : "5 may 2024",
        rangoNumeracion  : "20000 - 500000",
        proximoNumero    : "20000",
    }]
  ─ ultimaActualizacion : "09 sept 2025 a las 10:00"
  ─ onActualizar        : () => void
  ─ cargando            : boolean
*/
export default function Step6Sincronizar({
  numeraciones = [],
  ultimaActualizacion = "",
  onActualizar,
  cargando = false,
}) {
  return (
    <div className="fe-step6-wrapper">
      {/* ── Encabezado de éxito ── */}
      <div className="fe-step6-header">
        <p className="fe-step6-titulo">
          Has solicitado tu numeración y asociado los prefijos en la DIAN.{" "}
          <strong>Ahora puedes ver las numeraciones habilitadas</strong>
        </p>
        <p className="fe-step6-subtitulo">
          Puedes crear o modificar un comprobante{" "}
          <a
            href="#"
            className="fe-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            desde la configuración de la Factura electrónica
            <ExternalLink size={12} />
          </a>
        </p>
      </div>

      {/* ── Tabla de numeraciones ── */}
      <div className="fe-tabla-wrapper">
        {/* Barra superior */}
        <div className="fe-tabla-topbar">
          {ultimaActualizacion && (
            <span className="fe-tabla-update">
              Última actualización: <strong>{ultimaActualizacion}</strong>
            </span>
          )}
          <button
            className={`fe-btn-refresh ${cargando ? "fe-btn-refresh--loading" : ""}`}
            onClick={onActualizar}
            disabled={cargando}
          >
            <RefreshCw size={14} className={cargando ? "fe-spin" : ""} />
            Actualizar listado
          </button>
        </div>

        {/* Tabla */}
        <div className="fe-tabla-scroll">
          <table className="fe-tabla">
            <thead>
              <tr>
                <th className="fe-th-check">
                  <input type="checkbox" disabled />
                </th>
                <th>Tipo de numeración</th>
                <th>Prefijo</th>
                <th>Numeración DIAN</th>
                <th>Fecha de resolución</th>
                <th>Rango de numeración</th>
                <th>Próximo número</th>
              </tr>
            </thead>
            <tbody>
              {numeraciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="fe-tabla-empty">
                    No se encontraron numeraciones sincronizadas.
                  </td>
                </tr>
              ) : (
                numeraciones.map((n, i) => (
                  <tr key={i}>
                    <td className="fe-th-check">
                      <input type="checkbox" />
                    </td>
                    <td>{n.tipoNumeracion}</td>
                    <td>
                      <span className="fe-prefijo-badge">{n.prefijo}</span>
                    </td>
                    <td className="fe-num-mono">{n.numeracionDian}</td>
                    <td>{n.fechaResolucion}</td>
                    <td>{n.rangoNumeracion}</td>
                    <td className="fe-num-mono">{n.proximoNumero}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
