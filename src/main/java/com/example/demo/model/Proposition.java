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
    private Date durée_estimé;
    private String statut;

    public Proposition() {}

    public Proposition(Consultant consultant, Date durée_estimé, Long id, Mission mission, Double montant, String statut) {
        this.consultant = consultant;
        this.durée_estimé = durée_estimé;
        this.id = id;
        this.mission = mission;
        this.montant = montant;
        this.statut = statut;
    }

    public Consultant getConsultant() {
        return consultant;
    }

    public void setConsultant(Consultant consultant) {
        this.consultant = consultant;
    }

    public Date getDurée_estimé() {
        return durée_estimé;
    }

    public void setDurée_estimé(Date durée_estimé) {
        this.durée_estimé = durée_estimé;
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
