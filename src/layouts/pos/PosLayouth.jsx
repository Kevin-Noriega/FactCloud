import React, { useState } from "react";
import {
  PosSidebar,
  PosMorePanel,
} from "../../components/pos/layout/PosSidebar";
import { PosProvider } from "../../contexts/pos/PosContext";

export function PosLayout({ children }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <PosProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "#f5f7fa",
          position: "relative",
        }}
      >
        {/* Sidebar */}
        <PosSidebar onMoreClick={() => setIsMoreOpen(true)} />

        {/* More panel overlay */}
        <PosMorePanel
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
        />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </main>
      </div>
    </PosProvider>
  );
}
