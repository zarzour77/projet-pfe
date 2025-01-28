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

<<<<<<< HEAD:src/main/java/com/example/Trade_For_Talent/Entity/Consultant.java
    public Consultant(List<Competence> competences, List<Proposition> propositions, String portfolio) {
        this.competences = competences;
=======
    public Consultant(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, List<Competence> competences1, String portfolio, List<Proposition> propositions,String role) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone,role);
        this.competences = competences1;
        this.portfolio = portfolio;
>>>>>>> 7a9975fca109a84f1345bf1a4c460d7f6dbf917d:src/main/java/com/example/demo/model/Consultant.java
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