import { useState } from "react";
import { ChevronDown, ChevronUp, Shop, XCircle } from "react-bootstrap-icons";
import { useTienda } from "../hooks/useTienda";
import FormularioTienda from "../components/tienda/FormTienda";
import PlanCard         from "../components/PlanCard";
import TarjetaAddon     from "../components/tienda/TarjetaAddon";
import "../styles/Tienda.css";

function Tienda() {
  const {
    planActual,
    planesDisponibles,
    addonsDisponibles,
    misAddons,
    estadisticas,
    isLoading,
    error,
    cambiarPlan,
    cambiarPlanLoading,
    agregarAddons,
    agregarAddonsLoading,
    cancelarAddon,
    cancelarAddonLoading,
    cargarDatos,
  } = useTienda();

  const [mostrarPlanes,       setMostrarPlanes]       = useState(true);
  const [mostrarAddons,       setMostrarAddons]        = useState(false);
  const [planSeleccionado,    setPlanSeleccionado]     = useState(null);
  const [addonsSeleccionados, setAddonsSeleccionados]  = useState([]);
  const [mensajeExito,        setMensajeExito]         = useState("");
  const [mensajeError,        setMensajeError]         = useState("");
  const [periodoAnual,        setPeriodoAnual]         = useState(true);
  const [cancelandoId,        setCancelandoId]         = useState(null);

  /* ── Helpers ─────────────────────────────────────────────────── */
  const exito = (msg) => {
    setMensajeExito(msg);
    setMensajeError("");
    setTimeout(() => setMensajeExito(""), 4000);
  };

  const fallo = (msg) => {
    setMensajeError(msg);
    setMensajeExito("");
    setTimeout(() => setMensajeError(""), 5000);
  };

  const togglePlanes = () => {
    if (mostrarPlanes) setPlanSeleccionado(null);
    setMostrarPlanes((v) => !v);
    setMostrarAddons(false);
  };

  const toggleAddons = () => {
    if (mostrarAddons) setAddonsSeleccionados([]);
    setMostrarAddons((v) => !v);
    setMostrarPlanes(false);
  };

  const handleSeleccionarPlan = (plan) => {
    if (planActual?.id === plan.id) return;
    setPlanSeleccionado(plan);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCambiarPlan = async (e) => {
    e.preventDefault();
    if (!planSeleccionado) return;
    try {
      await cambiarPlan({ planId: planSeleccionado.id, periodoAnual });
      exito("Plan actualizado exitosamente");
      setMostrarPlanes(false);
      setPlanSeleccionado(null);
    } catch (err) {
      fallo("Error al cambiar el plan: " + (err.message || "Error desconocido"));
    }
  };

  const handleToggleAddon = (addonId) => {
    setAddonsSeleccionados((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAgregarAddons = async (e) => {
    e.preventDefault();
    if (!addonsSeleccionados.length) return;
    try {
      const res = await agregarAddons(addonsSeleccionados);
      exito(res?.mensaje || "Complementos agregados exitosamente");
      setMostrarAddons(false);
      setAddonsSeleccionados([]);
    } catch (err) {
      fallo(err.message || "Error al agregar complementos");
    }
  };

  const handleCancelarAddon = async (addonId, nombre) => {
    if (!window.confirm(`¿Cancelar el complemento "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setCancelandoId(addonId);
    try {
      await cancelarAddon(addonId);
      exito(`Complemento "${nombre}" cancelado.`);
    } catch (err) {
      fallo(err.message || "Error al cancelar el complemento.");
    } finally {
      setCancelandoId(null);
    }
  };

  const calcularPrecio = (plan) => periodoAnual ? plan.precioAnual : plan.precioMensual;

  const pctUso = (() => {
    if (!estadisticas || estadisticas.documentosLimite === -1) return 0;
    return Math.min(
      Math.round((estadisticas.documentosUsados / estadisticas.documentosLimite) * 100),
      100
    );
  })();

  const totalAddons = addonsSeleccionados.reduce((sum, id) => {
    const a = addonsDisponibles.find((x) => x.id === id);
    return sum + (a?.precio ?? 0);
  }, 0);

  // Addons disponibles para contratar (sin los ya contratados en la selección)
  const addonsParaContratar = addonsDisponibles.filter((a) => !a.contratado);
  const addonsContratados   = addonsDisponibles.filter((a) => a.contratado);

  /* ── Carga / error ───────────────────────────────────────────── */
  if (isLoading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando tienda...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h5>Error al cargar la tienda</h5>
        <p className="mb-2">{error.message || "Error desconocido"}</p>
        <button className="btn btn-primary btn-sm" onClick={cargarDatos}>Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 tienda-container">

      {/* ── Header ── */}
      <div className="header-card mb-4">
        <div className="header-content">
          <div>
            <h2 className="header-title">Tienda Nubee</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>
              Gestiona tu plan y complementos
            </p>
          </div>
          <div className="header-icon"><Shop size={64} /></div>
        </div>
      </div>

      {/* ── Alertas ── */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-3">
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito("")} />
        </div>
      )}
      {mensajeError && (
        <div className="alert alert-danger alert-dismissible fade show mb-3">
          {mensajeError}
          <button type="button" className="btn-close" onClick={() => setMensajeError("")} />
        </div>
      )}

      {/* ── Plan actual ── */}
      {planActual && (
        <div className="plan-actual-card mb-4">
          <div className="plan-actual-header">
            <h5>Tu Plan Actual</h5>
            <span className="badge bg-success">Activo</span>
          </div>
          <div className="plan-actual-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Plan</span>
                  <span className="plan-info-value">{planActual.nombre}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Precio</span>
                  <span className="plan-info-value">
                    ${planActual.precioAnual?.toLocaleString("es-CO")}/año
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Documentos/año</span>
                  <span className="plan-info-value">
                    {planActual.limiteDocumentosAnuales === -1
                      ? "Ilimitados"
                      : planActual.limiteDocumentosAnuales?.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>

            {estadisticas && (
              <div className="estadisticas-uso mt-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="stat-item mb-1">
                      <span className="stat-label">Documentos usados</span>
                      <span className="stat-value">
                        {estadisticas.documentosUsados} /{" "}
                        {estadisticas.documentosLimite === -1
                          ? "∞"
                          : estadisticas.documentosLimite?.toLocaleString("es-CO")}
                      </span>
                    </div>
                    {estadisticas.documentosLimite !== -1 && (
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className={`progress-bar ${
                            pctUso >= 80 ? "bg-danger" :
                            pctUso >= 60 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${pctUso}%` }}
                          role="progressbar"
                          aria-valuenow={pctUso}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    )}
                    {estadisticas.desglose && (
                      <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                        {[
                          { label: "Facturas",     val: estadisticas.desglose.facturas },
                          { label: "N. Crédito",   val: estadisticas.desglose.notasCredito },
                          { label: "N. Débito",    val: estadisticas.desglose.notasDebito },
                          { label: "Doc. Soporte", val: estadisticas.desglose.documentosSoporte },
                        ].map((d) => (
                          <span key={d.label} style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                            {d.label}: <strong style={{ color: "#374151" }}>{d.val}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-label">Días restantes</span>
                      <span className="stat-value">{estadisticas.diasRestantes} días</span>
                    </div>
                    {estadisticas.fechaFin && (
                      <small className="text-muted d-block mt-1">
                        Vence: {new Date(estadisticas.fechaFin).toLocaleDateString("es-CO")}
                      </small>
                    )}
                  </div>
                </div>
                {pctUso >= 80 && (
                  <div className="alert alert-warning mt-3 mb-0 py-2">
                    <small>
                      <strong>Advertencia:</strong> Has usado más del 80% de tus documentos.
                      Considera actualizar tu plan o agregar documentos extra.
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Complementos activos del usuario */}
            {misAddons.length > 0 && (
              <div style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #f1f3f4"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Complementos activos
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {misAddons.map((a) => (
                    <div key={a.id} style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          6,
                      background:   "#f0f4ff",
                      border:       "1px solid #b5d4f4",
                      borderRadius: 8,
                      padding:      "5px 10px",
                      fontSize:     "0.78rem",
                      color:        "#1a73e8",
                      fontWeight:   500,
                    }}>
                      {a.nombre}
                      <button
                        type="button"
                        onClick={() => handleCancelarAddon(a.addonId, a.nombre)}
                        disabled={cancelandoId === a.addonId || cancelarAddonLoading}
                        style={{
                          background: "none",
                          border:     "none",
                          padding:    0,
                          cursor:     "pointer",
                          color:      "#9ca3af",
                          lineHeight: 1,
                          display:    "flex",
                        }}
                        title="Cancelar complemento"
                      >
                        <XCircle size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 text-end">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cargarDatos}>
                ↻ Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ── Botones acción ── */}
      <div className="acciones-header mb-4">
        <button className={`btn-tienda ${mostrarPlanes ? "active" : ""}`} onClick={togglePlanes} type="button">
          {mostrarPlanes
            ? <><ChevronUp size={16} className="me-1" />Ocultar planes</>
            : <><ChevronDown size={16} className="me-1" />Ver todos los planes</>}
        </button>
        <button className={`btn-tienda-addon ${mostrarAddons ? "active" : ""}`} onClick={toggleAddons} type="button">
          {mostrarAddons
            ? <><ChevronUp size={16} className="me-1" />Ocultar complementos</>
            : <><ChevronDown size={16} className="me-1" />Ver complementos{misAddons.length > 0 && <span className="badge bg-primary ms-1" style={{ fontSize: "0.65rem" }}>{misAddons.length}</span>}</>}
        </button>
      </div>

      {/* ── Confirmación plan ── */}
      {mostrarPlanes && planSeleccionado && (
        <div className="formulario-tienda-collapse mb-4">
          <FormularioTienda
            planSeleccionado={planSeleccionado}
            periodoAnual={periodoAnual}
            setPeriodoAnual={setPeriodoAnual}
            onSubmit={handleCambiarPlan}
            onCancel={() => setPlanSeleccionado(null)}
            isLoading={cambiarPlanLoading}
          />
        </div>
      )}

      {/* ── Grid planes ── */}
      {mostrarPlanes && (
       <div className="">
           {/* ── Toggle período ── */}
      <div className="periodo-toggle-container mb-4">
        <div className="periodo-toggle">
          <button className={`periodo-btn ${!periodoAnual ? "active" : ""}`} onClick={() => setPeriodoAnual(false)}>
            Mensual
          </button>
          <button className={`periodo-btn ${periodoAnual ? "active" : ""}`} onClick={() => setPeriodoAnual(true)}>
            Anual
            <span className="badge bg-success ms-1" style={{ fontSize: "0.65rem" }}>Ahorra 20%</span>
          </button>
        </div>
      </div>
      <div className="planes-grid mb-4">
          
          {planesDisponibles.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onCheckout={handleSeleccionarPlan}
              esActual={planActual?.id === plan.id}
              periodoAnual={periodoAnual}
              calcularPrecio={calcularPrecio}
            />
          ))}
        </div>
        </div>
      )}

      {/* ── Addons ── */}
      {mostrarAddons && (
        <div className="formulario-tienda-collapse mb-4">
          <form onSubmit={handleAgregarAddons}>

            {/* Complementos disponibles para contratar */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "0.92rem", color: "#1a1a2e" }}>
                  Complementos disponibles
                </p>
                {addonsSeleccionados.length > 0 && (
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    {addonsSeleccionados.length} seleccionado{addonsSeleccionados.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {addonsParaContratar.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "0.83rem" }}>
                  Ya tienes todos los complementos disponibles contratados.
                </p>
              ) : (
                <div className="addons-grid">
                  {addonsParaContratar.map((addon) => (
                    <TarjetaAddon
                      key={addon.id}
                      addon={addon}
                      seleccionado={addonsSeleccionados.includes(addon.id)}
                      onToggle={handleToggleAddon}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Complementos ya contratados */}
            {addonsContratados.length > 0 && (
              <div style={{
                borderTop: "1px solid #f1f3f4",
                paddingTop: "1rem",
                marginBottom: "1rem"
              }}>
                <p style={{ margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.82rem", color: "#6b7280" }}>
                  Ya contratados
                </p>
                <div className="addons-grid">
                  {addonsContratados.map((addon) => (
                    <TarjetaAddon
                      key={addon.id}
                      addon={addon}
                      seleccionado={false}
                      onToggle={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Resumen selección */}
            {addonsSeleccionados.length > 0 && (
              <div className="resumen-addons mb-3">
                <h6>Resumen de selección</h6>
                <ul>
                  {addonsSeleccionados.map((id) => {
                    const addon = addonsDisponibles.find((a) => a.id === id);
                    return (
                      <li key={id}>
                        {addon?.nombre} — ${addon?.precio.toLocaleString("es-CO")}
                        {addon?.unidad ? ` / ${addon.unidad}` : ""}
                      </li>
                    );
                  })}
                </ul>
                <div className="total-addons">
                  <strong>Total adicional</strong>
                  <span>${totalAddons.toLocaleString("es-CO")}</span>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={toggleAddons}>
                Cerrar
              </button>
              {addonsParaContratar.length > 0 && (
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!addonsSeleccionados.length || agregarAddonsLoading}
                >
                  {agregarAddonsLoading
                    ? "Agregando..."
                    : `Agregar${addonsSeleccionados.length > 0 ? ` (${addonsSeleccionados.length})` : ""} complemento${addonsSeleccionados.length !== 1 ? "s" : ""}`}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ── Info ── */}
      <div className="info-tienda-card mt-4">
        <h5>¿Necesitas ayuda?</h5>
        <p>
          Contáctanos en{" "}
          <a href="mailto:soporte@Nubee.com">soporte@Nubee.com</a>{" "}
          para planes personalizados o dudas sobre tu suscripción.
        </p>
       
      </div>

    </div>
  );
}

export default Tienda;