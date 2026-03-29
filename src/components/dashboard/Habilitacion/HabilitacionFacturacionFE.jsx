import React, { useEffect, useState } from "react";
import {
  CheckCircleFill,
  CheckLg,
  ArrowLeft,
  ArrowRight,
  XLg,
  ShieldCheck,
  InfoCircle,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import "./Habilitaciones.css";

const ETAPAS = [
  { id: 1, label: "Perfil de la empresa" },
  { id: 2, label: "Certificado digital" },
  { id: 3, label: "Set de pruebas DIAN" },
  { id: 4, label: "Solicitar numeración DIAN" },
  { id: 5, label: "Asociar prefijos DIAN" },
  { id: 6, label: "Sincronizar" },
];

export default function HabilitacionFacturacionFE() {
  const navigate = useNavigate();

  const [etapaActual, setEtapaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [form, setForm] = useState({
    perfil: {
      tipoIdentificacion: "NIT",
      numeroIdentificacion: "",
      dv: "",
      nombreComercial: "",
      razonSocial: "",
      correo: "",
      direccion: "",
      ciudad: "",
      telefono: "",
      representanteNombre: "",
      representanteApellidos: "",
      representanteTipoId: "Cédula de ciudadanía",
      representanteNumeroId: "",
      ciudadExpedicion: "",
      ciudadResidencia: "",
    },
    certificado: {
      usarCertificadoSiigo: true,
      aceptarExoneracion: false,
    },
    setPruebas: {
      testSetId: "",
      resolucionPrueba: "",
    },
    numeracion: {
      prefijo: "",
      tipoFacturacion: "Factura electrónica de venta",
    },
    prefijos: {
      prefijoAsociado: "",
    },
    sincronizacion: {
      sincronizado: false,
    },
  });

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      const res = await axiosClient.get("/Habilitacion/estado");
      if (res.data?.etapaActual) setEtapaActual(res.data.etapaActual);
      if (res.data?.formulario) setForm(res.data.formulario);
    } catch {
      // si el endpoint no existe aún, seguimos con el estado local
    }
  };

  const actualizarCampo = (bloque, campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [bloque]: {
        ...prev[bloque],
        [campo]: valor,
      },
    }));
  };

  const guardarEtapa = async () => {
    setError("");
    setExito("");
    setCargando(true);

    try {
      await axiosClient.post("/Habilitacion/guardar-etapa", {
        etapaActual,
        data: form,
      });

      if (etapaActual < 6) {
        setEtapaActual((prev) => prev + 1);
      } else {
        setExito("Habilitación guardada correctamente.");
      }
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "No fue posible guardar la etapa.");
    } finally {
      setCargando(false);
    }
  };

  const volver = () => {
    if (etapaActual > 1) setEtapaActual((prev) => prev - 1);
  };

  const finalizar = async () => {
    setError("");
    setExito("");
    setCargando(true);

    try {
      await axiosClient.post("/Habilitacion/finalizar", form);
      setExito("La habilitación fue completada correctamente.");
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "No fue posible finalizar.");
    } finally {
      setCargando(false);
    }
  };

  const renderContenido = () => {
    switch (etapaActual) {
      case 1:
        return (
          <div className="fe-step-view">
            <p className="fe-step-helper">
              Diligencia la información que tienes registrada ante la DIAN,
              recuerda que debe corresponder a la información que tienes en el
              RUT.
            </p>

            <div className="fe-type-switch mb-4">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoPersona"
                  id="tipoEmpresa"
                  checked={form.perfil.tipoPersona === "empresa"}
                  onChange={() =>
                    actualizarCampo("perfil", "tipoPersona", "empresa")
                  }
                />
                <label className="form-check-label" htmlFor="tipoEmpresa">
                  Empresa
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoPersona"
                  id="tipoNatural"
                  checked={form.perfil.tipoPersona === "persona_natural"}
                  onChange={() =>
                    actualizarCampo("perfil", "tipoPersona", "persona_natural")
                  }
                />
                <label className="form-check-label" htmlFor="tipoNatural">
                  Persona natural
                </label>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="fe-block-card">
                  <h6 className="section-title-primary">Datos de acceso</h6>

                  <div className="row">
                    <div className="col-12">
                      <label className="form-label">
                        Correo acceso a Proveedor Tecnológico *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.perfil.correoAcceso || ""}
                        onChange={(e) =>
                          actualizarCampo(
                            "perfil",
                            "correoAcceso",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="fe-block-card mt-4">
                  <h6 className="section-title-primary">Información básica</h6>

                  {form.perfil.tipoPersona === "empresa" ? (
                    <div className="row g-3">
                      <div className="col-md-5">
                        <label className="form-label">
                          Tipo de identificación *
                        </label>
                        <select
                          className="form-select"
                          value={form.perfil.tipoIdentificacion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "tipoIdentificacion",
                              e.target.value,
                            )
                          }
                        >
                          <option value="NIT">NIT</option>
                        </select>
                      </div>

                      <div className="col-md-5">
                        <label className="form-label">
                          Número de identificación *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.numeroIdentificacion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "numeroIdentificacion",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-2">
                        <label className="form-label">DV *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.dv}
                          onChange={(e) =>
                            actualizarCampo("perfil", "dv", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Nombre comercial</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.nombreComercial}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "nombreComercial",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Razón social *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.razonSocial}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "razonSocial",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={form.perfil.correo}
                          onChange={(e) =>
                            actualizarCampo("perfil", "correo", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Dirección *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.direccion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "direccion",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Ciudad *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.ciudad}
                          onChange={(e) =>
                            actualizarCampo("perfil", "ciudad", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Número de teléfono *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.telefono}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "telefono",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nombres *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.nombres || ""}
                          onChange={(e) =>
                            actualizarCampo("perfil", "nombres", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Apellidos *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.apellidos || ""}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "apellidos",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Tipo de identificación *
                        </label>
                        <select
                          className="form-select"
                          value={form.perfil.tipoIdentificacion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "tipoIdentificacion",
                              e.target.value,
                            )
                          }
                        >
                          <option value="Cédula de ciudadanía">
                            Cédula de ciudadanía
                          </option>
                          <option value="Cédula de extranjería">
                            Cédula de extranjería
                          </option>
                          <option value="NIT">NIT</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Número de identificación *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.numeroIdentificacion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "numeroIdentificacion",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={form.perfil.correo}
                          onChange={(e) =>
                            actualizarCampo("perfil", "correo", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Dirección *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.direccion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "direccion",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Ciudad *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.ciudad}
                          onChange={(e) =>
                            actualizarCampo("perfil", "ciudad", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Número de teléfono *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.telefono}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "telefono",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="fe-block-card">
                  <h6 className="section-title-primary">Datos tributarios</h6>

                  <p className="fe-section-note">
                    Estos datos los encuentras en tu RUT, casilla 53
                    responsabilidades, calidades y atributos.
                  </p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Tipo de régimen de IVA *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.perfil.regimenIva || ""}
                        onChange={(e) =>
                          actualizarCampo(
                            "perfil",
                            "regimenIva",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Código de actividad económica *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.perfil.actividadEconomica || ""}
                        onChange={(e) =>
                          actualizarCampo(
                            "perfil",
                            "actividadEconomica",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tributos *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.perfil.tributos || ""}
                        onChange={(e) =>
                          actualizarCampo("perfil", "tributos", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Responsabilidades fiscales *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.perfil.responsabilidadesFiscales || ""}
                        onChange={(e) =>
                          actualizarCampo(
                            "perfil",
                            "responsabilidadesFiscales",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {form.perfil.tipoPersona === "empresa" && (
                  <div className="fe-block-card mt-4">
                    <h6 className="section-title-primary">
                      Datos del representante legal
                    </h6>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nombre *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.representanteNombre}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "representanteNombre",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Apellidos *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.representanteApellidos}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "representanteApellidos",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Tipo de identificación *
                        </label>
                        <select
                          className="form-select"
                          value={form.perfil.representanteTipoId}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "representanteTipoId",
                              e.target.value,
                            )
                          }
                        >
                          <option value="Cédula de ciudadanía">
                            Cédula de ciudadanía
                          </option>
                          <option value="Cédula de extranjería">
                            Cédula de extranjería
                          </option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Número de identificación *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.representanteNumeroId}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "representanteNumeroId",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Ciudad de expedición *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.ciudadExpedicion}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "ciudadExpedicion",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Ciudad de residencia *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.perfil.ciudadResidencia}
                          onChange={(e) =>
                            actualizarCampo(
                              "perfil",
                              "ciudadResidencia",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="fe-grid one">
            <div className="fe-card">
              <h4>Certificado digital</h4>
              <p>
                Aquí puedes mostrar la explicación, la carta de exoneración y el
                botón para continuar.
              </p>

              <label className="fe-check">
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
                Acepto la carta de exoneración
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="fe-grid">
            <div className="fe-card">
              <h4>Set de pruebas</h4>
              <p>
                Registra el identificador del set de pruebas entregado por la
                DIAN.
              </p>

              <div className="fe-form-grid">
                <div className="full">
                  <label>Código identificador del set de pruebas</label>
                  <input
                    value={form.setPruebas.testSetId}
                    onChange={(e) =>
                      actualizarCampo("setPruebas", "testSetId", e.target.value)
                    }
                  />
                </div>

                <div className="full">
                  <label>Número de resolución del set de pruebas</label>
                  <input
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
            </div>
          </div>
        );

      case 4:
        return (
          <div className="fe-grid">
            <div className="fe-card">
              <h4>Solicitar numeración DIAN</h4>

              <div className="fe-form-grid">
                <div>
                  <label>Prefijo</label>
                  <input
                    value={form.numeracion.prefijo}
                    onChange={(e) =>
                      actualizarCampo(
                        "numeracion",
                        "prefijo",
                        e.target.value.toUpperCase(),
                      )
                    }
                  />
                </div>

                <div>
                  <label>Tipo de facturación</label>
                  <select
                    value={form.numeracion.tipoFacturacion}
                    onChange={(e) =>
                      actualizarCampo(
                        "numeracion",
                        "tipoFacturacion",
                        e.target.value,
                      )
                    }
                  >
                    <option value="Factura electrónica de venta">
                      Factura electrónica de venta
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="fe-grid">
            <div className="fe-card">
              <h4>Asociar prefijos DIAN</h4>
              <p>Selecciona o registra el prefijo ya asociado en DIAN.</p>

              <div className="fe-form-grid">
                <div className="full">
                  <label>Prefijo asociado</label>
                  <input
                    value={form.prefijos.prefijoAsociado}
                    onChange={(e) =>
                      actualizarCampo(
                        "prefijos",
                        "prefijoAsociado",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="fe-grid">
            <div className="fe-card">
              <h4>Sincronizar</h4>
              <p>
                En esta etapa consultas el estado final y sincronizas la
                información con tu sistema.
              </p>

              <label className="fe-check">
                <input
                  type="checkbox"
                  checked={form.sincronizacion.sincronizado}
                  onChange={(e) =>
                    actualizarCampo(
                      "sincronizacion",
                      "sincronizado",
                      e.target.checked,
                    )
                  }
                />
                Confirmo que la información ya fue sincronizada
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fe-wrapper">
      <div className="fe-header">
        <div>
          <h2>Habilitación de Facturación Electrónica</h2>
          <p>
            Completa las 6 etapas para dejar configurada tu facturación
            electrónica.
          </p>
        </div>

        <button className="fe-close" onClick={() => navigate(-1)}>
          <XLg size={18} />
        </button>
      </div>

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

      <div className="fe-help-box">
        <InfoCircle size={18} />
        <span>Este flujo puede guardarse por etapas y retomarse luego.</span>
      </div>

      <div className="fe-stepper">
        {ETAPAS.map((etapa, index) => (
          <React.Fragment key={etapa.id}>
            <div
              className={`fe-step ${
                etapaActual === etapa.id ? "activo" : ""
              } ${etapaActual > etapa.id ? "completado" : ""}`}
            >
              <div className="fe-step-circle">
                {etapaActual > etapa.id ? <CheckLg size={12} /> : etapa.id}
              </div>
              <span>{etapa.label}</span>
            </div>

            {index < ETAPAS.length - 1 && (
              <div
                className={`fe-step-line ${
                  etapaActual > etapa.id ? "completa" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="fe-body">
        <div className="fe-title-box">
          <h3>
            <ShieldCheck size={18} />{" "}
            {ETAPAS.find((e) => e.id === etapaActual)?.label}
          </h3>
        </div>

        {renderContenido()}
      </div>

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

          {etapaActual < 6 ? (
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
              className="fe-btn fe-btn-success"
              onClick={finalizar}
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
