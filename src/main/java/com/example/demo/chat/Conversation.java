package com.example.demo.chat;

import com.example.demo.model.User;
import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "conversation_participants",
            joinColumns = @JoinColumn(name = "conversation_id", referencedColumnName = "id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false),
            uniqueConstraints = @UniqueConstraint(columnNames = {"conversation_id", "user_id"})
    )
    private Set<User> participants;

    public Conversation() {
    }

    public Conversation(Set<User> participants) {
        this.participants = participants;
    }

    public Long getId() {
        return id;
    }

    public Set<User> getParticipants() {
        return participants;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }
}
