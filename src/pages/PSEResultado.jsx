// src/pages/PSEResultado.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { wompiService } from "../Service/wompiService";
import {
    CheckCircleFill,
    ClockFill,
    XCircleFill,
} from "react-bootstrap-icons";

export default function PSEResultado() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [retries, setRetries] = useState(0);

    const transactionId =
        searchParams.get("id") ||
        localStorage.getItem("pseTransactionId");

    useEffect(() => {
        if (!transactionId) {
            navigate("/planes");
            return;
        }

        const checkStatus = async () => {
            try {
                const result = await wompiService.getTransactionStatus(transactionId);
                setStatus(result.status);

                if (result.status === "PENDING" && retries < 10) {
                    // Reintentar cada 5 segundos (máx 10 veces)
                    setTimeout(() => setRetries((r) => r + 1), 5000);
                }

                if (result.status === "APPROVED") {
                    localStorage.removeItem("pseTransactionId");
                    localStorage.removeItem("pseReference");
                    localStorage.removeItem("registroData");
                    localStorage.removeItem("selectedPlan");
                }
            } catch (err) {
                console.error("Error checking status:", err);
                setStatus("ERROR");
            }
        };

        checkStatus();
    }, [transactionId, retries, navigate]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            padding: "20px"
        }}>
            <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "48px",
                textAlign: "center",
                maxWidth: "480px",
                width: "100%",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
            }}>
                {status === "loading" && (
                    <>
                        <div className="spinner" style={{ margin: "0 auto 20px" }} />
                        <h2>Verificando pago...</h2>
                        <p>Estamos confirmando tu transacción con el banco.</p>
                    </>
                )}

                {status === "PENDING" && (
                    <>
                        <ClockFill size={64} color="#f59e0b" />
                        <h2 style={{ marginTop: 20 }}>Pago pendiente</h2>
                        <p>Tu pago está siendo procesado por el banco.
                            Esto puede tardar unos minutos.</p>
                        <p style={{ color: "#64748b", fontSize: 13 }}>
                            Verificación automática {retries}/10...
                        </p>
                    </>
                )}

                {status === "APPROVED" && (
                    <>
                        <CheckCircleFill size={64} color="#10b981" />
                        <h2 style={{ marginTop: 20 }}>¡Pago exitoso! 🎉</h2>
                        <p>Tu cuenta ha sido creada y activada correctamente.</p>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                marginTop: 20,
                                padding: "12px 32px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}

                {(status === "DECLINED" || status === "ERROR") && (
                    <>
                        <XCircleFill size={64} color="#ef4444" />
                        <h2 style={{ marginTop: 20 }}>Pago no completado</h2>
                        <p>La transacción fue rechazada o hubo un error.
                            Puedes intentar nuevamente.</p>
                        <button
                            onClick={() => navigate("/checkout")}
                            style={{
                                marginTop: 20,
                                padding: "12px 32px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Intentar de nuevo
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
