package com.example.demo.repository;

import com.example.demo.chat.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.participants p " +
            "WHERE p.email IN (:email1, :email2) " +
            "GROUP BY c " +
            "HAVING COUNT(DISTINCT p.email) = 2")
    List<Conversation> findConversationsByParticipants(@Param("email1") String email1, @Param("email2") String email2);

    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.email = :email")
    List<Conversation> findAllByParticipantEmail(@Param("email") String email);
}
