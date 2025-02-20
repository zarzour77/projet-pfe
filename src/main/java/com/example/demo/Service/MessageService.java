package com.example.demo.Service;

import com.example.demo.chat.ChatMessage;
import com.example.demo.chat.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(ChatMessage chatMessage, Long idConversation, Long idExpediteur, Long idDestinataire) {
        Message message = new Message();
        message.setIdConversation(idConversation);
        message.setIdExpediteur(idExpediteur);
        message.setIdDestinataire(idDestinataire);
        message.setContenu(chatMessage.getContent());
        message.setDateEnvoi(LocalDateTime.now());
        message.setStatut(Message.Statut.NON_LU);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByConversation(Long idConversation) {
        return messageRepository.findByIdConversationOrderByDateEnvoiAsc(idConversation);
    }
}
