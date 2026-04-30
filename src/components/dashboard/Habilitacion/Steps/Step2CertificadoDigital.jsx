// steps/Step2CertificadoDigital.jsx
import "../Habilitaciones.css";

export default function Step2CertificadoDigital({ form, actualizarCampo }) {
  const opcion = form.certificado.opcion; // "propio" | "Nubee"

  return (
    <div className="fe-grid one">
      {/* ── SELECTOR DE OPCIÓN ── */}
      <div className="fe-card">
        <h4>Certificado digital</h4>
        <p className="fe-subtitle">
          El certificado digital permite firmar y autenticar tus documentos
          electrónicos ante la DIAN.
        </p>

        <div className="fe-opciones-certificado">
          {/* Opción A: certificado propio */}
          <label
            className={`fe-opcion-card ${opcion === "propio" ? "activa" : ""}`}
          >
            <input
              type="radio"
              name="opcionCertificado"
              value="propio"
              checked={opcion === "propio"}
              onChange={() =>
                actualizarCampo("certificado", "opcion", "propio")
              }
            />
            <div className="fe-opcion-icono fe-icono-upload">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="fe-opcion-content">
              <div className="fe-opcion-radio-dot">
                {opcion === "propio" && <span />}
              </div>
              <div>
                <strong>Usar mi propio certificado digital</strong>
                <p>
                  Sube tu archivo <code>.p12</code> o <code>.pfx</code>{" "}
                  adquirido con Certicámara, Andes u otra entidad autorizada.
                </p>
              </div>
            </div>
          </label>

          {/* Opción B: certificado de Nubee */}
          <label
            className={`fe-opcion-card ${opcion === "Nubee" ? "activa" : ""}`}
          >
            <input
              type="radio"
              name="opcionCertificado"
              value="Nubee"
              checked={opcion === "Nubee"}
              onChange={() =>
                actualizarCampo("certificado", "opcion", "Nubee")
              }
            />
            <div className="fe-opcion-icono fe-icono-shield">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="fe-opcion-content">
              <div className="fe-opcion-radio-dot">
                {opcion === "Nubee" && <span />}
              </div>
              <div>
                <strong>Usar el certificado de Nubee</strong>
                <p>
                  Nubee firmará tus documentos usando su certificado como
                  proveedor tecnológico habilitado por la DIAN, por 1 año.
                  Requiere aceptar la carta de exoneración.
                </p>
                <span className="fe-badge-recomendado">✓ Recomendado</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* ── PANEL: certificado propio ── */}
      {opcion === "propio" && (
        <div className="fe-card">
          <h5>Subir certificado .p12 / .pfx</h5>

          <label className="fe-upload-area" htmlFor="fe-file-cert">
            <input
              id="fe-file-cert"
              type="file"
              accept=".p12,.pfx"
              onChange={(e) =>
                actualizarCampo(
                  "certificado",
                  "archivoCertificado",
                  e.target.files[0],
                )
              }
            />
            <div className="fe-upload-icono">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <span className="fe-upload-label">
              {form.certificado.archivoCertificado
                ? form.certificado.archivoCertificado.name
                : "Arrastra tu archivo aquí o haz clic para seleccionar"}
            </span>
            <span className="fe-upload-hint">Formatos aceptados</span>
            <div className="fe-upload-formatos">
              <span className="fe-format-chip">.p12</span>
              <span className="fe-format-chip">.pfx</span>
            </div>
          </label>

          <div className="fe-divider" />

          <div className="fe-field">
            <label>Contraseña del certificado</label>
            <input
              type="password"
              value={form.certificado.passwordCertificado || ""}
              onChange={(e) =>
                actualizarCampo(
                  "certificado",
                  "passwordCertificado",
                  e.target.value,
                )
              }
              placeholder="Ingresa la contraseña del archivo .p12 / .pfx"
            />
          </div>

          <div className="fe-hint">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Tu certificado se almacena de forma cifrada y solo se usa para
            firmar documentos electrónicos. Nubee no comparte esta
            información.
          </div>
        </div>
      )}

      {/* ── PANEL: carta de exoneración ── */}
      {opcion === "Nubee" && (
        <div className="fe-card">
          <div className="fe-carta-header">
            <div className="fe-carta-icono">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h5>Carta de exoneración de responsabilidad</h5>
              <span className="fe-subtitle-small">
                Lee el documento antes de aceptar
              </span>
            </div>
          </div>

          {/* Carta renderizada dinámicamente con datos del negocio */}
          <div className="fe-carta-exoneracion">
            <p className="fe-carta-empresa">Nubee S.A.S.</p>
            <p className="fe-carta-titulo">
              CARTA DE EXONERACIÓN DE RESPONSABILIDAD
            </p>

            <p>
              <strong>{form.perfil.nombreRepresentante}</strong>, mayor de edad,
              identificado(a) con{" "}
              <strong>{form.perfil.tipoDocRepresentante}</strong> N°{" "}
              <strong>{form.perfil.docRepresentante}</strong>, actuando en
              calidad de representante legal de{" "}
              <strong>{form.perfil.razonSocial}</strong> (en adelante el
              "Usuario"), por medio de la presente carta que hace parte
              integrante del Contrato firmado con Nubee S.A.S. (en adelante,
              "Nubee")
            </p>

            <p className="fe-carta-seccion">MANIFIESTO</p>

            <p>
              Que Nubee, en su calidad de proveedor tecnológico de
              facturación electrónica habilitado por la DIAN, permite el uso de
              su Certificado de Firma Digital para la firma de Documentos del
              Ecosistema de Factura Electrónica expedidos por el Usuario a
              través del Software Nubee, durante un (1) año contado a partir
              de la aceptación de la presente carta.
            </p>

            <p>
              Que el Usuario{" "}
              <strong>exonera expresamente a Nubee S.A.S.</strong> de
              cualquier responsabilidad civil, penal, fiscal o administrativa
              que pueda derivarse del uso del Certificado Digital en la firma de
              los documentos electrónicos expedidos en nombre del Usuario.
            </p>

            <p className="fe-carta-seccion">VIGENCIA</p>
            <p>
              La presente autorización tendrá vigencia de{" "}
              <strong>un (1) año</strong> a partir de la fecha de su aceptación
              electrónica, pudiendo renovarse de común acuerdo entre las partes.
            </p>
          </div>

          <label
            className={`fe-check ${form.certificado.aceptarExoneracion ? "fe-check-activo" : ""}`}
          >
            <input
              type="checkbox"
              checked={form.certificado.aceptarExoneracion}
              onChange={(e) =>
                actualizarCampo(
                  "certificado",
                  "aceptarExoneracion",
                  e.target.checked,
                )
              }
            />
            <div
              className={`fe-checkbox-custom ${form.certificado.aceptarExoneracion ? "marcado" : ""}`}
            >
              {form.certificado.aceptarExoneracion && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div className="fe-check-texto">
              He leído y acepto la carta de exoneración de responsabilidad
              <span>
                Al marcar esta casilla autorizas a Nubee a firmar en nombre
                de tu empresa.
              </span>
            </div>
          </label>

          <div className="fe-info-strip">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p>
              Puedes usar el certificado de Nubee por <strong>1 año</strong>
              . Para usar el tuyo, selecciona la opción anterior.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
