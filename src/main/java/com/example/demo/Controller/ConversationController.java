package com.example.demo.Controller;

import com.example.demo.chat.Conversation;
import com.example.demo.Service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }
    @GetMapping("/count/{userId}")
    public Map<String, Long> getConversationCount(@PathVariable Long userId) {
        long count = conversationService.getConversationCount(userId);
        return Collections.singletonMap("count", count);
    }

    /**
     * Endpoint pour récupérer toutes les conversations d'un utilisateur.
     * Exemple : GET /api/conversations?email=exemple@mail.com
     */
    @GetMapping
    public List<Conversation> getConversationsByUser(@RequestParam String email) {
        return conversationService.getConversationsByUser(email);
    }

    @PostMapping
    public Conversation createConversation(@RequestParam String senderEmail, @RequestParam String receiverEmail) throws Exception {
        return conversationService.createConversation(senderEmail, receiverEmail);
    }
}
