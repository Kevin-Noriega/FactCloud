import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePos } from "../../contexts/pos/PosContext";
import {
  posProductsApi,
  posShiftsApi,
  posSalesApi,
  posClientsApi,
  posConfigApi,
  posCashApi,
  posLabelsApi,
  posPrintConfigApi,
  posReportsApi,
} from "../../Service/pos/posApi";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const POS_QUERY_KEYS = {
  products: (params) => ["pos", "products", params],
  categories: () => ["pos", "categories"],
  shift: () => ["pos", "shift", "current"],
  shiftHistory: (params) => ["pos", "shifts", params],
  clients: (q) => ["pos", "clients", q],
  config: () => ["pos", "config"],
  branches: () => ["pos", "branches"],
};

// ─── Products hook ────────────────────────────────────────────────────────────

export function usePosProducts() {
  const { state, dispatch } = usePos();

  const params = {
    search: state.searchQuery || undefined,
    category:
      state.activeFilter !== "all" && state.activeFilter !== "favorites"
        ? state.activeFilter
        : undefined,
    onlyFavorites: state.activeFilter === "favorites" ? true : undefined,
    pageSize: 50,
  };

  const query = useQuery({
    queryKey: POS_QUERY_KEYS.products(params),
    queryFn: () => posProductsApi.getAll(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (query.data?.data) {
      dispatch({ type: "SET_PRODUCTS", payload: query.data.data });
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_LOADING_PRODUCTS", payload: query.isLoading });
  }, [query.isLoading, dispatch]);

  return query;
}

// ─── Categories hook ──────────────────────────────────────────────────────────

export function usePosCategories() {
  return useQuery({
    queryKey: POS_QUERY_KEYS.categories(),
    queryFn: posProductsApi.getCategories,
    staleTime: 5 * 60_000,
  });
}

// ─── Favorite toggle ──────────────────────────────────────────────────────────

export function useToggleFavorite() {
  const { dispatch } = usePos();

  return useMutation({
    mutationFn: posProductsApi.toggleFavorite,
    // El estado de favoritos vive en el front (localStorage), por eso no se
    // invalida la query al terminar: el backend siempre devuelve isFavorite:false
    // y un refetch borraría el cambio. Solo revertimos si la llamada falla.
    onMutate: (productId) => {
      dispatch({ type: "TOGGLE_FAVORITE", payload: productId });
    },
    onError: (_, productId) => {
      dispatch({ type: "TOGGLE_FAVORITE", payload: productId });
    },
  });
}

// ─── Ajuste de stock ───────────────────────────────────────────────────────────

export function useAddStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, cantidad }) =>
      posProductsApi.addStock(productId, cantidad),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pos", "products"] });
    },
  });
}

// ─── Shift hooks ──────────────────────────────────────────────────────────────

export function useCurrentShift() {
  const { dispatch } = usePos();

  const query = useQuery({
    queryKey: POS_QUERY_KEYS.shift(),
    queryFn: posShiftsApi.getCurrent,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      dispatch({ type: "SET_SHIFT", payload: query.data });
    }
  }, [query.data, dispatch]);

  return query;
}

export function useOpenShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto) => posShiftsApi.open(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pos", "shift"] });
      qc.invalidateQueries({ queryKey: ["pos", "shifts"] });
    },
  });
}

export function useCloseShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto) => posShiftsApi.close(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pos", "shift"] });
      qc.invalidateQueries({ queryKey: ["pos", "shifts"] });
    },
  });
}

// Historial de turnos (paginado, con filtros de fecha)
export function useShiftHistory(params) {
  return useQuery({
    queryKey: POS_QUERY_KEYS.shiftHistory(params),
    queryFn: () => posShiftsApi.getHistory(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

// Resumen/arqueo de un turno (para el drawer de cierre/detalle)
export function useShiftSummary(shiftId) {
  return useQuery({
    queryKey: ["pos", "shift", "summary", shiftId],
    queryFn: () => posShiftsApi.getSummary(shiftId),
    enabled: !!shiftId,
    staleTime: 30_000,
  });
}

// ─── Sale hook ────────────────────────────────────────────────────────────────

export function useCreateSale() {
  const { dispatch, state } = usePos();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto) => posSalesApi.create(dto),
    // El cierre del modal y el vaciado del carrito los maneja ChargeModal tras
    // mostrar la confirmación. Aquí solo refrescamos datos (stock, turnos, caja).
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pos"] });
    },
  });
}

// ─── Client search hook ───────────────────────────────────────────────────────

export function useClientSearch(query) {
  return useQuery({
    queryKey: POS_QUERY_KEYS.clients(query),
    queryFn: () => posClientsApi.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
}

export function useCreateQuickClient() {
  const { dispatch } = usePos();
  return useMutation({
    mutationFn: posClientsApi.createQuick,
    onSuccess: (client) => {
      dispatch({ type: "SET_CLIENT", payload: client });
    },
  });
}

// ─── Config hook ──────────────────────────────────────────────────────────────

export function usePosConfig() {
  return useQuery({
    queryKey: POS_QUERY_KEYS.config(),
    queryFn: posConfigApi.get,
    staleTime: 10 * 60_000,
  });
}

// ─── Movimientos de caja (ingresos / retiros) ───────────────────────────────────

export function useCashMovements(params) {
  return useQuery({
    queryKey: ["pos", "cash-movements", params],
    queryFn: () => posCashApi.list(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateCashMovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto) => posCashApi.create(dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["pos", "cash-movements"] }),
  });
}

// ─── Etiquetas ───────────────────────────────────────────────────────────────────

export function useLabels() {
  return useQuery({
    queryKey: ["pos", "labels"],
    queryFn: posLabelsApi.list,
    staleTime: 60_000,
  });
}

export function useCreateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto) => posLabelsApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos", "labels"] }),
  });
}

export function useUpdateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }) => posLabelsApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos", "labels"] }),
  });
}

export function useDeleteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => posLabelsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos", "labels"] }),
  });
}

// ─── Config de impresión ─────────────────────────────────────────────────────────

export function usePrintConfig() {
  return useQuery({
    queryKey: ["pos", "print-config"],
    queryFn: posPrintConfigApi.get,
    staleTime: 5 * 60_000,
  });
}

export function useUpdatePrintConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto) => posPrintConfigApi.update(dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["pos", "print-config"] }),
  });
}

// ─── Reportes ────────────────────────────────────────────────────────────────────

export function useDailyReport(params) {
  return useQuery({
    queryKey: ["pos", "report", params],
    queryFn: () => posReportsApi.report(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

// ─── Barcode scanner hook ─────────────────────────────────────────────────────

export function useBarcodeScanner(onScan) {
  const bufferRef = useRef("");
  const timerRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && bufferRef.current.length > 3) {
        onScan(bufferRef.current);
        bufferRef.current = "";
        return;
      }
      if (e.key.length === 1) {
        bufferRef.current += e.key;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          bufferRef.current = "";
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onScan]);
}

// ─── Debounced search hook ────────────────────────────────────────────────────

export function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── Currency formatter ───────────────────────────────────────────────────────

export function useCurrency() {
  const format = useCallback((amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return { format };
}
