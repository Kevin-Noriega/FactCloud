import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("factcloud_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

  return: async (saleId, items) => {
    await api.post(`/pos/sales/${saleId}/return`, { items });
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

// ─── Reports endpoints ────────────────────────────────────────────────────────

export const posReportsApi = {
  dailySales: async (date) => {
    const { data } = await api.get("/pos/reports/daily", { params: { date } });
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