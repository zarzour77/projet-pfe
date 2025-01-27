package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    private String message;
    private Boolean estLu;
    private String type;
    public Notification() {}

    public Notification(Boolean estLu, Long id, String message, String type, Utilisateur utilisateur) {
        this.estLu = estLu;
        this.id = id;
        this.message = message;
        this.type = type;
        this.utilisateur = utilisateur;
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

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
