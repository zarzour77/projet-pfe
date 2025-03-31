// File: PaymentTransaction.java
package com.example.demo.Payment;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.model.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // For mission payments: the enterprise paying the consultant
    @ManyToOne
    @JoinColumn(name = "entreprise_sender_id")
    private Entreprise entrepriseSender;

    @ManyToOne
    @JoinColumn(name = "consultant_receiver_id")
    private Consultant consultantReceiver;

    // For subscription payments: the consultant paying the platform
    @ManyToOne
    @JoinColumn(name = "consultant_sender_id")
    private Consultant consultantSender;

    // For cases where an admin initiates an action (if needed)
    @ManyToOne
    @JoinColumn(name = "admin_sender_id")
    private User adminSender;

    // For payments where the admin receives funds (subscription or mission fee)
    @ManyToOne
    @JoinColumn(name = "admin_receiver_id")
    private User adminReceiver;

    // Stripe PaymentIntent ID
    private String paymentIntentId;

    // Payment type: "subscription" (consultant-to-platform) or "mission" (enterprise-to-consultant)
    private String paymentType;

    // Payment amount in cents
    private Long amount;

    private String currency;

    // Stripe status (e.g., "requires_payment_method", "succeeded")
    private String status;

    // For mission payments, platform commission fee (in cents)
    private Long applicationFee;

    // For mission payments, net amount that goes to the consultant (amount - fee) in cents
    private Long netAmount;

    // References to internal IDs or Stripe IDs
    private String customerId;          // The enterprise or consultant making the payment
    private String consultantAccountId; // Consultant’s Stripe Account ID for mission payments

    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Entreprise getEntrepriseSender() { return entrepriseSender; }
    public void setEntrepriseSender(Entreprise entrepriseSender) { this.entrepriseSender = entrepriseSender; }

    public Consultant getConsultantReceiver() { return consultantReceiver; }
    public void setConsultantReceiver(Consultant consultantReceiver) { this.consultantReceiver = consultantReceiver; }

    public Consultant getConsultantSender() { return consultantSender; }
    public void setConsultantSender(Consultant consultantSender) { this.consultantSender = consultantSender; }

    public User getAdminSender() { return adminSender; }
    public void setAdminSender(User adminSender) { this.adminSender = adminSender; }

    public User getAdminReceiver() { return adminReceiver; }
    public void setAdminReceiver(User adminReceiver) { this.adminReceiver = adminReceiver; }

    public String getPaymentIntentId() { return paymentIntentId; }
    public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getApplicationFee() { return applicationFee; }
    public void setApplicationFee(Long applicationFee) { this.applicationFee = applicationFee; }

    public Long getNetAmount() { return netAmount; }
    public void setNetAmount(Long netAmount) { this.netAmount = netAmount; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getConsultantAccountId() { return consultantAccountId; }
    public void setConsultantAccountId(String consultantAccountId) { this.consultantAccountId = consultantAccountId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Mission getMission() { return mission; }
    public void setMission(Mission mission) { this.mission = mission; }
}
