package com.example.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Competence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToMany(mappedBy = "competences")
    private List<Consultant> consultants;

    @ManyToMany(mappedBy = "competencesRequises")
    private List<Mission> missions;

    @ManyToMany(mappedBy = "competences")
    private List<User> users;
    public Competence() {}
    public Competence(List<Consultant> consultants, Long id, List<Mission> missions, String nom, List<User> users) {
        this.consultants = consultants;
        this.id = id;
        this.missions = missions;
        this.nom = nom;
        this.users = users;
    }

    public List<Consultant> getConsultants() {
        return consultants;
    }

    public void setConsultants(List<Consultant> consultants) {
        this.consultants = consultants;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public List<User> getUtilisateurs() {
        return users;
    }

    public void setUtilisateurs(List<User> users) {
        this.users = users;
    }
}
