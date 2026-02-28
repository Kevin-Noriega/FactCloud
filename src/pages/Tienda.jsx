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
  } = useTienda();

  const [mostrarFormularioPlan, setMostrarFormularioPlan] = useState(false);
  const [mostrarFormularioAddons, setMostrarFormularioAddons] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [addonsSeleccionados, setAddonsSeleccionados] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const [periodoAnual, setPeriodoAnual] = useState(true);

  const toggleFormularioPlan = () => {
    if (mostrarFormularioPlan) {
      setPlanSeleccionado(null);
    }
    setMostrarFormularioPlan(!mostrarFormularioPlan);
    setMostrarFormularioAddons(false);
  };

  const toggleFormularioAddons = () => {
    if (mostrarFormularioAddons) {
      setAddonsSeleccionados([]);
    }
    setMostrarFormularioAddons(!mostrarFormularioAddons);
    setMostrarFormularioPlan(false);
  };

  const handleSeleccionarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarFormularioPlan(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleAddon = (addonId) => {
    setAddonsSeleccionados((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleCambiarPlan = async (e) => {
    e.preventDefault();

    if (!planSeleccionado) {
      alert("Debes seleccionar un plan");
      return;
    }

    try {
      await cambiarPlan({ planId: planSeleccionado.id, periodoAnual });
      setMensajeExito("✅ Plan actualizado exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
      setMostrarFormularioPlan(false);
      setPlanSeleccionado(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar el plan: " + (error.message || "Error desconocido"));
    }
  };

  const handleAgregarAddons = async (e) => {
    e.preventDefault();

    if (addonsSeleccionados.length === 0) {
      alert("Debes seleccionar al menos un complemento");
      return;
    }

    try {
      await agregarAddons(addonsSeleccionados);
      setMensajeExito("✅ Complementos agregados exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);
      setMostrarFormularioAddons(false);
      setAddonsSeleccionados([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar complementos: " + (error.message || "Error desconocido"));
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h5>❌ Error al cargar la tienda</h5>
          <p>{error.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const calcularPrecio = (plan) => {
    return periodoAnual ? plan.precioAnual : plan.precioMensual;
  };

  return (
    <div className="container-fluid mt-4 px-4 tienda-container">
      {/* HEADER */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-text">
            <h2 className="header-title mb-4">Tienda FactCloud</h2>
            <p className="header-subtitle">
              Gestiona tu plan de facturación y complementos
            </p>
          </div>
          <div className="header-icon">
            <Shop size={80} />
          </div>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <span>{mensajeExito}</span>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeExito("")}
          />
        </div>
      )}

      {/* PLAN ACTUAL */}
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
                    {planActual.facturasMensuales === -1
                      ? "Ilimitadas"
                      : planActual.facturasMensuales}
                  </span>
                </div>
              </div>
            </div>

            {/* ESTADÍSTICAS */}
            {estadisticas && (
              <div className="estadisticas-uso mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-label">Documentos usados:</span>
                      <span className="stat-value">
                        {estadisticas.documentosUsados} /{" "}
                        {estadisticas.documentosLimite === -1
                          ? "∞"
                          : estadisticas.documentosLimite}
                      </span>
                    </div>
                    {estadisticas.documentosLimite !== -1 && (
                      <div className="progress mt-2">
                        <div
                          className={`progress-bar ${
                            estadisticas.porcentajeUso >= 80
                              ? "bg-danger"
                              : estadisticas.porcentajeUso >= 60
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          role="progressbar"
                          style={{ width: `${estadisticas.porcentajeUso}%` }}
                        >
                          {estadisticas.porcentajeUso.toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="stat-item">
                      <span className="stat-label">Días restantes:</span>
                      <span className="stat-value">
                        {estadisticas.diasRestantes} días
                      </span>
                    </div>
                    {estadisticas.fechaFin && (
                      <small className="text-muted d-block mt-1">
                        Vence:{" "}
                        {new Date(estadisticas.fechaFin).toLocaleDateString("es-CO")}
                      </small>
                    )}
                  </div>
                </div>

                {estadisticas.porcentajeUso >= 80 && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <strong>⚠️ Advertencia:</strong> Has usado más del 80% de tus
                    documentos disponibles. Considera actualizar tu plan.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOGGLE DE PERIODO */}
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

      {/* BOTONES DE ACCIÓN */}
      <div className="acciones-header mb-4">
        <button
          className={`btn-tienda ${mostrarFormularioPlan ? "active" : ""}`}
          onClick={toggleFormularioPlan}
          type="button"
        >
          {mostrarFormularioPlan ? (
            <>
              <ChevronUp size={20} className="me-2" />
              Ocultar Planes
            </>
          ) : (
            <>
              <ChevronDown size={20} className="me-2" />
              Ver Todos los Planes
            </>
          )}
        </button>

        <button
          className={`btn-tienda-addon ${mostrarFormularioAddons ? "active" : ""}`}
          onClick={toggleFormularioAddons}
          type="button"
        >
          {mostrarFormularioAddons ? (
            <>
              <ChevronUp size={20} className="me-2" />
              Ocultar Complementos
            </>
          ) : (
            <>
              <ChevronDown size={20} className="me-2" />
              Ver Complementos
            </>
          )}
        </button>
      </div>

      {/* FORMULARIO DE CONFIRMACIÓN DE PLAN */}
      {mostrarFormularioPlan && planSeleccionado && (
        <div className="formulario-tienda-collapse mb-4">
          <FormularioTienda
            planSeleccionado={planSeleccionado}
            periodoAnual={periodoAnual}
            setPeriodoAnual={setPeriodoAnual}
            onSubmit={handleCambiarPlan}
            onCancel={() => {
              setMostrarFormularioPlan(false);
              setPlanSeleccionado(null);
            }}
            isLoading={cambiarPlanLoading}
          />
        </div>
      )}

      {/* GRID DE PLANES */}
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

      {/* FORMULARIO DE ADDONS */}
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
                          {addon.nombre} - ${addon.precio.toLocaleString("es-CO")}{" "}
                          {addon.unidad}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="total-addons">
                    <strong>Total adicional:</strong>
                    <span>
                      $
                      {addonsSeleccionados
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleFormularioAddons}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addonsSeleccionados.length === 0 || agregarAddonsLoading}
                >
                  {agregarAddonsLoading ? "Agregando..." : "Agregar Complementos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INFORMACIÓN ADICIONAL */}
      <div className="info-tienda-card mt-4">
        <h5>¿Necesitas ayuda?</h5>
        <p>
          Si tienes dudas sobre qué plan es mejor para ti o necesitas un plan
          personalizado, contáctanos en{" "}
          <a href="mailto:soporte@factcloud.com">soporte@factcloud.com</a>
        </p>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Todos los planes incluyen soporte técnico</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Facturación electrónica validada por la DIAN</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Actualización y cancelación en cualquier momento</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Respaldo automático de tus datos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tienda;
