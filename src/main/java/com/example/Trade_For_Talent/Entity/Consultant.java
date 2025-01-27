package com.example.Trade_For_Talent.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Consultant extends User {
    @ManyToMany
    private List<Competence> competences;

    @OneToMany(mappedBy = "consultant")
    private List<Proposition> propositions;
    private String portfolio;
    public Consultant() {}

    public Consultant(List<Competence> competences, List<Proposition> propositions, String portfolio) {
        this.competences = competences;
        this.propositions = propositions;
        this.portfolio = portfolio;
    }

    public Consultant(Long id, String prenom, String nom, String telephone, String email, String password, String role, List<Notification> notifications, List<Competence> competences, List<Avis> avisRediges, List<Avis> avisRecus, List<Competence> competences1, List<Proposition> propositions, String portfolio) {
        super(id, prenom, nom, telephone, email, password, role, notifications, competences, avisRediges, avisRecus);
        this.competences = competences1;
        this.propositions = propositions;
        this.portfolio = portfolio;
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