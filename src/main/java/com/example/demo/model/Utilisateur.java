package com.example.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String password;
    @OneToMany(mappedBy = "utilisateur")
    private List<Notification> notifications;

    @ManyToMany
    private List<Competence> competences;

    @OneToMany(mappedBy = "auteur")
    private List<Avis> avisRediges;

    @OneToMany(mappedBy = "cible")
    private List<Avis> avisRecus;


    public Utilisateur() {}

    public Utilisateur(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone) {
        this.adresse = adresse;
        this.avisRecus = avisRecus;
        this.avisRediges = avisRediges;
        this.competences = competences;
        this.email = email;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.prenom = prenom;
        this.telephone = telephone;
    }

    public Utilisateur(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone) {
        this.avisRecus = avisRecus;
        this.adresse = adresse;
        this.avisRediges = avisRediges;
        this.email = email;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public List<Avis> getAvisRecus() {
        return avisRecus;
    }

    public void setAvisRecus(List<Avis> avisRecus) {
        this.avisRecus = avisRecus;
    }

    public List<Avis> getAvisRediges() {
        return avisRediges;
    }

    public void setAvisRediges(List<Avis> avisRediges) {
        this.avisRediges = avisRediges;
    }

    public List<Competence> getCompetences() {
        return competences;
    }

    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}