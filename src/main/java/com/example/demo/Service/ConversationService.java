package com.example.demo.Service;

import com.example.demo.chat.Conversation;
import com.example.demo.model.User;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationService.class);
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves all conversations in which the user is a participant.
     */
    public List<Conversation> getConversationsByUser(String email) {
        List<Conversation> convs = conversationRepository.findAllByParticipantEmail(email);
        logger.info("Found {} conversations for user {}", convs.size(), email);
        return convs;
    }

    /**
     * Checks if a conversation between two users exists.
     * If yes, returns it (and logs a warning if multiple exist), otherwise creates and returns it.
     */
    @Transactional
    public synchronized Conversation createConversation(String senderEmail, String receiverEmail) throws Exception {
        logger.info("Searching conversation between {} and {}", senderEmail, receiverEmail);
        List<Conversation> convs = conversationRepository.findConversationsByParticipants(senderEmail, receiverEmail);
        if (!convs.isEmpty()) {
            if (convs.size() > 1) {
                logger.warn("Multiple conversations ({}) found between {} and {}. Returning conversation with id: {}",
                        convs.size(), senderEmail, receiverEmail, convs.get(0).getId());
            } else {
                logger.info("Found conversation between {} and {} with id: {}", senderEmail, receiverEmail, convs.get(0).getId());
            }
            return convs.get(0);
        }
        logger.info("No conversation found between {} and {}. Creating a new conversation.", senderEmail, receiverEmail);
        // If no conversation exists, create one
        User sender = userRepository.findUserByEmail(senderEmail);
        User receiver = userRepository.findUserByEmail(receiverEmail);
        if (sender == null) {
            throw new Exception("Sender not found: " + senderEmail);
        }
        if (receiver == null) {
            throw new Exception("Receiver not found: " + receiverEmail);
        }
        Set<User> participants = new HashSet<>();
        participants.add(sender);
        participants.add(receiver);
        Conversation conversation = new Conversation();
        conversation.setParticipants(participants);
        conversation = conversationRepository.save(conversation);
        logger.info("Created new conversation with id: {} for users {} and {}", conversation.getId(), senderEmail, receiverEmail);
        return conversation;
    }
}
