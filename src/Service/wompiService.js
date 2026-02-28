import axios from "axios";

import api from "../api/axios";

const WOMPI_PUBLIC_KEY = "pub_test_9yiStyVoOX7mdDTPZQOBZTK07ICEGAbT";

export const wompiService = {
  async getAcceptanceToken() {
    const response = await api.get("/payment/acceptance-token");
    return response.data.data.presignedAcceptance.acceptanceToken;
  },

  async tokenizeCard(cardData) {
    try {
      console.log("🔵 Tokenizando tarjeta...");
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
      console.log("✅ Token obtenido:", response.data.data.id);
      return response.data.data.id;
    } catch (error) {
      console.error("❌ Error tokenizando:", error.response?.data);
      throw error;
    }
  },

  async createTransaction(transactionData) {
    try {
      console.log("🔵 Creando transacción...");
      console.log(
        "📤 Datos enviados:",
        JSON.stringify(transactionData, null, 2),
      );

      const response = await api.post(
        "/payment/create-transaction",
        transactionData,
      );

      console.log("✅ Transacción creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creando transacción:", error.response?.data);
      throw error;
    }
  },

  async getTransaction(transactionId) {
    const response = await api.get(`/payment/transaction/${transactionId}`);
    return response.data;
  },
};
