package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Entreprise extends User {
    private String nomentreprise;
    @JsonIgnore
    @OneToMany(mappedBy = "entreprise")
    private List<Mission> missions;

    public Entreprise(List<Mission> missions, String nomentreprise) {
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public Entreprise(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, String role, String photoprofile, String statut, List<Mission> missions, String nomentreprise) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone, role, photoprofile, statut);
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public Entreprise(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, String photoprofile, List<Mission> missions, String nomentreprise) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone, photoprofile);
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public Entreprise(String nom, List<Mission> missions, String nomentreprise) {
        super(nom);
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, List<Mission> missions, String nomentreprise) {
        super(nom, prenom, telephone, email, encodedPassword, role);
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, String subscriptionType, List<Mission> missions, String nomentreprise) {
        super(nom, prenom, telephone, email, encodedPassword, role, subscriptionType);
        this.missions = missions;
        this.nomentreprise = nomentreprise;
    }

    public String getNomentreprise() {
        return nomentreprise;
    }

    public void setNomentreprise(String nomentreprise) {
        this.nomentreprise = nomentreprise;
    }

    public Entreprise() {}

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }
}