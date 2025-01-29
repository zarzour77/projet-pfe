package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data // Lombok annotation for getters, setters, toString, etc.
@NoArgsConstructor // Lombok annotation for no-args constructor
@Entity
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private User auteur;  // Maps to User.avisRediges (mappedBy = "auteur")

    @ManyToOne
    @JoinColumn(name = "cible_id")
    private User cible;  // Maps to User.avisRecus (mappedBy = "cible")

    private double note; // Rating for the review
    private String commentaire; // Review comment

    @Temporal(TemporalType.TIMESTAMP) // Explicitly define the date type
    private Date dateAvis; // Date of the review

    // All-args constructor (optional, can be generated by Lombok)
    public Avis(User auteur, User cible, double note, String commentaire, Date dateAvis) {
        this.auteur = auteur;
        this.cible = cible;
        this.note = note;
        this.commentaire = commentaire;
        this.dateAvis = dateAvis;
    }
}