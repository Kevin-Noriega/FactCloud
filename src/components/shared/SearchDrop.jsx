import { useState, useRef, useEffect } from "react";
import { Search, XCircle, PlusCircle } from "react-bootstrap-icons";

/**
 * Dropdown de búsqueda reutilizable.
 * "Crear nuevo" aparece SIEMPRE al final, después de resultados o "sin resultados".
 */
export default function SearchDrop({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = "Buscar...",
  items = [],
  keyExtractor,
  renderItem,
  loading = false,
  emptyLabel = "Sin resultados",
  onCrear,
  crearLabel = "Crear nuevo",
  readOnly = false,
  invalid = false,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="doc-search-wrap" ref={wrapRef}>
      <input
        type="text"
        className={`form-control form-control-sm${invalid ? " is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => { if (!readOnly) setOpen(true); }}
        autoComplete="off"
      />

      {value && onClear
        ? <button type="button" className="doc-icon-btn"
            onClick={() => { onClear(); setOpen(false); }}>
            <XCircle size={13} />
          </button>
        : <Search size={13} className="doc-search-icon" />
      }

      {open && !readOnly && (
        <div className="doc-dropdown">

          {/* ── Resultados ── */}
          {loading ? (
            <div className="doc-select-empty">
              <span className="spinner-border spinner-border-sm me-2" />
              Cargando...
            </div>
          ) : items.length > 0 ? (
            items.slice(0, 10).map((item) => (
              <button key={keyExtractor(item)} type="button"
                className="doc-dropdown-item"
                onMouseDown={() => { onSelect(item); setOpen(false); }}>
                {renderItem(item)}
              </button>
            ))
          ) : (
            /* ── Sin resultados ── */
            <div className="doc-select-empty">{emptyLabel}</div>
          )}

          {/* ✅ "Crear nuevo" SIEMPRE al final, después de resultados o sin resultados */}
          {onCrear && (
            <>
              <div className="doc-dropdown-divider" />
              <button type="button"
                className="doc-dropdown-item doc-dropdown-crear"
                onMouseDown={() => { onCrear(); setOpen(false); }}>
                <PlusCircle size={14} className="me-2" />
                {crearLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
