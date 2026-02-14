import { useState } from 'react';
import { API_URL } from "../api/config";

export const useCupones = (planId) => {
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Ingresa un código");
      return false;
    }

    setLoading(true);
    setCouponError("");
    setCoupon(null);

    try {
      const response = await fetch(`${API_URL}/cupones/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.toUpperCase(), planId })
      });
      
      const data = await response.json();

      if (data.isValid) {
        setCoupon({
          code: data.code,
          discountPercent: data.discountPercentage, 
          message: data.message,
          priceAfterDiscount: data.priceAfterDiscount
        });
        return true;
      } else {
        setCouponError(data.message || "Código inválido");
        return false;

      }
    } catch (error) {
      setCouponError("Error de conexión");
      console.error("Cupón error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCoupon = () => {
    setCoupon(null);
    setCouponError("");
    setCouponCode("");
  };

  return {
    couponCode,
    setCouponCode,
    coupon,
    couponError,
    loading,
    validateCoupon,
    clearCoupon,
    descuentoPorcentaje: coupon?.discountPercent, 
    total: coupon?.priceAfterDiscount || 0
  };
};
