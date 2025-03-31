// ProfileView.java
package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class ProfileView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence au consultant (optionnel, si applicable)
    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

    // Nouvelle référence à l'entreprise
    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    // Date de la vue
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateView;

    // Getters et setters
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

    public Date getDateView() {
        return dateView;
    }

    public void setDateView(Date dateView) {
        this.dateView = dateView;
    }
}
