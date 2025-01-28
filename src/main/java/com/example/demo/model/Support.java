package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Support {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTicket;

    private Long idUtilisateur; // User ID
    private String sujet;       // Subject
    private String description; // Description of the ticket
    private LocalDateTime dateCreation; // Date of creation

    @Enumerated(EnumType.STRING)
    private Statut statut; // Status of the ticket (OPEN, RESOLVED, CLOSED)

    // Enum for Status
    public enum Statut {
        OUVERT, RESOLU, FERME
    }

    // Constructors
    public Support() {}

    public Support(Long idUtilisateur, String sujet, String description, LocalDateTime dateCreation, Statut statut) {
        this.idUtilisateur = idUtilisateur;
        this.sujet = sujet;
        this.description = description;
        this.dateCreation = dateCreation;
        this.statut = statut;
    }

    // Getters and Setters
    public Long getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(Long idTicket) {
        this.idTicket = idTicket;
    }

    public Long getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    @Override
    public String toString() {
        return "Support{" +
                "idTicket=" + idTicket +
                ", idUtilisateur=" + idUtilisateur +
                ", sujet='" + sujet + '\'' +
                ", description='" + description + '\'' +
                ", dateCreation=" + dateCreation +
                ", statut=" + statut +
                '}';
    }
}
