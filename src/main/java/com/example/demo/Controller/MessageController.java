package com.example.demo.Controller;

import com.example.demo.chat.ChatMessage;
import com.example.demo.chat.Message;
import com.example.demo.chat.Conversation;
import com.example.demo.Service.MessageService;
import com.example.demo.Service.ConversationService;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Envoie un message via une requête POST.
     * L'objet JSON attendu doit correspondre à ChatMessage, par exemple :
     * {
     *   "type": "CHAT",
     *   "sender": "expediteur@mail.com",
     *   "receiver": "destinataire@mail.com",
     *   "content": "Bonjour, comment ça va ?"
     * }
     *
     * Cette méthode :
     *  - Récupère (ou crée) la conversation entre l'expéditeur et le destinataire.
     *  - Récupère les identifiants des utilisateurs.
     *  - Enregistre le message dans la conversation.
     */
    @PostMapping
    public Message sendMessage(@RequestBody ChatMessage chatMessage) throws Exception {
        // Création ou récupération de la conversation entre les deux utilisateurs
        Conversation conversation = conversationService.createConversation(chatMessage.getSender(), chatMessage.getReceiver());

        // Récupération des identifiants des utilisateurs
        Long senderId = getUserId(chatMessage.getSender());
        Long receiverId = getUserId(chatMessage.getReceiver());

        // Sauvegarde et renvoi du message
        return messageService.saveMessage(chatMessage, conversation.getId(), senderId, receiverId);
    }

    /**
     * Récupère tous les messages d'une conversation donnée
     * Exemple d'URL : GET /api/messages/conversation/123
     */
    @GetMapping("/conversation/{idConversation}")
    public List<Message> getMessages(@PathVariable Long idConversation) {
        return messageService.getMessagesByConversation(idConversation);
    }

    /**
     * Méthode utilitaire pour récupérer l'identifiant d'un utilisateur via son email.
     */
    private Long getUserId(String email) throws Exception {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email: " + email);
        }
        return user.getId();
    }
}
