import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileEarmarkText,
  People,
  FileText,
  Truck,
  Person,
  PersonPlus,
  Box,
} from "react-bootstrap-icons";
import "../styles/ModalCrear.css";

function ModalCrear({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay-crear" onClick={onClose} />

      <div className="modal-container-crear">
        <div className="modal-content-crear" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-crear">
            <h5>¿Qué deseas crear?</h5>
            <button className="btn-close btn-close-crear" onClick={onClose} />
          </div>

          <div className="modal-body-crear">
            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear clientes-section-crear">
                  <strong className="category-title-crear">Clientes</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/facturas")}
                      >
                        <FileEarmarkText className="menu-icon-crear" />
                        <span>Factura de venta</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/clientes")}
                      >
                        <People className="menu-icon-crear" />
                        <span>Clientes</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/notaCredito")}
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Nota crédito</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear proveedores-section-crear">
                  <strong className="category-title-crear">Proveedores</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/#")}
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Documento soporte</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/#")}
                      >
                        <Truck className="menu-icon-crear" />
                        <span>Proveedores</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear usuarios-section-crear">
                  <strong className="category-title-crear">Usuarios</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("")}
                      >
                        <Person className="menu-icon-crear" />
                        <span>Usuario</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("")}
                      >
                        <PersonPlus className="menu-icon-crear" />
                        <span>Invitar contador</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear otros-section-crear">
                  <strong className="category-title-crear">Otros</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavigation("/productos")}
                      >
                        <Box className="menu-icon-crear" />
                        <span>Producto / Servicio</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCrear;
