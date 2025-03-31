package com.example.demo.model;

import com.example.demo.Payment.PaymentTransaction;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planType;
    private Date dateDebut;
    private Date expirationDate;

    // New field to track the subscription status
    private String statut;

    // Change association to Consultant since only consultants have subscriptions
    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;

    @OneToOne
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    private PaymentTransaction transaction;

    public Subscription() {
        // Set default status to active upon creation
        this.statut = "actif";
    }

    public Subscription(String planType, Date dateDebut, Date expirationDate, Consultant consultant) {
        this.planType = planType;
        this.dateDebut = dateDebut;
        this.expirationDate = expirationDate;
        this.consultant = consultant;
        this.statut = "actif";
    }

    // Entity callback to update status when persisting/updating
    @PrePersist
    @PreUpdate
    public void checkAndUpdateStatus() {
        if (expirationDate != null && new Date().after(expirationDate)) {
            this.statut = "expired";
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getPlanType() {
        return planType;
    }
    public void setPlanType(String planType) {
        this.planType = planType;
    }
    public Date getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }
    public Date getExpirationDate() {
        return expirationDate;
    }
    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
    public String getStatut() {
        return statut;
    }
    public void setStatut(String statut) {
        this.statut = statut;
    }
    public Consultant getConsultant() {
        return consultant;
    }
    public void setConsultant(Consultant consultant) {
        this.consultant = consultant;
    }
    public PaymentTransaction getTransaction() {
        return transaction;
    }
    public void setTransaction(PaymentTransaction transaction) {
        this.transaction = transaction;
    }
}
