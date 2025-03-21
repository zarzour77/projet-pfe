    package com.example.demo.model;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import jakarta.persistence.*;
    import java.util.Date;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

    @Entity
    public class Proposition {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "consultant_id")
        private Consultant consultant;

        // Nouveau champ pour l'entreprise (celle qui recrute)
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "entreprise_id", nullable = true)
        private Entreprise entreprise;

        @JsonBackReference
        @ManyToOne
        @JoinColumn(name = "mission_id")
        private Mission mission;

        private Double montant;

        @Column(name = "duree_estime")
        private String dureeEstime;

        private String statut; // PENDING, refused, terminée, accepted

        @Column(length = 2048)
        private String message;

        // Date de proposition
        private Date dateProposition;

        private String origine; // "APPLIED", "INVITED" ou "RECRUTEMENT"

        private Date dateAcceptation;

        public Proposition() {}

        // Constructeur mis à jour incluant l'entreprise
        public Proposition(Consultant consultant, Entreprise entreprise, Date dateProposition, String dureeEstime, Long id, String message, Mission mission, Double montant, String origine, String statut) {
            this.consultant = consultant;
            this.entreprise = entreprise;
            this.dateProposition = dateProposition;
            this.dureeEstime = dureeEstime;
            this.id = id;
            this.message = message;
            this.mission = mission;
            this.montant = montant;
            this.origine = origine;
            this.statut = statut;
        }

        @PrePersist
        public void prePersist() {
            if (dateProposition == null) {
                dateProposition = new Date();
            }
        }

        // Getters et Setters

        public Long getId() {
            return id;
        }
        public void setId(Long id) {
            this.id = id;
        }

        public Consultant getConsultant() {
            return consultant;
        }
        public void setConsultant(Consultant consultant) {
            this.consultant = consultant;
        }

        public Entreprise getEntreprise() {
            return entreprise;
        }
        public void setEntreprise(Entreprise entreprise) {
            this.entreprise = entreprise;
        }

        public Mission getMission() {
            return mission;
        }
        public void setMission(Mission mission) {
            this.mission = mission;
        }

        public Double getMontant() {
            return montant;
        }
        public void setMontant(Double montant) {
            this.montant = montant;
        }

        public String getDureeEstime() {
            return dureeEstime;
        }
        public void setDureeEstime(String dureeEstime) {
            this.dureeEstime = dureeEstime;
        }

        public String getStatut() {
            return statut;
        }
        public void setStatut(String statut) {
            this.statut = statut;
        }

        public String getMessage() {
            return message;
        }
        public void setMessage(String message) {
            this.message = message;
        }

        public Date getDateProposition() {
            return dateProposition;
        }
        public void setDateProposition(Date dateProposition) {
            this.dateProposition = dateProposition;
        }

        public String getOrigine() {
            return origine;
        }
        public void setOrigine(String origine) {
            this.origine = origine;
        }
        public Date getDateAcceptation() {
            return dateAcceptation;
        }

        public void setDateAcceptation(Date dateAcceptation) {
            this.dateAcceptation = dateAcceptation;
        }
    }
