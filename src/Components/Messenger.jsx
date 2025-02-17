// src/components/Messenger.jsx
import React, { useState, useEffect } from "react";
import styles from "./messenger.module.css";
import { Search, Video, Phone, MoreVertical, Send } from "lucide-react";
import { connect, disconnect, sendMessage } from "../services/websocketService";

export default function Messenger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([
    // ... (vos conversations fictives)
  ]);
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [inputMessage, setInputMessage] = useState("");

  // Pour gérer l'arrivée de nouveaux messages depuis le backend
  const onMessageReceived = (chatMessage) => {
    console.log("Message reçu depuis le backend:", chatMessage);
    // Par exemple, si chatMessage.receiver correspond à selectedConv.name :
    if (chatMessage.receiver === selectedConv.name) {
      const updated = conversations.map((conv) => {
        if (conv.id === selectedConv.id) {
          return {
            ...conv,
            messages: [...conv.messages, chatMessage],
            lastMessage: chatMessage.content,
            lastActivity: Date.now(),
          };
        }
        return conv;
      });
      updated.sort((a, b) => b.lastActivity - a.lastActivity);
      setConversations(updated);
      setSelectedConv(updated[0]);
    }
  };

  // Établir la connexion au montage
  useEffect(() => {
    connect(onMessageReceived, () => {
      console.log("Connexion WebSocket établie !");
    });
    return () => {
      disconnect();
    };
  }, []);

  // Les fonctions de filtrage et de sélection restent identiques
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectConversation = (conv) => {
    if (conv.unread > 0) {
      const updated = conversations.map((c) =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      );
      setConversations(updated);
    }
    setSelectedConv(conv);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Créez un objet ChatMessage compatible avec votre backend
    const newChatMessage = {
      type: "CHAT",
      sender: selectedConv.name, // Exemple, à adapter
      receiver: selectedConv.name, // Exemple, à adapter
      content: inputMessage,
    };

    // Envoyer le message au backend via WebSocket
    sendMessage(newChatMessage);

    // Mise à jour locale (pour la démo)
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = conversations.map((conv) => {
      if (conv.id === selectedConv.id) {
        const updatedMessages = [...conv.messages, newMessage];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: newMessage.text,
          lastActivity: Date.now(),
        };
      }
      return conv;
    });
    updated.sort((a, b) => b.lastActivity - a.lastActivity);
    setConversations(updated);
    setSelectedConv(updated[0]);
    setInputMessage("");
  };

  return (
    <div className={styles.container}>
      {/* COLONNE GAUCHE */}
      <div className={styles.leftColumn}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Rechercher un ami..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.conversationList}>
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`${styles.conversationItem} ${
                selectedConv && selectedConv.id === conv.id
                  ? styles.activeConversation
                  : ""
              }`}
            >
              <img src={conv.avatar} alt={conv.name} className={styles.avatar} />
              <div className={styles.conversationInfo}>
                <span className={styles.conversationName}>{conv.name}</span>
                <span className={styles.conversationLastMessage}>{conv.lastMessage}</span>
              </div>
              {conv.unread > 0 && (
                <div className={styles.unreadBadge}>{conv.unread}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* COLONNE CENTRALE */}
      {selectedConv ? (
        <div className={styles.centerColumn}>
          <div className={styles.chatHeader}>
            <div className={styles.userInfo}>
              <img src={selectedConv.avatar} alt={selectedConv.name} className={styles.avatar} />
              <div>
                <div className={styles.userName}>{selectedConv.name}</div>
                <div className={styles.userStatus}>{selectedConv.status}</div>
              </div>
            </div>
            <div className={styles.headerIcons}>
              <Video className={styles.icon} />
              <Phone className={styles.icon} />
              <MoreVertical className={styles.icon} />
            </div>
          </div>
          <div className={styles.messagesArea}>
            {selectedConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.sender === "me" ? styles.messageMe : styles.messageOther}
              >
                <div className={styles.messageText}>{msg.text}</div>
                <div className={styles.messageTime}>{msg.time}</div>
              </div>
            ))}
          </div>
          <div className={styles.inputBar}>
            <input
              type="text"
              placeholder="Écrivez un message..."
              className={styles.inputField}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.centerColumnEmpty}>
          Sélectionnez une conversation à gauche
        </div>
      )}
    </div>
  );
}
