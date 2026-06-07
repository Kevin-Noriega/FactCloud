import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Calendar,
  BarChart2,
  MoreHorizontal,
  CheckCircle,
  LogOut,
  Printer,
  Settings,
  HelpCircle,
  LayoutGrid,
  DollarSign,
} from "lucide-react";
import { usePos } from "../../../contexts/pos/PosContext";

export function PosSidebar({ onMoreClick }) {
  const { state } = usePos();
  const navigate = useNavigate();
  const hasShift = !!state.currentShift;

  return (
    <aside
      style={{
        width: 68,
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 12,
        gap: 0,
        flexShrink: 0,
        height: "100%",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={() => navigate("/pos")}
        title="FactCloud POS"
      >
        <LayoutGrid size={22} color="#fff" />
      </div>

      {/* Nav items */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
          width: "100%",
        }}
      >
        <SidebarItem
          to="/pos/ventas"
          icon={<ShoppingCart size={20} />}
          label="Ventas"
        />
        <SidebarItem
          to="/pos/turnos"
          icon={<Calendar size={20} />}
          label="Turnos"
        />
        <SidebarItem
          to="/pos/reportes"
          icon={<BarChart2 size={20} />}
          label="Reportes"
        />
        <SidebarItem
          icon={<MoreHorizontal size={20} />}
          label="Más"
          onClick={onMoreClick}
        />
      </nav>

      {/* Bottom: shift status + avatar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          marginTop: "auto",
          paddingTop: 12,
        }}
      >
        {/* Shift indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            padding: "6px 4px",
            borderRadius: 8,
          }}
          onClick={() => navigate("/pos/turnos")}
          title={hasShift ? "Turno abierto" : "Sin turno"}
        >
          <CheckCircle
            size={20}
            color={hasShift ? "#4CAF50" : "#555"}
            fill={hasShift ? "#4CAF5022" : "none"}
          />
          <span
            style={{
              fontSize: 9,
              color: hasShift ? "#4CAF50" : "#666",
              textAlign: "center",
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            {hasShift ? "Turno\\nabierto" : "Sin\\nturno"}
          </span>
        </div>

        {/* User avatar */}
        <UserAvatar />
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, onClick }) {
  const activeStyle = {
    background: "rgba(255,255,255,0.12)",
    borderRadius: 8,
  };

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "8px 0",
    cursor: "pointer",
    borderRadius: 8,
    width: "100%",
    color: "#aaa",
    transition: "all 0.15s",
    textDecoration: "none",
  };

  if (to) {
    return (
      <NavLink
        to={to}
        style={({ isActive }) => ({
          ...baseStyle,
          ...(isActive ? activeStyle : {}),
          color: "inherit",
        })}
      >
        {({ isActive }) => (
          <>
            <span style={{ color: isActive ? "#fff" : "#aaa" }}>{icon}</span>
            <span style={{ fontSize: 10, color: isActive ? "#fff" : "#aaa" }}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      style={{ ...baseStyle, background: "none", border: "none" }}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span style={{ fontSize: 10 }}>{label}</span>
    </button>
  );
}

function UserAvatar() {
  const initials = "JV"; // TODO: get from auth context
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#2D4A8A",
        border: "2px solid #3D5A9A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        cursor: "pointer",
        flexShrink: 0,
      }}
      title="Mi perfil"
    >
      {initials}
    </div>
  );
}

// ─── "Más" panel ──────────────────────────────────────────────────────────────

export function PosMorePanel({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const items = [
    {
      icon: <DollarSign size={20} />,
      label: "Ingresos y retiros de efectivo",
      action: () => navigate("/pos/caja"),
    },
    {
      icon: <Printer size={20} />,
      label: "Configuración de impresión",
      action: () => navigate("/pos/impresion"),
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Ayuda y soporte",
      action: () => navigate("/pos/ayuda"),
    },
    {
      icon: <Settings size={20} />,
      label: "Etiquetas",
      action: () => navigate("/pos/etiquetas"),
    },
    {
      icon: <LayoutGrid size={20} />,
      label: "Módulo administrativo",
      action: () => navigate("/"),
    },
    {
      icon: <LogOut size={20} />,
      label: "Cerrar sesión",
      action: () => { navigate("/login") }
    }
  ];

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 0,
          bottom: 0,
          width: 280,
          background: "#fff",
          zIndex: 200,
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
        }}
      >
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1a1a2e",
            padding: "0 20px 16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          Ajustes
        </p>

        <div style={{ flex: 1, padding: "8px 0" }}>
          {items.map((item, i) => (
            <button
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: item.label === "Cerrar sesión" ? "#e53935" : "#333",
                fontSize: 14,
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              <span
                style={{
                  color: item.label === "Cerrar sesión" ? "#e53935" : "#666",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <p
          style={{
            fontSize: 11,
            color: "#aaa",
            padding: "12px 20px 0",
            textAlign: "center",
          }}
        >
          Versión 1.0.0
        </p>
      </div>
    </>
  );
}
