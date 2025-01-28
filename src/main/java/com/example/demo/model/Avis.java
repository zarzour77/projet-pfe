package com.example.demo.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private User auteur;

    @ManyToOne
    @JoinColumn(name = "cible_id")
    private User cible;
    private double note;
    private String commentaire;
    private Date dateAvis;

    public Avis(User auteur, User cible, String commentaire, Date dateAvis, Long id,double note) {
        this.auteur = auteur;
        this.cible = cible;
        this.commentaire = commentaire;
        this.dateAvis = dateAvis;
        this.id = id;
        this.note = note;
    }

    public Avis() {}

    public User getAuteur() {
        return auteur;
    }

    public void setAuteur(User auteur) {
        this.auteur = auteur;
    }

    public User getCible() {
        return cible;
    }

    public void setCible(User cible) {
        this.cible = cible;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Date getDateAvis() {
        return dateAvis;
    }

    public void setDateAvis(Date dateAvis) {
        this.dateAvis = dateAvis;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
