import { useState, useEffect } from "react";
import { API_URL } from "../api/config";
import { XCircle, CheckCircleFill, FileEarmarkText } from "react-bootstrap-icons";
import "../styles/ModalDocumentoSoporte.css";

function ModalDocumentoSoporte({ isOpen, onClose, onSuccess, documentoEditar }) {
  const [formData, setFormData] = useState({
    proveedorNombre: "",
    proveedorNit: "",
    proveedorTipoIdentificacion: "CC",
    descripcion: "",
    valorTotal: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (documentoEditar) {
      setFormData({
        proveedorNombre: documentoEditar.proveedorNombre || "",
        proveedorNit: documentoEditar.proveedorNit || "",
        proveedorTipoIdentificacion: documentoEditar.proveedorTipoIdentificacion || "CC",
        descripcion: documentoEditar.descripcion || "",
        valorTotal: documentoEditar.valorTotal || "",
        observaciones: documentoEditar.observaciones || "",
      });
    }
  }, [documentoEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = documentoEditar
        ? `${API_URL}/DocumentosSoporte/${documentoEditar.id}`
        : `${API_URL}/DocumentosSoporte`;

      const response = await fetch(url, {
        method: documentoEditar ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          valorTotal: parseFloat(formData.valorTotal),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al guardar documento soporte");
      }

      onSuccess(
        documentoEditar
          ? "Documento soporte actualizado exitosamente"
          : "Documento soporte creado exitosamente"
      );
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-documento" onClick={onClose}>
      <div className="modal-documento" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-documento">
          <h3>
            <FileEarmarkText className="me-2" />
            {documentoEditar ? "Editar" : "Nuevo"} Documento Soporte
          </h3>
          <button className="btn-close-documento" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-documento">
          <div className="form-section-documento">
            <h4 className="section-title-documento">Información del Proveedor</h4>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label-documento">
                  Nombre o Razón Social *
                </label>
                <input
                  type="text"
                  name="proveedorNombre"
                  className="form-control-documento"
                  value={formData.proveedorNombre}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez / Mi Empresa S.A.S"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-documento">Tipo Identificación *</label>
                <select
                  name="proveedorTipoIdentificacion"
                  className="form-select-documento"
                  value={formData.proveedorTipoIdentificacion}
                  onChange={handleChange}
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="NIT">NIT</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label-documento">
                  Número de Identificación *
                </label>
                <input
                  type="text"
                  name="proveedorNit"
                  className="form-control-documento"
                  value={formData.proveedorNit}
                  onChange={handleChange}
                  required
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>

          <div className="form-section-documento">
            <h4 className="section-title-documento">Detalle de la Adquisición</h4>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-documento">
                  Descripción del Bien o Servicio *
                </label>
                <textarea
                  name="descripcion"
                  className="form-control-documento"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  placeholder="Detalla el bien o servicio adquirido..."
                ></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label-documento">Valor Total *</label>
                <input
                  type="number"
                  name="valorTotal"
                  className="form-control-documento"
                  value={formData.valorTotal}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="col-12">
                <label className="form-label-documento">Observaciones</label>
                <textarea
                  name="observaciones"
                  className="form-control-documento"
                  rows="2"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Información adicional (opcional)..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="info-legal-documento">
            <p>
              <strong>ℹ️ Información:</strong> Este documento se generará 
              cumpliendo con todos los requisitos de la DIAN, incluyendo CUDS, 
              numeración consecutiva y firma electrónica [web:15][web:16][web:17].
            </p>
          </div>

          <div className="modal-actions-documento">
            <button
              type="button"
              className="btn-cancelar-documento"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-guardar-documento"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircleFill className="me-2" size={18} />
                  {documentoEditar ? "Actualizar" : "Crear"} Documento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalDocumentoSoporte;
