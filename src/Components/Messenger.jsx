import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./messenger.module.css";

/** Icônes Lucide (ou tout autre set d'icônes) **/
import { 
  Search, 
  Video, 
  Phone, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile 
} from "lucide-react";

/** Services WebSocket et API **/
import { connect, disconnect } from "../services/webSocket";
import { 
  getConversations, 
  getConversationHistory, 
  createConversation, 
  sendMessage as apiSendMessage,
  uploadFileMessage
} from "../services/MessengerService";
import EmojiPicker from "emoji-picker-react";

export default function Messenger() {
  const location = useLocation();
  const userWithToken = JSON.parse(localStorage.getItem("userWithToken")) || {};
  const currentUser = userWithToken.email || "me@domain.com";
  const currentUserId = userWithToken.id || null; 

  /** État local **/
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [autoOpened, setAutoOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("lastActivity");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  /** Références **/
  const autoOpenedRef = useRef(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // Pour scroller en bas

  /** Variants d'animations pour les messages **/
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to render message content (text or file)
  const renderMessageContent = (msg) => {
    if (msg.content.startsWith("[FILE]")) {
      const parts = msg.content.split(" | ");
      // Extract the file name and the data URL
      const fileName = parts[0].replace("[FILE] ", "");
      const dataUrl = parts[1];
      // If the data URL is for an image, display it as an image; otherwise, provide a download link.
      if (dataUrl.startsWith("data:image")) {
        return <img src={dataUrl} alt={fileName} style={{ maxWidth: "200px" }} />;
      } else {
        return <a href={dataUrl} download={fileName}>{fileName}</a>;
      }
    } else {
      return <span>{msg.content}</span>;
    }
  };

  // Transformation d'une conversation pour l'affichage
  const transformConversation = (conv) => {
    const partner = conv.participants.find(user => user.email !== currentUser);
    return {
      ...conv,
      name: partner?.prenom && partner?.nom
        ? `${partner.prenom} ${partner.nom}`
        : (partner?.nom || "Unknown"),
      avatar: partner?.photoprofile 
        ? (partner.photoprofile.startsWith("data:image")
            ? partner.photoprofile
            : `data:image/png;base64,${partner.photoprofile}`)
        : (partner?.avatar || "/default-avatar.png"),
      status: partner?.status || "offline",
      partnerEmail: partner?.email
    };
  };

  // Charge toutes les conversations
  const loadConversations = async () => {
    try {
      const data = await getConversations(currentUser);
      const transformed = data.map(transformConversation);
      setConversations(transformed);

      // Sélection automatique de la première conversation si aucune n’est ouverte
      if (transformed.length > 0 && !autoOpened) {
        setSelectedConv(transformed[0]);
        loadConversationHistory(transformed[0].id);
      }
    } catch (error) {
      console.error("[Messenger] Error loading conversations:", error);
    }
  };

  // Charge l’historique d’une conversation
  const loadConversationHistory = async (conversationId) => {
    try {
      const messagesFromAPI = await getConversationHistory(conversationId);
      const transformedMessages = messagesFromAPI.map(msg => ({
        id: msg.idMessage,
        sender: msg.idExpediteur === currentUserId 
          ? currentUser 
          : "Autre utilisateur",
        content: msg.contenu,
        time: new Date(msg.dateEnvoi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }));

      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === conversationId 
            ? { ...conv, messages: transformedMessages }
            : conv
        );
        setSelectedConv(updated.find(c => c.id === conversationId));
        return updated;
      });
    } catch (error) {
      console.error("[Messenger] Error loading conversation history:", error);
    }
  };

  // WebSocket : message reçu
  const onMessageReceived = (chatMessage) => {
    if (selectedConv && chatMessage.sender === selectedConv.name) {
      const updated = conversations.map(conv => {
        if (conv.id === selectedConv.id) {
          return {
            ...conv,
            messages: [...(conv.messages || []), chatMessage],
            lastMessage: chatMessage.content,
            lastActivity: Date.now()
          };
        }
        return conv;
      });
      updated.sort((a, b) => b.lastActivity - a.lastActivity);
      setConversations(updated);
      setSelectedConv(updated.find(c => c.id === selectedConv.id));
    }
  };

  // useEffect principal
  useEffect(() => {
    connect(onMessageReceived, () => {
      console.log("[Messenger] WebSocket connection established!");
    });
    loadConversations();
    return () => {
      disconnect();
    };
  }, []);

  // Scroller en bas lorsqu’on ajoute un nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConv?.messages]);

  // Ouverture auto depuis location.state
  useEffect(() => {
    if (location.state && location.state.mission && !autoOpenedRef.current) {
      const mission = location.state.mission;
      if (mission.entreprise && mission.entreprise.email) {
        const userFromMission = {
          email: mission.entreprise.email,
          avatar: mission.entreprise.photoprofile || "/default-avatar.png",
          name: mission.entreprise.nomentreprise || mission.entreprise.nom
        };
        handleUserSelected(userFromMission);
        autoOpenedRef.current = true;
      }
    }
  }, [location.state]);

  // Sélection d’un utilisateur
  const handleUserSelected = async (user) => {
    try {
      let conversation = await createConversation(currentUser, user.email);
      conversation = transformConversation(conversation);

      setConversations(prev => {
        const exists = prev.some(conv => conv.id === conversation.id);
        if (!exists) {
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

  // Sélection d’une conversation
  const handleSelectConversation = (conv) => {
    if (conv.unread > 0) {
      const updated = conversations.map(c =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      );
      setConversations(updated);
    }
    setSelectedConv(conv);
    loadConversationHistory(conv.id);
  };

  // Envoi d’un message texte
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConv) return;
    const newChatMessage = {
      type: "CHAT",
      sender: currentUser,
      receiver: selectedConv.partnerEmail,
      content: inputMessage
    };
    try {
      await apiSendMessage(newChatMessage);
    } catch (error) {
      console.error("[Messenger] Error sending message:", error);
    }

    // Mise à jour locale (optimiste)
    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    const updated = conversations.map(conv => {
      if (conv.id === selectedConv.id) {
        return {
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage.content,
          lastActivity: Date.now()
        };
      }
      return conv;
    });
    updated.sort((a, b) => b.lastActivity - a.lastActivity);
    setConversations(updated);
    setSelectedConv(updated.find(c => c.id === selectedConv.id));
    setInputMessage("");
  };

  // Gestion des fichiers
  const handleFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedConv) return;
    const file = files[0];

    // On crée un FormData pour envoyer le fichier en multipart/form-data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", currentUser);
    formData.append("receiver", selectedConv.partnerEmail);

    try {
      // Appel du service d'upload de fichier
      const savedMessage = await uploadFileMessage(formData);
      console.log("Fichier envoyé avec succès, message sauvegardé:", savedMessage);

      // Mise à jour locale : on l'ajoute dans la conversation courante
      const newMessage = {
        id: savedMessage.idMessage,
        sender: currentUser,
        // On récupère la partie après " | " pour obtenir le data URL créé sur le backend.
        content: `[FILE] ${file.name} | ${savedMessage.contenu.split(" | ")[1] || ""}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const updated = conversations.map(conv => {
        if (conv.id === selectedConv.id) {
          return {
            ...conv,
            messages: [...(conv.messages || []), newMessage],
            lastMessage: newMessage.content,
            lastActivity: Date.now()
          };
        }
        return conv;
      });
      updated.sort((a, b) => b.lastActivity - a.lastActivity);
      setConversations(updated);
      setSelectedConv(updated.find(c => c.id === selectedConv.id));
    } catch (error) {
      console.error("Erreur lors de l’envoi du fichier:", error);
    }
  };

  // Envoi d’emoji seul
  const handleEmojiClick = () => {
    setInputMessage("😊");
  };

  // Filtrer et trier les conversations
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortConversations = (criteria) => {
    const sorted = [...conversations].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "unread") {
        return (b.unread || 0) - (a.unread || 0);
      } else {
        return (b.lastActivity || 0) - (a.lastActivity || 0);
      }
    });
    setConversations(sorted);
  };

  useEffect(() => {
    sortConversations(sortCriteria);
  }, [sortCriteria]);

  const onEmojiClick = (emojiData, event) => {
    // Vous pouvez soit ajouter l'emoji à la fin du texte actuel, soit le remplacer
    setInputMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Modifiez la fonction de clic sur l'icône Emoji pour afficher/masquer le picker
  const handleEmojiIconClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* --- COLONNE GAUCHE --- */}
      <div className={styles.leftColumn}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.sortSelect}
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="lastActivity">Dernière activité</option>
            <option value="name">Nom</option>
            <option value="unread">Non lus</option>
          </select>
        </div>

        <div className={styles.conversationList}>
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`${styles.conversationItem} ${
                selectedConv && selectedConv.id === conv.id ? styles.activeConversation : ""
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

      {/* --- COLONNE CENTRALE --- */}
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
              selectedConv.messages.map(msg => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  className={msg.sender === currentUser ? styles.messageMe : styles.messageOther}
                >
                  <div className={styles.messageText}>
                    {renderMessageContent(msg)}
                  </div>
                  <div className={styles.messageTime}>{msg.time}</div>
                </motion.div>
              ))
            }
            {/* Réf invisible pour scroller en bas */}
            <div ref={messagesEndRef} />
          </div>

          {/* --- BARRE D’ENVOI --- */}
          <div className={styles.inputBar}>
            {/* Icône Fichier (à gauche) */}
            <div className={styles.iconLeft} onClick={handleFileIconClick}>
              <Paperclip size={20} />
              {/* Input masqué pour sélectionner les fichiers */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
              />
            </div>

            {/* Champ de saisie */}
            <input
              type="text"
              placeholder="Écrivez un message..."
              className={styles.inputField}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {/* Icône Emoji (à droite) */}

              <div className={styles.iconRight} onClick={handleEmojiIconClick}>
              <Smile size={20} />
            </div>

            {/* Bouton Envoyer */}
            <button className={styles.sendButton} onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
                    {/* Render the Emoji Picker */}
                    {showEmojiPicker && (
            <div className={styles.emojiPickerContainer}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.centerColumnEmpty}>
          Sélectionnez une conversation à gauche
        </div>
      )}
    </div>
  );
}
