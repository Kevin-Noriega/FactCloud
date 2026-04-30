import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import "./Habilitaciones.css"; // Comparte CSS con FEV
import { 
  ArrowLeft, 
  ArrowRight, 
  CircleCheck,  // Reemplaza CheckCircleFill
  CheckCircle,  // Alternativa más común
  Clock,        // Reemplaza ClockFill
  Check, 
  X,            // Reemplaza XLg (más estándar)
  CircleCheckBig // Para icono grande si necesitas
} from 'lucide-react';
const PASOS = [
  { id: 1, label: "Datos del software" },
  { id: 2, label: "Set de pruebas" },
  { id: 3, label: "Resolución y numeración" },
  { id: 4, label: "Datos del software" },
  { id: 5, label: "Set de pruebas" },
  { id: 6, label: "Resolución y numeración" },
];

const BadgeEstado = ({ estado }) => {
  if (estado === "completado")
    return (
      <span className="hab-badge hab-badge-ok">
        <CheckCircle size={11} /> Completado
      </span>
    );
  if (estado === "en_proceso")
    return (
      <span className="hab-badge hab-badge-proceso">
        <Clock size={11} /> En proceso
      </span>
    );
  return <span className="hab-badge hab-badge-pendiente">Pendiente</span>;
};

export default function HabilitacionDSE() {
  const navigate = useNavigate();
  const tipo = "dse"; // Fijo para DSE
  const [estado, setEstado] = useState("pendiente");
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

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
      const res = await axiosClient.get(`/Habilitacion/estado?tipo=${tipo}`);
      setEstado(res.data.estado ?? "pendiente");
      if (res.data.software) setSoftware(res.data.software);
      if (res.data.resolucion) setResolucion(res.data.resolucion);
      
      // Reanudar paso
      if (res.data.estado === "pendiente") setPasoActual(1);
      else if (!res.data.software?.testSetId) setPasoActual(2);
      else if (!res.data.resolucion?.numeroAutorizacion) setPasoActual(3);
    } catch {
      // Ignorar si endpoint no existe
    }
  };

  const abrirPaso1 = () => setPasoActual(1);
  const abrirPaso2 = () => setPasoActual(2);
  const abrirPaso3 = () => setPasoActual(3);

  const guardarSoftware = async () => {
    setError("");
    if (!software.nitFabricante || !software.nombreSoftware || !software.codigoSoftware)
      return setError("Todos los campos del software son obligatorios.");
    setCargando(true);
    try {
      await axiosClient.post(`/Habilitacion/software?tipo=${tipo}`, software);
      setPasoActual(2);
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "Error guardando datos del software.");
    } finally {
      setCargando(false);
    }
  };

  const guardarTestSetId = async () => {
    setError("");
    if (!software.testSetId) return setError("El identificador del set de pruebas es obligatorio.");
    setCargando(true);
    try {
      await axiosClient.post(`/Habilitacion/test-set?tipo=${tipo}`, { testSetId: software.testSetId });
      setEstado("en_proceso");
      setPasoActual(3);
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "Error guardando TestSetId.");
    } finally {
      setCargando(false);
    }
  };

  const guardarResolucion = async () => {
    setError("");
    if (resolucion.numeroAutorizacion.length !== 14)
      return setError("El número de autorización debe tener exactamente 14 dígitos.");
    if (!resolucion.rangoDesde || !resolucion.rangoHasta || !resolucion.claveTecnica || !resolucion.fechaInicio || !resolucion.fechaFin)
      return setError("Todos los campos obligatorios.");
    setCargando(true);
    try {
      await axiosClient.post(`/Habilitacion/resolucion?tipo=${tipo}`, resolucion);
      setEstado("completado");
      setExito("¡Habilitación DSE completada! Puedes emitir documentos soporte electrónicos.");
    } catch (e) {
      setError(e.response?.data?.mensaje ?? "Error guardando la resolución.");
    } finally {
      setCargando(false);
    }
  };

  const irAtras = () => {
    setError("");
    setPasoActual((p) => Math.max(1, p - 1));
  };

  if (estado === "completado") {
    return (
      <div className="hab-wrapper">
        <div className="hab-success-final">
          <CheckCircleFill size={48} className="hab-success-icon" />
          <h3>¡Habilitación completada!</h3>
          <p>Ya puedes emitir Documentos Soporte Electrónicos.</p>
          <button className="hab-btn-primary" onClick={() => navigate("/configuracion/habilitaciones")}>
            Ver configuraciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hab-wrapper">
      {/* Header como Siigo */}
      <div className="hab-header-siigo">
        <button className="hab-back-btn" onClick={() => navigate("/configuracion/habilitaciones")}>
          <ArrowLeft size={20} /> Volver
        </button>
        <div className="hab-header-content">
          <h5 className="hab-titulo-siigo">Habilitación Documento Soporte Electrónico</h5>
          <BadgeEstado estado={estado} />
        </div>
      </div>

      {/* Progress bar horizontal como Siigo */}
      <div className="hab-progress-bar">
        <div className={`hab-progress-step ${pasoActual >= 1 ? 'completo' : ''}`}>
          <div className="hab-step-number">1</div>
          <span>Datos software</span>
        </div>
        <div className={`hab-progress-step ${pasoActual >= 2 ? 'completo' : ''}`}>
          <div className="hab-step-number">2</div>
          <span>Set pruebas</span>
        </div>
        <div className={`hab-progress-step ${pasoActual >= 3 ? 'completo' : ''}`}>
          <div className="hab-step-number">3</div>
          <span>Resolución</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="hab-alert hab-alert-err">
          <X size={16} /> {error}
        </div>
      )}

      {/* PASO 1: Datos software (como Siigo) */}
      {pasoActual === 1 && (
        <div className="hab-paso-body">
          <div className="hab-video-section">
            <div className="hab-video-placeholder">
              <span>📹 Video tutorial</span>
            </div>
          </div>
          <h6>Registra los datos de tu software ante la DIAN</h6>
          <p className="hab-paso-desc">
            Si desarrollaste el software tú mismo, usa tu propio NIT como fabricante (Art. 28, Res. 000165/2023).
          </p>
          
          <div className="hab-form-grid">
            <div className="hab-field">
              <label>NIT del fabricante <span className="hab-req">*</span></label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ej. 900123456"
                value={software.nitFabricante}
                onChange={(e) => setSoftware(s => ({ ...s, nitFabricante: e.target.value }))}
              />
              <small>Sin dígito de verificación</small>
            </div>
            <div className="hab-field">
              <label>Nombre del software <span className="hab-req">*</span></label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ej. FactCloud DSE v1.0"
                value={software.nombreSoftware}
                onChange={(e) => setSoftware(s => ({ ...s, nombreSoftware: e.target.value }))}
              />
            </div>
            <div className="hab-field hab-field-full">
              <label>Código del software — GUID DIAN <span className="hab-req">*</span></label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="ab12cd34-ef56-7890-abcd-ef1234567890"
                value={software.codigoSoftware}
                onChange={(e) => setSoftware(s => ({ ...s, codigoSoftware: e.target.value }))}
              />
              <small>UUID del portal DIAN → Facturación → Modo operación</small>
            </div>
          </div>

          <div className="hab-paso-footer">
            <button className="hab-btn-sig" onClick={guardarSoftware} disabled={cargando}>
              {cargando ? "Guardando..." : <>Siguiente <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: Set de pruebas (como imagen) */}
      {pasoActual === 2 && (
        <div className="hab-paso-body">
          <h6>Ingresa el identificador del set de pruebas</h6>
          <p className="hab-paso-desc">
            Generado en portal DIAN. Tu sistema enviará documentos prueba vía <code>SendTestSetAsync</code>.
          </p>
          
          <div className="hab-field hab-field-full">
            <label>Identificador del set de pruebas (TestSetId) <span className="hab-req">*</span></label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="4de36cb4-9973-4ea4-a156-34e909aa24dc"
              value={software.testSetId}
              onChange={(e) => setSoftware(s => ({ ...s, testSetId: e.target.value }))}
            />
            <small>UUID 36 caracteres. Portal DIAN → Set de pruebas</small>
          </div>

          <div className="hab-paso-footer">
            <button className="hab-btn-atras" onClick={irAtras}>
              <ArrowLeft size={16} /> Atrás
            </button>
            <button className="hab-btn-sig" onClick={guardarTestSetId} disabled={cargando}>
              {cargando ? "Guardando..." : <>Siguiente <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: Resolución (igual FEV) */}
      {pasoActual === 3 && (
        <div className="hab-paso-body">
          <h6>Datos de la resolución de numeración</h6>
          <p className="hab-paso-desc">
            Obtenida en portal DIAN → Numeración → Autorización de rangos.
          </p>
          
          {/* Tu form de resolución exacto de FEV */}
          <div className="hab-form-grid">
            {/* ... copia tu Paso 3 de FEV aquí ... */}
          </div>

          <div className="hab-paso-footer">
            <button className="hab-btn-atras" onClick={irAtras}>
              <ArrowLeft size={16} /> Atrás
            </button>
            <button className="hab-btn-sig hab-btn-finalizar" onClick={guardarResolucion} disabled={cargando}>
              {cargando ? "Finalizando..." : <>Finalizar habilitación <Check size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Éxito global */}
      {exito && (
        <div className="hab-alert hab-alert-ok">
          <CheckCircleFill size={16} /> {exito}
          <button className="hab-alert-close" onClick={() => setExito("")}>
            <XLg size={16} />
          </button>
        </div>
      )}
    </div>
  );
}