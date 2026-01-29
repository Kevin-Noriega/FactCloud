import * as signalR from "@microsoft/signalr";

export const createConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/notificacionesHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
