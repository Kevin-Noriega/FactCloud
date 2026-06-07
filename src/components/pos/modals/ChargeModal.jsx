import React, { useState, useEffect } from "react";
import {
  X,
  DollarSign,
  CreditCard,
  Smartphone,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { usePos } from "../../../contexts/pos/PosContext";
import { useCurrency, useCreateSale } from "../../../hooks/pos/usePosHooks";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Efectivo", icon: <DollarSign size={18} /> },
  { value: "CARD", label: "Tarjeta", icon: <CreditCard size={18} /> },
  { value: "TRANSFER", label: "Transferencia", icon: <Smartphone size={18} /> },
  { value: "CREDIT", label: "Crédito", icon: <Clock size={18} /> },
];

// Mapeo de medio de pago del front → desglose que espera el backend.
const METHOD_MAP = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "PagosLinea",
  CREDIT: "Credito",
};

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export function ChargeModal() {
  const { state, dispatch, cartTotal, activeAccount } = usePos();
  const { format } = useCurrency();
  const createSale = useCreateSale();

  const [payments, setPayments] = useState([
    { id: "1", method: "CASH", amount: cartTotal },
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const isProcessing = createSale.isPending;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const change = Math.max(0, totalPaid - cartTotal);
  const remaining = Math.max(0, cartTotal - totalPaid);
  const canCharge =
    totalPaid >= cartTotal && payments.every((p) => p.amount > 0);

  useEffect(() => {
    if (state.isChargeModalOpen) {
      setPayments([{ id: "1", method: "CASH", amount: cartTotal }]);
      setIsSuccess(false);
    }
  }, [state.isChargeModalOpen, cartTotal]);

  if (!state.isChargeModalOpen) return null;

  const updatePayment = (id, field, value) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const addPayment = () => {
    const methodsUsed = new Set(payments.map((p) => p.method));
    const next = PAYMENT_METHODS.find((m) => !methodsUsed.has(m.value));
    if (next && payments.length < 4) {
      setPayments((prev) => [
        ...prev,
        { id: String(Date.now()), method: next.value, amount: remaining },
      ]);
    }
  };

  const removePayment = (id) => {
    if (payments.length > 1) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCharge = async () => {
    const items = (activeAccount?.items ?? []).map((i) => ({
      productoId: /^\d+$/.test(i.product.id) ? Number(i.product.id) : null,
      nombre: i.product.name,
      cantidad: i.quantity,
      precioUnitario: i.unitPrice,
      descuento: i.discount || 0,
    }));
    const pagos = payments.map((p) => ({
      metodo: METHOD_MAP[p.method] || "Otros",
      monto: p.amount,
    }));

    try {
      await createSale.mutateAsync({
        clienteNombre: state.activeClient?.name || "Consumidor Final",
        items,
        pagos,
      });
      setIsSuccess(true);
      setTimeout(() => {
        dispatch({ type: "TOGGLE_CHARGE_MODAL" });
        dispatch({ type: "CLEAR_CART" });
      }, 1600);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo registrar la venta.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing)
          dispatch({ type: "TOGGLE_CHARGE_MODAL" });
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Success state */}
        {isSuccess ? (
          <div
            style={{
              padding: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <CheckCircle size={64} color="#4CAF50" />
            <p style={{ fontSize: 20, fontWeight: 700, color: "#333" }}>
              ¡Venta registrada!
            </p>
            <p style={{ fontSize: 14, color: "#666" }}>
              Cambio: <strong>{format(change)}</strong>
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                background: "#1565C0",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                Cobrar venta
              </p>
              <button
                onClick={() => dispatch({ type: "TOGGLE_CHARGE_MODAL" })}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {/* Total */}
              <div
                style={{
                  background: "#f0f6ff",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#666" }}>
                  Total a cobrar
                </span>
                <span
                  style={{ fontSize: 24, fontWeight: 800, color: "#1565C0" }}
                >
                  {format(cartTotal)}
                </span>
              </div>

              {/* Payments */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {payments.map((payment, idx) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    isOnly={payments.length === 1}
                    onUpdate={(field, value) =>
                      updatePayment(payment.id, field, value)
                    }
                    onRemove={() => removePayment(payment.id)}
                    remaining={remaining}
                    isCash={payment.method === "CASH"}
                    cartTotal={cartTotal}
                  />
                ))}
              </div>

              {/* Add payment method */}
              {payments.length < 4 && (
                <button
                  onClick={addPayment}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "1.5px dashed #c5d8f5",
                    borderRadius: 8,
                    padding: "8px 14px",
                    cursor: "pointer",
                    color: "#1565C0",
                    fontSize: 13,
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Plus size={14} />
                  Agregar otro medio de pago
                </button>
              )}

              {/* Summary */}
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>
                    Total pagado
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: totalPaid >= cartTotal ? "#2e7d32" : "#e53935",
                    }}
                  >
                    {format(totalPaid)}
                  </span>
                </div>
                {change > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: 13, color: "#666" }}>Cambio</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1565C0",
                      }}
                    >
                      {format(change)}
                    </span>
                  </div>
                )}
                {remaining > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: 13, color: "#e53935" }}>
                      Falta
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#e53935",
                      }}
                    >
                      {format(remaining)}
                    </span>
                  </div>
                )}
              </div>

              {/* Charge button */}
              <button
                onClick={handleCharge}
                disabled={!canCharge || isProcessing}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: canCharge ? "#1565C0" : "#ccc",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: canCharge ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isProcessing ? (
                  <>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Procesando...
                  </>
                ) : (
                  `Cobrar ${format(cartTotal)}`
                )}
              </button>
            </div>
          </>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}

// ─── Payment row ──────────────────────────────────────────────────────────────

function PaymentRow({
  payment,
  isOnly,
  onUpdate,
  onRemove,
  remaining,
  isCash,
  cartTotal,
}) {
  const { format } = useCurrency();

  return (
    <div
      style={{
        border: "1.5px solid #e0e7ef",
        borderRadius: 10,
        padding: 14,
        background: "#fafbff",
      }}
    >
      {/* Method selector */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}
      >
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.value}
            onClick={() => onUpdate("method", m.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 6,
              border: "1.5px solid",
              borderColor: payment.method === m.value ? "#1565C0" : "#e0e7ef",
              background: payment.method === m.value ? "#e3f0ff" : "#fff",
              color: payment.method === m.value ? "#1565C0" : "#666",
              fontSize: 12,
              fontWeight: payment.method === m.value ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            border: "1.5px solid #e0e7ef",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              padding: "0 10px",
              fontSize: 14,
              fontWeight: 600,
              color: "#999",
              borderRight: "1px solid #e0e7ef",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            $
          </span>
          <input
            type="number"
            value={payment.amount}
            onChange={(e) =>
              onUpdate("amount", parseFloat(e.target.value) || 0)
            }
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "10px 10px",
              fontSize: 16,
              fontWeight: 700,
              color: "#333",
            }}
          />
        </div>

        {!isOnly && (
          <button
            onClick={onRemove}
            style={{
              background: "none",
              border: "1.5px solid #fecdd3",
              borderRadius: 8,
              cursor: "pointer",
              color: "#e53935",
              padding: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Quick amounts for cash */}
      {isCash && (
        <div
          style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
        >
          <button
            onClick={() => onUpdate("amount", cartTotal)}
            style={{
              fontSize: 11,
              padding: "3px 8px",
              border: "1px solid #e0e7ef",
              borderRadius: 4,
              background: "#fff",
              cursor: "pointer",
              color: "#555",
            }}
          >
            Exacto
          </button>
          {[50000, 100000, 200000].map((amt) => (
            <button
              key={amt}
              onClick={() => onUpdate("amount", amt)}
              style={{
                fontSize: 11,
                padding: "3px 8px",
                border: "1px solid #e0e7ef",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {format(amt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
