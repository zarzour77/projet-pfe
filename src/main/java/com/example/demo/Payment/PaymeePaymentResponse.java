package com.example.demo.Payment;

import lombok.Data;

@Data
public class PaymeePaymentResponse {
    private String status;
    private String message;
    private PaymeePaymentData data; // Ajout de l'objet data imbriqué
}
