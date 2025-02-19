import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs.min.js';

let stompClient = null;

export const connect = (onMessageReceived, onConnected) => {
  const userWithToken = JSON.parse(localStorage.getItem("userWithToken"));
  const token = userWithToken?.token; // Ensure the token exists
  // Append token to the WebSocket URL as a query parameter
  const socket = new SockJS(`http://localhost:8081/ws?token=${token}`);
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");
      // Subscribe to private messages
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
