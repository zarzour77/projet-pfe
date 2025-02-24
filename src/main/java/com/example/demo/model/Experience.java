package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Temporal(TemporalType.DATE)
    private Date dateFin;

    @Transient
    private Integer duree;

    private String entreprise;
    private String role;

    @Column(length = 1000)
    private String description;

    public Experience() {}

    public Experience(Date dateDebut, Date dateFin, String entreprise, String role, String description) {
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
    public Date getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }
    public Date getDateFin() {
        return dateFin;
    }
    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public Integer getDuree() {
        if (dateDebut != null && dateFin != null) {
            long diffInMillies = dateFin.getTime() - dateDebut.getTime();
            return (int) (diffInMillies / (1000L * 60 * 60 * 24 * 30)); // Convert milliseconds to months
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
