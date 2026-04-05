// ─────────────────────────────────────────────────────────────
// HabilitacionFacturacionFE.jsx
// Componente orquestador del wizard. Solo contiene JSX del
// layout, el stepper y la navegación.
// Toda la lógica vive en useHabilitacion.js
// ─────────────────────────────────────────────────────────────
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleFill,
  CheckLg,
  ArrowLeft,
  ArrowRight,
  XLg,
  ShieldCheck,
  InfoCircle,
  FileEarmarkText,
} from "react-bootstrap-icons";
import "./Habilitaciones.css";

import { ETAPAS } from "./constants";
import { useHabilitacion } from "./useHabilitacion";

import Step1PerfilEmpresa from "./steps/Step1PerfilEmpresa";
import Step2CertificadoDigital from "./steps/Step2CertificadoDigital";
import Step3SetPruebas from "./steps/Step3SetPruebas";
import Step4Numeracion from "./steps/Step4Numeracion";
import Step5Prefijos from "./steps/Step5Prefijos";
import Step6Sincronizar from "./steps/Step6Sincronizar";

// Mapa etapa → componente
const STEPS_MAP = {
  1: Step1PerfilEmpresa,
  2: Step2CertificadoDigital,
  3: Step3SetPruebas,
  4: Step4Numeracion,
  5: Step5Prefijos,
  6: Step6Sincronizar,
};

export default function HabilitacionFacturacionFE() {
  const navigate = useNavigate();

  const {
    etapaActual,
    form,
    cargando,
    error,
    exito,
    opcionesCiudades,
    opcionesActividad,
    valorRegimen,
    valorActividad,
    valorTributos,
    valorResponsabilidades,
    actualizarCampo,
    manejarCambioRegimen,
    guardarEtapa,
    volver,
  } = useHabilitacion();

  // Props compartidos que cada step puede necesitar
  const stepProps = {
    form,
    actualizarCampo,
    manejarCambioRegimen,
    opcionesCiudades,
    opcionesActividad,
    valorRegimen,
    valorActividad,
    valorTributos,
    valorResponsabilidades,
  };

  const StepActual = STEPS_MAP[etapaActual] ?? null;

  return (
    <div className="fe-wrapper">
      {/* Encabezado */}
      <div className="header-card hab-header-card mb-3">
        <div className="hab-header-left">
          <h2 className="header-title mb-1">
            Habilitación de Facturación Electrónica
          </h2>
          <p className="hab-subtitulo mb-0 text-white">
            Completa las {ETAPAS.length} etapas para dejar configurada tu
            facturación electrónica.
          </p>
        </div>
        <div className="header-icon">
          <FileEarmarkText size={42} />
        </div>
      </div>

      {/* Alertas */}
      {exito && (
        <div className="fe-alert fe-alert-ok">
          <CheckCircleFill size={16} /> {exito}
        </div>
      )}
      {error && (
        <div className="fe-alert fe-alert-error">
          <XLg size={16} /> {error}
        </div>
      )}

      {/* Aviso informativo */}
      <div className="fe-help-box">
        <InfoCircle size={18} />
        <span>Este flujo puede guardarse por etapas y retomarse luego.</span>
      </div>

      {/* Stepper */}
      <div className="fe-stepper">
        {ETAPAS.map((etapa, index) => (
          <React.Fragment key={etapa.id}>
            <div
              className={`fe-step ${etapaActual === etapa.id ? "activo" : ""} ${etapaActual > etapa.id ? "completado" : ""}`}
            >
              <div className="fe-step-circle">
                {etapaActual > etapa.id ? <CheckLg size={12} /> : etapa.id}
              </div>
              <span>{etapa.label}</span>
            </div>
            {index < ETAPAS.length - 1 && (
              <div
                className={`fe-step-line ${etapaActual > etapa.id ? "completa" : ""}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Contenido del step activo */}
      <div className="fe-body">
        <div className="fe-title-box"></div>

        {StepActual && <StepActual {...stepProps} />}
      </div>

      {/* Footer de navegación */}
      <div className="fe-footer">
        <button className="fe-btn fe-btn-light" onClick={() => navigate(-1)}>
          Cancelar
        </button>

        <div className="fe-footer-actions">
          {etapaActual > 1 && (
            <button className="fe-btn fe-btn-back" onClick={volver}>
              <ArrowLeft size={14} /> Anterior
            </button>
          )}

          {etapaActual < ETAPAS.length ? (
            <button
              className="fe-btn fe-btn-primary"
              onClick={guardarEtapa}
              disabled={cargando}
            >
              {cargando ? (
                "Guardando..."
              ) : (
                <>
                  {" "}
                  Guardar y continuar <ArrowRight size={14} />{" "}
                </>
              )}
            </button>
          ) : (
            <button
              className="fe-btn fe-btn-primary"
              onClick={guardarEtapa}
              disabled={cargando}
            >
              {cargando ? "Finalizando..." : "Finalizar habilitación"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
