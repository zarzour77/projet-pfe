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

        private String category;

    public Domaine() {
    }

    public Domaine(String category, List<Consultant> consultants, Long id, List<Mission> missions, String nom) {
        this.category = category;
        this.consultants = consultants;
        this.id = id;
        this.missions = missions;
        this.nom = nom;
    }

    public Domaine(String nom, String category) {
        this.nom = nom;
        this.category = category;
    }

    // Getters et setters

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
