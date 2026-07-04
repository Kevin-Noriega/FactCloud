// Reusa el axiosClient principal: misma baseURL (https://localhost:7149/api),
// el access token en memoria y el refresh automático con cookie HttpOnly.
import api from "../../api/axiosClient";

// ─── Product endpoints ────────────────────────────────────────────────────────

export const posProductsApi = {
  getAll: async (params) => {
    const { data } = await api.get("/pos/products", { params });
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get("/pos/products/categories");
    return data;
  },

  toggleFavorite: async (productId) => {
    await api.post(`/pos/products/${productId}/favorite`);
  },

  getByBarcode: async (barcode) => {
    const { data } = await api.get(`/pos/products/barcode/${barcode}`);
    return data;
  },

  addStock: async (productId, cantidad) => {
    const { data } = await api.post(`/pos/products/${productId}/stock`, {
      cantidad,
    });
    return data;
  },

  // Kardex: historial de movimientos de inventario de un producto.
  getKardex: async (productId, params) => {
    const { data } = await api.get(`/pos/products/${productId}/kardex`, { params });
    return data;
  },
};

// ─── Shift endpoints ──────────────────────────────────────────────────────────

export const posShiftsApi = {
  getCurrent: async () => {
    const { data } = await api.get("/pos/shifts/current");
    return data;
  },

  open: async (dto) => {
    const { data } = await api.post("/pos/shifts/open", dto);
    return data;
  },

  close: async (dto) => {
    const { data } = await api.post("/pos/shifts/close", dto);
    return data;
  },

  getHistory: async (params) => {
    const { data } = await api.get("/pos/shifts", { params });
    return data;
  },

  getSummary: async (shiftId) => {
    const { data } = await api.get(`/pos/shifts/${shiftId}/summary`);
    return data;
  },

  deposit: async (shiftId, amount, notes) => {
    await api.post(`/pos/shifts/${shiftId}/deposit`, { amount, notes });
  },

  withdraw: async (shiftId, amount, notes) => {
    await api.post(`/pos/shifts/${shiftId}/withdraw`, { amount, notes });
  },
};

// ─── Sale endpoints ───────────────────────────────────────────────────────────

export const posSalesApi = {
  create: async (dto) => {
    const { data } = await api.post("/pos/sales", dto);
    return data;
  },

  getReceipt: async (saleId) => {
    const { data } = await api.get(`/pos/sales/${saleId}/receipt`, {
      responseType: "text",
    });
    return data;
  },

  void: async (saleId, reason) => {
    await api.post(`/pos/sales/${saleId}/void`, { reason });
  },

  // Líneas devolvibles de una venta (vendida - ya devuelta).
  getReturnable: async (saleId) => {
    const { data } = await api.get(`/pos/sales/${saleId}/returnable`);
    return data;
  },

  // Registra una devolución total/parcial.
  // dto: { items: [{ productoId, nombre, cantidad }], motivo?, metodoReembolso? }
  return: async (saleId, dto) => {
    const { data } = await api.post(`/pos/sales/${saleId}/return`, dto);
    return data;
  },
};

// ─── Client endpoints ─────────────────────────────────────────────────────────

export const posClientsApi = {
  search: async (query) => {
    const { data } = await api.get("/pos/clients/search", { params: { q: query } });
    return data;
  },

  createQuick: async (client) => {
    const { data } = await api.post("/pos/clients/quick", client);
    return data;
  },

  getHistory: async (clientId) => {
    const { data } = await api.get(`/pos/clients/${clientId}/history`);
    return data;
  },
};

// ─── Config endpoints ─────────────────────────────────────────────────────────

export const posConfigApi = {
  get: async () => {
    const { data } = await api.get("/pos/config");
    return data;
  },

  update: async (config) => {
    await api.put("/pos/config", config);
  },

  getBranches: async () => {
    const { data } = await api.get("/pos/config/branches");
    return data;
  },

  getCashRegisters: async (branchId) => {
    const { data } = await api.get(`/pos/config/branches/${branchId}/registers`);
    return data;
  },
};

// ─── Cash movements (ingresos / retiros) ───────────────────────────────────────

export const posCashApi = {
  list: async (params) => {
    const { data } = await api.get("/pos/cash-movements", { params });
    return data;
  },
  create: async (dto) => {
    const { data } = await api.post("/pos/cash-movements", dto);
    return data;
  },
};

// ─── Labels (etiquetas) ─────────────────────────────────────────────────────────

export const posLabelsApi = {
  list: async () => {
    const { data } = await api.get("/pos/labels");
    return data;
  },
  create: async (dto) => {
    const { data } = await api.post("/pos/labels", dto);
    return data;
  },
  update: async (id, dto) => {
    const { data } = await api.put(`/pos/labels/${id}`, dto);
    return data;
  },
  remove: async (id) => {
    await api.delete(`/pos/labels/${id}`);
  },
};

// ─── Print config ───────────────────────────────────────────────────────────────

export const posPrintConfigApi = {
  get: async () => {
    const { data } = await api.get("/pos/print-config");
    return data;
  },
  update: async (dto) => {
    const { data } = await api.put("/pos/print-config", dto);
    return data;
  },
};

// ─── Loyalty / fidelización ─────────────────────────────────────────────────────

export const posLoyaltyApi = {
  getConfig: async () => {
    const { data } = await api.get("/pos/loyalty/config");
    return data;
  },
  updateConfig: async (dto) => {
    const { data } = await api.put("/pos/loyalty/config", dto);
    return data;
  },
  // Resumen + historial de puntos de un cliente.
  getClient: async (clientId) => {
    const { data } = await api.get(`/pos/clients/${clientId}/loyalty`);
    return data;
  },
  redeem: async (clientId, puntos) => {
    const { data } = await api.post(`/pos/clients/${clientId}/loyalty/redeem`, { puntos });
    return data;
  },
};

// ─── Reports endpoints ────────────────────────────────────────────────────────

export const posReportsApi = {
  dailySales: async (date) => {
    const { data } = await api.get("/pos/reports/daily", { params: { date } });
    return data;
  },

  report: async (params) => {
    const { data } = await api.get("/pos/reports/daily", { params });
    return data;
  },

  byCashier: async (from, to) => {
    const { data } = await api.get("/pos/reports/by-cashier", { params: { from, to } });
    return data;
  },

  exportExcel: async (from, to) => {
    const { data } = await api.get("/pos/reports/export/excel", {
      params: { from, to },
      responseType: "blob",
    });
    return data;
  },
};

export default api;