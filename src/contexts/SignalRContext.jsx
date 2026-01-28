import { createContext, useContext, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../api/config";
import { useQueryClient } from "@tanstack/react-query";

const SignalRContext = createContext();

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR debe usarse dentro de SignalRProvider");
  }
  return context;
};

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Crear conexión
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notificacionesHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection.onreconnecting((error) => {
      console.log("Reconectando SignalR...", error);
      setIsConnected(false);
    });

    newConnection.onreconnected((connectionId) => {
      console.log("SignalR reconectado:", connectionId);
      setIsConnected(true);
    });

    newConnection.onclose((error) => {
      console.log("Conexión SignalR cerrada", error);
      setIsConnected(false);

      reconnectTimeoutRef.current = setTimeout(() => {
        startConnection(newConnection);
      }, 5000);
    });

    newConnection.on("NuevaNotificacion", (notificacion) => {
      console.log("Nueva notificación recibida:", notificacion);

      // Actualizar cache de React Query
      queryClient.invalidateQueries(["notificaciones"]);

      // Mostrar notificación del navegador si está permitido
      if (Notification.permission === "granted") {
        new Notification(notificacion.titulo, {
          body: notificacion.mensaje,
          icon: "/logo.png",
          badge: "/logo.png",
        });
      }

      // Reproducir sonido (opcional)
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    });

    // Escuchar actualización de contador
    newConnection.on("ActualizarContadorNoLeidas", (count) => {
      console.log("Contador actualizado:", count);
      queryClient.setQueryData(["notificaciones-no-leidas"], count);
    });

    setConnection(newConnection);
    startConnection(newConnection);

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [queryClient]);

  const startConnection = async (conn) => {
    try {
      await conn.start();
      console.log("SignalR conectado exitosamente");
      setIsConnected(true);
    } catch (error) {
      console.error("Error al conectar SignalR:", error);
      setIsConnected(false);

      // Reintentar después de 5 segundos
      reconnectTimeoutRef.current = setTimeout(() => {
        startConnection(conn);
      }, 5000);
    }
  };

  // Solicitar permisos de notificaciones del navegador
  useEffect(() => {
    if (isConnected && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [isConnected]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};
