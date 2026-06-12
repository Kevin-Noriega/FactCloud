// steps/Step4Numeracion.jsx
// CORRECCIÓN: el componente original era solo informacional (instrucciones DIAN)
// y no tenía formulario. Se añade el formulario de captura de la resolución.
import "../Habilitaciones.css";
import { PlayCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function Step4Numeracion({ form, actualizarCampo }) {
  const n = form.numeracion || {};

  return (
    <div className="fe-grid-two fe-grid-stretch">
      {/* Columna izquierda: instrucciones */}
      <div className="fe-card fe-card-instrucciones">
        <div className="fe-card-instrucciones-inner">
          <h4>Solicitar numeración</h4>

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
              <strong>Transaccional</strong>, selecciona{" "}
              <strong>Usuario Registrado</strong>.
            </li>
            <li>
              Dirígete al <strong>Menú Principal</strong> → selecciona{" "}
              <strong>Numeración de Facturación</strong>.
            </li>
            <li>
              En <strong>Solicitar Numeración de Facturación</strong> completa
              los datos y confirma.
            </li>
            <li>
              Una vez aprobada, ingresa aquí los datos de la resolución que la
              DIAN te asignó.
            </li>
          </ol>
        </div>

        <a
          href="https://catalogo-vpfe-hab.dian.gov.co/User/Login"
          target="_blank"
          rel="noopener noreferrer"
          className="fe-dian-btn"
        >
          Ir al portal DIAN
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Columna derecha: formulario resolución DIAN */}
      <div className="fe-card">
        <div className="fe-tips-header">
          <div className="fe-tips-icono">
            <AlertCircle size={18} />
          </div>
          <h4>Datos de la resolución DIAN</h4>
        </div>

        <p className="fe-subtitle">
          Ingresa exactamente los datos que te asignó la DIAN en tu resolución
          de facturación.
        </p>

        <div className="fe-form-grid">
          {/* Número de autorización */}
          <div className="full fe-field-group">
            <label htmlFor="num-autorizacion">
              Número de autorización
              <span className="fe-field-hint">14 dígitos exactos.</span>
            </label>
            <input
              id="num-autorizacion"
              type="text"
              maxLength={14}
              placeholder="Ej. 18764000001234"
              value={n.numeroAutorizacion || ""}
              onChange={(e) =>
                actualizarCampo(
                  "numeracion",
                  "numeroAutorizacion",
                  e.target.value,
                )
              }
            />
          </div>

          {/* Prefijo */}
          <div className="fe-field-group">
            <label htmlFor="num-prefijo">
              Prefijo
              <span className="fe-field-hint">
                Alfabético, máx. 4 caracteres. No debe terminar en número.
              </span>
            </label>
            <input
              id="num-prefijo"
              type="text"
              maxLength={4}
              placeholder="Ej. FACT"
              value={n.prefijo || ""}
              onChange={(e) =>
                actualizarCampo(
                  "numeracion",
                  "prefijo",
                  e.target.value.toUpperCase(),
                )
              }
            />
          </div>

          {/* Tipo de ambiente */}
          <div className="fe-field-group">
            <label htmlFor="num-ambiente">Tipo de ambiente</label>
            <select
              id="num-ambiente"
              value={n.tipoAmbiente || "1"}
              onChange={(e) =>
                actualizarCampo("numeracion", "tipoAmbiente", e.target.value)
              }
            >
              <option value="1">1 — Producción</option>
              <option value="2">2 — Habilitación / Pruebas</option>
            </select>
          </div>

          {/* Rango desde */}
          <div className="fe-field-group">
            <label htmlFor="num-desde">Rango desde</label>
            <input
              id="num-desde"
              type="number"
              min={1}
              placeholder="Ej. 1"
              value={n.rangoDesde || ""}
              onChange={(e) =>
                actualizarCampo("numeracion", "rangoDesde", e.target.value)
              }
            />
          </div>

          {/* Rango hasta */}
          <div className="fe-field-group">
            <label htmlFor="num-hasta">Rango hasta</label>
            <input
              id="num-hasta"
              type="number"
              min={1}
              placeholder="Ej. 5000000"
              value={n.rangoHasta || ""}
              onChange={(e) =>
                actualizarCampo("numeracion", "rangoHasta", e.target.value)
              }
            />
          </div>

          {/* Fecha inicio */}
          <div className="fe-field-group">
            <label htmlFor="num-fecha-ini">Fecha de inicio de vigencia</label>
            <input
              id="num-fecha-ini"
              type="date"
              value={n.fechaInicio || ""}
              onChange={(e) =>
                actualizarCampo("numeracion", "fechaInicio", e.target.value)
              }
            />
          </div>

          {/* Fecha fin */}
          <div className="fe-field-group">
            <label htmlFor="num-fecha-fin">Fecha de fin de vigencia</label>
            <input
              id="num-fecha-fin"
              type="date"
              value={n.fechaFin || ""}
              onChange={(e) =>
                actualizarCampo("numeracion", "fechaFin", e.target.value)
              }
            />
          </div>

          {/* Clave técnica (opcional) */}
          <div className="full fe-field-group">
            <label htmlFor="num-clave">
              Clave técnica
              <span className="fe-field-hint">
                Opcional. Proporcionada por la DIAN.
              </span>
            </label>
            <input
              id="num-clave"
              type="text"
              placeholder="Opcional"
              value={n.claveTecnica || ""}
              onChange={(e) =>
                actualizarCampo("numeracion", "claveTecnica", e.target.value)
              }
            />
          </div>
        </div>

        <div className="fe-tips-lista" style={{ marginTop: "1rem" }}>
          <div className="fe-tip-item">
            <div className="fe-tip-numero">✓</div>
            <p>
              Al guardar, Nubee registrará automáticamente el rango en Factus
              para habilitar la emisión de facturas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
