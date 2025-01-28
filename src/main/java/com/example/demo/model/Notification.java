package com.example.Trade_For_Talent.Entity;

import jakarta.persistence.*;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private User user;

    private String message;
    private Boolean estLu;
    private String type;
    public Notification() {}

    public Notification(Boolean estLu, Long id, String message, String type, User user) {
        this.estLu = estLu;
        this.id = id;
        this.message = message;
        this.type = type;
        this.user = user;
    }

    public Boolean getEstLu() {
        return estLu;
    }

    public void setEstLu(Boolean estLu) {
        this.estLu = estLu;
    }

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

<<<<<<< HEAD:src/main/java/com/example/Trade_For_Talent/Entity/Notification.java
    public User getUser() {
=======
    public User getUtilisateur() {
>>>>>>> 7a9975fca109a84f1345bf1a4c460d7f6dbf917d:src/main/java/com/example/demo/model/Notification.java
        return user;
    }

    public void setUtilisateur(User user) {
        this.user = user;
    }
}
