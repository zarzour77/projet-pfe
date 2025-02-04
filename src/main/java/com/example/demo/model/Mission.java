package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String domaine;
    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;
    @JsonIgnore
    @ManyToMany
    private List<Competence> competencesRequises;
    @JsonIgnore
    @OneToMany(mappedBy = "mission")
    private List<Proposition> propositions;
    @OneToMany(mappedBy = "mission")
    private List<Avis> avis;
    private String localisation;
    private int requiredExperience;

    public Mission() {}

    public Mission(Double budget, List<Competence> competencesRequises, Date deadline, String description, Entreprise entreprise, Long id, List<Proposition> propositions, String statut, String titre,String domaine) {
        this.budget = budget;
        this.competencesRequises = competencesRequises;
        this.deadline = deadline;
        this.description = description;
        this.entreprise = entreprise;
        this.id = id;
        this.propositions = propositions;
        this.statut = statut;
        this.titre = titre;
        this.domaine = domaine;
    }

    public Mission(List<Avis> avis, Double budget, List<Competence> competencesRequises, Date deadline, String description, String domaine, Entreprise entreprise, Long id, String localisation, List<Proposition> propositions, int requiredExperience, String statut, String titre) {
        this.avis = avis;
        this.budget = budget;
        this.competencesRequises = competencesRequises;
        this.deadline = deadline;
        this.description = description;
        this.domaine = domaine;
        this.entreprise = entreprise;
        this.id = id;
        this.localisation = localisation;
        this.propositions = propositions;
        this.requiredExperience = requiredExperience;
        this.statut = statut;
        this.titre = titre;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public int getRequiredExperience() {
        return requiredExperience;
    }

    public void setRequiredExperience(int requiredExperience) {
        this.requiredExperience = requiredExperience;
    }

    public String getDomaine() {
        return domaine;
    }

    public void setDomaine(String domaine) {
        this.domaine = domaine;
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

    public List<Avis> getAvis() {
        return avis;
    }

    public void setAvis(List<Avis> avis) {
        this.avis = avis;
    }
}