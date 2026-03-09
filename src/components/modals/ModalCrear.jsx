import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileEarmarkText, People, FileText,
  Truck, Person, PersonPlus, Box,
} from "react-bootstrap-icons";
import "../../styles/modals/ModalCrear.css";
import ModalCrearFactura   from "./ModalCrearFactura";
import ModalCrearCliente   from "../modals/ModalCrearCliente";
import ModalCrearProducto  from "../modals/ModalCrearProducto";
import ModalDocumentoSoporte from "../modals/ModalDocumentoSoporte";

function ModalCrear({ open, onClose }) {
  const navigate = useNavigate();
  const [modalActivo, setModalActivo] = useState(null);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    if (!open) setModalActivo(null);
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  const abrirModal = (tipo) => setModalActivo(tipo);

  const navegar = (ruta) => {
    onClose();          
    navigate(ruta);
  };

  const cerrarSubModal = () => setModalActivo(null);

  const subModalExitoso = (ruta) => {
    setModalActivo(null);
    onClose();
    if (ruta) navigate(ruta);
  };

  /** Click en el overlay: cierra todo */
  const handleOverlayClick = () => {
    setModalActivo(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* ── Overlay — cierra todo al hacer click ── */}
      <div className="modal-overlay-crear" onClick={handleOverlayClick} />

      {/* ── Modal principal ── */}
      <div className="modal-container-crear" onClick={handleOverlayClick} >
        
        <div
          className="modal-content-crear"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header-crear">
            <h5>¿Qué deseas crear?</h5>
            <button
              className="btn-close btn-close-crear"
              onClick={onClose}
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body-crear">
            <div className="row g-4">

              {/* ── Clientes ── */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear clientes-section-crear">
                  <strong className="category-title-crear">Clientes</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => abrirModal("factura")}
                      >
                        <FileEarmarkText className="menu-icon-crear" />
                        <span>Factura de venta</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/nuevo-cliente")} 
                      >
                        <People className="menu-icon-crear" />
                        <span>Cliente</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/nueva-nota-credito")}  // ✅ cierra y navega
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Nota crédito</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/nueva-nota-debito")}   // ✅ cierra y navega
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Nota débito</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Proveedores ── */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear proveedores-section-crear">
                  <strong className="category-title-crear">Proveedores</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/nuevo-documento-soporte")} // ✅ cierra y navega
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Documento soporte</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/proveedores")}
                      >
                        <Truck className="menu-icon-crear" />
                        <span>Proveedor</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Usuarios ── */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear usuarios-section-crear">
                  <strong className="category-title-crear">Usuarios</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/usuarios")}
                      >
                        <Person className="menu-icon-crear" />
                        <span>Usuario</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => navegar("/invitar-contador")}
                      >
                        <PersonPlus className="menu-icon-crear" />
                        <span>Invitar contador</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Otros ── */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="category-section-crear otros-section-crear">
                  <strong className="category-title-crear">Otros</strong>
                  <ul className="menu-list-crear">
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => abrirModal("producto")}
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

      {/* ── Sub-modales ── */}
      {modalActivo === "factura" && (
        <ModalCrearFactura
          facturaEditando={null}
          onClose={cerrarSubModal}
          onGuardadoExitoso={() => subModalExitoso("/facturas")}
        />
      )}

      {modalActivo === "cliente" && (
        <ModalCrearCliente
          clienteEditando={null}
          onClose={cerrarSubModal}
          onGuardadoExitoso={() => subModalExitoso("/clientes")}
        />
      )}

      {modalActivo === "producto" && (
        <ModalCrearProducto
          productoEditando={null}
          onClose={cerrarSubModal}
          onGuardadoExitoso={() => subModalExitoso("/productos")}
        />
      )}

      {modalActivo === "documentoSoporte" && (
        <ModalDocumentoSoporte
          isOpen={true}
          documentoEditar={null}
          onClose={cerrarSubModal}
          onSuccess={() => subModalExitoso("/compras/documentos-soporte")}
        />
      )}
    </>
  );
}

export default ModalCrear;
