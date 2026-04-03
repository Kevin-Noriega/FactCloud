// steps/Step5Prefijos.jsx
import "../Habilitaciones.css";
import {
  PlayCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";

/*
  Props:
  ─ estadoConsulta : "idle" | "loading" | "success" | "sin_prefijos" | "error"
  ─ prefijosResult : [{ prefijo: "FDS", resolucion: "1256226398" }]
  ─ onConsultar    : () => void   — llama a la API de FactCloud
*/
export default function Step5Prefijos({
  estadoConsulta = "idle",
  prefijosResult = [],
  onConsultar,
}) {
  return (
    <div className="fe-step5-wrapper">
      {/* ── Banner de advertencia ── */}
      <div className="fe-banner-warning">
        <AlertCircle size={17} />
        <p>
          Después de solicitar tu numeración deberás{" "}
          <strong>esperar de 2 a 3 horas</strong> para poder asociar los
          prefijos en la DIAN.
        </p>
      </div>

      <div className="fe-grid-two fe-grid-stretch">
        {/* ── Columna izquierda: instrucciones ── */}
        <div className="fe-card fe-card-instrucciones">
          <div className="fe-card-instrucciones-inner">
            <h4>Asociar prefijos</h4>

            <div className="fe-tutorial-link">
              <span>¿No sabes cómo hacerlo?</span>
              <a
                href="https://www.dian.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="fe-link"
              >
                <PlayCircle size={14} />
                Tutorial en video
              </a>
            </div>

            <ol className="fe-pasos">
              <li>
                Ingresa a la <strong>página de la DIAN</strong>. Ve a la sección{" "}
                <strong>Temas de interés</strong>, en Factura Electrónica
                selecciona la opción{" "}
                <strong>Facturando Electrónicamente</strong>. Inicia sesión con
                los datos solicitados.
              </li>
              <li>
                Recibirás un enlace de acceso en tu correo electrónico
                registrado en el RUT. Haz clic en el enlace del correo para
                acceder a la plataforma de la DIAN.
              </li>
              <li>
                Una vez dentro, dirígete al <strong>Menú Principal</strong>,
                selecciona <strong>Configuración</strong> y luego{" "}
                <strong>Rangos de Numeración</strong>.
              </li>
              <li>
                Selecciona <strong>FactCloud S.A.S.</strong> como tu proveedor,
                elige la resolución de facturación habilitada y haz clic en{" "}
                <strong>Agregar</strong>.
              </li>
              <li>
                Confirma la asociación seleccionando <strong>Aceptar</strong> en
                la ventana de confirmación.
              </li>
              <li>
                En la parte inferior de la pantalla, verás la{" "}
                <strong>resolución asociada</strong>, incluyendo los datos del
                proveedor (FactCloud), el prefijo y el rango de numeración
                asignado.
              </li>
            </ol>
          </div>
        </div>

        {/* ── Columna derecha: consulta de estado ── */}
        <div className="fe-card">
          <h4>Consultar estado de prefijos</h4>
          <p className="fe-subtitle">
            Una vez estén asociados los prefijos en la DIAN, consulta su estado
            de sincronización con FactCloud:
          </p>

          {/* Panel de estado */}
          <div className="fe-estado-panel">
            {/* ── Estado: idle — solo botón de consultar ── */}
            {estadoConsulta === "idle" && (
              <button className="fe-btn-consultar" onClick={onConsultar}>
                Consultar si ya tengo prefijos asociados
                <Search size={14} />
              </button>
            )}

            {/* ── Estado: loading — en proceso ── */}
            {estadoConsulta === "loading" && (
              <>
                <div className="fe-estado-header">
                  <span className="fe-estado-label">
                    Estado de la consulta:
                  </span>
                  <span className="fe-badge fe-badge-blue">En proceso</span>
                </div>
                <div className="fe-estado-pasos">
                  <div className="fe-estado-paso fe-paso-ok">
                    <span>Consultando resoluciones</span>
                    <CheckCircle2 size={20} className="fe-paso-icon-ok" />
                  </div>
                  <div className="fe-estado-paso fe-paso-loading">
                    <span>Obteniendo resoluciones</span>
                    <Loader2 size={20} className="fe-paso-icon-spin" />
                  </div>
                </div>
              </>
            )}

            {/* ── Estado: success — prefijos encontrados ── */}
            {estadoConsulta === "success" && prefijosResult.length > 0 && (
              <>
                <div className="fe-estado-header">
                  <span className="fe-estado-label">
                    Estado de la consulta:
                  </span>
                  <span className="fe-badge fe-badge-green">
                    Prefijos asociados
                  </span>
                </div>
                <p className="fe-prefijos-titulo">
                  Prefijos asociados en resoluciones:
                </p>
                <ul className="fe-prefijos-lista">
                  {prefijosResult.map((item, i) => (
                    <li key={i} className="fe-prefijo-item">
                      <span className="fe-prefijo-tag">{item.prefijo}</span>
                      <span className="fe-prefijo-resolucion">
                        — {item.resolucion}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ── Estado: sin_prefijos ── */}
            {estadoConsulta === "sin_prefijos" && (
              <>
                <div className="fe-estado-header">
                  <span className="fe-estado-label">
                    Estado de la consulta:
                  </span>
                  <span className="fe-badge fe-badge-red">
                    Sin prefijos asociados
                  </span>
                </div>
                <p className="fe-estado-msg">
                  Aún no tienes prefijos asociados en la DIAN. Inténtalo más
                  tarde. Si no has realizado este paso, mira el video "Cómo
                  asociar prefijos".
                </p>
                <button className="fe-btn-consultar" onClick={onConsultar}>
                  Consultar si ya tengo prefijos asociados
                  <Search size={14} />
                </button>
              </>
            )}

            {/* ── Estado: error ── */}
            {estadoConsulta === "error" && (
              <>
                <div className="fe-estado-header">
                  <span className="fe-estado-label">
                    Estado de la consulta:
                  </span>
                  <span className="fe-badge fe-badge-red">Error</span>
                </div>
                <p className="fe-estado-msg">
                  No se ha podido realizar la consulta. Inténtalo nuevamente.
                </p>
                <button className="fe-btn-consultar" onClick={onConsultar}>
                  Consultar si ya tengo prefijos asociados
                  <Search size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
