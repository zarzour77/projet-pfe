import { useState, useEffect, useRef } from "react"; 
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Messenger.module.css";

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
import { connect, disconnect } from "../Services/WebSocket";
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
  const userWithToken = JSON.parse(localStorage.getItem("user")) || {};
  const currentUser = userWithToken.email || "me@domain.com";
  const currentUserId = userWithToken.id || null; 

  /** État local **/
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("lastActivity");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // État ajouté pour la langue de traduction
  const [targetLanguage, setTargetLanguage] = useState("");
  // Pour afficher ou non la liste déroulante des langues
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  /** Références **/
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // Pour scroller en bas

  /** Variants d'animations pour les messages **/
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
      transformed.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
      setConversations(transformed);

      if (transformed.length > 0 && !selectedConv) {
        setSelectedConv(transformed[0]);
        loadConversationHistory(transformed[0].id);
      }
    } catch (error) {
      console.error("[Messenger] Error loading conversations:", error);
    }
  };

  // Charge l’historique d’une conversation et stocke les messages originaux
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
            ? { ...conv, 
                messages: transformedMessages,
                originalMessages: transformedMessages // Sauvegarde des messages initiaux
              }
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
          // Ajout à la fois dans messages et originalMessages
          return {
            ...conv,
            messages: [...(conv.messages || []), chatMessage],
            originalMessages: [...(conv.originalMessages || []), chatMessage],
            lastMessage: chatMessage.content,
            lastActivity: Date.now()
          };
        }
        return conv;
      });
      updated.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
      setConversations(updated);
      setSelectedConv(updated.find(c => c.id === selectedConv.id));
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

  useEffect(() => {
    if (location.state && location.state.conversation) {
      const convFromLanding = transformConversation(location.state.conversation);
      setConversations(prev => {
        const exists = prev.find(c => c.id === convFromLanding.id);
        let updated;
        if (exists) {
          updated = prev.map(c => c.id === convFromLanding.id ? convFromLanding : c);
        } else {
          updated = [convFromLanding, ...prev];
        }
        updated.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
        return updated;
      });
      setSelectedConv(convFromLanding);
      loadConversationHistory(convFromLanding.id);
    }
  }, [location.state]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConv?.messages]);

  const handleUserSelected = async (user) => {
    try {
      let conversation = await createConversation(currentUser, user.email);
      conversation = transformConversation(conversation);
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === conversation.id);
        return exists ? prev : [conversation, ...prev];
      });
      setSelectedConv(conversation);
      loadConversationHistory(conversation.id);
    } catch (error) {
      console.error("[Messenger] Error in handleUserSelected:", error);
    }
  };

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
          originalMessages: [...(conv.originalMessages || []), newMessage],
          lastMessage: newMessage.content,
          lastActivity: Date.now()
        };
      }
      return conv;
    });
    updated.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
    setConversations(updated);
    setSelectedConv(updated.find(c => c.id === selectedConv.id));
    setInputMessage("");
  };

  const handleFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedConv) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", currentUser);
    formData.append("receiver", selectedConv.partnerEmail);
    try {
      const savedMessage = await uploadFileMessage(formData);
      console.log("Fichier envoyé avec succès, message sauvegardé:", savedMessage);
      const newMessage = {
        id: savedMessage.idMessage,
        sender: currentUser,
        content: `[FILE] ${file.name} | ${savedMessage.contenu.split(" | ")[1] || ""}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const updated = conversations.map(conv => {
        if (conv.id === selectedConv.id) {
          return {
            ...conv,
            messages: [...(conv.messages || []), newMessage],
            originalMessages: [...(conv.originalMessages || []), newMessage],
            lastMessage: newMessage.content,
            lastActivity: Date.now()
          };
        }
        return conv;
      });
      updated.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
      setConversations(updated);
      setSelectedConv(updated.find(c => c.id === selectedConv.id));
    } catch (error) {
      console.error("Erreur lors de l’envoi du fichier:", error);
    }
  };

  const handleEmojiClick = () => {
    setInputMessage("😊");
  };

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
    setInputMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleEmojiIconClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  /*** FONCTIONS DE TRADUCTION ***/
  async function translateText(text, targetLang) {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`
      );
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Erreur de traduction :", error);
      return text;
    }
  }

  async function translateConversation(targetLang) {
    if (!selectedConv || !selectedConv.originalMessages) return;
    const translatedMessages = await Promise.all(
      selectedConv.originalMessages.map(async (msg) => {
        if (msg.content.startsWith("[FILE]")) return msg;
        const translatedContent = await translateText(msg.content, targetLang);
        return { ...msg, content: translatedContent };
      })
    );
    setSelectedConv({ ...selectedConv, messages: translatedMessages });
    setConversations(conversations.map(conv =>
      conv.id === selectedConv.id ? { ...conv, messages: translatedMessages } : conv
    ));
  }
  

  const handleTranslateButtonClick = () => {
    setShowLangDropdown(prev => !prev);
  };

  const handleLanguageSelect = async (event) => {
    const lang = event.target.value;
    if (lang) {
      setTargetLanguage(lang);
      setShowLangDropdown(false);
      // Si l'utilisateur choisit le français, on réaffiche les messages originaux
      if (lang === "fr") {
        setSelectedConv({ ...selectedConv, messages: selectedConv.originalMessages });
        setConversations(conversations.map(conv =>
          conv.id === selectedConv.id ? { ...conv, messages: conv.originalMessages } : conv
        ));
      } else {
        await translateConversation(lang);
      }
    }
  };

  const languages = [
    { label: "Arabe", code: "ar" },
    { label: "Français", code: "fr" },
    { label: "Anglais", code: "en" },
    { label: "Espagnol", code: "es" }
  ];

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
                    {msg.content.startsWith("[FILE]") 
                      ? (() => {
                          const parts = msg.content.split(" | ");
                          const fileName = parts[0].replace("[FILE] ", "");
                          const dataUrl = parts[1];
                          return dataUrl.startsWith("data:image") 
                            ? <img src={dataUrl} alt={fileName} style={{ maxWidth: "200px" }} />
                            : <a href={dataUrl} download={fileName}>{fileName}</a>;
                        })() 
                      : <span>{msg.content}</span>}
                  </div>
                  <div className={styles.messageTime}>{msg.time}</div>
                </motion.div>
              ))
            }
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputBar}>
            <div className={styles.iconLeft} onClick={handleFileIconClick}>
              <Paperclip size={20} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
              />
            </div>
            <div className={styles.translateButton} onClick={handleTranslateButtonClick}>
              Traduire
            </div>
            {showLangDropdown && (
              <select 
                className={styles.languageSelect}
                onChange={handleLanguageSelect}
                defaultValue=""
              >
                <option value="" disabled>Choisir une langue</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              placeholder="Écrivez un message..."
              className={styles.inputField}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className={styles.iconRight} onClick={handleEmojiIconClick}>
              <Smile size={20} />
            </div>
            <button className={styles.sendButton} onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
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
