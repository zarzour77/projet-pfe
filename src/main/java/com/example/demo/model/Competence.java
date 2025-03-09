package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Entity
@JsonIgnoreProperties({"missions"})
public class Competence {
    private static final Logger logger = LoggerFactory.getLogger(Competence.class);

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
        String niveauLower = competenceNiveau != null ? competenceNiveau.toLowerCase() : null;
        if (niveauLower == null || (!niveauLower.equals("débutant") && !niveauLower.equals("intermédiaire") && !niveauLower.equals("expert"))) {
            throw new IllegalArgumentException("Invalid competence level...");
        }
        this.competenceNiveau = niveauLower; // Stocker en minuscules
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public List<Mission> getMissions() { return missions; }
    public void setMissions(List<Mission> missions) { this.missions = missions; }
}
