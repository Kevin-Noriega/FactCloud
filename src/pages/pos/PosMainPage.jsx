import React, { useCallback } from "react";
import { PreAccountTabs } from "../../components/pos/layout/PreAccountTabs";
import {
  ProductSearchBar,
  ProductCategoryBar,
  ProductGrid,
} from "../../components/pos/products/ProductGrid";
import { CartSidebar } from "../../components/pos/cart/CartSidebar";
import { ChargeModal } from "../../components/pos/modals/ChargeModal";
import { usePos } from "../../contexts/pos/PosContext";
import {
  usePosProducts,
  usePosCategories,
  useBarcodeScanner,
} from "../../hooks/pos/usePosHooks";
import { posProductsApi } from "../../Service/pos/posApi";

// ─── POS Main Page ────────────────────────────────────────────────────────────

export default function PosMainPage() {
  const { dispatch } = usePos();

  // Productos y categorías reales del usuario autenticado (backend /api/pos/products)
  usePosProducts();
  const { data: categories } = usePosCategories();

  // Barcode scanner support
  const handleBarcodeScan = useCallback(
    async (barcode) => {
      try {
        const product = await posProductsApi.getByBarcode(barcode);
        if (product) {
          dispatch({ type: "ADD_TO_CART", payload: product });
        }
      } catch {
        // Product not found by barcode — show toast in future
        console.warn("Product not found for barcode:", barcode);
      }
    },
    [dispatch],
  );

  useBarcodeScanner(handleBarcodeScan);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Pre-account tabs */}
      <PreAccountTabs />

      {/* Main area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Products panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Search */}
          <ProductSearchBar />

          {/* Category filter (con flechas de desplazamiento) */}
          <ProductCategoryBar categories={categories ?? []} />

          {/* Product grid */}
          <ProductGrid categories={categories ?? []} />
        </div>

        {/* Cart sidebar */}
        <CartSidebar />
      </div>

      {/* Charge modal */}
      <ChargeModal />
    </div>
  );
}
