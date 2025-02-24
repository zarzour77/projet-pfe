package com.example.demo.chat;

import com.example.demo.Service.ConversationService;
import com.example.demo.Service.MessageService;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
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
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate,
                          MessageService messageService,
                          ConversationService conversationService,
                          UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(ChatMessage chatMessage) {
        try {
            logger.info("Received private message: from {} to {} with content: {}",
                    chatMessage.getSender(), chatMessage.getReceiver(), chatMessage.getContent());

            Long conversationId = conversationService.createConversation(
                    chatMessage.getSender(), chatMessage.getReceiver()).getId();
            logger.info("Using conversation id: {} for message from {} to {}",
                    conversationId, chatMessage.getSender(), chatMessage.getReceiver());

            Long senderId = getUserId(chatMessage.getSender());
            Long receiverId = getUserId(chatMessage.getReceiver());

            messageService.saveMessage(chatMessage, conversationId, senderId, receiverId);

            messagingTemplate.convertAndSendToUser(chatMessage.getReceiver(), "/queue/messages", chatMessage);
            logger.info("Message sent successfully to {}", chatMessage.getReceiver());
        } catch (Exception e) {
            logger.error("Error sending private message: ", e);
        }
    }

    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessage chatMessage) {
        try {
            logger.info("New user added: {}", chatMessage.getSender());
            messagingTemplate.convertAndSendToUser(chatMessage.getReceiver(), "/queue/messages", chatMessage);
        } catch (Exception e) {
            logger.error("Error adding user: ", e);
        }
    }

    private Long getUserId(String email) throws Exception {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email: " + email);
        }
        return user.getId();
    }
}
