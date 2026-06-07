// pages/CuentasContables.jsx
import React, { useState, useCallback } from "react";
import {
  FileEarmarkSpreadsheet,
  ChevronDown,
  ChevronRight,
  Plus,
} from "react-bootstrap-icons";
import { useCuentasContables } from "../hooks/useCuentasContables";
import {
  DetalleCuenta,
  FormCrearCuenta,
} from "../components/Impuestos/DetalleCuenta";
import "../styles/Impuestos/CuentasContables.css";

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════
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
    // Creación
    modoCrear,
    formCrear,
    iniciarCreacion,
    cancelarCreacion,
    actualizarFormCrear,
    crearCuenta,
  } = useCuentasContables();

  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [expandidos, setExpandidos] = useState(new Set(["1"])); // Clase 1 expandida por defecto

  // ── Expand / collapse ─────────────────────────────────────────
  const toggleExpand = useCallback((codigo) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(codigo) ? next.delete(codigo) : next.add(codigo);
      return next;
    });
  }, []);

  const expandirTodos = useCallback(() => {
    const todos = new Set();
    const rec = (nodos) =>
      nodos.forEach((n) => {
        todos.add(n.codigo);
        rec(n.hijos || []);
      });
    rec(arbol);
    setExpandidos(todos);
  }, [arbol]);

  const colapsarTodos = useCallback(() => setExpandidos(new Set()), []);

  // ── Filtrado recursivo ────────────────────────────────────────
  const filtrarArbol = useCallback(
    (nodos) => {
      return nodos.reduce((acc, nodo) => {
        const okCodigo = !filtroCodigo || nodo.codigo.startsWith(filtroCodigo);
        const okNombre =
          !filtroNombre ||
          nodo.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const hijosFiltrados = filtrarArbol(nodo.hijos || []);

        if ((okCodigo && okNombre) || hijosFiltrados.length > 0) {
          // Si hay filtro activo → auto-expandir padres con hijos filtrados
          if (hijosFiltrados.length > 0 && (filtroCodigo || filtroNombre)) {
            setExpandidos((prev) => {
              if (prev.has(nodo.codigo)) return prev;
              const next = new Set(prev);
              next.add(nodo.codigo);
              return next;
            });
          }
          acc.push({ ...nodo, hijos: hijosFiltrados });
        }
        return acc;
      }, []);
    },
    [filtroCodigo, filtroNombre],
  );

  const arbolFiltrado = filtrarArbol(arbol);

  // ── Seleccionar cuenta ────────────────────────────────────────
  const handleSeleccionar = useCallback(
    (nodo) => {
      setSeleccionada(nodo);
      // Si estamos en modo crear, cerrar formulario al seleccionar otra cuenta
      if (modoCrear) cancelarCreacion();
    },
    [setSeleccionada, modoCrear, cancelarCreacion],
  );

  // ── Panel derecho: qué mostrar ────────────────────────────────
  const renderPanelDerecho = () => {
    if (modoCrear && formCrear) {
      return (
        <FormCrearCuenta
          form={formCrear}
          onChange={actualizarFormCrear}
          onCrear={crearCuenta}
          onCancelar={cancelarCreacion}
          saving={saving}
          error={error}
        />
      );
    }

    if (seleccionada) {
      return (
        <DetalleCuenta
          cuenta={seleccionada}
          onGuardar={guardar}
          saving={saving}
          onIniciarCreacion={iniciarCreacion}
        />
      );
    }

    return (
      <div className="cc-panel-vacio">
        <div className="cc-panel-vacio-icono">📋</div>
        <p className="cc-panel-vacio-texto">
          Selecciona una cuenta del árbol para ver o editar sus datos.
        </p>
        <button
          className="cc-btn-crear-clase"
          onClick={() => iniciarCreacion(null)}
        >
          <Plus size={14} /> Crear nueva clase
        </button>
      </div>
    );
  };

  if (loading)
    return (
      <div className="cc-loading">
        <span className="cc-spinner" />
        Cargando cuentas...
      </div>
    );

  return (
    <div className="cc-page">
      {/* ── Header ── */}
      <div className="cc-header">
        <h2 className="cc-titulo">Cuenta contable</h2>
        <button className="cc-btn-excel" onClick={exportarExcel}>
          <FileEarmarkSpreadsheet size={14} />
          Descargar Excel
        </button>
      </div>

      {/* ── Alerta de error global ── */}
      {error && !modoCrear && (
        <div className="cc-alert-error">
          {error}
          <button className="cc-alert-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* ── Cuerpo: árbol + detalle ── */}
      <div className="cc-body">
        {/* ══ Panel Izquierdo — árbol ══ */}
        <div className="cc-panel-izq">
          {/* Controles de árbol */}
          <div className="cc-arbol-controles">
            <button className="cc-link-expandir" onClick={expandirTodos}>
              ∨ Expandir todos
            </button>
            <button className="cc-link-expandir" onClick={colapsarTodos}>
              ∧ Colapsar todos
            </button>
          </div>

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
                placeholder="Buscar por nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="cc-filtro-input"
              />
            </div>
          </div>

          {/* Encabezados de columna */}
          <div className="cc-arbol-header">
            <span className="cc-arbol-col-codigo">Código</span>
            <span className="cc-arbol-col-nombre">Cuenta contable</span>
          </div>

          {/* Árbol */}
          <div className="cc-arbol">
            {arbolFiltrado.length === 0 ? (
              <div className="cc-arbol-vacio">
                Sin resultados para la búsqueda.
              </div>
            ) : (
              arbolFiltrado.map((nodo) => (
                <NodoArbol
                  key={nodo.codigo}
                  nodo={nodo}
                  nivel={0}
                  expandidos={expandidos}
                  onToggle={toggleExpand}
                  seleccionada={seleccionada}
                  onSeleccionar={handleSeleccionar}
                  onCrearHijo={iniciarCreacion}
                  modoCrear={modoCrear}
                  formCrear={formCrear}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Divisor ── */}
        <div className="cc-divider" />

        {/* ══ Panel Derecho — detalle / formulario ══ */}
        <div className="cc-panel-der">{renderPanelDerecho()}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NODO RECURSIVO DEL ÁRBOL
// ═══════════════════════════════════════════════════════════════
function NodoArbol({
  nodo,
  nivel,
  expandidos,
  onToggle,
  seleccionada,
  onSeleccionar,
  onCrearHijo,
  modoCrear,
  formCrear,
}) {
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const expandido = expandidos.has(nodo.codigo);
  const esSeleccionada = seleccionada?.codigo === nodo.codigo;

  // Resaltar si es el padre del formulario de creación
  const esPadreActivo = modoCrear && formCrear?.codigoPadre === nodo.codigo;

  return (
    <div className="cc-nodo">
      <div
        className={[
          "cc-nodo-fila",
          esSeleccionada ? "cc-nodo-activo" : "",
          esPadreActivo ? "cc-nodo-padre-activo" : "",
          `nivel-${Math.min(nivel, 5)}`,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => {
          if (tieneHijos) onToggle(nodo.codigo);
          onSeleccionar(nodo);
        }}
      >
        {/* Toggle expand */}
        <span className="cc-nodo-toggle">
          {tieneHijos ? (
            expandido ? (
              <ChevronDown size={10} />
            ) : (
              <ChevronRight size={10} />
            )
          ) : (
            <span className="cc-nodo-leaf" />
          )}
        </span>

        {/* Código */}
        <span className={`cc-nodo-codigo ${!nodo.activa ? "cc-inactiva" : ""}`}>
          {nodo.codigo}
        </span>

        {/* Nombre */}
        <span className="cc-nodo-nombre">
          {nodo.nombre}
          {!nodo.activa && <span className="cc-badge-inactiva">inactiva</span>}
        </span>

        {/* Botón añadir hijo (visible en hover) */}
        {nodo.nivel < 5 && (
          <button
            className="cc-nodo-btn-add"
            title={`Crear cuenta hija de ${nodo.codigo}`}
            onClick={(e) => {
              e.stopPropagation();
              onCrearHijo(nodo);
            }}
          >
            <Plus size={10} />
          </button>
        )}
      </div>

      {/* Hijos */}
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
              onCrearHijo={onCrearHijo}
              modoCrear={modoCrear}
              formCrear={formCrear}
            />
          ))}
        </div>
      )}
    </div>
  );
}
