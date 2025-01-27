package com.example.Trade_For_Talent.Entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String password;
    private String role;  // Role as a String
    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;

    @ManyToMany
    private List<Competence> competences;

    @OneToMany(mappedBy = "auteur")
    private List<Avis> avisRediges;

    @OneToMany(mappedBy = "cible")
    private List<Avis> avisRecus;
    public User() {}

    public User(Long id, String prenom, String nom, String telephone, String email, String password, String role, List<Notification> notifications, List<Competence> competences, List<Avis> avisRediges, List<Avis> avisRecus) {
        this.id = id;
        this.prenom = prenom;
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.role = role;
        this.notifications = notifications;
        this.competences = competences;
        this.avisRediges = avisRediges;
        this.avisRecus = avisRecus;
    }


    public User(String nom, String prenom, String telephone, String email, String encodedPassword, String role) {
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.password = encodedPassword;
    }

    public User(Long id, String nom, String telephone, String email, String password, List<Notification> notifications, List<Avis> avisRediges, List<Avis> avisRecus) {
        this.id = id;
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.notifications = notifications;
        this.avisRediges = avisRediges;
        this.avisRecus = avisRecus;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Competence> getCompetences() {
        return competences;
    }

    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

    public List<Avis> getAvisRediges() {
        return avisRediges;
    }

    public void setAvisRediges(List<Avis> avisRediges) {
        this.avisRediges = avisRediges;
    }

    public List<Avis> getAvisRecus() {
        return avisRecus;
    }

    public void setAvisRecus(List<Avis> avisRecus) {
        this.avisRecus = avisRecus;
    }
}
