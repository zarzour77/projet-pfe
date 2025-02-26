package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Consultant extends User {
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, }, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_competences",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "competence_id")
    )
    private List<Competence> competences;


    @OneToMany(mappedBy = "consultant", fetch = FetchType.EAGER)
    @JsonIgnore // Empêche la sérialisation de ce champ
    private List<Proposition> propositions;

    @Column(nullable = true)
    private String portfolio;
    @Column(nullable = true)
    private Integer experienceYears;
    @Column(nullable = true)
    private Integer workload;
    // pour la localisation
    @Column(nullable = true)
    private Double latitude;
    @Column(nullable = true)
    private Double longitude;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_domaines",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "domaine_id")
    )
    private List<Domaine> domaines;
    @Column(nullable = true)
    private Integer budgetMin; // Remplacer budget_min par budgetMin en Java
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_experiences",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "experience_id")
    )
    private List<Experience> experiences;




    public Consultant() {}



    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(Integer budgetMin) {
        this.budgetMin = budgetMin;
    }

    public List<Competence> getCompetences() {
        return competences;
    }

    public void setCompetences(List<Competence> competences) {
        this.competences = competences;
    }

    public Integer getWorkload() {
        return workload;
    }

    public void setWorkload(Integer workload) {
        this.workload = workload;
    }

    public List<Domaine> getDomaines() {
        return domaines;
    }

    public void setDomaines(List<Domaine> domaines) {
        this.domaines = domaines;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
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
    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
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
    public Double getAcceptanceRate() {
        if (propositions == null || propositions.isEmpty()) {
            return 1.0; // Par défaut, si le consultant n'a pas encore reçu de missions, son taux est considéré comme parfait.
        }

        long acceptedCount = propositions.stream()
                .filter(p -> "ACCEPTEE".equalsIgnoreCase(p.getStatut()))
                .count();

        return (double) acceptedCount / propositions.size();
    }
}
