package com.example.demo.Payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Payment Success
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
        return ResponseEntity.ok(responsePayment); // Return the new response structure
    }
}
