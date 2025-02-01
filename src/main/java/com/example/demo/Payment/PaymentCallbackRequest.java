package com.example.demo.Payment;

import lombok.Data;

@Data
public class PaymentCallbackRequest {
    private String token;
    private String status;
    private Double amount;
    private String signature;
    private String paymee_reference;
}
