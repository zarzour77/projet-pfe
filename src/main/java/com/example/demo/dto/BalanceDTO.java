package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BalanceDTO {
    private double available;  // From Stripe
    private double frozen;     // From local DB
    private String currency;
}