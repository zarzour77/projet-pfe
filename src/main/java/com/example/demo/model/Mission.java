package com.example.Trade_For_Talent.Entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private Double budget;
    private Date deadline;
    private String statut;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @ManyToMany
    private List<Competence> competencesRequises;

    @OneToMany(mappedBy = "mission")
    private List<Proposition> propositions;

    public Mission() {}

    public Mission(Double budget, List<Competence> competencesRequises, Date deadline, String description, Entreprise entreprise, Long id, List<Proposition> propositions, String statut, String titre) {
        this.budget = budget;
        this.competencesRequises = competencesRequises;
        this.deadline = deadline;
        this.description = description;
        this.entreprise = entreprise;
        this.id = id;
        this.propositions = propositions;
        this.statut = statut;
        this.titre = titre;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public List<Competence> getCompetencesRequises() {
        return competencesRequises;
    }

    public void setCompetencesRequises(List<Competence> competencesRequises) {
        this.competencesRequises = competencesRequises;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Entreprise getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(Entreprise entreprise) {
        this.entreprise = entreprise;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Proposition> getPropositions() {
        return propositions;
    }

    public void setPropositions(List<Proposition> propositions) {
        this.propositions = propositions;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}