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
    private Integer taux_horaire; // Remplacer budget_min par taux_horaire en Java
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_experiences",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "experience_id")
    )
    private List<Experience> experiences;

    @JsonIgnore
    @OneToMany(mappedBy = "auteur", fetch = FetchType.LAZY)
    private List<Avis> avisDonnes; // Reviews given by this consultant (should target entreprises)

    @JsonIgnore

    @OneToMany(mappedBy = "cible", fetch = FetchType.LAZY)
    private List<Avis> avisRecus; // Reviews received by this consultant (should come from entreprises)

    // New field for CV storage (as PDF bytes)
    @Lob
    @Column(nullable = true, columnDefinition = "LONGBLOB")
    private byte[] cv;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_saved_missions",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "mission_id")
    )
    private List<Mission> savedMissions;
    public Consultant() {}

    public Consultant(List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String adresse, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone, String role, String photoprofile, String statut, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences1, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(adresse, competences, email, id, nom, notifications, password, prenom, telephone, role, photoprofile, statut);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences1;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String adresse, String email, Long id, String nom, List<Notification> notifications, String password, String telephone, String photoprofile, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(adresse, email, id, nom, notifications, password, telephone, photoprofile);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String nom, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(nom);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String nom, String prenom, String email, String encodedPassword, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(nom, prenom, email, encodedPassword);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String nom, String prenom, String telephone, String email, String encodedPassword, String role, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(nom, prenom, telephone, email, encodedPassword, role);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public Consultant(String nom, String prenom, String telephone, String email, String encodedPassword, String role, String subscriptionType, List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences, List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude, Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions, Integer workload) {
        super(nom, prenom, telephone, email, encodedPassword, role, subscriptionType);
        this.avisDonnes = avisDonnes;
        this.avisRecus = avisRecus;
        this.taux_horaire = taux_horaire;
        this.competences = competences;
        this.domaines = domaines;
        this.experiences = experiences;
        this.experienceYears = experienceYears;
        this.latitude = latitude;
        this.longitude = longitude;
        this.portfolio = portfolio;
        this.propositions = propositions;
        this.savedMissions = savedMissions;
        this.workload = workload;
    }

    public List<Mission> getSavedMissions() {
        return savedMissions;
    }

    public void setSavedMissions(List<Mission> savedMissions) {
        this.savedMissions = savedMissions;
    }

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

    public Integer getTaux_horaire() {
        return taux_horaire;
    }

    public void setTaux_horaire(Integer taux_horaire) {
        this.taux_horaire = taux_horaire;
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
    public List<Avis> getAvisDonnes() {
        return avisDonnes;
    }

    public void setAvisDonnes(List<Avis> avisDonnes) {
        this.avisDonnes = avisDonnes;
    }

    public List<Avis> getAvisRecus() {
        return avisRecus;
    }

    public void setAvisRecus(List<Avis> avisRecus) {
        this.avisRecus = avisRecus;
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

    // Getters and setters for new field
    public byte[] getCv() {
        return cv;
    }

    public void setCv(byte[] cv) {
        this.cv = cv;
    }
}
