import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  RefreshCw,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePos } from "../../../contexts/pos/PosContext";
import {
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import {
  useCurrency,
  useToggleFavorite,
  useAddStock,
} from "../../../hooks/pos/usePosHooks";

// ─── Search bar ───────────────────────────────────────────────────────────────

export function ProductSearchBar() {
  const { state, dispatch } = usePos();
  const qc = useQueryClient();
  const inputRef = useRef(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");

  const handleChange = useCallback(
    (e) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
    },
    [dispatch],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await qc.invalidateQueries({ queryKey: ["pos", "products"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [qc]);

  const handleAddManual = useCallback(() => {
    const name = manualName.trim();
    const price = Number(manualPrice);
    if (!name || !Number.isFinite(price) || price <= 0) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: `manual-${Date.now()}`,
        name,
        sku: "MANUAL",
        barcode: null,
        price,
        taxRate: 0,
        stock: 0,
        category: null,
        isService: true,
        isFavorite: false,
        imageUrl: null,
        initials: name.slice(0, 2).toUpperCase(),
      },
    });

    setManualName("");
    setManualPrice("");
    setManualOpen(false);
  }, [dispatch, manualName, manualPrice]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: 1,
          background: "#f5f7fa",
          border: "1.5px solid #e0e7ef",
          borderRadius: 8,
          padding: "0 14px",
          height: 40,
        }}
      >
        <Search size={16} color="#999" />
        <input
          ref={inputRef}
          value={state.searchQuery}
          onChange={handleChange}
          placeholder="Buscar por Producto, Referencia o Código"
          style={{
            flex: 1,
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 14,
            color: "#333",
          }}
        />
      </div>

      <button
        onClick={() => setManualOpen(true)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: "1.5px solid #e0e7ef",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1565C0",
          flexShrink: 0,
        }}
        title="Agregar producto manual"
      >
        <Plus size={18} />
      </button>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: "1.5px solid #e0e7ef",
          background: "#fff",
          cursor: isRefreshing ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          flexShrink: 0,
        }}
        title="Actualizar productos"
      >
        <RefreshCw
          size={16}
          style={{
            animation: isRefreshing ? "spin 0.8s linear infinite" : "none",
          }}
        />
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Dialog open={manualOpen} onClose={() => setManualOpen(false)}>
        <DialogTitle>Agregar producto manual</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important", minWidth: 320 }}
        >
          <TextField
            label="Nombre del producto"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Precio"
            type="number"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            inputProps={{ min: 0, step: "any" }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAddManual}
            variant="contained"
            disabled={!manualName.trim() || !(Number(manualPrice) > 0)}
          >
            Agregar al carrito
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Category filter bar ──────────────────────────────────────────────────────

export function ProductCategoryBar({ categories }) {
  const { state, dispatch } = usePos();
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const allFilters = [
    { id: "favorites", name: "Favoritos" },
    { id: "all", name: "Productos" },
    ...categories,
  ];

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "10px 12px",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0,
      }}
    >
      <CatArrow dir="left" disabled={!canLeft} onClick={() => scroll(-1)} />

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          flex: 1,
        }}
      >
        {allFilters.map((filter) => {
          const isActive = state.activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => dispatch({ type: "SET_FILTER", payload: filter.id })}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: isActive ? "none" : "1.5px solid #e0e7ef",
                background: isActive ? "#1565C0" : "#fff",
                color: isActive ? "#fff" : "#555",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
              }}
            >
              {filter.id === "favorites" && (
                <Star size={12} fill={isActive ? "#fff" : "none"} />
              )}
              {filter.name}
            </button>
          );
        })}
      </div>

      <CatArrow dir="right" disabled={!canRight} onClick={() => scroll(1)} />
    </div>
  );
}

function CatArrow({ dir, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={dir === "left" ? "Anterior" : "Siguiente"}
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "1.5px solid #e0e7ef",
        background: "#fff",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: disabled ? "#ccc" : "#1565C0",
        flexShrink: 0,
      }}
    >
      {dir === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

const qtyBtnStyle = {
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f5f7fa",
  border: "none",
  cursor: "pointer",
  color: "#1565C0",
};

export function ProductCard({ product, onAdd }) {
  const { format } = useCurrency();
  const toggleFavorite = useToggleFavorite();
  const addStock = useAddStock();
  const { dispatch } = usePos();
  const [openDetail, setOpenDetail] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showAddStock, setShowAddStock] = useState(false);
  const [addStockValue, setAddStockValue] = useState("");

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setQuantity(1);
    setShowAddStock(false);
    setAddStockValue("");
    setOpenDetail(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite.mutate(product.id);
  };

  const handleAddUnits = () => {
    dispatch({ type: "ADD_TO_CART_QTY", payload: { product, quantity } });
    setOpenDetail(false);
    setQuantity(1);
  };

  const handleConfirmAddStock = () => {
    const cant = parseInt(addStockValue, 10);
    if (!Number.isFinite(cant) || cant <= 0) return;
    addStock.mutate(
      { productId: Number(product.id), cantidad: cant },
      {
        onSuccess: () => {
          setAddStockValue("");
          setShowAddStock(false);
        },
        onError: (err) =>
          alert(err.response?.data?.message || "No se pudo añadir stock"),
      },
    );
  };

  const saldo = Number(product.stock) || 0;

  return (
    <div
      onClick={() => onAdd(product)}
      style={{
        background: "#fff",
        border: "1.5px solid #e8f0fe",
        borderRadius: 10,
        padding: "12px 12px 10px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        transition: "all 0.15s",
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#1565C0";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(21,101,192,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e8f0fe";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* More options button */}
      <button
        onClick={handleMoreClick}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#aaa",
          padding: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ⋮
      </button>
      <Drawer
        anchor="right"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 380,
            maxWidth: "92vw",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "20px 24px 12px",
              borderBottom: "1px solid #eef2f7",
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1565C0", margin: "0 0 4px" }}>
                {product.name}
              </h2>
              <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
                Cód: {product.sku}
                {product.barcode ? ` · ${product.barcode}` : ""}
              </p>
            </div>
            <button
              onClick={() => setOpenDetail(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1565C0" }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
            {/* Precio + selector de cantidad */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: "#333" }}>
                {format(product.price)}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #e0e7ef",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={qtyBtnStyle}
                  title="Quitar"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  style={{
                    width: 56,
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#333",
                    MozAppearance: "textfield",
                  }}
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={qtyBtnStyle}
                  title="Agregar"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {product.category && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                <span style={{ color: "#888" }}>Categoría</span>
                <strong style={{ color: "#333" }}>{product.category}</strong>
              </div>
            )}

            {/* Información de bodegas (solo productos) */}
            {!product.isService ? (
              <div style={{ marginTop: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: "0 0 10px" }}>
                  Información de bodegas
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1.5px solid #e8f0fe",
                    borderRadius: 8,
                    padding: "12px 14px",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#333" }}>Sin asignar</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: saldo < 0 ? "#e53935" : saldo === 0 ? "#FF9800" : "#2e7d32",
                    }}
                  >
                    Saldo: {saldo.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Añadir stock al inventario */}
                {showAddStock ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <input
                      type="number"
                      min={1}
                      autoFocus
                      value={addStockValue}
                      onChange={(e) => setAddStockValue(e.target.value)}
                      placeholder="Unidades a añadir"
                      style={{
                        flex: 1,
                        border: "1.5px solid #e0e7ef",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleConfirmAddStock}
                      disabled={addStock.isPending}
                      style={{
                        background: "#1565C0",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0 14px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {addStock.isPending ? "..." : "Guardar"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddStock(false);
                        setAddStockValue("");
                      }}
                      style={{
                        background: "none",
                        border: "1.5px solid #e0e7ef",
                        borderRadius: 8,
                        padding: "0 10px",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddStock(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "none",
                      border: "none",
                      color: "#1565C0",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: 10,
                      padding: 0,
                    }}
                  >
                    <Plus size={15} /> Añadir stock al inventario
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#888" }}>Tipo</span>
                <strong style={{ color: "#333" }}>Servicio</strong>
              </div>
            )}
          </div>

          {/* Footer: añadir al carrito */}
          <div style={{ padding: "14px 24px", borderTop: "1px solid #eef2f7" }}>
            <button
              onClick={handleAddUnits}
              style={{
                width: "100%",
                background: "#1565C0",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Añadir unidades
            </button>
          </div>
        </div>
      </Drawer>

      {/* Initials avatar */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          maxHeight: 80,
          background: "linear-gradient(135deg, #e3f0ff 0%, #c8deff 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "#1a4f8a",
          letterSpacing: 1,
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          product.initials
        )}
      </div>

      {/* Product info */}
      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#333",
            lineHeight: 1.3,
            marginBottom: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </p>
        <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>
          {product.sku}
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1565C0" }}>
          {format(product.price)}
        </p>
      </div>

      {/* Stock indicator */}
      {!product.isService && (
        <div
          style={{
            fontSize: 10,
            color:
              product.stock > 5
                ? "#4CAF50"
                : product.stock > 0
                  ? "#FF9800"
                  : "#e53935",
            fontWeight: 500,
          }}
        >
          {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
        </div>
      )}

      {/* Favorite */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: "absolute",
          bottom: 8,
          right: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
        }}
        title={product.isFavorite ? "Quitar favorito" : "Agregar a favoritos"}
      >
        <Star
          size={14}
          color={product.isFavorite ? "#FFC107" : "#ccc"}
          fill={product.isFavorite ? "#FFC107" : "none"}
        />
      </button>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #f0f0f0",
        borderRadius: 10,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          maxHeight: 80,
          background: "#f0f0f0",
          borderRadius: 8,
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          height: 10,
          background: "#f0f0f0",
          borderRadius: 4,
          width: "70%",
        }}
      />
      <div
        style={{
          height: 8,
          background: "#f0f0f0",
          borderRadius: 4,
          width: "40%",
        }}
      />
      <div
        style={{
          height: 12,
          background: "#f0f0f0",
          borderRadius: 4,
          width: "55%",
        }}
      />
    </div>
  );
}

// ─── Product grid ─────────────────────────────────────────────────────────────

export function ProductGrid({ categories }) {
  const { state, dispatch, filteredProducts } = usePos();

  const handleAdd = useCallback(
    (product) => {
      dispatch({ type: "ADD_TO_CART", payload: product });
    },
    [dispatch],
  );

  if (state.isLoadingProducts) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 12,
          padding: "12px 16px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          gap: 12,
          padding: 40,
        }}
      >
        <Search size={48} strokeWidth={1} />
        <p style={{ fontSize: 15, fontWeight: 500, color: "#555" }}>
          No se encontraron productos
        </p>
        <p style={{ fontSize: 13, textAlign: "center" }}>
          Intenta con otro nombre, referencia o código de barras
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        gap: 12,
        padding: "12px 16px",
        overflowY: "auto",
        flex: 1,
        alignContent: "start",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={handleAdd} />
      ))}
    </div>
  );
}
