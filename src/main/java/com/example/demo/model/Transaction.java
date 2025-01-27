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

    @ManyToOne
    @JoinColumn(name = "debiteur_id")
    private Utilisateur expéditeur;

    @ManyToOne
    @JoinColumn(name = "destinataire_id")
    private Utilisateur destinataire;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;

    public Transaction() {}

    public Transaction(String type, Double montant, Mission mission, Long id, Utilisateur expéditeur, Utilisateur destinataire, Date date) {
        this.type = type;
        this.montant = montant;
        this.mission = mission;
        this.id = id;
        this.expéditeur = expéditeur;
        this.destinataire = destinataire;
        this.date = date;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Utilisateur getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(Utilisateur destinataire) {
        this.destinataire = destinataire;
    }

    public Utilisateur getExpéditeur() {
        return expéditeur;
    }

    public void setExpéditeur(Utilisateur expéditeur) {
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