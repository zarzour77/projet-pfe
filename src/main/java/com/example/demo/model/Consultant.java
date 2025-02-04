package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Consultant extends User {
    @ManyToMany
    private List<Competence> competences;

    @OneToMany(mappedBy = "consultant")
    @JsonIgnore // Prevents serialization of this field
    private List<Proposition> propositions;
    private String portfolio;
    private int experienceYears;
    private int currentWorkload;

    @Column(name = "localisation")
    private String localisation;
    public Consultant() {}

    public Consultant(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, List<Competence> competences1, String portfolio, List<Proposition> propositions,String role,String photoprofil,String statut) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone,role,photoprofil,statut);
        this.competences = competences1;
        this.portfolio = portfolio;
        this.propositions = propositions;
    }

    public int getCurrentWorkload() {
        return currentWorkload;
    }

    public void setCurrentWorkload(int currentWorkload) {
        this.currentWorkload = currentWorkload;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    @Override
    public List<Competence> getCompetences() {
        return competences;
    }

    @Override
    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public List<Proposition> getPropositions() {
        return propositions;
    }

    public void setPropositions(List<Proposition> propositions) {
        this.propositions = propositions;
    }

}