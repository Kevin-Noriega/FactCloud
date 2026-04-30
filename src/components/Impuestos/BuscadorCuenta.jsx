import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../styles/Impuestos/BuscadorCuenta.css";

export default function BuscadorCuenta({
  value,
  onChange,
  placeholder = "Buscar",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Cierra al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Busca con debounce — sin q vacío al backend
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let lista = [];

        if (query.trim()) {
          // Búsqueda por texto → endpoint /buscar
          const { data } = await axiosClient.get("/cuentascontables/buscar", {
            params: { q: query.trim() },
          });
          lista = data;
        } else {
          // Sin texto → trae las primeras 20 cuentas de movimiento
          const { data } = await axiosClient.get("/cuentascontables", {
            params: { soloActivas: true, soloMovimiento: true },
          });
          lista = data.slice(0, 20).map((c) => ({
            id: c.id,
            codigo: c.codigo,
            nombre: c.nombre,
            codigoNombre: c.codigoNombre,
          }));
        }

        setCuentas(lista);
      } catch {
        setCuentas([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleSelect = (cuenta) => {
    onChange(cuenta);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="bc-wrapper" ref={ref}>
      {/* Campo visible */}
      <div className="bc-field" onClick={() => setOpen((p) => !p)}>
        {value ? (
          <span className="bc-value">
            {value.codigo} {value.nombre}
          </span>
        ) : (
          <span className="bc-placeholder">{placeholder}</span>
        )}
        <span className="bc-arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="bc-dropdown">
          {/* ✅ value siempre controlado con ?? "" */}
          <div className="bc-search-row">
            <input
              autoFocus
              type="text"
              className="bc-search-input"
              placeholder="Buscar por código o nombre"
              value={query ?? ""}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="bc-list-header">
            <span>Código</span>
            <span>Nombre</span>
          </div>

          <div className="bc-list">
            {loading && <div className="bc-msg">Buscando...</div>}
            {!loading && cuentas.length === 0 && (
              <div className="bc-msg">Sin resultados</div>
            )}
            {!loading &&
              cuentas.map((c) => (
                <div
                  key={c.id}
                  className={`bc-item ${value?.id === c.id ? "bc-item-active" : ""}`}
                  onClick={() => handleSelect(c)}
                >
                  <span className="bc-item-codigo">{c.codigo}</span>
                  <span className="bc-item-nombre">{c.nombre}</span>
                </div>
              ))}
          </div>

          <div className="bc-footer">
            <button
              className="bc-btn-crear"
              onClick={() => {
                setOpen(false);
                navigate("/cuentas-contables/nueva");
              }}
            >
              + Crear nuevo
            </button>
            <button
              className="bc-btn-ver"
              onClick={() => {
                setOpen(false);
                navigate("/cuentas-contables");
              }}
            >
              Ver más
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
