// steps/Step4Numeracion.jsx
import "../Habilitaciones.css";
import { PlayCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function Step4Numeracion() {
  return (
    <div className="fe-grid-two fe-grid-stretch">
      {/* Columna izquierda: pasos */}
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
              <strong>Usuario Registrado</strong>. Inicia sesión con los datos
              solicitados.
            </li>
            <li>
              Una vez dentro, dirígete al <strong>Menú Principal</strong>,
              selecciona <strong>Numeración de Facturación</strong>.
            </li>
            <li>
              Allí te diriges a la sección de{" "}
              <strong>Numeración de Facturación</strong> y luego a la opción{" "}
              <strong>Solicitar Numeración de Facturación</strong>.
            </li>
            <li>
              Confirma que tienes actualizado el RUT seleccionando{" "}
              <strong>Aceptar</strong> en la ventana de confirmación.
            </li>
            <li>
              Revisa la información de la empresa y selecciona{" "}
              <strong>Ingresar</strong>.
            </li>
            <li>
              En la vista <strong>Consultar Numeración de Facturación</strong>,
              selecciona <strong>Autorizar Rangos</strong>.
            </li>
            <li>
              En la solicitud de autorización de rangos, ingresa los datos y
              finalmente selecciona <strong>Agregar</strong>.
              <ul className="fe-subpasos">
                <li>Prefijo: debe ser alfabético y no terminar en número.</li>
                <li>
                  Tipo de facturación: selecciona{" "}
                  <strong>Factura electrónica de venta</strong>.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <a
          href="https://catalogo-vpfe-hab.dian.gov.co/User/Login"
          target="_blank"
          rel="noopener noreferrer"
          className="fe-dian-btn"
        >
          Ir al portal de habilitación DIAN
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Columna derecha: consejos */}
      <div className="fe-card fe-card-tips">
        <div className="fe-tips-header">
          <div className="fe-tips-icono">
            <AlertCircle size={18} />
          </div>
          <h4>Tener en cuenta</h4>
        </div>

        <div className="fe-tips-lista">
          <div className="fe-tip-item">
            <div className="fe-tip-numero">1</div>
            <p>
              Al momento de crear un prefijo te sugerimos que sea un{" "}
              <strong>código alfabético de hasta 4 caracteres</strong> (por
              ejemplo, FDS) para identificar tu documento.
            </p>
          </div>

          <div className="fe-tip-item">
            <div className="fe-tip-numero">2</div>
            <p>
              Es importante que el{" "}
              <strong>prefijo no termine en número</strong> para que Nubee
              pueda traer correctamente tus resoluciones.
            </p>
          </div>
        </div>

        <div className="fe-tip-ejemplo">
          <span className="fe-tip-ejemplo-label">Ejemplos de prefijo</span>
          <div className="fe-tip-ejemplo-chips">
            <span className="fe-chip fe-chip-ok">FDS ✓</span>
            <span className="fe-chip fe-chip-ok">FACT ✓</span>
            <span className="fe-chip fe-chip-ok">FE ✓</span>
            <span className="fe-chip fe-chip-err">FDS1 ✗</span>
            <span className="fe-chip fe-chip-err">A2 ✗</span>
          </div>
        </div>
      </div>
    </div>
  );
}