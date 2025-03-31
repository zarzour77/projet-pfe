package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@DiscriminatorValue("CONSULTANT")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Consultant extends User {
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = true)
    private Date dateInscription;
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

    @Column(nullable = true)
    private Date dateRecrutement;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_experiences",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "experience_id")
    )
    private List<Experience> experiences;


    // New field for CV storage (as PDF bytes)
    @Lob
    @Basic(fetch = FetchType.EAGER)  // Ajoutez cette annotation pour forcer le chargement
    @Column(nullable = true, columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] cv;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_saved_missions",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "mission_id")
    )
    private List<Mission> savedMissions;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_formations",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "formation_id")
    )
    private List<Formation> formations;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_certifications",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "certification_id")
    )
    private List<Certification> certifications;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "consultant_langues",
            joinColumns = @JoinColumn(name = "consultant_id"),
            inverseJoinColumns = @JoinColumn(name = "langue_id")
    )
    private List<Langue> langues;
    @Column(name = "badge", nullable = true)
    private String badge;


    @OneToMany(mappedBy = "consultant", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    private List<Subscription> subscriptions;
    // Nouveau champ pour le type de consultant : FREE ou ENTREPRISE_SSI
    @Enumerated(EnumType.STRING)
    private TypeConsultant typeConsultant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entreprise_ssi_id")
    private Entreprise entrepriseSsi;


    public enum TypeConsultant {
        FREE,           // Consultant indépendant
        ENTREPRISE_SSI  // Consultant affilié à une entreprise SSI
    }

    public Consultant() {}

    public Consultant(List<Avis> avisDonnes, List<Avis> avisRecus, Integer taux_horaire, List<Competence> competences,
                      List<Domaine> domaines, List<Experience> experiences, Integer experienceYears, Double latitude,
                      Double longitude, String portfolio, List<Proposition> propositions, List<Mission> savedMissions,
                      Integer workload, TypeConsultant typeConsultant,Entreprise entrepriseSsi) {
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
        this.typeConsultant = typeConsultant;
        this.entrepriseSsi = entrepriseSsi;
    }

    public Date getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(Date dateInscription) {
        this.dateInscription = dateInscription;
    }

    public Entreprise getEntrepriseSsi() {
        return entrepriseSsi;
    }

    public void setEntrepriseSsi(Entreprise entrepriseSsi) {
        this.entrepriseSsi = entrepriseSsi;
    }
    public TypeConsultant getTypeConsultant() {
        return typeConsultant;
    }

    public void setTypeConsultant(TypeConsultant typeConsultant) {
        this.typeConsultant = typeConsultant;
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

    public Date getDateRecrutement() {
        return dateRecrutement;
    }

    public void setDateRecrutement(Date dateRecrutement) {
        this.dateRecrutement = dateRecrutement;
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
    // Getters and setters for new field
    public byte[] getCv() {
        return cv;
    }

    public void setCv(byte[] cv) {
        this.cv = cv;
    }

    public List<Formation> getFormations() {
        return formations;
    }

    public void setFormations(List<Formation> formations) {
        this.formations = formations;
    }

    public List<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public List<Langue> getLangues() {
        return langues;
    }

    public void setLangues(List<Langue> langues) {
        this.langues = langues;
    }

    public List<Subscription> getSubscriptions() {
        return subscriptions;
    }
    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

}
