// src/main/java/com/example/demo/model/Domaine.java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@JsonIgnoreProperties({"missions", "consultants"})
public class Domaine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;


    // Association inverse pour Mission
    @ManyToMany(mappedBy = "domaines")
    private List<Mission> missions;

    // Association inverse pour Consultant
    @ManyToMany(mappedBy = "domaines")
    private List<Consultant> consultants;

    public Domaine() {
    }

    public Domaine(String nom) {
        this.nom = nom;
    }

    public Domaine(Long id, String nom,  List<Mission> missions, List<Consultant> consultants) {
        this.id = id;
        this.nom = nom;
        this.missions = missions;
        this.consultants = consultants;
    }

    // Getters et setters
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

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }

    public List<Consultant> getConsultants() {
        return consultants;
    }

    public void setConsultants(List<Consultant> consultants) {
        this.consultants = consultants;
    }
}
