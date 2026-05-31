import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../api/config";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "../api/axiosClient";

const SignalRContext = createContext();

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context)
    throw new Error("useSignalR debe usarse dentro de SignalRProvider");
  return context;
};

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const queryClient = useQueryClient();
  const mountedRef = useRef(true);
  const startingRef = useRef(false);
  const connectionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const ERRORES_IGNORABLES = [
    "stop() was called",
    "hub handshake",
    "was stopped before",
    "Failed to start",
    "before stop()",
  ];

  const esIgnorable = (err) =>
    ERRORES_IGNORABLES.some((m) =>
      err?.message?.toLowerCase().includes(m.toLowerCase()),
    );

  const startConnection = useCallback(async (conn) => {
    if (startingRef.current || !mountedRef.current) return;
    startingRef.current = true;

    try {
      await conn.start();

      if (!mountedRef.current) {
        await conn.stop().catch(() => {});
        return;
      }

      setIsConnected(true);
      setReconnecting(false);
      console.log("[SignalR] Conectado exitosamente");
    } catch (err) {
      if (!mountedRef.current) return;
      if (esIgnorable(err)) return;

      console.error("[SignalR] Error al conectar:", err);
      setIsConnected(false);

      reconnectTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          startingRef.current = false;
          startConnection(conn);
        }
      }, 5000);
    } finally {
      if (mountedRef.current) startingRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const token = getAccessToken();
    if (!token) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notificacionesHub`, {
        accessTokenFactory: () => getAccessToken() || "",
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (ctx) => {
          if (ctx.previousRetryCount === 0) return 0;
          if (ctx.previousRetryCount === 1) return 2000;
          if (ctx.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = conn;

    conn.onreconnecting((err) => {
      if (!mountedRef.current) return;
      console.warn("[SignalR] Reconectando...", err?.message || "");
      setIsConnected(false);
      setReconnecting(true);
    });

    conn.onreconnected((id) => {
      if (!mountedRef.current) return;
      console.log("[SignalR] Reconectado:", id);
      setIsConnected(true);
      setReconnecting(false);
    });

    conn.onclose((err) => {
      if (!mountedRef.current) return;
      if (err && !esIgnorable(err)) {
        console.warn("[SignalR] Conexión cerrada:", err?.message || "");
      }
      setIsConnected(false);
      setReconnecting(false);
    });

    conn.on("NuevaNotificacion", (notificacion) => {
      if (!mountedRef.current) return;
      console.log("[SignalR] Nueva notificación:", notificacion);

      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });

      if (Notification.permission === "granted") {
        new Notification(notificacion.titulo || "Nueva notificación", {
          body: notificacion.mensaje,
          icon: "/logo.png",
          badge: "/logo.png",
        });
      }

      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    });

    conn.on("ActualizarContadorNoLeidas", (count) => {
      if (!mountedRef.current) return;
      queryClient.setQueryData(["notificaciones-no-leidas"], count);
    });

    setConnection(conn);
    startConnection(conn);

    return () => {
      mountedRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const estados = [
        signalR.HubConnectionState.Disconnected,
        signalR.HubConnectionState.Disconnecting,
      ];

      if (conn && !estados.includes(conn.state)) {
        conn.stop().catch(() => {});
      }
    };
  }, [queryClient, startConnection]);

  useEffect(() => {
    if (isConnected && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isConnected]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected, reconnecting }}>
      {children}
    </SignalRContext.Provider>
  );
};
