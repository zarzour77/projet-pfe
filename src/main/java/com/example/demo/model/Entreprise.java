package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity
public class Entreprise extends User {
    @JsonIgnore
    @OneToMany(mappedBy = "entreprise", fetch = FetchType.EAGER)
    private List<Mission> missions;

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    private String nomEntreprise;
    @OneToMany(mappedBy = "auteur", fetch = FetchType.LAZY)
    private List<Avis> avisDonnes; // Reviews given by this entreprise (should target consultants)

    @OneToMany(mappedBy = "cible", fetch = FetchType.LAZY)
    private List<Avis> avisRecus; // Reviews received by this entreprise (should come from consultants)

    public Entreprise() {}

    public Entreprise(Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    // Autres constructeurs et getters/setters simplifiés

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
    public List<Mission> getMissions() {
        return missions;
    }
    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }
    // Add the corresponding getters and setters
    public List<Avis> getAvisDonnes() {
        return avisDonnes;
    }

    public void setAvisDonnes(List<Avis> avisDonnes) {
        this.avisDonnes = avisDonnes;
    }

    public List<Avis> getAvisRecus() {
        return avisRecus;
    }

    public void setAvisRecus(List<Avis> avisRecus) {
        this.avisRecus = avisRecus;
    }
}
