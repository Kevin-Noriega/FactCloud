import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PlanGuard } from "./PlanGuard";
import { PosLayout } from "../layouts/pos/PosLayouth";

const PosMainPage = lazy(() => import("../pages/pos/PosMainPage"));
const PosShiftsPage = lazy(() => import("../pages/pos/PosShiftsPage"));
const PosReportsPage = lazy(() => import("../pages/pos/PosReportPage"));

function PosLoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 12,
        color: "#666",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: "2px solid #e0e7ef",
          borderTopColor: "#1565C0",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Cargando módulo POS...
    </div>
  );
}

export function PosRoutes() {
  return (
    <PlanGuard>
      <PosLayout>
        <Suspense fallback={<PosLoadingFallback />}>
          <Routes>
            <Route index element={<Navigate to="ventas" replace />} />
            <Route path="ventas" element={<PosMainPage />} />
            <Route path="turnos" element={<PosShiftsPage />} />
            <Route path="reportes" element={<PosReportsPage />} />
            <Route path="*" element={<Navigate to="ventas" replace />} />
          </Routes>
        </Suspense>
      </PosLayout>
    </PlanGuard>
  );
}
