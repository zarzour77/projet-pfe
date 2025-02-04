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
}