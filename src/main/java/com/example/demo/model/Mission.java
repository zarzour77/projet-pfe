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
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;
    @JsonIgnore
    @ManyToMany
    private List<Competence> competencesRequises;
    @JsonIgnore
    @OneToMany(mappedBy = "mission")
    private List<Proposition> propositions;
    @JsonIgnore
    @OneToMany(mappedBy = "mission", fetch = FetchType.EAGER)
    private List<Avis> avis;
    //pour la localisation
    private double latitude;
    private double longitude;
    private int requiredExperience;
    private double matchScore; // Score de compatibilité mission-consultant
    private Date startdate;
    private Date enddate;

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public Mission() {}

    public Mission(List<Avis> avis, Double budget, List<Competence> competencesRequises, Date deadline, String description, String domaine, Date enddate, Entreprise entreprise, Long id, double latitude, double longitude, double matchScore, List<Proposition> propositions, int requiredExperience, Date startdate, String statut, String titre) {
        this.avis = avis;
        this.budget = budget;
        this.competencesRequises = competencesRequises;
        this.deadline = deadline;
        this.description = description;
        this.domaine = domaine;
        this.enddate = enddate;
        this.entreprise = entreprise;
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.matchScore = matchScore;
        this.propositions = propositions;
        this.requiredExperience = requiredExperience;
        this.startdate = startdate;
        this.statut = statut;
        this.titre = titre;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
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