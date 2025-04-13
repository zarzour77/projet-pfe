package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvisResponse {
    private Long id;
    private String auteurNom;
    private String cibleNom;
    private Double note;
    private String commentaire;
    private LocalDateTime dateAvis;
    private String missionTitre;

    // Add this constructor
    public AvisResponse(Long id, String auteurNom, Double note, String commentaire,
                        LocalDateTime dateAvis, String missionTitre) {
        this.id = id;
        this.auteurNom = auteurNom;
        this.note = note;
        this.commentaire = commentaire;
        this.dateAvis = dateAvis;
        this.missionTitre = missionTitre;
    }

    // Add empty constructor if needed
    public AvisResponse() {
    }
}