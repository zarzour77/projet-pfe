// Mission.java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

@Entity
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private Double budget;
    private String statut;

    // Relation avec Domaine (déjà configurée avec cascade)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "mission_domaines",
            joinColumns = @JoinColumn(name = "mission_id"),
            inverseJoinColumns = @JoinColumn(name = "domaine_id")
    )
    private List<Domaine> domaines;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "mission_competences",
            joinColumns = @JoinColumn(name = "mission_id"),
            inverseJoinColumns = @JoinColumn(name = "competence_id")
    )
    private List<Competence> competencesRequises;

    @JsonManagedReference
    @OneToMany(mappedBy = "mission",fetch = FetchType.EAGER)
    private List<Proposition> propositions;

    @JsonProperty("propositionsCount")
    @Transient
    public int getPropositionsCount() {
        return (propositions != null) ? propositions.size() : 0;
    }

    // Pour la localisation
    private double latitude;
    private double longitude;
    private int requiredExperience;
    private double matchScore;
    private Date startdate;
    private Date enddate;
    private String logo;
    private String portetravail;
    private String dureeEstime;
    private String niveauExperienceRequis;
    private Date PublishedAt;


    public Mission() {}

    public Mission(Double budget, List<Competence> competencesRequises, String description, List<Domaine> domaines, String dureeEstime, Date enddate, Entreprise entreprise, Long id, double latitude, String logo, double longitude, double matchScore, String niveauExperienceRequis, String portetravail, List<Proposition> propositions, Date publishedAt, int requiredExperience, Date startdate, String statut, String titre) {
        this.budget = budget;
        this.competencesRequises = competencesRequises;
        this.description = description;
        this.domaines = domaines;
        this.dureeEstime = dureeEstime;
        this.enddate = enddate;
        this.entreprise = entreprise;
        this.id = id;
        this.latitude = latitude;
        this.logo = logo;
        this.longitude = longitude;
        this.matchScore = matchScore;
        this.niveauExperienceRequis = niveauExperienceRequis;
        this.portetravail = portetravail;
        this.propositions = propositions;
        PublishedAt = publishedAt;
        this.requiredExperience = requiredExperience;
        this.startdate = startdate;
        this.statut = statut;
        this.titre = titre;
    }

    public Date getPublishedAt() {
        return PublishedAt;
    }

    public void setPublishedAt(Date publishedAt) {
        PublishedAt = publishedAt;
    }

    // Getters et setters

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public String getDureeEstime() {
        return dureeEstime;
    }

    public void setDureeEstime(String dureeEstime) {
        this.dureeEstime = dureeEstime;
    }

    public String getNiveauExperienceRequis() {
        return niveauExperienceRequis;
    }

    public void setNiveauExperienceRequis(String niveauExperienceRequis) {
        this.niveauExperienceRequis = niveauExperienceRequis;
    }

    public String getPortetravail() {
        return portetravail;
    }

    public void setPortetravail(String portetravail) {
        this.portetravail = portetravail;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
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

    public List<Domaine> getDomaines() {
        return domaines;
    }

    public void setDomaines(List<Domaine> domaines) {
        this.domaines = domaines;
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
