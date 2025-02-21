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
    @OneToMany(mappedBy = "entreprise",fetch = FetchType.EAGER)
    private List<Mission> missions;
    @Column(nullable = true)
    private Double latitude;
    @Column(nullable = true)
    private Double longitude;

    public Entreprise(Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, String role, String photoprofile, String statut, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone, role, photoprofile, statut);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, String photoprofile, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone, photoprofile);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(String nom, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(nom);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(String nom, String prenom, String email, String encodedPassword, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(nom, prenom, email, encodedPassword);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(nom, prenom, telephone, email, encodedPassword, role);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
    }

    public Entreprise(String nom, String prenom, String telephone, String email, String encodedPassword, String role, String subscriptionType, Double latitude, Double longitude, List<Mission> missions, String nomEntreprise) {
        super(nom, prenom, telephone, email, encodedPassword, role, subscriptionType);
        this.latitude = latitude;
        this.longitude = longitude;
        this.missions = missions;
        this.nomEntreprise = nomEntreprise;
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