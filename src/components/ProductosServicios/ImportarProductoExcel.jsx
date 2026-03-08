// ImportarProductosExcel.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CloudArrowUp,
  FileEarmarkExcel,
  CheckCircle,
  XCircle,
} from "react-bootstrap-icons";

export default function ImportarProductosExcel() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [archivo, setArchivo] = useState(null);
  const [arrastrandoSobre, setArrastrandoSobre] = useState(false);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null); // { ok: true, total, errores }
  const [error, setError] = useState(null);

  // ── Validar que sea .xlsx y <= 1 MB ──
  const validarArchivo = (file) => {
    if (!file) return "Selecciona un archivo.";
    if (!file.name.endsWith(".xlsx")) return "Solo se permiten archivos .xlsx";
    if (file.size > 1 * 1024 * 1024) return "El archivo no puede superar 1 MB.";
    return null;
  };

  const handleArchivoChange = (file) => {
    const err = validarArchivo(file);
    if (err) {
      setError(err);
      setArchivo(null);
    } else {
      setError(null);
      setArchivo(file);
      setResultado(null);
    }
  };

  // ── Drag & Drop ──
  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrandoSobre(false);
    const file = e.dataTransfer.files?.[0];
    handleArchivoChange(file);
  };

  // ── Importar ──
  const handleImportar = async () => {
    const err = validarArchivo(archivo);
    if (err) {
      setError(err);
      return;
    }

    setImportando(true);
    setResultado(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      // 🔁 Cambia esta URL por tu endpoint real
      const res = await fetch("/api/productos/importar-excel", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al importar. Intenta de nuevo.");

      const data = await res.json();
      setResultado(data); // espera { total: 50, errores: [] }
    } catch (e) {
      setError(e.message);
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="page-crear-producto">
      {/* ── HEADER ── */}
      <div className="page-crear-producto__header">
        <button
          className="btn btn-volver btn-sm mb-3"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="page-crear-producto__banner">
          <div className="page-crear-producto__banner-content">
            <div className="page-crear-producto__banner-text">
              <h2 className="page-crear-producto__banner-title">
                Importar Productos desde Excel
              </h2>
              <p className="page-crear-producto__banner-subtitle">
                Sube un archivo .xlsx para cargar o actualizar productos en el
                catálogo.
              </p>
            </div>
            <div className="page-crear-producto__banner-icon">
              <FileEarmarkExcel size={70} />
            </div>
          </div>
        </div>
      </div>

      {/* ── CUERPO ── */}
      <div className="page-crear-producto__wrapper">
        <div className="page-crear-producto__body">
          {/* ── PASO 1 ── */}
          <h6 className="section-title-producto-producto">
            Paso 1 — Descarga la plantilla
          </h6>
          <p className="text-muted small mb-3">
            Crea una plantilla si vas a cargar productos nuevos, o descarga la
            plantilla de los productos existentes si deseas actualizarlos.
          </p>

          <div className="d-flex gap-3 mb-4">
            <a
              href="/api/productos/plantilla-excel"
              className="btn btn-outline-primary btn-sm"
              download
            >
              <FileEarmarkExcel className="me-1" />
              Crear plantilla vacía
            </a>
            <a
              href="/api/productos/exportar-excel"
              className="btn btn-outline-secondary btn-sm"
              download
            >
              <FileEarmarkExcel className="me-1" />
              Descargar productos existentes
            </a>
          </div>

          {/* Nota de advertencia — mismo estilo que Siigo */}
          <div className="alert alert-info d-flex gap-2 align-items-start mb-4 py-2">
            <span style={{ fontSize: "1.1rem" }}>ℹ️</span>
            <small>
              Para modificar productos existentes, asegúrate de que el valor en
              la columna <strong>"Código del producto"</strong> sea idéntico al
              registrado. Ten en cuenta que si el código es <code>"001"</code>,
              Excel puede convertirlo en <code>"1"</code> — para el sistema son
              códigos distintos.
            </small>
          </div>

          {/* ── PASO 2 ── */}
          <h6 className="section-title-producto-producto">
            Paso 2 — Selecciona tu archivo
          </h6>
          <p className="text-muted small mb-1">
            Máximo 500 registros por archivo
          </p>

          {/* Dropzone */}
          <div
            className={`fotos-dropzone mb-3 ${arrastrandoSobre ? "fotos-dropzone--activo" : ""} ${error ? "fotos-dropzone--error" : ""}`}
            style={{
              border: `2px dashed ${error ? "#dc3545" : arrastrandoSobre ? "#0d6efd" : "#ced4da"}`,
              borderRadius: "10px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: arrastrandoSobre ? "#e8f0fe" : "#fafafa",
              transition: "all 0.2s ease",
              maxWidth: "420px",
            }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrandoSobre(true);
            }}
            onDragLeave={() => setArrastrandoSobre(false)}
            onDrop={handleDrop}
          >
            <CloudArrowUp size={40} className="text-muted mb-2" />
            {archivo ? (
              <p className="mb-0 fw-semibold text-success">
                ✅ {archivo.name}{" "}
                <span className="text-muted fw-normal">
                  ({(archivo.size / 1024).toFixed(1)} KB)
                </span>
              </p>
            ) : (
              <>
                <p className="mb-1 text-muted">
                  Arrastra aquí el archivo <strong>.xlsx</strong>
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Selecciona un archivo
                </button>
                <p className="text-muted small mt-1 mb-0">Máx. 1 MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="d-none"
              onChange={(e) => handleArchivoChange(e.target.files?.[0])}
            />
          </div>

          {/* Error de validación */}
          {error && (
            <div
              className="alert alert-danger py-2 d-flex align-items-center gap-2 mb-3"
              style={{ maxWidth: "420px" }}
            >
              <XCircle size={18} />
              <small>{error}</small>
            </div>
          )}

          {/* Resultado exitoso */}
          {resultado && (
            <div
              className="alert alert-success py-2 mb-3"
              style={{ maxWidth: "420px" }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <CheckCircle size={18} />
                <strong>Importación completada</strong>
              </div>
              <small>
                {resultado.total} producto(s) procesado(s).
                {resultado.errores?.length > 0 && (
                  <span className="text-danger ms-2">
                    {resultado.errores.length} con error.
                  </span>
                )}
              </small>
              {resultado.errores?.length > 0 && (
                <ul className="mt-2 mb-0 ps-3">
                  {resultado.errores.map((e, i) => (
                    <li key={i} className="text-danger small">
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="page-crear-producto__footer">
            <div className="footer-acciones">
              <button
                type="button"
                className="btn btn-footer-secundario"
                onClick={() => navigate(-1)}
                disabled={importando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-footer-primario"
                onClick={handleImportar}
                disabled={!archivo || importando}
              >
                {importando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Importando...
                  </>
                ) : (
                  "Importar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
