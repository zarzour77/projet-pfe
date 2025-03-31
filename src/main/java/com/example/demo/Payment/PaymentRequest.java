package com.example.demo.Payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private long  amount;
    private long quantity;
    private String name;
    private String  currency;
    private String planType;
    private Long userId;

}
