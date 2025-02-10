package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Competence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private int competenceNiveaux;

    @ManyToMany(mappedBy = "competencesRequises")
    private List<Mission> missions;

    public Competence() {}

    public Competence(int competenceNiveaux, Long id, List<Mission> missions, String nom) {
        this.competenceNiveaux = competenceNiveaux;
        this.id = id;
        this.missions = missions;
        this.nom = nom;
    }

    public int getCompetenceNiveaux() {
        return competenceNiveaux;
    }

    public void setCompetenceNiveaux(int competenceNiveaux) {
        this.competenceNiveaux = competenceNiveaux;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public List<Mission> getMissions() { return missions; }
    public void setMissions(List<Mission> missions) { this.missions = missions; }
}
