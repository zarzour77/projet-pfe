package com.example.demo.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;



public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByToken(String token);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByPaymeeReference(String reference);
}

