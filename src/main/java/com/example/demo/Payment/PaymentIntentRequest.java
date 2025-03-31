package com.example.demo.Payment;

import lombok.Data;

@Data
public class PaymentIntentRequest {
    private long amount;          // Amount in cents (e.g., $20.00 = 2000)
    private String currency;      // e.g., "eur"
    private String captureMethod; // "automatic" or "manual"

    // Generic user ID (entreprise or consultant)
    private Long userId;          // 👈 Changed from consultantId
    private String paymentType;
    // For consultant payments
    private String consultantAccountId; // Stripe Account ID
    private Long applicationFee;        // Platform commission


}