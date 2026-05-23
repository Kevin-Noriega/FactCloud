import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { wompiService } from "../Service/wompiService";
import { CheckCircleFill, ClockFill, XCircleFill } from "react-bootstrap-icons";

const MAX_RETRIES = 10;
const POLL_INTERVAL_MS = 5000;
const REDIRECT_DELAY_MS = 4000;

export default function PSEResultado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [retries, setRetries] = useState(0);
  const [countdown, setCountdown] = useState(Math.round(REDIRECT_DELAY_MS / 1000));

  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const transactionId =
    searchParams.get("id") || localStorage.getItem("pseTransactionId");

  // ── Polling ──
  useEffect(() => {
    if (!transactionId) {
      navigate("/planes");
      return;
    }

    let attempt = 0;

    const poll = async () => {
      try {
        const result = await wompiService.getTransactionStatus(transactionId);
        setStatus(result.status);
        attempt++;
        setRetries(attempt);

        if (result.status !== "PENDING") {
          clearInterval(intervalRef.current);

          if (result.status === "APPROVED") {
            localStorage.removeItem("pseTransactionId");
            localStorage.removeItem("pseReference");
            localStorage.removeItem("registroData");
            localStorage.removeItem("selectedPlan");
          }
          return;
        }

        if (attempt >= MAX_RETRIES) {
          clearInterval(intervalRef.current);
          setStatus("TIMEOUT");
        }
      } catch {
        clearInterval(intervalRef.current);
        setStatus("ERROR");
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [transactionId, navigate]);

  // ── Auto-redirect countdown on APPROVED ──
  useEffect(() => {
    if (status !== "APPROVED") return;

    let secs = Math.round(REDIRECT_DELAY_MS / 1000);
    setCountdown(secs);

    countdownRef.current = setInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        navigate("/login");
      }
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [status, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "48px",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
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
            <p>Tu pago está siendo procesado por el banco. Esto puede tardar unos minutos.</p>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Verificación automática {retries}/{MAX_RETRIES}…
            </p>
          </>
        )}

        {status === "APPROVED" && (
          <>
            <CheckCircleFill size={64} color="#10b981" />
            <h2 style={{ marginTop: 20 }}>¡Pago exitoso!</h2>
            <p>Tu cuenta ha sido creada y activada correctamente.</p>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Redirigiendo en {countdown} segundo{countdown !== 1 ? "s" : ""}…
            </p>
            <button
              onClick={() => navigate("/login")}
              style={btnStyle("#10b981")}
            >
              Iniciar sesión ahora
            </button>
          </>
        )}

        {(status === "DECLINED" || status === "ERROR") && (
          <>
            <XCircleFill size={64} color="#ef4444" />
            <h2 style={{ marginTop: 20 }}>Pago no completado</h2>
            <p>
              La transacción fue rechazada o hubo un error. Puedes intentar
              nuevamente.
            </p>
            <button onClick={() => navigate("/checkout")} style={btnStyle("#3b82f6")}>
              Intentar de nuevo
            </button>
          </>
        )}

        {status === "TIMEOUT" && (
          <>
            <ClockFill size={64} color="#94a3b8" />
            <h2 style={{ marginTop: 20 }}>Tiempo de espera agotado</h2>
            <p>
              No pudimos confirmar tu pago automáticamente. Si autorizaste el
              débito, tu cuenta se activará en minutos. Revisa tu correo o
              contacta soporte.
            </p>
            <button onClick={() => navigate("/planes")} style={btnStyle("#6366f1")}>
              Volver a planes
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    marginTop: 20,
    padding: "12px 32px",
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  };
}
