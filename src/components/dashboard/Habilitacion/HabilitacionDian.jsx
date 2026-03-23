import React, { useState, useEffect } from "react";
import {
  InfoCircle,
  CheckCircleFill,
  ClockFill,
  FileEarmarkText,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckLg,
  XLg,
  ShieldCheck,
} from "react-bootstrap-icons";
import axiosClient from "../../../api/axiosClient";
import "./Habilitaciones.css";
import { useNavigate } from "react-router-dom";

const PASOS = [
  { id: 1, label: "Datos del software" },
  { id: 2, label: "Set de pruebas" },
  { id: 3, label: "Resolución y numeración" },
];

const BadgeEstado = ({ estado }) => {
  if (estado === "completado")
    return (
      <span className="hab-badge hab-badge-ok">
        <CheckCircleFill size={11} /> Completado
      </span>
    );
  if (estado === "en_proceso")
    return (
      <span className="hab-badge hab-badge-proceso">
        <ClockFill size={11} /> En proceso
      </span>
    );
  return <span className="hab-badge hab-badge-pendiente">Pendiente</span>;
};

export default function HabilitacionDian() {
  const [estadoFEV, setEstadoFEV] = useState("pendiente");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const Navigate = useNavigate();

  const [software, setSoftware] = useState({
    nitFabricante: "",
    nombreSoftware: "",
    codigoSoftware: "",
    testSetId: "",
  });

  const [resolucion, setResolucion] = useState({
    numeroAutorizacion: "",
    prefijo: "",
    rangoDesde: "",
    rangoHasta: "",
    fechaInicio: "",
    fechaFin: "",
    claveTecnica: "",
    tipoAmbiente: "2",
  });

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      const res = await axiosClient.get("/Habilitacion/estado");
      setEstadoFEV(res.data.estadoFEV ?? "pendiente");
      if (res.data.software) setSoftware(res.data.software);
      if (res.data.resolucion) setResolucion(res.data.resolucion);
      // Reanudar en el paso correcto
      if (res.data.estadoFEV === "pendiente") setPasoActual(1);
      else if (!res.data.software?.testSetId) setPasoActual(2);
      else if (!res.data.resolucion?.numeroAutorizacion) setPasoActual(3);
    } catch {
      /* endpoint aún no existe: ignorar */
    }
  };

  const abrirModal = () => {
    setError("");
    setModalAbierto(true);
  };

  // ── PASO 1: guardar software ──────────────────────────────────────
  const guardarSoftware = async () => {
    setError("");
    if (
      !software.nitFabricante ||
      !software.nombreSoftware ||
      !software.codigoSoftware
    )
      return setError("Todos los campos del software son obligatorios.");
    setCargando(true);
    try {
      await axiosClient.post("/Habilitacion/software", software);
      setPasoActual(2);
    } catch (e) {
      setError(
        e.response?.data?.mensaje ?? "Error guardando datos del software.",
      );
    } finally {
      setCargando(false);
    }
  };

  // ── PASO 2: guardar TestSetId ─────────────────────────────────────
  const guardarTestSetId = async () => {
    setError("");
    if (!software.testSetId)
      return setError("El identificador del set de pruebas es obligatorio.");
    setCargando(true);
    try {
      await axiosClient.post("/Habilitacion/test-set", {
        testSetId: software.testSetId,
      });
      setEstadoFEV("en_proceso");
      setPasoActual(3);
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "Error guardando TestSetId.");
    } finally {
      setCargando(false);
    }
  };

  // ── PASO 3: guardar resolución ────────────────────────────────────
  const guardarResolucion = async () => {
    setError("");
    if (resolucion.numeroAutorizacion.length !== 14)
      return setError(
        "El número de autorización debe tener exactamente 14 dígitos.",
      );
    if (!resolucion.rangoDesde || !resolucion.rangoHasta)
      return setError("El rango de numeración es obligatorio.");
    if (!resolucion.claveTecnica)
      return setError("La clave técnica asignada por la DIAN es obligatoria.");
    if (!resolucion.fechaInicio || !resolucion.fechaFin)
      return setError("Las fechas de vigencia son obligatorias.");
    setCargando(true);
    try {
      await axiosClient.post("/Habilitacion/resolucion", resolucion);
      setEstadoFEV("completado");
      setModalAbierto(false);
      setExito(
        "¡Habilitación completada! Ya puedes emitir facturas electrónicas de venta.",
      );
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "Error guardando la resolución.");
    } finally {
      setCargando(false);
    }
  };

  const irAtras = () => {
    setError("");
    setPasoActual((p) => p - 1);
  };

  return (
    <div className="hab-wrapper">
      <h5 className="hab-titulo">Configuración de documentos electrónicos</h5>
      <p className="hab-subtitulo">
        Para iniciar a facturar electrónicamente debes realizar el proceso de
        habilitación de tus documentos. Selecciona el que se ajuste a tus
        necesidades.
      </p>

      {/* Alerta éxito global */}
      {exito && (
        <div className="hab-alert hab-alert-ok">
          <CheckCircleFill size={15} /> {exito}
          <button className="hab-alert-close" onClick={() => setExito("")}>
            <XLg size={12} />
          </button>
        </div>
      )}

      {/* Banner informativo */}
      <div className="hab-info-box">
        <InfoCircle size={20} className="hab-info-icon" />
        <div>
          <strong>
            Recuerda que debes tener a la mano los siguientes datos:
          </strong>
          <ol className="hab-info-list">
            <li>
              Datos del RUT (Registro único tributario) y del representante
              legal.
            </li>
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
            <li>Identificador del set de pruebas ante la DIAN.</li>
          </ol>
        </div>
      </div>

      {/* Cards */}
      <div className="hab-cards">
        {/* Tarjeta FEV */}
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
                ¿Necesitas Ayuda?
              </a>
              {estadoFEV === "completado" ? (
                <button
                  className="hab-btn-crear"
                  onClick={() => (window.location.href = "/ventas/nueva")}
                >
                  Crear Factura E.
                </button>
              ) : (
                <button className="hab-btn-continuar" onClick= {() => Navigate("/habilitacionDSE")}>
                  {estadoFEV === "en_proceso" ? "Continuar" : "Configurar"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta DSE (próximamente) */}
        <div className="hab-card hab-card-muted">
          <div className="hab-card-icon-wrap hab-card-icon-wrap-muted">
            <Building size={34} className="hab-card-icon-muted" />
          </div>
          <div className="hab-card-body">
            <div className="hab-card-header-row">
              <h6 className="hab-card-titulo">Documento soporte electrónico</h6>
              <BadgeEstado estado="pendiente" />
            </div>
            <p className="hab-card-desc">
              Registra transacciones electrónicas para sujetos no obligados a
              facturar.
            </p>
            <div className="hab-card-actions">
              <a
                className="hab-link-ayuda"
                href="https://www.dian.gov.co"
                target="_blank"
                rel="noreferrer"
              >
                ¿Necesitas Ayuda?
              </a>
              <button className="hab-btn-continuar" disabled>
                Próximamente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ MODAL ═══════════════ */}
      {modalAbierto && (
        <div className="hab-overlay" onClick={() => setModalAbierto(false)}>
          <div className="hab-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header modal */}
            <div className="hab-modal-header">
              <h6 className="hab-modal-titulo">
                <ShieldCheck size={17} /> Habilitación — Facturación Electrónica
                de Venta
              </h6>
              <button
                className="hab-modal-close"
                onClick={() => setModalAbierto(false)}
              >
                <XLg size={15} />
              </button>
            </div>

            {/* Stepper */}
            <div className="hab-stepper">
              {PASOS.map((p, i) => (
                <React.Fragment key={p.id}>
                  <div
                    className={`hab-step ${pasoActual === p.id ? "activo" : ""} ${pasoActual > p.id ? "hecho" : ""}`}
                  >
                    <div className="hab-step-circulo">
                      {pasoActual > p.id ? <CheckLg size={11} /> : p.id}
                    </div>
                    <span className="hab-step-label">{p.label}</span>
                  </div>
                  {i < PASOS.length - 1 && (
                    <div
                      className={`hab-step-linea ${pasoActual > p.id ? "completa" : ""}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Error inline */}
            {error && (
              <div
                className="hab-alert hab-alert-err"
                style={{ margin: "12px 22px 0" }}
              >
                <XLg size={13} /> {error}
              </div>
            )}

            {/* ── PASO 1: Datos del software ── */}
            {pasoActual === 1 && (
              <div className="hab-paso-body">
                <p className="hab-paso-desc">
                  Registra los datos de tu software ante la DIAN (Art. 28, Res.
                  000165/2023). Si desarrollaste el software tú mismo, usa tu
                  propio NIT como fabricante.
                </p>
                <div className="hab-form-grid">
                  <div className="hab-field">
                    <label className="hab-label">
                      NIT del fabricante <span className="hab-req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Ej. 900123456"
                      value={software.nitFabricante}
                      onChange={(e) =>
                        setSoftware((s) => ({
                          ...s,
                          nitFabricante: e.target.value,
                        }))
                      }
                    />
                    <small className="hab-hint">
                      Sin dígito de verificación.
                    </small>
                  </div>
                  <div className="hab-field">
                    <label className="hab-label">
                      Nombre del software <span className="hab-req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Ej. FactCloud v1.0"
                      value={software.nombreSoftware}
                      onChange={(e) =>
                        setSoftware((s) => ({
                          ...s,
                          nombreSoftware: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field hab-field-full">
                    <label className="hab-label">
                      Código del software — GUID DIAN{" "}
                      <span className="hab-req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Ej. ab12cd34-ef56-7890-abcd-ef1234567890"
                      value={software.codigoSoftware}
                      onChange={(e) =>
                        setSoftware((s) => ({
                          ...s,
                          codigoSoftware: e.target.value,
                        }))
                      }
                    />
                    <small className="hab-hint">
                      UUID generado al registrar tu software en el portal DIAN →
                      Facturación electrónica → Modo de operación.
                    </small>
                  </div>
                  <div className="hab-field hab-field-full">
                    <label className="hab-label">Tipo de ambiente</label>
                    <select
                      className="form-select form-select-sm"
                      value={resolucion.tipoAmbiente}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          tipoAmbiente: e.target.value,
                        }))
                      }
                    >
                      <option value="2">
                        2 — Habilitación / Pruebas ⚠️ (recomendado para iniciar)
                      </option>
                      <option value="1">
                        1 — Producción (solo cuando tengas habilitación
                        aprobada)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="hab-paso-footer">
                  <span />
                  <button
                    className="hab-btn-sig"
                    onClick={guardarSoftware}
                    disabled={cargando}
                  >
                    {cargando ? (
                      "Guardando..."
                    ) : (
                      <>
                        {" "}
                        Siguiente <ArrowRight size={13} />{" "}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── PASO 2: TestSetId ── */}
            {pasoActual === 2 && (
              <div className="hab-paso-body">
                <p className="hab-paso-desc">
                  Ingresa el identificador del set de pruebas generado en el
                  portal DIAN. Con él tu sistema enviará los documentos de
                  prueba vía <code>SendTestSetAsync</code>.
                </p>
                <div className="hab-field">
                  <label className="hab-label">
                    Identificador del set de pruebas (TestSetId){" "}
                    <span className="hab-req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. 4de36cb4-9973-4ea4-a156-34e909aa24dc"
                    value={software.testSetId}
                    onChange={(e) =>
                      setSoftware((s) => ({ ...s, testSetId: e.target.value }))
                    }
                  />
                  <small className="hab-hint">
                    UUID de 36 caracteres. Portal DIAN → Facturación electrónica
                    → Modo de operación → Set de pruebas.
                  </small>
                </div>
                <div className="hab-info-box" style={{ marginTop: 16 }}>
                  <InfoCircle size={16} className="hab-info-icon" />
                  <span style={{ fontSize: "0.81rem" }}>
                    Una vez ingresado, tu backend debe enviar facturas de prueba
                    al endpoint
                    <code> SendTestSetAsync</code> de la DIAN y esperar que el
                    estado pase de <strong>registrado</strong> a{" "}
                    <strong>habilitado</strong>.
                  </span>
                </div>
                <div className="hab-paso-footer">
                  <button className="hab-btn-atras" onClick={irAtras}>
                    <ArrowLeft size={13} /> Atrás
                  </button>
                  <button
                    className="hab-btn-sig"
                    onClick={guardarTestSetId}
                    disabled={cargando}
                  >
                    {cargando ? (
                      "Guardando..."
                    ) : (
                      <>
                        {" "}
                        Siguiente <ArrowRight size={13} />{" "}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── PASO 3: Resolución ── */}
            {pasoActual === 3 && (
              <div className="hab-paso-body">
                <p className="hab-paso-desc">
                  Ingresa la resolución de numeración otorgada por la DIAN. Se
                  obtiene en el portal DIAN →{" "}
                  <strong>
                    Numeración de facturación → Autorización de rangos
                  </strong>
                  .
                </p>
                <div className="hab-form-grid">
                  <div className="hab-field hab-field-full">
                    <label className="hab-label">
                      Número de autorización DIAN — 14 dígitos{" "}
                      <span className="hab-req">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      className={`form-control form-control-sm ${resolucion.numeroAutorizacion && resolucion.numeroAutorizacion.length !== 14 ? "is-invalid" : ""}`}
                      placeholder="Ej. 18760000001000"
                      value={resolucion.numeroAutorizacion}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          numeroAutorizacion: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                    {resolucion.numeroAutorizacion &&
                      resolucion.numeroAutorizacion.length !== 14 && (
                        <div className="invalid-feedback d-block">
                          {resolucion.numeroAutorizacion.length}/14 dígitos
                        </div>
                      )}
                  </div>
                  <div className="hab-field">
                    <label className="hab-label">
                      Prefijo{" "}
                      <span className="hab-hint-inline">(máx 4 chars)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      className="form-control form-control-sm text-uppercase"
                      placeholder="Ej. SETP"
                      value={resolucion.prefijo}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          prefijo: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field" /> {/* spacer */}
                  <div className="hab-field">
                    <label className="hab-label">
                      Rango desde <span className="hab-req">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Ej. 990000000"
                      value={resolucion.rangoDesde}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          rangoDesde: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field">
                    <label className="hab-label">
                      Rango hasta <span className="hab-req">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Ej. 995000000"
                      value={resolucion.rangoHasta}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          rangoHasta: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field">
                    <label className="hab-label">
                      Vigencia desde <span className="hab-req">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={resolucion.fechaInicio}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          fechaInicio: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field">
                    <label className="hab-label">
                      Vigencia hasta <span className="hab-req">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={resolucion.fechaFin}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          fechaFin: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="hab-field hab-field-full">
                    <label className="hab-label">
                      Clave técnica (DIAN) <span className="hab-req">*</span>
                      <span className="hab-badge-warn">
                        ⚠️ Nunca va en el XML
                      </span>
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      placeholder="Clave técnica asignada por la DIAN"
                      value={resolucion.claveTecnica}
                      onChange={(e) =>
                        setResolucion((r) => ({
                          ...r,
                          claveTecnica: e.target.value,
                        }))
                      }
                    />
                    <small className="hab-hint">
                      Usada internamente para calcular el CUFE (SHA-384).
                      Almacenar cifrada en producción.
                    </small>
                  </div>
                </div>
                <div className="hab-paso-footer">
                  <button className="hab-btn-atras" onClick={irAtras}>
                    <ArrowLeft size={13} /> Atrás
                  </button>
                  <button
                    className="hab-btn-sig hab-btn-finalizar"
                    onClick={guardarResolucion}
                    disabled={cargando}
                  >
                    {cargando ? (
                      "Guardando..."
                    ) : (
                      <>
                        <CheckLg size={13} /> Finalizar habilitación
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
