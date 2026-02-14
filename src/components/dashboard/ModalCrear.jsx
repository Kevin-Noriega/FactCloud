import { useEffect, useState } from "react";
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
import "../../styles/ModalCrear.css";
import ModalCrearFactura from "./ModalCrearFactura";
import ModalCrearCliente from "./ModalCrearCliente";
import ModalCrearProducto from "./ModalCrearProducto";
import ModalCrearNotaCredito from "./ModalNotaCredito";
import ModalDocumentoSoporte from "./ModalDocumentoSoporte";

function ModalCrear({ open, onClose }) {
  const navigate = useNavigate();
  const [modalActivo, setModalActivo] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    if (!open) {
      setModalActivo(null);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  /**
   * Maneja la navegación y apertura de modales
   * @param {string} tipo - Tipo de modal a abrir
   * @param {string} rutaDestino - Ruta a la que navegar después de crear
   */
  const handleAbrirModal = (tipo, rutaDestino) => {
    setModalActivo({ tipo, rutaDestino });
  };

  const handleCerrarModalEspecifico = () => {
    setModalActivo(null);
    onClose();
  };

  
  const handleGuardadoExitoso = () => {
    const rutaDestino = modalActivo?.rutaDestino;
    
    // Cerrar modales
    setModalActivo(null);
    onClose();
    
    if (rutaDestino) {
      navigate(rutaDestino);
    }
  };

  const handleNavegacionDirecta = (ruta) => {
    navigate(ruta);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay-crear" onClick={onClose} />
      
      {/* Modal Principal */}
      <div className="modal-container-crear">
        <div className="modal-content-crear" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-crear">
            <h5>¿Qué deseas crear?</h5>
            <button 
              className="btn-close btn-close-crear" 
              onClick={onClose}
              aria-label="Cerrar modal"
            />
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
                        onClick={() => handleAbrirModal("factura", "/facturas")}
                      >
                        <FileEarmarkText className="menu-icon-crear" />
                        <span>Factura de venta</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleAbrirModal("cliente", "/clientes")}
                      >
                        <People className="menu-icon-crear" />
                        <span>Cliente</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleAbrirModal("notaCredito", "/notaCredito")}
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
                        onClick={() => handleAbrirModal("documentoSoporte", "/documento-soporte")}
                      >
                        <FileText className="menu-icon-crear" />
                        <span>Documento soporte</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavegacionDirecta("/proveedores")}
                      >
                        <Truck className="menu-icon-crear" />
                        <span>Proveedor</span>
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
                        onClick={() => handleNavegacionDirecta("/usuarios")}
                      >
                        <Person className="menu-icon-crear" />
                        <span>Usuario</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-item-crear"
                        onClick={() => handleNavegacionDirecta("/invitar-contador")}
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
                        onClick={() => handleAbrirModal("producto", "/productos")}
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
      {modalActivo?.tipo === "producto" && (
        <ModalCrearProducto 
          productoEditando={null}
          onClose={handleCerrarModalEspecifico}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      )}

      {modalActivo?.tipo === "factura" && (
        <ModalCrearFactura 
          facturaEditando={null}
          onClose={handleCerrarModalEspecifico}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      )}

      {modalActivo?.tipo === "cliente" && (
        <ModalCrearCliente 
          clienteEditando={null}
          onClose={handleCerrarModalEspecifico}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      )}

      {modalActivo?.tipo === "notaCredito" && (
        <ModalCrearNotaCredito 
          onClose={handleCerrarModalEspecifico}
          onGuardadoExitoso={handleGuardadoExitoso}
        />
      )}

      {modalActivo?.tipo === "documentoSoporte" && (
        <ModalDocumentoSoporte 
          isOpen={true}
          onClose={handleCerrarModalEspecifico}
          onSuccess={handleGuardadoExitoso}
          documentoEditar={null}
        />
      )}
    </>
  );
}

export default ModalCrear;
