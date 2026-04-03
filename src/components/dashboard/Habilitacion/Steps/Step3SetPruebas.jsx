// steps/Step3SetPruebas.jsx
import "../Habilitaciones.css";
import { ExternalLink, PlayCircle, Send } from "lucide-react";

export default function Step3SetPruebas({
  form,
  actualizarCampo,
  onEnviar,
  enviando,
}) {
  return (
    <div className="fe-grid fe-grid-two">
      {/* ── COLUMNA IZQUIERDA: instrucciones ── */}
      <div className="fe-card fe-card-instrucciones">
        <h4>Set de pruebas</h4>
        <p className="fe-subtitle">
          Este proceso enviará automáticamente documentos de prueba a la DIAN
          para asegurar el funcionamiento del software de facturación
          electrónica.
        </p>

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
            <strong>Temas de interés</strong>, en Factura Electrónica selecciona
            la opción <strong>Habilitación</strong>. Inicia sesión con los datos
            solicitados por <strong>Empresa y/o Persona</strong> según
            corresponda.
          </li>
          <li>
            Recibirás un enlace de acceso en tu correo electrónico registrado en
            el RUT. Haz clic en el enlace del correo para acceder a la
            plataforma de la DIAN.
          </li>
          <li>
            Una vez dentro, dirígete al <strong>Menú Principal</strong>,
            selecciona{" "}
            <strong>Registro y habilitación – Documentos Electrónicos</strong>.
          </li>
          <li>
            Selecciona el <strong>tipo de documento</strong>, en este caso elige{" "}
            <strong>Factura electrónica</strong>. Luego te aparecerán los datos
            de la empresa, deberás hacer clic en el botón{" "}
            <strong>"Configurar modos de operación"</strong>.
          </li>
          <li>
            En el campo <strong>"selecciona modo de operación"</strong> elige la
            opción Software de un proveedor tecnológico.
          </li>
          <li>
            En el campo{" "}
            <strong>"Nombre de empresa proveedora y de software"</strong> elige
            a <strong>FactCloud S.A.S.</strong>, confirma que "Nombre de
            Software" aparece <strong>FactCloudPT</strong>, seguido haz clic en{" "}
            <strong>Asociar</strong>.
          </li>
        </ol>
      </div>

      {/* ── COLUMNA DERECHA: formulario ── */}
      <div className="fe-card">
        <h4>Envío del set de pruebas</h4>
        <p className="fe-subtitle">
          Ingresa los siguientes datos que encontrarás en la{" "}
          <a
            href="https://catalogo-vpfe-hab.dian.gov.co/User/Login"
            target="_blank"
            rel="noopener noreferrer"
            className="fe-link"
          >
            página de habilitación DIAN
            <ExternalLink size={12} />
          </a>
        </p>

        <div className="fe-form-grid">
          <div className="full fe-field-group">
            <label htmlFor="sp-testSetId">
              Código identificador del set de pruebas
              <span className="fe-field-hint">
                Encuéntralo en la parte superior del formulario.
              </span>
            </label>
            <input
              id="sp-testSetId"
              type="text"
              placeholder="Código identificador del set de pruebas"
              value={form.setPruebas.testSetId}
              onChange={(e) =>
                actualizarCampo("setPruebas", "testSetId", e.target.value)
              }
            />
          </div>

          <div className="full fe-field-group">
            <label htmlFor="sp-resolucion">
              Número de resolución del set de pruebas
              <span className="fe-field-hint">
                Encuéntralo en la sección "Rango de numeración asignado".
              </span>
            </label>
            <input
              id="sp-resolucion"
              type="text"
              placeholder="Ej. 18760000001"
              value={form.setPruebas.resolucionPrueba}
              onChange={(e) =>
                actualizarCampo(
                  "setPruebas",
                  "resolucionPrueba",
                  e.target.value,
                )
              }
            />
          </div>
        </div>

        <div className="fe-card-actions">
          <button
            className="fe-btn fe-btn-primary fe-btn-send"
            onClick={onEnviar}
            disabled={
              enviando ||
              !form.setPruebas.testSetId ||
              !form.setPruebas.resolucionPrueba
            }
          >
            {enviando ? (
              <>
                <span className="fe-spinner" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={14} />
                Enviar set de pruebas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
