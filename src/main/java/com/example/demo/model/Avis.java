package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Lombok annotation for getters, setters, toString, etc.
@NoArgsConstructor // Lombok annotation for no-args constructor
@Entity


public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id", nullable = false)
    private User auteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cible_id", nullable = false)
    private User cible;

    @Min(1)
    @Max(5)
    private Double note;

    @Size(max = 500)
    private String commentaire;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateAvis = LocalDateTime.now();

    // Ajout pour lier à une mission spécifique
    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;

    // Méthode de vérification
    public boolean isValid() {
        return !auteur.equals(cible);
    }
}
