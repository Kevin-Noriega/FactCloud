// pages/CuentasContables.jsx
import React, { useState } from "react";
import { FileEarmarkSpreadsheet } from "react-bootstrap-icons";
import { useCuentasContables } from "../hooks/useCuentasContables";
import DetalleCuenta from "../components/Impuestos/DetalleCuenta";
import "../styles/Impuestos/CuentasContables.css";

export default function CuentasContables() {
  const {
    arbol,
    loading,
    error,
    seleccionada,
    setSeleccionada,
    saving,
    guardar,
    eliminar,
    exportarExcel,
    setError,
  } = useCuentasContables();

  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [expandidos, setExpandidos] = useState(new Set());

  const toggleExpand = (codigo) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(codigo) ? next.delete(codigo) : next.add(codigo);
      return next;
    });
  };

  const expandirTodos = () => {
    // Recorre todo el árbol y expande todos
    const todos = new Set();
    const recorrer = (nodos) =>
      nodos.forEach((n) => {
        todos.add(n.codigo);
        recorrer(n.hijos);
      });
    recorrer(arbol);
    setExpandidos(todos);
  };

  // Filtrado recursivo del árbol
  const filtrarArbol = (nodos) => {
    return nodos.reduce((acc, nodo) => {
      const matchCodigo = !filtroCodigo || nodo.codigo.startsWith(filtroCodigo);
      const matchNombre =
        !filtroNombre ||
        nodo.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const hijosFiltrados = filtrarArbol(nodo.hijos || []);
      if ((matchCodigo && matchNombre) || hijosFiltrados.length > 0) {
        acc.push({ ...nodo, hijos: hijosFiltrados });
      }
      return acc;
    }, []);
  };

  const arbolFiltrado = filtrarArbol(arbol);

  if (loading)
    return <div className="cc-loading">Cargando cuentas contables...</div>;

  return (
    <div className="cc-page">
      {/* Header */}
      <div className="cc-header">
        <div className="cc-header-left">
          <h2 className="cc-titulo">Cuenta contable</h2>
        </div>
        <button className="cc-btn-excel" onClick={exportarExcel}>
          <FileEarmarkSpreadsheet size={14} />
          Descargar Excel
        </button>
      </div>

      {error && (
        <div className="cc-alert">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="cc-body">
        {/* Panel izquierdo — árbol */}
        <div className="cc-panel-izq">
          {/* Expandir todos */}
          <button className="cc-link-expandir" onClick={expandirTodos}>
            ∨ Expandir todos los detalles
          </button>

          {/* Filtros */}
          <div className="cc-filtros">
            <div className="cc-filtro-campo">
              <span className="cc-filtro-ico">🔍</span>
              <input
                type="text"
                placeholder="Buscar por código"
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
                className="cc-filtro-input"
              />
            </div>
            <div className="cc-filtro-campo">
              <span className="cc-filtro-ico">🔍</span>
              <input
                type="text"
                placeholder="Buscar por cuenta contable"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="cc-filtro-input"
              />
            </div>
          </div>

          {/* Árbol */}
          <div className="cc-arbol">
            {arbolFiltrado.map((nodo) => (
              <NodoArbol
                key={nodo.codigo}
                nodo={nodo}
                nivel={0}
                expandidos={expandidos}
                onToggle={toggleExpand}
                seleccionada={seleccionada}
                onSeleccionar={setSeleccionada}
              />
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className="cc-divider" />

        {/* Panel derecho — detalle */}
        <div className="cc-panel-der">
          {seleccionada ? (
            <DetalleCuenta
              cuenta={seleccionada}
              onGuardar={guardar}
              onEliminar={eliminar}
              saving={saving}
            />
          ) : (
            <div className="cc-vacia">
              <p>
                Para crear o editar, selecciona una cuenta contable desplegando
                los grupos de cuentas ubicados en la parte izquierda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Nodo recursivo del árbol ──────────────────────────────────────────────────
function NodoArbol({
  nodo,
  nivel,
  expandidos,
  onToggle,
  seleccionada,
  onSeleccionar,
}) {
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const expandido = expandidos.has(nodo.codigo);
 // const esTransaccional = nodo.permiteMovimiento;
  const esSeleccionada = seleccionada?.codigo === nodo.codigo;

  return (
    <div className="cc-nodo">
      <div
        className={`cc-nodo-fila ${esSeleccionada ? "cc-nodo-activo" : ""} nivel-${Math.min(nivel, 4)}`}
        onClick={() => {
          if (tieneHijos) onToggle(nodo.codigo);
          onSeleccionar(nodo);
        }}
      >
        <span className="cc-nodo-toggle">
          {tieneHijos ? (expandido ? "▼" : "▶") : ""}
        </span>
        <span
          className={`cc-nodo-codigo ${!nodo.activa ? "cc-codigo-inactivo" : ""}`}
        >
          {nodo.codigo}
        </span>
        <span className="cc-nodo-nombre">{nodo.nombre}</span>
      </div>

      {tieneHijos && expandido && (
        <div className="cc-nodo-hijos">
          {nodo.hijos.map((hijo) => (
            <NodoArbol
              key={hijo.codigo}
              nodo={hijo}
              nivel={nivel + 1}
              expandidos={expandidos}
              onToggle={onToggle}
              seleccionada={seleccionada}
              onSeleccionar={onSeleccionar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
