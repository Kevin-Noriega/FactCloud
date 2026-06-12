// ─────────────────────────────────────────────────────────────────────────
// HabilitacionFacturacionFE.jsx
// Orquestador del wizard. Solo contiene layout, stepper y navegación.
// CORRECCIÓN: ahora pasa correctamente todos los props específicos de
// cada step (onEnviar, enviando, estadoConsulta, etc.) que antes faltaban.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleFill,
  CheckLg,
  ArrowLeft,
  ArrowRight,
  XLg,
  FileEarmarkText,
  InfoCircle,
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

export default function HabilitacionFacturacionFE() {
  const navigate = useNavigate();

  const {
    // Estado del wizard
    etapaActual,
    form,
    cargando,
    error,
    exito,

    // Selects
    opcionesCiudades,
    opcionesActividad,
    valorRegimen,
    valorActividad,
    valorTributos,
    valorResponsabilidades,

    // Step 3
    enviandoTestSet,
    onEnviarTestSet,

    // Step 5
    estadoConsulta,
    prefijosResult,
    onConsultarPrefijos,

    // Step 6
    numeraciones,
    ultimaActualizacion,
    cargandoRango,
    onActualizarRango,

    // Acciones
    actualizarCampo,
    manejarCambioRegimen,
    guardarEtapa,
    volver,
  } = useHabilitacion();

  // Props comunes a todos los steps
  const commonProps = {
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

  // Renderiza el step activo con los props específicos que necesita
  const renderStep = () => {
    switch (etapaActual) {
      case 1:
        return <Step1PerfilEmpresa {...commonProps} />;

      case 2:
        return <Step2CertificadoDigital {...commonProps} />;

      case 3:
        // CORRECCIÓN: Step3 necesita onEnviar y enviando; antes no se pasaban.
        return (
          <Step3SetPruebas
            {...commonProps}
            onEnviar={onEnviarTestSet}
            enviando={enviandoTestSet}
          />
        );

      case 4:
        // CORRECCIÓN: Step4 necesita actualizarCampo para el formulario
        // de resolución que completamos en el hook.
        return <Step4Numeracion {...commonProps} />;

      case 5:
        // CORRECCIÓN: Step5 necesita estadoConsulta, prefijosResult y onConsultar.
        return (
          <Step5Prefijos
            estadoConsulta={estadoConsulta}
            prefijosResult={prefijosResult}
            onConsultar={onConsultarPrefijos}
          />
        );

      case 6:
        // CORRECCIÓN: Step6 necesita numeraciones, ultimaActualizacion,
        // onActualizar y cargando.
        return (
          <Step6Sincronizar
            numeraciones={numeraciones}
            ultimaActualizacion={ultimaActualizacion}
            onActualizar={onActualizarRango}
            cargando={cargandoRango}
          />
        );

      default:
        return null;
    }
  };

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
              className={[
                "fe-step",
                etapaActual === etapa.id ? "activo" : "",
                etapaActual > etapa.id ? "completado" : "",
              ]
                .filter(Boolean)
                .join(" ")}
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
      <div className="fe-body">{renderStep()}</div>

      {/* Footer de navegación */}
      <div className="fe-footer">
        <button className="fe-btn fe-btn-light" onClick={() => navigate(-1)}>
          Cancelar
        </button>

        <div className="fe-footer-actions">
          {etapaActual > 1 && (
            <button
              className="fe-btn fe-btn-back"
              onClick={volver}
              disabled={cargando}
            >
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
                  Guardar y continuar <ArrowRight size={14} />
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
