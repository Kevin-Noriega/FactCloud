import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Los favoritos no se persisten en el backend (ver PosController.MapToPos),
// así que el front los mantiene en localStorage por usuario/dispositivo.
const FAVORITES_KEY = "pos_favorite_ids";

function loadFavoriteIds() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveFavoriteIds(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage no disponible (modo privado / SSR): se ignora.
  }
}

function newPreAccount(index) {
  return {
    id: `pre-${Date.now()}-${index}`,
    label: `Pre-cuenta ${index}`,
    items: [],
    clientName: "Consumidor Final",
    vendorName: "",
    documentType: "FACTURA_ELECTRONICA",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getInitialState() {
  const first = newPreAccount(1);
  return {
    preAccounts: [first],
    activePreAccountId: first.id,
    searchQuery: "",
    activeFilter: "all",
    products: [],
    isLoadingProducts: false,
    activeClient: { name: "Consumidor Final" },
    currentShift: null,
    isChargeModalOpen: false,
    isNewClientModalOpen: false,
    isSidebarCollapsed: false,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function posReducer(state, action) {
  const updateActiveAccount = (updater) => ({
    ...state,
    preAccounts: state.preAccounts.map((acc) =>
      acc.id === state.activePreAccountId ? updater(acc) : acc,
    ),
  });

  const activeAccount = state.preAccounts.find(
    (a) => a.id === state.activePreAccountId,
  );

  switch (action.type) {
    case "SET_PRODUCTS": {
      // Re-aplicamos los favoritos guardados localmente al refrescar productos,
      // ya que el backend siempre devuelve isFavorite: false.
      const favs = loadFavoriteIds();
      return {
        ...state,
        products: action.payload.map((p) => ({
          ...p,
          isFavorite: favs.has(p.id),
        })),
      };
    }

    case "SET_LOADING_PRODUCTS":
      return { ...state, isLoadingProducts: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_FILTER":
      return { ...state, activeFilter: action.payload, searchQuery: "" };

    case "ADD_TO_CART": {
      const product = action.payload;
      const existing = activeAccount.items.find(
        (i) => i.product.id === product.id,
      );
      const updatedItems = existing
        ? activeAccount.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [
            ...activeAccount.items,
            {
              product,
              quantity: 1,
              unitPrice: product.price,
              discount: 0,
              note: "",
            },
          ];
      return updateActiveAccount((acc) => ({
        ...acc,
        items: updatedItems,
        updatedAt: new Date(),
      }));
    }

    case "ADD_TO_CART_QTY": {
      const { product, quantity } = action.payload;
      const qty = Math.max(1, Math.floor(quantity) || 1);
      const existing = activeAccount.items.find(
        (i) => i.product.id === product.id,
      );
      const updatedItems = existing
        ? activeAccount.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          )
        : [
            ...activeAccount.items,
            {
              product,
              quantity: qty,
              unitPrice: product.price,
              discount: 0,
              note: "",
            },
          ];
      return updateActiveAccount((acc) => ({
        ...acc,
        items: updatedItems,
        updatedAt: new Date(),
      }));
    }

    case "REMOVE_FROM_CART":
      return updateActiveAccount((acc) => ({
        ...acc,
        items: acc.items.filter((i) => i.product.id !== action.payload),
        updatedAt: new Date(),
      }));

    case "UPDATE_ITEM_QUANTITY":
      return updateActiveAccount((acc) => ({
        ...acc,
        items:
          action.payload.quantity <= 0
            ? acc.items.filter((i) => i.product.id !== action.payload.productId)
            : acc.items.map((i) =>
                i.product.id === action.payload.productId
                  ? { ...i, quantity: action.payload.quantity }
                  : i,
              ),
        updatedAt: new Date(),
      }));

    case "UPDATE_ITEM_DISCOUNT":
      return updateActiveAccount((acc) => ({
        ...acc,
        items: acc.items.map((i) =>
          i.product.id === action.payload.productId
            ? {
                ...i,
                discount: Math.min(100, Math.max(0, action.payload.discount)),
              }
            : i,
        ),
        updatedAt: new Date(),
      }));

    case "UPDATE_ITEM_NOTE":
      return updateActiveAccount((acc) => ({
        ...acc,
        items: acc.items.map((i) =>
          i.product.id === action.payload.productId
            ? { ...i, note: action.payload.note }
            : i,
        ),
      }));

    case "CLEAR_CART":
      return updateActiveAccount((acc) => ({
        ...acc,
        items: [],
        clientName: "Consumidor Final",
        updatedAt: new Date(),
      }));

    case "SET_CLIENT":
      return {
        ...updateActiveAccount((acc) => ({
          ...acc,
          clientId: action.payload.id,
          clientName: action.payload.name,
        })),
        activeClient: action.payload,
      };

    case "ADD_PRE_ACCOUNT": {
      const newAcc = newPreAccount(state.preAccounts.length + 1);
      return {
        ...state,
        preAccounts: [...state.preAccounts, newAcc],
        activePreAccountId: newAcc.id,
      };
    }

    case "SET_ACTIVE_PRE_ACCOUNT":
      return { ...state, activePreAccountId: action.payload };

    case "REMOVE_PRE_ACCOUNT": {
      if (state.preAccounts.length === 1) return state;
      const filtered = state.preAccounts.filter((a) => a.id !== action.payload);
      return {
        ...state,
        preAccounts: filtered,
        activePreAccountId:
          state.activePreAccountId === action.payload
            ? filtered[filtered.length - 1].id
            : state.activePreAccountId,
      };
    }

    case "RENAME_PRE_ACCOUNT":
      return {
        ...state,
        preAccounts: state.preAccounts.map((a) =>
          a.id === action.payload.id
            ? { ...a, label: action.payload.label }
            : a,
        ),
      };

    case "UPDATE_PRE_ACCOUNT_DOCUMENT_TYPE":
      return {
        ...state,
        preAccounts: state.preAccounts.map((a) =>
          a.id === action.payload.id
            ? { ...a, documentType: action.payload.documentType }
            : a,
        ),
      };

    case "SET_SHIFT":
      return { ...state, currentShift: action.payload };

    case "TOGGLE_CHARGE_MODAL":
      return { ...state, isChargeModalOpen: !state.isChargeModalOpen };

    case "TOGGLE_NEW_CLIENT_MODAL":
      return { ...state, isNewClientModalOpen: !state.isNewClientModalOpen };

    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };

    case "TOGGLE_FAVORITE": {
      const favs = loadFavoriteIds();
      if (favs.has(action.payload)) favs.delete(action.payload);
      else favs.add(action.payload);
      saveFavoriteIds(favs);
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload ? { ...p, isFavorite: favs.has(p.id) } : p,
        ),
      };
    }

    case "SAVE_PRE_ACCOUNT":
      return state;

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PosContext = createContext(null);

export function PosProvider({ children }) {
  const [state, dispatch] = useReducer(posReducer, undefined, getInitialState);

  const activeAccount = useMemo(
    () => state.preAccounts.find((a) => a.id === state.activePreAccountId),
    [state.preAccounts, state.activePreAccountId],
  );

  const { cartSubtotal, cartTax, cartTotal, cartItemCount } = useMemo(() => {
    const items = activeAccount?.items ?? [];
    let subtotal = 0;
    let tax = 0;
    items.forEach((item) => {
      const discountedPrice = item.unitPrice * (1 - item.discount / 100);
      const lineTotal = discountedPrice * item.quantity;
      const lineTax = lineTotal * item.product.taxRate;
      subtotal += lineTotal;
      tax += lineTax;
    });
    return {
      cartSubtotal: subtotal,
      cartTax: tax,
      cartTotal: subtotal + tax,
      cartItemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }, [activeAccount]);

  const filteredProducts = useMemo(() => {
    let result = state.products;
    if (state.activeFilter === "favorites") {
      result = result.filter((p) => p.isFavorite);
    } else if (state.activeFilter !== "all") {
      result = result.filter((p) => p.category === state.activeFilter);
    }
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q)),
      );
    }
    return result;
  }, [state.products, state.activeFilter, state.searchQuery]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      activeAccount,
      cartSubtotal,
      cartTax,
      cartTotal,
      cartItemCount,
      filteredProducts,
    }),
    [
      state,
      activeAccount,
      cartSubtotal,
      cartTax,
      cartTotal,
      cartItemCount,
      filteredProducts,
    ],
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos() {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be used within PosProvider");
  return ctx;
}
