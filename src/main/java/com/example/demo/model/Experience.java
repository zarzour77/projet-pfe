package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Transient
    private Integer duree;

    private String entreprise;
    private String role;

    @Column(length = 1000)
    private String description;

    public Experience() {}

    public Experience(LocalDate dateDebut, LocalDate dateFin, String entreprise, String role, String description) {
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.entreprise = entreprise;
        this.role = role;
        this.description = description;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

    public Integer getDuree() {
        if (dateDebut != null && dateFin != null) {
            return (int) ChronoUnit.MONTHS.between(dateDebut, dateFin); // Calculate months difference
        }
        return 0;
    }

    public String getEntreprise() {
        return entreprise;
    }
    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Experience{" +
                "id=" + id +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", duree=" + getDuree() +
                ", entreprise='" + entreprise + '\'' +
                ", role='" + role + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
