package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Consultant extends User {
    @ManyToMany
    private List<Competence> competences;

    @OneToMany(mappedBy = "consultant", fetch = FetchType.EAGER)
    @JsonIgnore // Empêche la sérialisation de ce champ
    private List<Proposition> propositions;

    private String portfolio;
    private int experienceYears;
    private int workload;
    // pour la localisation
    private double latitude;
    private double longitude;

    @ElementCollection(fetch = FetchType.EAGER) // Passage en mode EAGER
    // Pour stocker une liste de chaînes en base de données
    private List<String> domaines;
    private int budgetMin; // Remplacer budget_min par budgetMin en Java


    public Consultant() {}

    public Consultant(int budgetMin, List<Competence> competences, List<String> domaines, int experienceYears, double latitude, double longitude, String portfolio, List<Proposition> propositions, int workload) {
        this.budgetMin = budgetMin;
        this.competences = competences;
        this.domaines = domaines;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.workload = workload;
    }

    public Consultant(String adresse, List<Avis> avisRecus, List<Avis> avisRediges, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, String role, String photoprofile, String statut, int budgetMin, List<Competence> competences1, List<String> domaines, int experienceYears, double latitude, double longitude, String portfolio, List<Proposition> propositions, int workload) {
        super(adresse, avisRecus, avisRediges, competences, email, id, nom, notifications, password, prenom, telephone, role, photoprofile, statut);
        this.budgetMin = budgetMin;
        this.competences = competences1;
        this.domaines = domaines;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.workload = workload;
    }

    public Consultant(List<Avis> avisRecus, String adresse, List<Avis> avisRediges, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, String photoprofile, int budgetMin, List<Competence> competences, List<String> domaines, int experienceYears, double latitude, double longitude, String portfolio, List<Proposition> propositions, int workload) {
        super(avisRecus, adresse, avisRediges, email, id, nom, notifications, password, telephone, photoprofile);
        this.budgetMin = budgetMin;
        this.competences = competences;
        this.domaines = domaines;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.workload = workload;
    }

    public Consultant(String nom, int budgetMin, List<Competence> competences, List<String> domaines, int experienceYears, double latitude, double longitude, String portfolio, List<Proposition> propositions, int workload) {
        super(nom);
        this.budgetMin = budgetMin;
        this.competences = competences;
        this.domaines = domaines;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.workload = workload;
    }

    public Consultant(String nom, String prenom, String telephone, String email, String encodedPassword, String role, int budgetMin, List<Competence> competences, List<String> domaines, int experienceYears, double latitude, double longitude, String portfolio, List<Proposition> propositions, int workload) {
        super(nom, prenom, telephone, email, encodedPassword, role);
        this.budgetMin = budgetMin;
        this.competences = competences;
        this.domaines = domaines;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.workload = workload;
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

    public int getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(int budgetMin) {
        this.budgetMin = budgetMin;
    }

    @Override
    public List<Competence> getCompetences() {
        return competences;
    }

    @Override
    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

    public int getWorkload() {
        return workload;
    }

    public void setWorkload(int workload) {
        this.workload = workload;
    }

    public List<String> getDomaines() {
        return domaines;
    }

    public void setDomaines(List<String> domaines) {
        this.domaines = domaines;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
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

    @Override
    public String toString() {
        return "Consultant{" +
                "competences=" + competences +
                ", propositions=" + propositions +
                ", portfolio='" + portfolio + '\'' +
                ", experienceYears=" + experienceYears +
                ", domaines=" + domaines +
                '}';
    }
    public boolean isAvailableDuring(Date startDate, Date endDate) {
        if (propositions == null || propositions.isEmpty()) {
            return true; // Aucun engagement, donc disponible
        }

        for (Proposition proposition : propositions) {
            if ("ACCEPTEE".equalsIgnoreCase(proposition.getStatut())) { // Vérifier si la proposition est acceptée
                Mission mission = proposition.getMission();
                if (mission != null) {
                    Date missionStart = mission.getStartdate();
                    Date missionEnd = mission.getEnddate();

                    // Vérifier si la mission chevauche la période demandée
                    if ((missionStart.before(endDate) || missionStart.equals(endDate)) &&
                            (missionEnd.after(startDate) || missionEnd.equals(startDate))) {
                        return false; // Le consultant a déjà une mission durant cette période
                    }
                }
            }
        }
        return true; // Pas de conflits avec des missions acceptées
    }
    public boolean hasWorkedWithClient(Entreprise entreprise) {
        if (propositions == null || propositions.isEmpty()) {
            return false;
        }

        for (Proposition proposition : propositions) {
            if ("ACCEPTEE".equalsIgnoreCase(proposition.getStatut())) { // Vérifie si la proposition a été acceptée
                Mission mission = proposition.getMission();
                if (mission != null && mission.getEntreprise() != null) {
                    if (mission.getEntreprise().getId().equals(entreprise.getId())) {
                        return true; // Le consultant a déjà travaillé avec cette entreprise
                    }
                }
            }
        }
        return false;
    }
    public double getAcceptanceRate() {
        if (propositions == null || propositions.isEmpty()) {
            return 1.0; // Par défaut, si le consultant n'a pas encore reçu de missions, son taux est considéré comme parfait.
        }

        long acceptedCount = propositions.stream()
                .filter(p -> "ACCEPTEE".equalsIgnoreCase(p.getStatut()))
                .count();

        return (double) acceptedCount / propositions.size();
    }



}
