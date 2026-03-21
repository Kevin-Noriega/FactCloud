import React, { useState } from "react";
import { ChevronDown, ChevronUp, Shop } from "react-bootstrap-icons";
import { useTienda } from "../hooks/useTienda";
import FormularioTienda from "../components/tienda/FormTienda";
import TarjetaPlan from "../components/tienda/TarjetaPlan";
import TarjetaAddon from "../components/tienda/TarjetaAddon";
import "../styles/Tienda.css";

function Tienda() {
  const {
    planActual,
    planesDisponibles,
    addonsDisponibles,
    estadisticas,
    isLoading,
    error,
    cambiarPlan,
    cambiarPlanLoading,
    agregarAddons,
    agregarAddonsLoading,
    cargarDatos,
  } = useTienda();

  const [mostrarFormularioPlan,   setMostrarFormularioPlan]   = useState(false);
  const [mostrarFormularioAddons, setMostrarFormularioAddons] = useState(false);
  const [planSeleccionado,        setPlanSeleccionado]        = useState(null);
  const [addonsSeleccionados,     setAddonsSeleccionados]     = useState([]);
  const [mensajeExito,            setMensajeExito]            = useState("");
  const [periodoAnual,            setPeriodoAnual]            = useState(true);

  const toggleFormularioPlan = () => {
    if (mostrarFormularioPlan) setPlanSeleccionado(null);
    setMostrarFormularioPlan((v) => !v);
    setMostrarFormularioAddons(false);
  };

  const handleSeleccionarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarFormularioPlan(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCambiarPlan = async (e) => {
    e.preventDefault();
    if (!planSeleccionado) { alert("Debes seleccionar un plan"); return; }
    try {
      await cambiarPlan({ planId: planSeleccionado.id, periodoAnual });
      setMensajeExito("Plan actualizado exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
      setMostrarFormularioPlan(false);
      setPlanSeleccionado(null);
    } catch (err) {
      alert("Error al cambiar el plan: " + (err.message || "Error desconocido"));
    }
  };

  // ── Helpers addons ────────────────────────────────────────────────
  const toggleFormularioAddons = () => {
    if (mostrarFormularioAddons) setAddonsSeleccionados([]);
    setMostrarFormularioAddons((v) => !v);
    setMostrarFormularioPlan(false);
  };

  const handleToggleAddon = (addonId) =>
    setAddonsSeleccionados((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );

  const handleAgregarAddons = async (e) => {
    e.preventDefault();
    if (!addonsSeleccionados.length) { alert("Debes seleccionar al menos un complemento"); return; }
    try {
      await agregarAddons(addonsSeleccionados);
      setMensajeExito("Complementos agregados exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
      setMostrarFormularioAddons(false);
      setAddonsSeleccionados([]);
    } catch (err) {
      alert("Error al agregar complementos: " + (err.message || "Error desconocido"));
    }
  };

  const calcularPrecio = (plan) => periodoAnual ? plan.precioAnual : plan.precioMensual;

  // Porcentaje seguro — evita NaN/Infinity cuando límite es -1
  const pctUso = (() => {
    if (!estadisticas || estadisticas.documentosLimite === -1) return 0;
    return Math.min(
      Math.round((estadisticas.documentosUsados / estadisticas.documentosLimite) * 100),
      100
    );
  })();

  // ── Estados de carga / error ──────────────────────────────────────
  if (isLoading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando tienda...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h5>Error al cargar la tienda</h5>
        <p>{error.message || "Error desconocido"}</p>
        <button className="btn btn-primary btn-sm mt-2" onClick={cargarDatos}>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 tienda-container">

      {/* ── Header ── */}
      <div className="header-card mb-3 px-4">
        <div className="header-content">
          <h2 className="header-title">Tienda FactCloud</h2>
          <div className="header-icon"><Shop size={70} /></div>
        </div>
      </div>

      {/* ── Alerta éxito ── */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <span>{mensajeExito}</span>
          <button type="button" className="btn-close" onClick={() => setMensajeExito("")} />
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
            <div className="row">
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Plan:</span>
                  <span className="plan-info-value">{planActual.nombre}</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Precio:</span>
                  <span className="plan-info-value">
                    ${planActual.precioMensual?.toLocaleString("es-CO")}/mes
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="plan-info-item">
                  <span className="plan-info-label">Facturas/mes:</span>
                  <span className="plan-info-value">
                    {planActual.facturasMensuales === -1 ? "Ilimitadas" : planActual.facturasMensuales}
                  </span>
                </div>
              </div>
            </div>

            {estadisticas && (
              <div className="estadisticas-uso mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-label">Documentos usados:</span>
                      <span className="stat-value">
                        {estadisticas.documentosUsados} /{" "}
                        {estadisticas.documentosLimite === -1 ? "∞" : estadisticas.documentosLimite}
                      </span>
                    </div>
                    {estadisticas.documentosLimite !== -1 && (
                      <div className="progress mt-2">
                        <div
                          className={`progress-bar ${
                            pctUso >= 80 ? "bg-danger" :
                            pctUso >= 60 ? "bg-warning" : "bg-success"
                          }`}
                          role="progressbar"
                          style={{ width: `${pctUso}%` }}
                          aria-valuenow={pctUso}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {pctUso}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-label">Días restantes:</span>
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
                  <div className="alert alert-warning mt-3 mb-0">
                    <strong>Advertencia:</strong> Has usado más del 80% de tus documentos
                    disponibles. Considera actualizar tu plan.
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 text-end">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={cargarDatos}
              >
                ↻ Actualizar estadísticas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toggle período ── */}
      <div className="periodo-toggle-container mb-4">
        <div className="periodo-toggle">
          <button
            className={`periodo-btn ${!periodoAnual ? "active" : ""}`}
            onClick={() => setPeriodoAnual(false)}
          >
            Mensual
          </button>
          <button
            className={`periodo-btn ${periodoAnual ? "active" : ""}`}
            onClick={() => setPeriodoAnual(true)}
          >
            Anual
            <span className="badge bg-success ms-2">Ahorra 20%</span>
          </button>
        </div>
      </div>

      {/* ── Botones de acción ── */}
      <div className="acciones-header mb-4">
        <button
          className={`btn-tienda ${mostrarFormularioPlan ? "active" : ""}`}
          onClick={toggleFormularioPlan}
          type="button"
        >
          {mostrarFormularioPlan
            ? <><ChevronUp size={20} className="me-2" />Ocultar Planes</>
            : <><ChevronDown size={20} className="me-2" />Ver Todos los Planes</>}
        </button>

        <button
          className={`btn-tienda-addon ${mostrarFormularioAddons ? "active" : ""}`}
          onClick={toggleFormularioAddons}
          type="button"
        >
          {mostrarFormularioAddons
            ? <><ChevronUp size={20} className="me-2" />Ocultar Complementos</>
            : <><ChevronDown size={20} className="me-2" />Ver Complementos</>}
        </button>
      </div>

      {/* ── Formulario confirmación de plan ── */}
      {mostrarFormularioPlan && planSeleccionado && (
        <div className="formulario-tienda-collapse mb-4">
          <FormularioTienda
            planSeleccionado={planSeleccionado}
            periodoAnual={periodoAnual}
            setPeriodoAnual={setPeriodoAnual}
            onSubmit={handleCambiarPlan}
            onCancel={() => { setMostrarFormularioPlan(false); setPlanSeleccionado(null); }}
            isLoading={cambiarPlanLoading}
          />
        </div>
      )}

      {/* ── Grid de planes ── */}
      {mostrarFormularioPlan && (
        <div className="planes-grid mb-4">
          {planesDisponibles.map((plan) => (
            <TarjetaPlan
              key={plan.id}
              plan={plan}
              periodoAnual={periodoAnual}
              esActual={planActual?.id === plan.id}
              onSeleccionar={handleSeleccionarPlan}
              calcularPrecio={calcularPrecio}
            />
          ))}
        </div>
      )}

      {/* ── Formulario addons ── */}
      {mostrarFormularioAddons && (
        <div className="formulario-tienda-collapse mb-4">
          <div className="formulario-tienda-container">
            <form onSubmit={handleAgregarAddons}>
              <h5 className="mb-4">Complementos Disponibles</h5>
              <div className="addons-grid mb-4">
                {addonsDisponibles.map((addon) => (
                  <TarjetaAddon
                    key={addon.id}
                    addon={addon}
                    seleccionado={addonsSeleccionados.includes(addon.id)}
                    onToggle={handleToggleAddon}
                  />
                ))}
              </div>

              {addonsSeleccionados.length > 0 && (
                <div className="resumen-addons mb-3">
                  <h6>Resumen de selección:</h6>
                  <ul>
                    {addonsSeleccionados.map((id) => {
                      const addon = addonsDisponibles.find((a) => a.id === id);
                      return (
                        <li key={id}>
                          {addon.nombre} — ${addon.precio.toLocaleString("es-CO")} {addon.unidad}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="total-addons">
                    <strong>Total adicional:</strong>
                    <span>
                      ${addonsSeleccionados
                        .reduce((total, id) => {
                          const addon = addonsDisponibles.find((a) => a.id === id);
                          return total + addon.precio;
                        }, 0)
                        .toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={toggleFormularioAddons}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!addonsSeleccionados.length || agregarAddonsLoading}
                >
                  {agregarAddonsLoading ? "Agregando..." : "Agregar Complementos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Info adicional ── */}
      <div className="info-tienda-card mt-4">
        <h5>¿Necesitas ayuda?</h5>
        <p>
          Si tienes dudas sobre qué plan es mejor para ti o necesitas un plan personalizado,
          contáctanos en{" "}
          <a href="mailto:soporte@factcloud.com">soporte@factcloud.com</a>
        </p>
        <div className="features-list">
          {[
            "Todos los planes incluyen soporte técnico",
            "Facturación electrónica validada por la DIAN",
            "Actualización y cancelación en cualquier momento",
            "Respaldo automático de tus datos",
          ].map((f) => (
            <div className="feature-item" key={f}>
              <span className="feature-icon">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Tienda;