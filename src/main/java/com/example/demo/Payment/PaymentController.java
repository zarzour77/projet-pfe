package com.example.demo.Payment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymeeService paymeeService;
    private final PaymentRepository paymentRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymeePaymentRequest request) {
        try {
            PaymeePaymentResponse response = paymeeService.createPayment(request);

            Payment payment = new Payment();
            payment.setOrderId(request.getOrderId());
            payment.setToken(response.getData().getToken());
            payment.setAmount(request.getAmount());
            payment.setCurrency("TND");
            payment.setPaymentUrl(response.getData().getPayment_url());
            payment.setStatus("PENDING");
            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                    "payment_url", response.getData().getPayment_url(),
                    "status", "PENDING"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<String> handleCallback(@RequestBody PaymentCallbackRequest callbackRequest) {
        Optional<Payment> paymentOpt = paymentRepository.findByToken(callbackRequest.getToken());
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
        }

        Payment payment = paymentOpt.get();
        payment.setStatus(callbackRequest.getStatus());
        paymentRepository.save(payment);

        return ResponseEntity.ok("OK");
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long orderId) {
        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment payment = paymentOpt.get();
        return ResponseEntity.ok(Map.of(
                "status", payment.getStatus(),
                "payment_url", payment.getPaymentUrl()
        ));
    }
}
