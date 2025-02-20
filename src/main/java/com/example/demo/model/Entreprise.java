package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Entreprise extends User {
    @JsonIgnore
    @OneToMany(mappedBy = "entreprise",fetch = FetchType.EAGER)
    private List<Mission> missions;

    private String nomEntreprise;
    public Entreprise(List<Mission> missions) {
        this.missions = missions;
    }

    public Entreprise(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, List<Mission> missions,String photoprofil) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone,photoprofil);
        this.missions = missions;
    }

    public Entreprise(String nomEntreprise, List<Mission> missions) {
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(String nom, String nomEntreprise, List<Mission> missions) {
        super(nom);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, String role, String photoprofile, String statut, String nomEntreprise, List<Mission> missions) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone, role, photoprofile, statut);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, String photoprofile, String nomEntreprise, List<Mission> missions) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone, photoprofile);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, String nomEntreprise, List<Mission> missions) {
        super(nom, prenom, telephone, email, encodedPassword, role);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(String nom, String prenom, String email, String encodedPassword, String nomEntreprise, List<Mission> missions) {
        super(nom, prenom, email, encodedPassword);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, String subscriptionType, String nomEntreprise, List<Mission> missions) {
        super(nom, prenom, telephone, email, encodedPassword, role, subscriptionType);
        this.nomEntreprise = nomEntreprise;
        this.missions = missions;
    }

    public Entreprise() {}

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
}