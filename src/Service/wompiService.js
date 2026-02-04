import axios from "axios";

import api from "../api/axios";

const WOMPI_PUBLIC_KEY = "pub_test_9yiStyVoOX7mdDTPZQOBZTK07ICEGAbT";

export const wompiService = {
  // ✅ Llamadas a TU BACKEND → usar `api`
  async getAcceptanceToken() {
    const response = await api.get("/payment/acceptance-token");
    return response.data;
  },

  // ✅ Llamadas DIRECTAS a Wompi → usar `axios` (sin interceptors)
  async tokenizeCard(cardData) {
    const response = await axios.post(
      "https://sandbox.wompi.co/v1/tokens/cards",
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

  // ✅ Llamadas a TU BACKEND → usar `api`
  async createTransaction(transactionData) {
    const response = await api.post(
      "/payment/create-transaction",
      transactionData,
    );
    return response.data;
  },

  // ✅ Llamadas a TU BACKEND → usar `api`
  async getTransaction(transactionId) {
    const response = await api.get(`/payment/transaction/${transactionId}`);
    return response.data;
  },
};
