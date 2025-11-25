import * as signalR from "@microsoft/signalr";

export const createConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/notificacionesHub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets, // en vez de 1
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();