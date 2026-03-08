import { useState } from "react";
import { PersonFill } from "react-bootstrap-icons";
import axiosClient from "../../api/axiosClient";

function ModalCrearContacto({ clienteId, onClose, onSuccess }) {
  const [contacto, setContacto] = useState({
    nombre:   "",
    cargo:    "",
    telefono: "",
    email:    "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState("");
  const [touched,   setTouched]   = useState({});

  const set = (campo, valor) =>
    setContacto((prev) => ({ ...prev, [campo]: valor }));

  const blur = (campo) =>
    setTouched((prev) => ({ ...prev, [campo]: true }));

  const nombreError = touched.nombre && !contacto.nombre.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ nombre: true });

    if (!contacto.nombre.trim()) {
      setError("El nombre del contacto es obligatorio.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const res = await axiosClient.post(
        `/Clientes/${clienteId}/contactos`,
        contacto
      );
      onSuccess?.(res.data);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Error al crear el contacto"
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-cliente-overlay"
        style={{ zIndex: 1060 }}          /* encima de otros modales */
        onClick={onClose}
      />

      {/* Contenido */}
      <div
        style={{
          position:  "fixed",
          top:       "50%",
          left:      "50%",
          transform: "translate(-50%, -50%)",
          zIndex:    1061,
          width:     "95%",
          maxWidth:  480,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-cliente-content">

          {/* ── Header ── */}
          <div className="modal-cliente-header">
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0">Nuevo contacto</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
              onClick={onClose}
              aria-label="Cerrar"
            />
          </div>

          {/* ── Body ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-cliente-body">

              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 small">
                  {error}
                </div>
              )}

              <p className="section-title-cliente">Datos del contacto</p>

              {/* Nombre */}
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control ${nombreError ? "is-invalid" : ""}`}
                    value={contacto.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    onBlur={() => blur("nombre")}
                    placeholder="Nombre completo"
                    autoFocus
                    disabled={guardando}
                  />
                  {nombreError && (
                    <div className="invalid-feedback">
                      El nombre es obligatorio
                    </div>
                  )}
                </div>
              </div>

              {/* Cargo */}
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    value={contacto.apelldiso}
                    onChange={(e) => set("cargo", e.target.value)}
                    placeholder="Apellidos"
                    disabled={guardando}
                  />
                </div>
              </div>

              {/* Teléfono y Email */}
              <div className="row mb-3">
                <div className="col-12 col-sm-6 mt-3 mt-sm-0">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={contacto.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="correo@empresa.com"
                    disabled={guardando}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={contacto.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="+57 300 000 0000"
                    disabled={guardando}
                  />
                </div>
                
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="modal-cliente-footer" style={{ padding: "0 24px 24px" }}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={guardando}
              >
                {guardando
                  ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                  : "Guardar contacto"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

export default ModalCrearContacto;
