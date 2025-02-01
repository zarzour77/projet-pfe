package com.example.demo.Payment;

import lombok.Data;

@Data
public class PaymeePaymentRequest {
    private Double amount;
    private String note;
    private Long orderId;
    private Customer customer;
    private String webhookUrl;
}
