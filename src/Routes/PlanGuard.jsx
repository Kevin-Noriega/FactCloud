import React from "react";
import { Navigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function PlanGuard({ children }) {
  const { usuario, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e0e7ef",
            borderTopColor: "#1565C0",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Regla: si el plan tiene POS, entra sin más validaciones
  const tienePos = !!usuario.tienePos;
  if (!tienePos) {
    return <NoPosAccessScreen />;
  }

  return <>{children}</>;
}

// ─── Pantalla “no tiene POS” ────────────────────────────────────────────────

function NoPosAccessScreen() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 40,
        background: "#f8fbff",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#e3f0ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingCart size={36} color="#1565C0" />
        </div>

        <h2
          style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}
        >
          Tu plan no incluye POS
        </h2>

        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, margin: 0 }}>
          El módulo POS está disponible en el plan{" "}
          <strong>Facturación + POS</strong>. Actualiza tu plan para empezar a
          vender desde el punto de venta.
        </p>

        <a
          href="/planes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#1565C0",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 600,
            transition: "background 0.15s",
          }}
        >
          Actualizar plan
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
