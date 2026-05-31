import React, { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  UserPlus,
  X,
  Tag,
} from "lucide-react";
import { usePos } from "../../../contexts/pos/PosContext";
import { useCurrency } from "../../../hooks/pos/usePosHooks";

// ─── Client selector ──────────────────────────────────────────────────────────

function ClientSelector() {
  const { activeAccount, dispatch } = usePos();
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid #f0f0f0",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Search size={14} color="#999" />
      <input
        placeholder={activeAccount.clientName || "Consumidor Final"}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 13,
          color: "#333",
          background: "none",
        }}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setTimeout(() => setIsSearching(false), 200)}
      />
      <button
        onClick={() => dispatch({ type: "TOGGLE_NEW_CLIENT_MODAL" })}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1565C0",
          padding: 2,
          display: "flex",
          alignItems: "center",
        }}
        title="Crear cliente"
      >
        <UserPlus size={16} />
      </button>
    </div>
  );
}

// ─── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({ item }) {
  const { dispatch } = usePos();
  const { format } = useCurrency();
  const [showNote, setShowNote] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  const discountedPrice = item.unitPrice * (1 - item.discount / 100);
  const lineTotal = discountedPrice * item.quantity;

  const updateQty = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: item.product.id });
    } else {
      dispatch({
        type: "UPDATE_ITEM_QUANTITY",
        payload: { productId: item.product.id, quantity: newQty },
      });
    }
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #f5f5f5",
        padding: "10px 14px",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {/* Initials */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "#e3f0ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#1a4f8a",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {item.product.initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#333",
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.product.name}
          </p>
          <p style={{ fontSize: 11, color: "#999" }}>{item.product.sku}</p>

          {/* Discount indicator */}
          {item.discount > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#999",
                  textDecoration: "line-through",
                }}
              >
                {format(item.unitPrice)}
              </span>
              <span
                style={{
                  fontSize: 10,
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "1px 5px",
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                -{item.discount}%
              </span>
            </div>
          )}
        </div>

        {/* Remove */}
        <button
          onClick={() =>
            dispatch({ type: "REMOVE_FROM_CART", payload: item.product.id })
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ddd",
            padding: 2,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#ddd")}
        >
          <X size={14} />
        </button>
      </div>

      {/* Quantity + price row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {/* Qty stepper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            border: "1.5px solid #e0e7ef",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => updateQty(-1)}
            style={{
              width: 26,
              height: 26,
              background: "#f5f7fa",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
            }}
          >
            <Minus size={12} />
          </button>
          <input
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0) {
                dispatch({
                  type: "UPDATE_ITEM_QUANTITY",
                  payload: { productId: item.product.id, quantity: val },
                });
              }
            }}
            style={{
              width: 36,
              textAlign: "center",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              outline: "none",
              background: "#fff",
              height: 26,
            }}
          />
          <button
            onClick={() => updateQty(1)}
            style={{
              width: 26,
              height: 26,
              background: "#f5f7fa",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Line total */}
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1565C0" }}>
          {format(lineTotal)}
        </p>
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          onClick={() => setShowDiscount(!showDiscount)}
          style={{
            fontSize: 11,
            color: "#1565C0",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Tag size={11} />
          Descuento
        </button>
        <button
          onClick={() => setShowNote(!showNote)}
          style={{
            fontSize: 11,
            color: "#666",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          + Nota
        </button>
      </div>

      {/* Discount input */}
      {showDiscount && (
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <input
            type="number"
            min={0}
            max={100}
            value={item.discount}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_ITEM_DISCOUNT",
                payload: {
                  productId: item.product.id,
                  discount: parseFloat(e.target.value) || 0,
                },
              })
            }
            style={{
              width: 60,
              border: "1.5px solid #e0e7ef",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 13,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 12, color: "#666" }}>% descuento</span>
        </div>
      )}

      {/* Note input */}
      {showNote && (
        <input
          value={item.note}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_ITEM_NOTE",
              payload: { productId: item.product.id, note: e.target.value },
            })
          }
          placeholder="Agregar nota al ítem..."
          style={{
            marginTop: 6,
            width: "100%",
            border: "1.5px solid #e0e7ef",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 12,
            outline: "none",
            color: "#555",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

// ─── Cart totals ──────────────────────────────────────────────────────────────

function CartTotals() {
  const { cartSubtotal, cartTax, cartTotal } = usePos();
  const { format } = useCurrency();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        padding: "10px 14px",
        borderTop: "1px solid #e8f0fe",
        background: "#f8fbff",
      }}
    >
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: showDetails ? 8 : 0,
        }}
      >
        <span style={{ fontSize: 12, color: "#666" }}>Ver resumen</span>
        {showDetails ? (
          <ChevronUp size={14} color="#666" />
        ) : (
          <ChevronDown size={14} color="#666" />
        )}
      </button>

      {showDetails && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#666" }}>Subtotal</span>
            <span style={{ fontSize: 12, color: "#333", fontWeight: 500 }}>
              {format(cartSubtotal)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#666" }}>IVA</span>
            <span style={{ fontSize: 12, color: "#333", fontWeight: 500 }}>
              {format(cartTax)}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>
          Total
        </span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1565C0" }}>
          {format(cartTotal)}
        </span>
      </div>
    </div>
  );
}

// ─── Document type selector ───────────────────────────────────────────────────

function DocumentTypeSelector() {
  const { activeAccount, dispatch } = usePos();

  const options = [
    { value: "FACTURA_ELECTRONICA", label: "Factura electrónica de venta" },
    { value: "DOCUMENTO_SOPORTE", label: "Documento soporte" },
    { value: "TIQUETE_POS", label: "Tiquete POS" },
  ];

  return (
    <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
      <label
        style={{
          fontSize: 11,
          color: "#999",
          display: "block",
          marginBottom: 4,
        }}
      >
        Tipo de comprobante <span style={{ color: "#e53935" }}>*</span>
      </label>
      <select
        value={activeAccount.documentType}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_PRE_ACCOUNT_DOCUMENT_TYPE",
            payload: {
              id: activeAccount.id,
              documentType: e.target.value,
            },
          })
        }
        style={{
          width: "100%",
          border: "1.5px solid #e0e7ef",
          borderRadius: 6,
          padding: "6px 10px",
          fontSize: 13,
          color: "#333",
          background: "#fff",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Vendor selector ──────────────────────────────────────────────────────────

function VendorSelector() {
  const { activeAccount } = usePos();

  return (
    <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
      <label
        style={{
          fontSize: 11,
          color: "#999",
          display: "block",
          marginBottom: 4,
        }}
      >
        Vendedor <span style={{ color: "#e53935" }}>*</span>
      </label>
      <select
        defaultValue={activeAccount.vendorId ?? ""}
        style={{
          width: "100%",
          border: "1.5px solid #e0e7ef",
          borderRadius: 6,
          padding: "6px 10px",
          fontSize: 13,
          color: "#333",
          background: "#fff",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">Seleccionar vendedor</option>
        <option value="1">JHON ELKIN VARGAS PRADO</option>
      </select>
    </div>
  );
}

// ─── Cart empty state ─────────────────────────────────────────────────────────

function CartEmpty() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        color: "#bbb",
      }}
    >
      <ShoppingCart size={48} strokeWidth={1} />
      <p style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>
        Aún no tienes productos en el carrito
      </p>
    </div>
  );
}

// ─── Main cart sidebar ────────────────────────────────────────────────────────

export function CartSidebar() {
  const { activeAccount, dispatch, cartItemCount } = usePos();
  const hasItems = activeAccount.items.length > 0;

  return (
    <aside
      style={{
        width: 300,
        flexShrink: 0,
        background: "#fff",
        borderLeft: "1px solid #e8f0fe",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Top section: doc type, vendor, client */}
      <DocumentTypeSelector />
      <VendorSelector />
      <ClientSelector />

      {/* Items list */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {hasItems ? (
          activeAccount.items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))
        ) : (
          <CartEmpty />
        )}
      </div>

      {/* Totals */}
      {hasItems && <CartTotals />}

      {/* Actions */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => dispatch({ type: "SAVE_PRE_ACCOUNT" })}
            disabled={!hasItems}
            style={{
              flex: 1,
              padding: "10px",
              border: "1.5px solid #e0e7ef",
              borderRadius: 8,
              background: "#fff",
              color: "#555",
              fontSize: 13,
              fontWeight: 500,
              cursor: hasItems ? "pointer" : "not-allowed",
              opacity: hasItems ? 1 : 0.5,
            }}
          >
            Actualizar Pre-cuenta
          </button>
        </div>

        <button
          onClick={() => {
            if (hasItems) dispatch({ type: "TOGGLE_CHARGE_MODAL" });
          }}
          disabled={!hasItems}
          style={{
            width: "100%",
            padding: "12px",
            background: hasItems ? "#1565C0" : "#ccc",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: hasItems ? "pointer" : "not-allowed",
            transition: "background 0.15s",
            letterSpacing: 0.5,
          }}
          onMouseEnter={(e) => {
            if (hasItems) e.currentTarget.style.background = "#0D47A1";
          }}
          onMouseLeave={(e) => {
            if (hasItems) e.currentTarget.style.background = "#1565C0";
          }}
        >
          Cobrar
        </button>
      </div>
    </aside>
  );
}
