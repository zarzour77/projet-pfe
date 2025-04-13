    package com.example.demo.model;

    import jakarta.persistence.Entity;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;

    import java.time.LocalDate;

    @Entity
    public class Formation {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String diplome;
        private String universite;
        private LocalDate dateDebut;
        private LocalDate dateFin;

        public Formation() {}

        public Formation(Long id, String diplome, String universite, LocalDate dateDebut, LocalDate dateFin) {
            this.id = id;
            this.diplome = diplome;
            this.universite = universite;
            this.dateDebut = dateDebut;
            this.dateFin = dateFin;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getDiplome() {
            return diplome;
        }

        public void setDiplome(String diplome) {
            this.diplome = diplome;
        }

        public String getUniversite() {
            return universite;
        }

        public void setUniversite(String universite) {
            this.universite = universite;
        }

        public LocalDate getDateDebut() {
            return dateDebut;
        }

        public void setDateDebut(LocalDate dateDebut) {
            this.dateDebut = dateDebut;
        }

        public LocalDate getDateFin() {
            return dateFin;
        }

        public void setDateFin(LocalDate dateFin) {
            this.dateFin = dateFin;
        }
    }
