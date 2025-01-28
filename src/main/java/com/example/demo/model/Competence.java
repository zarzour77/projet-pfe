package com.example.Trade_For_Talent.Entity;

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
<<<<<<< HEAD:src/main/java/com/example/Trade_For_Talent/Entity/Competence.java
    private List<User> Users;
    public Competence() {}
    public Competence(List<Consultant> consultants, Long id, List<Mission> missions, String nom, List<User> Users) {
=======
    private List<User> users;
    public Competence() {}
    public Competence(List<Consultant> consultants, Long id, List<Mission> missions, String nom, List<User> users) {
>>>>>>> 7a9975fca109a84f1345bf1a4c460d7f6dbf917d:src/main/java/com/example/demo/model/Competence.java
        this.consultants = consultants;
        this.id = id;
        this.missions = missions;
        this.nom = nom;
<<<<<<< HEAD:src/main/java/com/example/Trade_For_Talent/Entity/Competence.java
        this.Users = Users;
=======
        this.users = users;
>>>>>>> 7a9975fca109a84f1345bf1a4c460d7f6dbf917d:src/main/java/com/example/demo/model/Competence.java
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

<<<<<<< HEAD:src/main/java/com/example/Trade_For_Talent/Entity/Competence.java
    public List<User> getUsers() {
        return Users;
    }

    public void setUsers(List<User> Users) {
        this.Users = Users;
=======
    public List<User> getUtilisateurs() {
        return users;
    }

    public void setUtilisateurs(List<User> users) {
        this.users = users;
>>>>>>> 7a9975fca109a84f1345bf1a4c460d7f6dbf917d:src/main/java/com/example/demo/model/Competence.java
    }
}
