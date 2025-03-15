package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class ProfileView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence au consultant concerné
    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

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

    public Date getDateView() {
        return dateView;
    }

    public void setDateView(Date dateView) {
        this.dateView = dateView;
    }
}

