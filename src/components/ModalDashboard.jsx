import { useEffect } from "react";

function ModalDashboard({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1040,
        }}
      />

      {/*  MODAL */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            width: "100%",
            maxWidth: "900px",
            borderRadius: "8px",
            padding: "1rem",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">¿Qué deseas crear?</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-3">
              <strong>Clientes</strong>
              <ul className="list-unstyled mt-2">
                <li>Factura de venta</li>
                <li>Clientes</li>
                <li>Nota crédito</li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <strong>Proveedores</strong>
              <ul className="list-unstyled mt-2">
                <li>Documento soporte</li>
                <li>Proveedores</li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <strong>Usuarios</strong>
              <ul className="list-unstyled mt-2">
                <li>Usuario</li>
                <li>Invitar contador</li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <strong>Otros</strong>
              <ul className="list-unstyled mt-2">
                <li>Producto / Servicio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ModalDashboard;
