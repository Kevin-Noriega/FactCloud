import React from "react";

function FormTienda({
  planSeleccionado,
  periodoAnual,
  setPeriodoAnual,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const precio = periodoAnual
    ? planSeleccionado.precioAnual
    : planSeleccionado.precioMensual;

  const descuento = periodoAnual
    ? ((planSeleccionado.precioMensual * 12 - planSeleccionado.precioAnual) /
        (planSeleccionado.precioMensual * 12)) *
      100
    : 0;

  return (
    <div className="formulario-tienda-container">
      <form onSubmit={onSubmit}>
        <h5 className="mb-4">Confirmar Cambio de Plan</h5>

        <div className="plan-seleccionado-info mb-4">
          <h6>{planSeleccionado.nombre}</h6>
          <p className="text-muted">{planSeleccionado.descripcion}</p>

          <div className="row mt-3">
            <div className="col-md-6">
              <div className="info-item">
                <span className="info-label">Facturas/mes:</span>
                <span className="info-value">
                  {planSeleccionado.facturasMensuales === -1
                    ? "Ilimitadas"
                    : planSeleccionado.facturasMensuales}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-item">
                <span className="info-label">Usuarios:</span>
                <span className="info-value">
                  {planSeleccionado.usuariosMax === -1
                    ? "Ilimitados"
                    : planSeleccionado.usuariosMax}
                </span>
              </div>
            </div>
          </div>

          {planSeleccionado.caracteristicas && planSeleccionado.caracteristicas.length > 0 && (
            <div className="caracteristicas-list mt-3">
              <h6>Características incluidas:</h6>
              <ul>
                {planSeleccionado.caracteristicas.map((car, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span> {car}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="periodo-selector mb-4">
          <label className="form-label">Periodo de facturación:</label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="periodo"
              id="mensual"
              checked={!periodoAnual}
              onChange={() => setPeriodoAnual(false)}
            />
            <label className="btn btn-outline-primary" htmlFor="mensual">
              Mensual
            </label>

            <input
              type="radio"
              className="btn-check"
              name="periodo"
              id="anual"
              checked={periodoAnual}
              onChange={() => setPeriodoAnual(true)}
            />
            <label className="btn btn-outline-primary" htmlFor="anual">
              Anual
              {descuento > 0 && (
                <span className="badge bg-success ms-2">
                  Ahorra {descuento.toFixed(0)}%
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="resumen-pago">
          <div className="resumen-item">
            <span>Precio base:</span>
            <span>${precio.toLocaleString("es-CO")}</span>
          </div>
          {periodoAnual && descuento > 0 && (
            <div className="resumen-item text-success">
              <span>Descuento anual:</span>
              <span>
                -$
                {(
                  planSeleccionado.precioMensual * 12 -
                  planSeleccionado.precioAnual
                ).toLocaleString("es-CO")}
              </span>
            </div>
          )}
          <div className="resumen-total">
            <span>Total a pagar:</span>
            <span>${precio.toLocaleString("es-CO")}</span>
          </div>
          <small className="text-muted d-block mt-2">
            {periodoAnual ? "Facturación anual" : "Facturación mensual"}
          </small>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Procesando...
              </>
            ) : (
              "Confirmar Cambio"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormTienda;
