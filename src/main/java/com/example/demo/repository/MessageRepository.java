package com.example.demo.repository;

import com.example.demo.chat.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Additional query methods if needed
}

