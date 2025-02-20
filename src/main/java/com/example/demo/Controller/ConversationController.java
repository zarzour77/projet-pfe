package com.example.demo.Controller;

import com.example.demo.chat.Conversation;
import com.example.demo.Service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
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
