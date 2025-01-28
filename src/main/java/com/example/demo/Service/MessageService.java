package com.example.demo.Service;

import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // Create or Update a message
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    // Get all messages
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // Get a message by ID
    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }

    // Delete a message by ID
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
