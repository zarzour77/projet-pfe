package com.example.demo.chat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(ChatMessage chatMessage) {
        try {
            logger.info("📩 Message privé reçu - De: {} | À: {} | Contenu: {}",
                    chatMessage.getSender(), chatMessage.getReceiver(), chatMessage.getContent());

            messagingTemplate.convertAndSendToUser(chatMessage.getReceiver(), "/queue/messages", chatMessage);
            logger.info("✅ Message envoyé avec succès à {}", chatMessage.getReceiver());
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'envoi du message privé : ", e);
        }
    }

    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessage chatMessage) {
        try {
            logger.info("👤 Nouvel utilisateur ajouté : {}", chatMessage.getSender());
            messagingTemplate.convertAndSendToUser(chatMessage.getReceiver(), "/queue/messages", chatMessage);
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'ajout de l'utilisateur : ", e);
        }
    }
}
