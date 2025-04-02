package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;



@Entity
@DiscriminatorValue("ENTREPRISE")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Entreprise extends User {

    // Type d'entreprise : CLIENTE ou SSI
    @Enumerated(EnumType.STRING)
    private TypeEntreprise typeEntreprise;

    // Missions publiées : pertinentes uniquement si l'entreprise est cliente
    @OneToMany(mappedBy = "entreprise", fetch = FetchType.EAGER)
    private List<Mission> missions;

    @JsonIgnore
    @OneToMany(mappedBy = "entrepriseSsi", fetch = FetchType.EAGER)
    private List<Consultant> consultants; // Une entreprise SSI gère des consultants

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    private String nomEntreprise;
    // Énumération pour distinguer les types d'entreprise
    public enum TypeEntreprise {
        CLIENTE,  // Entreprise cliente : peut publier des missions
        SSI       // Entreprise SSI : ne publie pas de missions, gère des consultants
    }

    @Column(name = "frozen_balance", columnDefinition = "double default 0.0")
    private Double frozenBalance = 0.0;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = true)
    private Date dateInscription;

    // Constructeur par défaut
    public Entreprise() {}

    // Constructeur complet
    public Entreprise(Double latitude, Double longitude, List<Mission> missions, String nomEntreprise, TypeEntreprise typeEntreprise) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
        this.typeEntreprise = typeEntreprise;
    }

    // Getters et setters

    public Date getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(Date dateInscription) {
        this.dateInscription = dateInscription;
    }

    public List<Consultant> getConsultants() {
        return consultants;
    }

    public void setConsultants(List<Consultant> consultants) {
        this.consultants = consultants;
    }

    public TypeEntreprise getTypeEntreprise() {
        return typeEntreprise;
    }

    public void setTypeEntreprise(TypeEntreprise typeEntreprise) {
        this.typeEntreprise = typeEntreprise;
    }

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getNomEntreprise() {
        return nomEntreprise;
    }

    public void setNomEntreprise(String nomEntreprise) {
        this.nomEntreprise = nomEntreprise;
    }

    public Double getFrozenBalance() {
        return frozenBalance;
    }

    public void setFrozenBalance(Double frozenBalance) {
        this.frozenBalance = frozenBalance != null ? frozenBalance : 0.00;
    }
}

