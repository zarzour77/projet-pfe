package com.example.demo.model;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AvisRequest {
    @NotNull(message = "L'auteur est requis")
    private Long auteurId;

    @NotNull(message = "La cible est requise")
    private Long cibleId;

    @NotNull(message = "La note est obligatoire")
    @Min(1) @Max(5)
    private Double note;

    @Size(max = 500, message = "Le commentaire ne doit pas dépasser 500 caractères")
    private String commentaire;

    public @NotNull(message = "L'auteur est requis") Long getAuteurId() {
        return auteurId;
    }

    public void setAuteurId(@NotNull(message = "L'auteur est requis") Long auteurId) {
        this.auteurId = auteurId;
    }

    public @NotNull(message = "La cible est requise") Long getCibleId() {
        return cibleId;
    }

    public void setCibleId(@NotNull(message = "La cible est requise") Long cibleId) {
        this.cibleId = cibleId;
    }

    public @Size(max = 500, message = "Le commentaire ne doit pas dépasser 500 caractères") String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(@Size(max = 500, message = "Le commentaire ne doit pas dépasser 500 caractères") String commentaire) {
        this.commentaire = commentaire;
    }

    public @NotNull(message = "La note est obligatoire") @Min(1) @Max(5) Double getNote() {
        return note;
    }

    public void setNote(@NotNull(message = "La note est obligatoire") @Min(1) @Max(5) Double note) {
        this.note = note;
    }
}