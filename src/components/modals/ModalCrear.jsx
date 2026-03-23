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

/* ── Ítem reutilizable ── */
function Item({label, onClick }) {
  return (
    <button className="mc-item" onClick={onClick} type="button">
      <span className="mc-item-text">{label}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
function ModalCrear({ open, onClose }) {
  const navigate = useNavigate();
  const [modalActivo, setModalActivo] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    if (!open) setModalActivo(null);
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  if (!open) return null;

  const navegar = (ruta) => { onClose(); navigate(ruta); };
  const cerrar  = ()     => setModalActivo(null);
  const exito   = (ruta) => { setModalActivo(null); onClose(); if (ruta) navigate(ruta); };

  return (
    <>
      <div className="mc-overlay" onClick={() => { cerrar(); onClose(); }}>
        <div className="mc-panel" onClick={(e) => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="mc-header">
            <div className="mc-header-left">
              <span className="mc-header-accent" />
              <div>
                <p className="mc-title">¿Qué deseas crear?</p>
                <p className="mc-subtitle">Selecciona el tipo de documento o registro</p>
              </div>
            </div>
            <button className="mc-btn-close" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>

          {/* ── Grid de categorías ── */}
          <div className="mc-body">

            <div className="mc-category">
              <span className="mc-category-label">Clientes</span>
              <Item label="Factura de venta"  onClick={() => navegar("/nueva-factura")} />
              <Item label="Cliente"            onClick={() => navegar("/nuevo-cliente")} />
              <Item label="Nota crédito"       onClick={() => navegar("/nueva-nota-credito")} />
              <Item label="Nota débito"        onClick={() => navegar("/nueva-nota-debito")} />
            </div>

            <div className="mc-category">
              <span className="mc-category-label">Proveedores</span>
              <Item  label="Documento soporte" onClick={() => navegar("/nuevo-documento-soporte")} />
              <Item label="Proveedor"          onClick={() => navegar("/nuevo-cliente")} />
            </div>

            <div className="mc-category">
              <span className="mc-category-label">Usuarios</span>
              <Item label="Usuario"          onClick={() => navegar("/usuarios")} />
              <Item label="Invitar contador" onClick={() => navegar("/invitar-contador")} />
            </div>

            <div className="mc-category">
              <span className="mc-category-label">Otros</span>
              <Item label="Producto / Servicio" onClick={() => navegar("/Crearproducto")} />
            </div>

          </div>
        </div>
      </div>

      {/* ── Sub-modales ── */}
      {modalActivo === "factura" && (
        <ModalCrearFactura
          facturaEditando={null}
          onClose={cerrar}
          onGuardadoExitoso={() => exito("/facturas")}
        />
      )}
      {modalActivo === "cliente" && (
        <ModalCrearCliente
          clienteEditando={null}
          onClose={cerrar}
          onGuardadoExitoso={() => exito("/clientes")}
        />
      )}
      {modalActivo === "producto" && (
        <ModalCrearProducto
          productoEditando={null}
          onClose={cerrar}
          onGuardadoExitoso={() => exito("/productos")}
        />
      )}
      {modalActivo === "documentoSoporte" && (
        <ModalDocumentoSoporte
          isOpen={true}
          documentoEditar={null}
          onClose={cerrar}
          onSuccess={() => exito("/compras/documentos-soporte")}
        />
      )}
    </>
  );
}

export default ModalCrear;