package com.example.demo.Payment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Payment Success (verification only)
    @GetMapping("/success")
    public ResponseEntity<String> paymentSuccess(@RequestParam("payment_id") String paymentId) {
        boolean isVerified = paymentService.verifyPayment(paymentId);
        if (isVerified) {
            return ResponseEntity.ok("Payment verification successful!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed.");
        }
    }

    // Home Page
    @GetMapping("/")
    public String index() {
        return "index";
    }

    // Payment Error
    @GetMapping("/payment/error")
    public String paymentError() {
        return "paymentError";
    }

    // Create Payment (Accepting JSON Body)
    @PostMapping("/create")
    public ResponseEntity<ResponsePayment> createPayment(@RequestBody PaymentRequest paymentRequest) throws IOException {
        ResponsePayment responsePayment = paymentService.generatePayment(paymentRequest.getAmount());
        return ResponseEntity.ok(responsePayment);
    }

    // New endpoint to process payment details and store payment history.
    @PostMapping("/process")
    public ResponseEntity<String> processPayment(@RequestBody Map<String, Object> payload) {
        String paymentId = (String) payload.get("paymentId");
        String paymentFor = (String) payload.get("paymentFor");

        Map<String, Object> details = new HashMap<>();
        if ("subscription".equalsIgnoreCase(paymentFor)) {
            // For subscription payments: expected keys: userId, amount, planType
            details.put("userId", Long.valueOf(payload.get("userId").toString()));
            details.put("amount", Integer.valueOf(payload.get("amount").toString()));
            details.put("planType", payload.get("planType"));
        } else if ("mission".equalsIgnoreCase(paymentFor)) {
            // For mission payments: expected keys: missionId, debiteurId, destinataireId, amount
            details.put("missionId", Long.valueOf(payload.get("missionId").toString()));
            details.put("debiteurId", Long.valueOf(payload.get("debiteurId").toString()));
            details.put("destinataireId", Long.valueOf(payload.get("destinataireId").toString()));
            details.put("amount", Integer.valueOf(payload.get("amount").toString()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unsupported payment type: " + paymentFor);
        }
        try {
            paymentService.processPayment(paymentId, paymentFor, details);
            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing payment: " + e.getMessage());
        }
    }
}
