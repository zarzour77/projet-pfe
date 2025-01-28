package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Entreprise extends User {
    @OneToMany(mappedBy = "entreprise")
    private List<Mission> missions;

    public Entreprise(List<Mission> missions) {
        this.missions = missions;
    }
    public Entreprise(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, List<Mission> missions,String photoprofil) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone,photoprofil);
        this.missions = missions;
    }

    public Entreprise() {}

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }
}