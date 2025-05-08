package com.example.demo.Controller;

import com.example.demo.chat.ChatMessage;
import com.example.demo.chat.Message;
import com.example.demo.chat.Conversation;
import com.example.demo.Service.MessageService;
import com.example.demo.Service.ConversationService;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
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

    @GetMapping("/conversation/{idConversation}")
    public List<Message> getMessages(@PathVariable Long idConversation) {
        return messageService.getMessagesByConversation(idConversation);
    }

    private Long getUserId(String email) throws Exception {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email: " + email);
        }
        return user.getId();
    }


    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Message sendFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sender") String sender,
            @RequestParam("receiver") String receiver
    ) throws Exception {
        // Create or retrieve the conversation
        Conversation conversation = conversationService.createConversation(sender, receiver);
        Long senderId = getUserId(sender);
        Long receiverId = getUserId(receiver);

        // Read file bytes and encode them in Base64
        byte[] fileBytes = file.getBytes();
        String base64File = Base64.getEncoder().encodeToString(fileBytes);

        // Use the file's actual MIME type, converting to lowercase for consistency.
        String mimeType = file.getContentType();
        mimeType = (mimeType != null) ? mimeType.toLowerCase() : "application/octet-stream";

        // Build the data URL correctly.
        String dataUrl = "data:" + mimeType + ";base64," + base64File;

        // Create a ChatMessage and include the data URL.
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setType(ChatMessage.MessageType.CHAT);
        chatMessage.setSender(sender);
        chatMessage.setReceiver(receiver);
        chatMessage.setContent("[FILE] " + file.getOriginalFilename() + " | " + dataUrl);

        // Save and return the message.
        return messageService.saveMessage(chatMessage, conversation.getId(), senderId, receiverId);
    }


}
