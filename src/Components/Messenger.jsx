import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./messenger.module.css";
import { Search, Video, Phone, MoreVertical, Send } from "lucide-react";
import { connect, disconnect } from "../services/webSocket";
import UserSearch from "./UserSearch";
import { 
  getConversations, 
  getConversationHistory, 
  createConversation, 
  sendMessage as apiSendMessage 
} from "../services/MessengerService";

export default function Messenger() {
  const location = useLocation();
  const userWithToken = JSON.parse(localStorage.getItem("userWithToken")) || {};
  const currentUser = userWithToken.email || "me@domain.com";
  const currentUserId = userWithToken.id; // Assurez-vous que l'id est stocké dans le localStorage

  console.log("[Messenger] Current user:", currentUser);

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [autoOpened, setAutoOpened] = useState(false);

  // Transformation d'une conversation pour l'affichage
  const transformConversation = (conv) => {
    const partner = conv.participants.find(user => user.email !== currentUser);
    const transformed = {
      ...conv,
      name: partner?.name || "Unknown",
      avatar: partner?.photoprofile || partner?.avatar || "/default-avatar.png",
      status: partner?.status || "offline",
    };
    console.log("[Messenger] Transformed conversation id:", conv.id, "->", transformed);
    return transformed;
  };

  // Chargement de la liste des conversations
  const loadConversations = async () => {
    try {
      const data = await getConversations(currentUser);
      console.log("[Messenger] Loaded conversations from API:", data);
      const transformed = data.map(transformConversation);
      console.log("[Messenger] Transformed conversation IDs:", transformed.map(c => c.id));
      setConversations(transformed);
      if (transformed.length > 0 && !autoOpened) {
        console.log("[Messenger] Auto-selecting conversation id:", transformed[0].id);
        setSelectedConv(transformed[0]);
        loadConversationHistory(transformed[0].id);
      }
    } catch (error) {
      console.error("[Messenger] Error loading conversations:", error);
    }
  };

  // Chargement de l'historique des messages pour une conversation
  // Ici, on transforme les messages pour qu'ils aient les propriétés attendues par l'UI.
  const loadConversationHistory = async (conversationId) => {
    try {
      const messagesFromAPI = await getConversationHistory(conversationId);
      console.log("[Messenger] Loaded messages for conversation id", conversationId, messagesFromAPI);
      
      const transformedMessages = messagesFromAPI.map(msg => ({
        id: msg.idMessage,  // utiliser idMessage comme clé
        // On peut comparer l'id de l'expéditeur avec currentUserId pour déterminer l'affichage
        sender: msg.idExpediteur === currentUserId ? currentUser : selectedConv?.name || "Unknown",
        content: msg.contenu,
        time: new Date(msg.dateEnvoi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }));
      
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv =>
          conv.id === conversationId ? { ...conv, messages: transformedMessages } : conv
        );
        setSelectedConv(updatedConversations.find(c => c.id === conversationId));
        return updatedConversations;
      });
    } catch (error) {
      console.error("[Messenger] Error loading conversation history:", error);
    }
  };

  // Réception d'un message via WebSocket
  const onMessageReceived = (chatMessage) => {
    console.log("[Messenger] Message received from backend:", chatMessage);
    if (selectedConv && chatMessage.sender === selectedConv.name) {
      const updated = conversations.map((conv) => {
        if (conv.id === selectedConv.id) {
          return {
            ...conv,
            messages: [...(conv.messages || []), chatMessage],
            lastMessage: chatMessage.content,
            lastActivity: Date.now(),
          };
        }
        return conv;
      });
      updated.sort((a, b) => b.lastActivity - a.lastActivity);
      setConversations(updated);
      setSelectedConv(updated.find((c) => c.id === selectedConv.id));
    }
  };

  useEffect(() => {
    connect(onMessageReceived, () => {
      console.log("[Messenger] WebSocket connection established!");
    });
    loadConversations();
    return () => {
      disconnect();
    };
  }, []);

  const autoOpenedRef = useRef(false);
  // Ouverture automatique de la conversation depuis une mission
  useEffect(() => {
    if (location.state && location.state.mission && !autoOpenedRef.current) {
      const mission = location.state.mission;
      if (mission.entreprise && mission.entreprise.email) {
        const userFromMission = {
          email: mission.entreprise.email,
          avatar: mission.entreprise.photoprofile || "/default-avatar.png",
          name: mission.entreprise.nomentreprise || mission.entreprise.nom
        };
        console.log("[Messenger] User from mission:", userFromMission);
        handleUserSelected(userFromMission);
        autoOpenedRef.current = true;
      }
    }
  }, [location.state]);

  // Création ou récupération d'une conversation lors de la sélection d'un utilisateur
  const handleUserSelected = async (user) => {
    console.log("[Messenger] handleUserSelected triggered for:", user);
    try {
      let conversation = await createConversation(currentUser, user.email);
      console.log("[Messenger] createConversation API returned:", conversation);
      conversation = transformConversation(conversation);
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === conversation.id);
        if (!exists) {
          console.log("[Messenger] Adding new conversation id:", conversation.id);
          return [...prev, conversation];
        }
        return prev;
      });
      setSelectedConv(conversation);
      loadConversationHistory(conversation.id);
    } catch (error) {
      console.error("[Messenger] Error in handleUserSelected:", error);
    }
  };

  const handleSelectConversation = (conv) => {
    console.log("[Messenger] handleSelectConversation for conversation id:", conv.id);
    if (conv.unread > 0) {
      const updated = conversations.map((c) =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      );
      setConversations(updated);
    }
    setSelectedConv(conv);
    loadConversationHistory(conv.id);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConv) return;
    const newChatMessage = {
      type: "CHAT",
      sender: currentUser,
      receiver: selectedConv.name,
      content: inputMessage,
    };
    console.log("[Messenger] Sending message:", newChatMessage);
    try {
      await apiSendMessage(newChatMessage);
    } catch (error) {
      console.error("[Messenger] Error sending message:", error);
    }
    // Création d'un message local pour l'affichage immédiat
    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = conversations.map((conv) => {
      if (conv.id === selectedConv.id) {
        return {
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage.content,
          lastActivity: Date.now(),
        };
      }
      return conv;
    });
    updated.sort((a, b) => b.lastActivity - a.lastActivity);
    setConversations(updated);
    setSelectedConv(updated.find((c) => c.id === selectedConv.id));
    setInputMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
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
            {selectedConv.messages &&
              selectedConv.messages.map((msg) => (
                <div
                  key={msg.id}  // Utilise la propriété transformée 'id'
                  className={msg.sender === currentUser ? styles.messageMe : styles.messageOther}
                >
                  <div className={styles.messageText}>{msg.content}</div>
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
