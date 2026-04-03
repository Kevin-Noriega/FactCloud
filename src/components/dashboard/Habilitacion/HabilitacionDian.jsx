import React, { useState, useEffect } from "react";
import {
  InfoCircle,
  CheckCircleFill,
  ClockFill,
  FileEarmarkText,
  Building,
  XLg,
} from "react-bootstrap-icons";
import axiosClient from "../../../api/axiosClient";
import "./Habilitaciones.css";
import { useNavigate } from "react-router-dom";

const BadgeEstado = ({ estado }) => {
  if (estado === "completado") {
    return (
      <span className="hab-badge hab-badge-ok">
        <CheckCircleFill size={11} /> Completado
      </span>
    );
  }

  if (estado === "en_proceso") {
    return (
      <span className="hab-badge hab-badge-proceso">
        <ClockFill size={11} /> En proceso
      </span>
    );
  }

  return <span className="hab-badge hab-badge-pendiente">Pendiente</span>;
};

export default function HabilitacionDian() {
  const navigate = useNavigate();

  const [estadoFEV, setEstadoFEV] = useState("pendiente");
  const [estadoDSE, setEstadoDSE] = useState("pendiente");
  const [exito, setExito] = useState("");

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      const res = await axiosClient.get("/Habilitacion/estado");
      setEstadoFEV(res.data.estadoFEV ?? "pendiente");
      setEstadoDSE(res.data.estadoDSE ?? "pendiente");
    } catch {
      // endpoint aún no existe
    }
  };

  return (
    <div className="hab-wrapper">
      <div className="header-card hab-header-card mb-3">
        <div className="hab-header-left">
          <h2 className="header-title mb-1">
            Configuración de documentos electrónicos
          </h2>
          <p className="hab-subtitulo mb-0 text-white">
            Para iniciar a facturar electrónicamente debes realizar el proceso
            de habilitación de tus documentos.  <br />      
             Selecciona el que se ajuste a tus
            necesidades.
          </p>
        </div>

        <div className="header-icon">
          <FileEarmarkText size={42} />
        </div>
      </div>

      {exito && (
        <div className="hab-alert hab-alert-ok">
          <CheckCircleFill size={15} /> {exito}
          <button className="hab-alert-close" onClick={() => setExito("")}>
            <XLg size={12} />
          </button>
        </div>
      )}

      <div className="hab-info-box">
        <InfoCircle size={20} className="hab-info-icon" />
        <div>
          <strong>
            Recuerda que debes tener a la mano los siguientes datos:
          </strong>
          <ol className="hab-info-list">
            <li>Datos del RUT y del representante legal.</li>
            <li>
              Acceso a tu cuenta de la DIAN en{" "}
              <a
                href="https://muisca.dian.gov.co"
                target="_blank"
                rel="noreferrer"
              >
                muisca.dian.gov.co
              </a>
              .
            </li>
            <li>Numeración o identificadores del proceso que corresponda.</li>
          </ol>
        </div>
      </div>

      <div className="hab-cards">
        <div className="hab-card">
          <div className="hab-card-icon-wrap">
            <FileEarmarkText size={34} className="hab-card-icon" />
          </div>

          <div className="hab-card-body">
            <div className="hab-card-header-row">
              <h6 className="hab-card-titulo">
                Facturación electrónica de venta
              </h6>
              <BadgeEstado estado={estadoFEV} />
            </div>

            <p className="hab-card-desc">
              Emite facturas electrónicas de venta directamente desde tu
              aplicación con validación previa ante la DIAN.
            </p>

            <div className="hab-card-actions">
              <a
                className="hab-link-ayuda"
                href="https://www.dian.gov.co"
                target="_blank"
                rel="noreferrer"
              >
                ¿Necesitas ayuda?
              </a>

              {estadoFEV === "completado" ? (
                <button
                  className="hab-btn-crear"
                  onClick={() => navigate("/ventas/nueva")}
                >
                  Crear Factura E.
                </button>
              ) : (
                <button
                  className="hab-btn-continuar"
                  onClick={() =>
                    navigate("/habilitacion-dian/factura-electronica")
                  }
                >
                  {estadoFEV === "en_proceso" ? "Continuar" : "Configurar"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="hab-card">
          <div className="hab-card-icon-wrap hab-card-icon-wrap-muted">
            <Building size={34} className="hab-card-icon-muted" />
          </div>

          <div className="hab-card-body">
            <div className="hab-card-header-row">
              <h6 className="hab-card-titulo">Documento soporte electrónico</h6>
              <BadgeEstado estado={estadoDSE} />
            </div>

            <p className="hab-card-desc">
              Registra compras y gastos con documento soporte electrónico para
              operaciones con sujetos no obligados a facturar.
            </p>

            <div className="hab-card-actions">
              <a
                className="hab-link-ayuda"
                href="https://www.dian.gov.co"
                target="_blank"
                rel="noreferrer"
              >
                ¿Necesitas ayuda?
              </a>

              <button
                className="hab-btn-continuar"
                onClick={() => navigate("/habilitacion-dian/habilitacionDSE")}
              >
                {estadoDSE === "en_proceso" ? "Continuar" : "Configurar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
