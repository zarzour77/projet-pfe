package com.example.demo.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMessage;

    private Long idConversation; // Conversation ID
    private Long idExpediteur; // Sender ID
    private Long idDestinataire; // Receiver ID
    private String contenu; // Message content
    private LocalDateTime dateEnvoi; // Sent date and time

    @Enumerated(EnumType.STRING)
    private Statut statut; // Read or Unread

    // Enum for status
    public enum Statut {
        LU, NON_LU
    }

    // Constructors
    public Message() {}

    public Message(Long idConversation, Long idExpediteur, Long idDestinataire, String contenu, LocalDateTime dateEnvoi, Statut statut) {
        this.idConversation = idConversation;
        this.idExpediteur = idExpediteur;
        this.idDestinataire = idDestinataire;
        this.contenu = contenu;
        this.dateEnvoi = dateEnvoi;
        this.statut = statut;
    }

    // Getters and Setters
    public Long getIdMessage() {
        return idMessage;
    }

    public void setIdMessage(Long idMessage) {
        this.idMessage = idMessage;
    }

    public Long getIdConversation() {
        return idConversation;
    }

    public void setIdConversation(Long idConversation) {
        this.idConversation = idConversation;
    }

    public Long getIdExpediteur() {
        return idExpediteur;
    }

    public void setIdExpediteur(Long idExpediteur) {
        this.idExpediteur = idExpediteur;
    }

    public Long getIdDestinataire() {
        return idDestinataire;
    }

    public void setIdDestinataire(Long idDestinataire) {
        this.idDestinataire = idDestinataire;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    @Override
    public String toString() {
        return "Message{" +
                "idMessage=" + idMessage +
                ", idConversation=" + idConversation +
                ", idExpediteur=" + idExpediteur +
                ", idDestinataire=" + idDestinataire +
                ", contenu='" + contenu + '\'' +
                ", dateEnvoi=" + dateEnvoi +
                ", statut=" + statut +
                '}';
    }
}

