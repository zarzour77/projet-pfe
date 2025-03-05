package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@DiscriminatorValue("ENTREPRISE")
public class Entreprise extends User {
    @JsonIgnore
    @OneToMany(mappedBy = "entreprise", fetch = FetchType.EAGER)
    private List<Mission> missions;

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    private String nomEntreprise;


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

}
