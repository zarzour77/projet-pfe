package com.example.demo.Payment;

import lombok.Data;

@Data
public class PaymentIntentResponse {
    private String id;
    private String clientSecret;
    private Long amount;
    private String currency;
    private String status;

    // Sender (enterprise/customer)
    private String senderType;      // "enterprise" or "customer"
    private String senderId;        // Stripe Customer ID or enterprise internal ID

    // Receiver (platform or consultant)
    private String receiverType;    // "platform" or "consultant"
    private String receiverId;      // Stripe Account ID

    // Fees
    private Long applicationFee;    // Platform commission
    private Long netAmount;         // Amount after fees (for consultants)
    private String sessionUrl;
}