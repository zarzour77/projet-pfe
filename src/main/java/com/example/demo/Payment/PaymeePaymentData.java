package com.example.demo.Payment;

import lombok.Data;
@Data
public class PaymeePaymentData {
    private String token;
    private String payment_url; // Doit correspondre au nom dans la réponse JSON
}
