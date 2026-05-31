import React, { useCallback, useRef } from "react";
import { Search, Plus, RefreshCw, Star } from "lucide-react";
import { usePos } from "../../../contexts/pos/PosContext";
import {
  useDebouncedValue,
  useCurrency,
  useToggleFavorite,
} from "../../../hooks/pos/usePosHooks";

// ─── Search bar ───────────────────────────────────────────────────────────────

export function ProductSearchBar() {
  const { state, dispatch } = usePos();
  const inputRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
    },
    [dispatch],
  );

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
          color: "#666",
          flexShrink: 0,
        }}
        title="Actualizar productos"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
}

// ─── Category filter bar ──────────────────────────────────────────────────────

export function ProductCategoryBar({ categories }) {
  const { state, dispatch } = usePos();

  const allFilters = [
    { id: "favorites", name: "Favoritos" },
    { id: "all", name: "Productos" },
    ...categories,
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        overflowX: "auto",
        flexShrink: 0,
        scrollbarWidth: "none",
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
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

export function ProductCard({ product, onAdd }) {
  const { format } = useCurrency();
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite.mutate(product.id);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
  };

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
