package com.example.demo.model;

import com.example.demo.Payment.PaymentTransaction;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Lob
    private String description;

    // Champ pour stocker une éventuelle preuve (texte, image encodée, capture d'écran, etc.)
    @Lob
    private String evidence;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private DisputeStatus status;

    // Champ pour stocker la réponse de l'administrateur
    @Lob
    private String adminResponse;

    // L'utilisateur qui a soumis le ticket (peut être Consultant ou Entreprise)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id")
    private User sender;

    // Optionnel : si le litige concerne une transaction de paiement
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_transaction_id")
    private PaymentTransaction paymentTransaction;

    public enum DisputeStatus {
        OPEN,           // Litige créé et en attente de traitement
        IN_PROGRESS,    // En cours de traitement par l'admin
        RESOLVED,       // Litige résolu
        CLOSED          // Litige fermé sans résolution ou après confirmation
    }

    public Dispute() {
        this.createdAt = LocalDateTime.now();
        this.status = DisputeStatus.OPEN;
    }

    public Dispute(String subject, String description, String evidence, User sender) {
        this.subject = subject;
        this.description = description;
        this.evidence = evidence;
        this.sender = sender;
        this.createdAt = LocalDateTime.now();
        this.status = DisputeStatus.OPEN;
    }

    // Getters et setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvidence() {
        return evidence;
    }
    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public DisputeStatus getStatus() {
        return status;
    }
    public void setStatus(DisputeStatus status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }
    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public User getSender() {
        return sender;
    }
    public void setSender(User sender) {
        this.sender = sender;
    }

    public PaymentTransaction getPaymentTransaction() {
        return paymentTransaction;
    }
    public void setPaymentTransaction(PaymentTransaction paymentTransaction) {
        this.paymentTransaction = paymentTransaction;
    }
}
