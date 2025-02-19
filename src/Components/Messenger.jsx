// src/components/Messenger.jsx
import React, { useState, useEffect } from "react";
import styles from "./messenger.module.css";
import { Search, Video, Phone, MoreVertical, Send } from "lucide-react";
import { connect, disconnect, sendMessage } from "../services/webSocket";
import UserSearch from "./UserSearch";

export default function Messenger() {
  const [conversations, setConversations] = useState([
    // Initial dummy conversations (if any)
    {
      id: 1,
      name: "Alice",
      avatar: "/images/alice.png",
      status: "En ligne",
      unread: 0,
      lastMessage: "",
      lastActivity: Date.now(),
      messages: []
    },
    {
      id: 2,
      name: "Bob",
      avatar: "/images/bob.png",
      status: "Hors ligne",
      unread: 0,
      lastMessage: "",
      lastActivity: Date.now(),
      messages: []
    }
  ]);
  const [selectedConv, setSelectedConv] = useState(conversations[0] || null);
  const [inputMessage, setInputMessage] = useState("");

  // Callback to handle incoming messages from backend
  const onMessageReceived = (chatMessage) => {
    console.log("Message received from backend:", chatMessage);
    if (selectedConv && chatMessage.receiver === selectedConv.name) {
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
      setSelectedConv(updated.find(c => c.id === selectedConv.id));
    }
  };

  useEffect(() => {
    connect(onMessageReceived, () => {
      console.log("WebSocket connection established!");
    });
    return () => {
      disconnect();
    };
  }, [selectedConv, conversations]);

  // When a user is selected from the search results, create/open a conversation
  const handleUserSelected = (user) => {
    let conversation = conversations.find((conv) => conv.name === user.username);
    if (!conversation) {
      conversation = {
        id: Date.now(),
        name: user.username,
        avatar: user.avatar || "/default-avatar.png",
        status: "En ligne",
        unread: 0,
        lastMessage: "",
        lastActivity: Date.now(),
        messages: []
      };
      setConversations([...conversations, conversation]);
    }
    setSelectedConv(conversation);
  };

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
    if (!inputMessage.trim() || !selectedConv) return;

    const newChatMessage = {
      type: "CHAT",
      sender: "me", // Replace with actual logged-in user's username or ID
      receiver: selectedConv.name,
      content: inputMessage,
    };

    sendMessage(newChatMessage);

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = conversations.map((conv) => {
      if (conv.id === selectedConv.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage.text,
          lastActivity: Date.now(),
        };
      }
      return conv;
    });
    updated.sort((a, b) => b.lastActivity - a.lastActivity);
    setConversations(updated);
    setSelectedConv(updated.find(c => c.id === selectedConv.id));
    setInputMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        {/* User search component */}
        <UserSearch onUserSelected={handleUserSelected} />

        <div className={styles.conversationList}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`${styles.conversationItem} ${selectedConv && selectedConv.id === conv.id ? styles.activeConversation : ""}`}
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
                <div className={styles.messageText}>{msg.text || msg.content}</div>
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
