package com.example.demo.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montant;
    private Date date;
    private String type;
    private String statut;
    @ManyToOne
    @JoinColumn(name = "debiteur_id")
    private User expéditeur;

    @ManyToOne
    @JoinColumn(name = "destinataire_id")
    private User destinataire;

    @ManyToOne
    @JoinColumn(name = "mission_id", nullable = true)
    private Mission mission;

    public Transaction() {}

    public Transaction(String type, Double montant, Mission mission, Long id, User expéditeur, User destinataire, Date date,String statut) {
        this.type = type;
        this.montant = montant;
        this.mission = mission;
        this.id = id;
        this.expéditeur = expéditeur;
        this.destinataire = destinataire;
        this.date = date;
        this.statut = statut;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(User destinataire) {
        this.destinataire = destinataire;
    }

    public User getExpéditeur() {
        return expéditeur;
    }

    public void setExpéditeur(User expéditeur) {
        this.expéditeur = expéditeur;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mission getMission() {
        return mission;
    }

    public void setMission(Mission mission) {
        this.mission = mission;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}