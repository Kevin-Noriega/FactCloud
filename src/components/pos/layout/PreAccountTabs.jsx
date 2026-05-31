import React, { useState, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { usePos } from "../../../contexts/pos/PosContext";

export function PreAccountTabs() {
  const { state, dispatch, activeAccount } = usePos();
  const scrollRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const startEdit = (id, label) => {
    setEditingId(id);
    setEditValue(label);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      dispatch({
        type: "RENAME_PRE_ACCOUNT",
        payload: { id: editingId, label: editValue.trim() },
      });
    }
    setEditingId(null);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "2px solid #e8f0fe",
        background: "#fff",
        minHeight: 46,
        position: "relative",
      }}
    >
      {/* Scroll left */}
      <button
        onClick={() => scroll("left")}
        style={{
          flexShrink: 0,
          padding: "0 8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#666",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Tabs */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          overflowX: "hidden",
          gap: 0,
        }}
      >
        {state.preAccounts.map((acc) => {
          const isActive = acc.id === state.activePreAccountId;
          const itemCount = acc.items.reduce((s, i) => s + i.quantity, 0);

          return (
            <div
              key={acc.id}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_PRE_ACCOUNT", payload: acc.id })
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 14px",
                cursor: "pointer",
                borderBottom: isActive
                  ? "2px solid #1565C0"
                  : "2px solid transparent",
                marginBottom: -2,
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#1565C0" : "#666",
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                whiteSpace: "nowrap",
                minHeight: 44,
                transition: "all 0.15s",
                position: "relative",
              }}
            >
              {editingId === acc.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingId(null);
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    border: "1px solid #1565C0",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 13,
                    width: 120,
                    outline: "none",
                  }}
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startEdit(acc.id, acc.label);
                  }}
                >
                  {acc.label}
                </span>
              )}

              {itemCount > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    background: isActive ? "#1565C0" : "#ccc",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontWeight: 600,
                  }}
                >
                  {itemCount}
                </span>
              )}

              {/* Close button — only show on hover when more than 1 tab */}
              {state.preAccounts.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "REMOVE_PRE_ACCOUNT", payload: acc.id });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#999",
                    padding: "2px",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 2,
                  }}
                  title="Cerrar pre-cuenta"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll right */}
      <button
        onClick={() => scroll("right")}
        style={{
          flexShrink: 0,
          padding: "0 8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#666",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChevronRight size={16} />
      </button>

      {/* Add new pre-account */}
      <button
        onClick={() => dispatch({ type: "ADD_PRE_ACCOUNT" })}
        style={{
          flexShrink: 0,
          padding: "0 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1565C0",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 300,
        }}
        title="Nueva pre-cuenta"
      >
        <Plus size={18} />
      </button>

      {/* Pre-account list */}
      <button
        style={{
          flexShrink: 0,
          padding: "0 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#666",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
        title="Ver todas las pre-cuentas"
      >
        <List size={16} />
      </button>
    </div>
  );
}
