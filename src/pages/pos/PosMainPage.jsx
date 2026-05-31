import React, { useEffect, useCallback } from "react";
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

// ─── Mock data loader (remove once backend is connected) ──────────────────────

function useMockProducts() {
  const { dispatch } = usePos();

  useEffect(() => {
    dispatch({ type: "SET_LOADING_PRODUCTS", payload: true });

    const mockProducts = [
      {
        id: "1",
        name: "Boquilla 2kl",
        sku: "543",
        price: 14000,
        taxRate: 0.19,
        stock: 48,
        category: "materiales",
        initials: "B2",
        isFavorite: false,
        isService: false,
      },
      {
        id: "2",
        name: "Perfiles Wim Ceramica Pe1",
        sku: "Pe1",
        price: 18000,
        taxRate: 0.19,
        stock: 12,
        category: "materiales",
        initials: "PW",
        isFavorite: false,
        isService: false,
      },
      {
        id: "3",
        name: "Pegante Master",
        sku: "098",
        price: 14000,
        taxRate: 0.19,
        stock: 25,
        category: "pegantes",
        initials: "PM",
        isFavorite: true,
        isService: false,
      },
      {
        id: "4",
        name: "Sanitarios",
        sku: "Sa",
        price: 450000,
        taxRate: 0.19,
        stock: 5,
        category: "sanitarios",
        initials: "S",
        isFavorite: false,
        isService: false,
      },
      {
        id: "5",
        name: "Cerámica - Piso x caja Cer1",
        sku: "Cer1",
        price: 74000,
        taxRate: 0.19,
        stock: 18,
        category: "ceramicas",
        initials: "C-",
        isFavorite: false,
        isService: false,
      },
      {
        id: "6",
        name: "Adaptador Macho Codelca",
        sku: "3212",
        price: 4500,
        taxRate: 0.19,
        stock: 100,
        category: "accesorios",
        initials: "AM",
        isFavorite: false,
        isService: false,
      },
      {
        id: "7",
        name: "Cerámica - Pared x Caja",
        sku: "5434",
        price: 40000,
        taxRate: 0.19,
        stock: 22,
        category: "ceramicas",
        initials: "C-",
        isFavorite: true,
        isService: false,
      },
      {
        id: "8",
        name: "Pegamaster",
        sku: "4321",
        price: 12000,
        taxRate: 0.19,
        stock: 30,
        category: "pegantes",
        initials: "P",
        isFavorite: false,
        isService: false,
      },
      {
        id: "9",
        name: "Hembra Codelca",
        sku: "432",
        price: 6500,
        taxRate: 0.19,
        stock: 75,
        category: "accesorios",
        initials: "HC",
        isFavorite: false,
        isService: false,
      },
      {
        id: "10",
        name: "Cemento Blanco x Kilo",
        sku: "321",
        price: 3000,
        taxRate: 0.19,
        stock: 0,
        category: "materiales",
        initials: "CB",
        isFavorite: false,
        isService: false,
      },
      {
        id: "11",
        name: "Hierro Ø 3/8 x 6m",
        sku: "H38",
        price: 28000,
        taxRate: 0.19,
        stock: 15,
        category: "materiales",
        initials: "HP",
        isFavorite: false,
        isService: false,
      },
      {
        id: "12",
        name: "Adoquín Prefabricado",
        sku: "ADQ",
        price: 1200,
        taxRate: 0.19,
        stock: 500,
        category: "materiales",
        initials: "AD",
        isFavorite: true,
        isService: false,
      },
      {
        id: "13",
        name: "Junta de Expansión",
        sku: "JE1",
        price: 8500,
        taxRate: 0.19,
        stock: 40,
        category: "accesorios",
        initials: "JB",
        isFavorite: false,
        isService: false,
      },
      {
        id: "14",
        name: "Ceramita Trio Soldado",
        sku: "CTS",
        price: 55000,
        taxRate: 0.19,
        stock: 8,
        category: "ceramicas",
        initials: "CT",
        isFavorite: false,
        isService: false,
      },
      {
        id: "15",
        name: "Lamina Yeso Cartón",
        sku: "LYC",
        price: 32000,
        taxRate: 0.19,
        stock: 20,
        category: "materiales",
        initials: "L-",
        isFavorite: false,
        isService: false,
      },
    ];

    setTimeout(() => {
      dispatch({ type: "SET_PRODUCTS", payload: mockProducts });
      dispatch({ type: "SET_LOADING_PRODUCTS", payload: false });
    }, 600);
  }, [dispatch]);
}

const MOCK_CATEGORIES = [
  { id: "materiales", name: "Materiales" },
  { id: "ceramicas", name: "Cerámicas" },
  { id: "pegantes", name: "Pegantes" },
  { id: "sanitarios", name: "Sanitarios" },
  { id: "accesorios", name: "Accesorios" },
];

// ─── POS Main Page ────────────────────────────────────────────────────────────

export default function PosMainPage() {
  const { dispatch, state } = usePos();

  // Use mock data until backend is connected
  // TODO: Replace with real hooks once backend is ready:
  //   usePosProducts();
  //   const { data: categories } = usePosCategories();
  useMockProducts();

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

          {/* Category filter */}
          <ProductCategoryBar categories={MOCK_CATEGORIES} />

          {/* Grid nav arrows row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1.5px solid #e0e7ef",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                fontSize: 16,
              }}
              title="Anterior"
            >
              ‹
            </button>
            <div style={{ flex: 1 }} />
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1.5px solid #e0e7ef",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                fontSize: 16,
              }}
              title="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Product grid */}
          <ProductGrid categories={MOCK_CATEGORIES} />
        </div>

        {/* Cart sidebar */}
        <CartSidebar />
      </div>

      {/* Charge modal */}
      <ChargeModal />
    </div>
  );
}
