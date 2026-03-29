import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircleFill,
  CheckLg,
  FileEarmarkText,
  InfoCircle,
  XLg,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import "./Habilitaciones.css";

const PASOS_DSE = [
  { id: 1, label: "Datos del documento soporte" },
  { id: 2, label: "Numeración DIAN" },
  { id: 3, label: "Prefijos y resolución" },
  { id: 4, label: "Sincronización" },
];

export default function HabilitacionDocumentoSoporte() {
  const navigate = useNavigate();

  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [form, setForm] = useState({
    datos: {
      nitProveedor: "",
      nombreSoftware: "",
      codigoSoftware: "",
      ambiente: "2",
    },
    numeracion: {
      numeroAutorizacion: "",
      prefijo: "",
      rangoDesde: "",
      rangoHasta: "",
    },
    resolucion: {
      fechaInicio: "",
      fechaFin: "",
      claveTecnica: "",
    },
    sincronizacion: {
      observacion: "",
    },
  });

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      const res = await axiosClient.get(
        "/Habilitacion/documento-soporte/estado",
      );
      if (res.data?.pasoActual) setPasoActual(res.data.pasoActual);
      if (res.data?.formulario) setForm(res.data.formulario);
    } catch {
      // si aún no existe el endpoint, sigue local
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

  const siguiente = () => {
    setError("");
    if (pasoActual < PASOS_DSE.length) {
      setPasoActual((prev) => prev + 1);
    }
  };

  const atras = () => {
    setError("");
    if (pasoActual > 1) {
      setPasoActual((prev) => prev - 1);
    }
  };

  const guardarPaso = async () => {
    setError("");
    setExito("");

    if (pasoActual === 1) {
      if (
        !form.datos.nitProveedor ||
        !form.datos.nombreSoftware ||
        !form.datos.codigoSoftware
      ) {
        return setError("Completa todos los campos del paso 1.");
      }
    }

    if (pasoActual === 2) {
      if (!form.numeracion.numeroAutorizacion || !form.numeracion.prefijo) {
        return setError("Completa los datos de numeración.");
      }
    }

    if (pasoActual === 3) {
      if (
        !form.numeracion.rangoDesde ||
        !form.numeracion.rangoHasta ||
        !form.resolucion.fechaInicio ||
        !form.resolucion.fechaFin
      ) {
        return setError("Completa la resolución y el rango.");
      }
    }

    setCargando(true);

    try {
      await axiosClient.post("/Habilitacion/documento-soporte/guardar-paso", {
        pasoActual,
        form,
      });

      if (pasoActual < PASOS_DSE.length) {
        setPasoActual((prev) => prev + 1);
      } else {
        setExito("Habilitación de documento soporte guardada correctamente.");
      }
    } catch (e) {
      setError(
        e.response?.data?.mensaje ||
          "No fue posible guardar la habilitación del documento soporte.",
      );
    } finally {
      setCargando(false);
    }
  };

  const finalizar = async () => {
    setError("");
    setExito("");
    setCargando(true);

    try {
      await axiosClient.post("/Habilitacion/documento-soporte/finalizar", form);
      setExito("Proceso finalizado correctamente.");
    } catch (e) {
      setError(
        e.response?.data?.mensaje || "No fue posible finalizar el proceso.",
      );
    } finally {
      setCargando(false);
    }
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="hab-page-card">
            <h4 className="hab-section-title">Datos del documento soporte</h4>
            <p className="hab-paso-desc">
              Registra la información base del software o proveedor con el que
              vas a operar el documento soporte electrónico.
            </p>

            <div className="hab-form-grid">
              <div className="hab-field">
                <label className="hab-label">
                  NIT del proveedor / fabricante
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={form.datos.nitProveedor}
                  onChange={(e) =>
                    actualizarCampo("datos", "nitProveedor", e.target.value)
                  }
                />
              </div>

              <div className="hab-field">
                <label className="hab-label">Nombre del software</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={form.datos.nombreSoftware}
                  onChange={(e) =>
                    actualizarCampo("datos", "nombreSoftware", e.target.value)
                  }
                />
              </div>

              <div className="hab-field hab-field-full">
                <label className="hab-label">Código del software</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={form.datos.codigoSoftware}
                  onChange={(e) =>
                    actualizarCampo("datos", "codigoSoftware", e.target.value)
                  }
                />
              </div>

              <div className="hab-field hab-field-full">
                <label className="hab-label">Tipo de ambiente</label>
                <select
                  className="form-select form-select-sm"
                  value={form.datos.ambiente}
                  onChange={(e) =>
                    actualizarCampo("datos", "ambiente", e.target.value)
                  }
                >
                  <option value="2">2 — Habilitación / Pruebas</option>
                  <option value="1">1 — Producción</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="hab-page-card">
            <h4 className="hab-section-title">Numeración DIAN</h4>
            <p className="hab-paso-desc">
              Registra la numeración asignada para el documento soporte.
            </p>

            <div className="hab-form-grid">
              <div className="hab-field hab-field-full">
                <label className="hab-label">Número de autorización</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={form.numeracion.numeroAutorizacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "numeracion",
                      "numeroAutorizacion",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                />
              </div>

              <div className="hab-field">
                <label className="hab-label">Prefijo</label>
                <input
                  type="text"
                  maxLength={4}
                  className="form-control form-control-sm text-uppercase"
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="hab-page-card">
            <h4 className="hab-section-title">Prefijos y resolución</h4>
            <p className="hab-paso-desc">
              Define el rango autorizado y la vigencia de la resolución.
            </p>

            <div className="hab-form-grid">
              <div className="hab-field">
                <label className="hab-label">Rango desde</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={form.numeracion.rangoDesde}
                  onChange={(e) =>
                    actualizarCampo("numeracion", "rangoDesde", e.target.value)
                  }
                />
              </div>

              <div className="hab-field">
                <label className="hab-label">Rango hasta</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={form.numeracion.rangoHasta}
                  onChange={(e) =>
                    actualizarCampo("numeracion", "rangoHasta", e.target.value)
                  }
                />
              </div>

              <div className="hab-field">
                <label className="hab-label">Vigencia desde</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={form.resolucion.fechaInicio}
                  onChange={(e) =>
                    actualizarCampo("resolucion", "fechaInicio", e.target.value)
                  }
                />
              </div>

              <div className="hab-field">
                <label className="hab-label">Vigencia hasta</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={form.resolucion.fechaFin}
                  onChange={(e) =>
                    actualizarCampo("resolucion", "fechaFin", e.target.value)
                  }
                />
              </div>

              <div className="hab-field hab-field-full">
                <label className="hab-label">Clave técnica</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={form.resolucion.claveTecnica}
                  onChange={(e) =>
                    actualizarCampo(
                      "resolucion",
                      "claveTecnica",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="hab-page-card">
            <h4 className="hab-section-title">Sincronización</h4>
            <p className="hab-paso-desc">
              Guarda observaciones finales y sincroniza el estado con tu
              sistema.
            </p>

            <div className="hab-form-grid">
              <div className="hab-field hab-field-full">
                <label className="hab-label">Observación</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="4"
                  value={form.sincronizacion.observacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "sincronizacion",
                      "observacion",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="hab-wrapper">
      <div className="header-card hab-header-card mb-3">
        <div className="hab-header-left">
          <h2 className="header-title mb-1">
            Habilitación de documento soporte electrónico
          </h2>
          <p className="hab-subtitulo mb-0">
            Completa el proceso en esta vista independiente.
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

      {error && (
        <div className="hab-alert hab-alert-err">
          <XLg size={13} /> {error}
        </div>
      )}

      <div className="hab-info-box">
        <InfoCircle size={20} className="hab-info-icon" />
        <div>
          <strong>Proceso en vista separada:</strong>
          <div>Ahora ya no dependes de modal y puedes guardar por pasos.</div>
        </div>
      </div>

      <div className="hab-page">
        <div className="hab-stepper">
          {PASOS_DSE.map((p, i) => (
            <React.Fragment key={p.id}>
              <div
                className={`hab-step ${pasoActual === p.id ? "activo" : ""} ${
                  pasoActual > p.id ? "hecho" : ""
                }`}
              >
                <div className="hab-step-circulo">
                  {pasoActual > p.id ? <CheckLg size={11} /> : p.id}
                </div>
                <span className="hab-step-label">{p.label}</span>
              </div>

              {i < PASOS_DSE.length - 1 && (
                <div
                  className={`hab-step-linea ${
                    pasoActual > p.id ? "completa" : ""
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {renderPaso()}

        <div className="hab-paso-footer">
          <button className="hab-btn-atras" onClick={() => navigate(-1)}>
            <ArrowLeft size={13} /> Volver
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            {pasoActual > 1 && (
              <button className="hab-btn-atras" onClick={atras}>
                <ArrowLeft size={13} /> Anterior
              </button>
            )}

            {pasoActual < PASOS_DSE.length ? (
              <button
                className="hab-btn-sig"
                onClick={guardarPaso}
                disabled={cargando}
              >
                {cargando ? (
                  "Guardando..."
                ) : (
                  <>
                    Guardar y seguir <ArrowRight size={13} />
                  </>
                )}
              </button>
            ) : (
              <button
                className="hab-btn-sig hab-btn-finalizar"
                onClick={finalizar}
                disabled={cargando}
              >
                {cargando ? (
                  "Finalizando..."
                ) : (
                  <>
                    <CheckLg size={13} /> Finalizar habilitación
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
