package com.example.demo.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Proposition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;

    private Double montant;
    @Column(name = "duree_estime")
    private String dureeEstime;
    private String statut;
    @Column(length = 2048)
    private String message;

    // Nouveau champ pour la date de proposition
    private Date dateProposition;
    private String origine; // "APPLIED" ou "INVITED"


    public Proposition() {}

    public Proposition(Consultant consultant, Date dateProposition, String dureeEstime, Long id, String message, Mission mission, Double montant, String origine, String statut) {
        this.consultant = consultant;
        this.dateProposition = dateProposition;
        this.dureeEstime = dureeEstime;
        this.id = id;
        this.message = message;
        this.mission = mission;
        this.montant = montant;
        this.origine = origine;
        this.statut = statut;
    }

    @PrePersist
    public void prePersist() {
        if (dateProposition == null) {
            dateProposition = new Date();
        }
    }

    public String getOrigine() {
        return origine;
    }

    public void setOrigine(String origine) {
        this.origine = origine;
    }

    public Date getDateProposition() {
        return dateProposition;
    }

    public void setDateProposition(Date dateProposition) {
        this.dateProposition = dateProposition;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Consultant getConsultant() {
        return consultant;
    }

    public void setConsultant(Consultant consultant) {
        this.consultant = consultant;
    }

    public String getDureeEstime() {
        return dureeEstime;
    }

    public void setDureeEstime(String dureeEstime) {
        this.dureeEstime = dureeEstime;
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

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
