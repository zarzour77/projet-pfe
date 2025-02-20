package com.example.demo.repository;

import com.example.demo.chat.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByIdConversationOrderByDateEnvoiAsc(Long idConversation);

}

