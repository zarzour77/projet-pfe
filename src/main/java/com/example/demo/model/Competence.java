package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@JsonIgnoreProperties({"missions"})
public class Competence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    @Column(name = "competence_niveau")
    private String competenceNiveau;

    @ManyToMany(mappedBy = "competencesRequises")
    private List<Mission> missions;

    public Competence() {}

    public Competence(Long id, String nom, String competenceNiveau, List<Mission> missions) {
        this.id = id;
        this.nom = nom;
        setCompetenceNiveau(competenceNiveau);
        this.missions = missions;
    }

    public Competence(String nom, String competenceNiveau) {
        this.nom = nom;
        setCompetenceNiveau(competenceNiveau);
    }

    public String getCompetenceNiveau() { // Fixed missing parenthesis
        return competenceNiveau;
    }

    public void setCompetenceNiveau(String competenceNiveau) {
        if (!competenceNiveau.equalsIgnoreCase("débutant") &&
                !competenceNiveau.equalsIgnoreCase("intermédiaire") &&
                !competenceNiveau.equalsIgnoreCase("expert")) {
            throw new IllegalArgumentException("Invalid competence level: Must be 'débutant', 'intermédiaire', or 'expert'.");
        }
        this.competenceNiveau = competenceNiveau;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public List<Mission> getMissions() { return missions; }
    public void setMissions(List<Mission> missions) { this.missions = missions; }
}
