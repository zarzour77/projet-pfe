package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    @JsonIgnore
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String password;
    private String role;
    private String photoprofile;
    private String statut;
    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Notification> notifications;
    @JsonIgnore
    @ManyToMany
    private List<Competence> competences;

    @JsonIgnore // Prevent serialization of lazy-loaded collection
    @OneToMany(mappedBy = "cible", fetch = FetchType.LAZY)
    private List<Avis> avisRecus;

    @JsonIgnore // Prevent serialization of eager-loaded collection if not needed
    @OneToMany(mappedBy = "auteur", fetch = FetchType.EAGER)
    private List<Avis> avisRediges;

    private Double rating;

    public User(String nom) {
        this.nom = nom;
    }

    public User() {}

    public User(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone , String role,String photoprofile,String statut) {
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
        this.role = role;
        this.photoprofile = photoprofile;
        this.statut = statut;
    }

    public User(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone,String photoprofile) {
        this.avisRecus = avisRecus;
        this.adresse = adresse;
        this.avisRediges = avisRediges;
        this.email = email;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.telephone = telephone;
        this.photoprofile = photoprofile;
    }

    public User(String nom, String prenom, String telephone, String email, String encodedPassword, String role) {
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.password = encodedPassword;
        this.role = role;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getPhotoprofile() {
        return photoprofile;
    }

    public void setPhotoprofile(String photoprofile) {
        this.photoprofile = photoprofile;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}