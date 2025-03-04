package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Notification message (e.g., "A consultant applied for your mission X")
    private String message;

    // Indicates if the notification has been read
    private boolean readStatus;

    // Creation date of the notification
    private Date createdAt;

    // Reference to the User (which can be an enterprise or consultant)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Notification() {}

    public Notification(String message, User user) {
        this.message = message;
        this.user = user;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = new Date();
        this.readStatus = false;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public boolean isReadStatus() {
        return readStatus;
    }
    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
