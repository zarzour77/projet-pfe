package com.example.demo.Payment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private String status;
    private Double amount;
    private String currency;
    private Long orderId;
    private String paymentUrl;

    @Column(unique = true)
    private String paymeeReference;

    private LocalDateTime createdAt = LocalDateTime.now();
}
