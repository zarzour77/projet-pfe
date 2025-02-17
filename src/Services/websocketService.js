// src/services/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connect = (onMessageReceived, onConnected) => {
  const socket = new SockJS("http://localhost:8081/ws"); // Assurez-vous que l'URL correspond à votre configuration backend
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");
      // S'abonner aux messages privés
      stompClient.subscribe("/user/queue/messages", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });
  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export const sendMessage = (chatMessage) => {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: "/app/chat.privateMessage",
      body: JSON.stringify(chatMessage),
    });
  } else {
    console.error("STOMP client is not connected");
  }
};
