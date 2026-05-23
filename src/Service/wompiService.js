import axios from "axios";
import api from "../api/axios";

const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const WOMPI_BASE_URL = import.meta.env.VITE_WOMPI_BASE_URL ?? "https://sandbox.wompi.co/v1";

if (!WOMPI_PUBLIC_KEY) {
  console.warn("[WompiService] VITE_WOMPI_PUBLIC_KEY no configurada en .env.local");
}

export const wompiService = {
  async getAcceptanceToken() {
    const response = await api.get("/payment/acceptance-token");
    return response.data.data.presignedAcceptance.acceptanceToken;
  },

  async tokenizeCard(cardData) {
    const response = await axios.post(
      `${WOMPI_BASE_URL}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        card_holder: cardData.cardHolder,
      },
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        },
      },
    );
    return response.data.data.id;
  },

  async createTransaction(transactionData) {
    const response = await api.post("/payment/create-transaction", transactionData);
    return response.data;
  },

  async getTransaction(transactionId) {
    const response = await api.get(`/payment/transaction/${transactionId}`);
    return response.data;
  },

  async getFinancialInstitutions() {
    const response = await api.get("/payment/pse/bancos");
    return response.data.data;
  },

  async createPSETransaction(datos) {
    const response = await api.post("/payment/pse/crear-transaccion", datos);
    return response.data;
  },

  async getTransactionStatus(transaccionId) {
    const response = await api.get(`/payment/pse/estado/${transaccionId}`);
    return response.data;
  },
};
