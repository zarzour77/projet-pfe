package com.example.demo.Payment;

import com.example.demo.Payment.PaymentBusinessService;
import com.example.demo.Payment.PaymentRequest;
import com.example.demo.Payment.PaymentResponse;
import com.example.demo.dto.BalanceDTO;
import com.example.demo.exception.MissionNotFoundException;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentBusinessService paymentBusinessService;
    private final StripeService stripeService;
    public PaymentController(PaymentBusinessService paymentBusinessService,
                             StripeService stripeService) {
        this.paymentBusinessService = paymentBusinessService;
        this.stripeService = stripeService;
    }

    // Initiate a subscription payment (consultant-to-platform)
    @PostMapping("/subscription")
    public ResponseEntity<PaymentResponse> initiateSubscriptionPayment(@RequestBody PaymentRequest request,
                                                                       @RequestParam long consultantId) {
        try {
            PaymentResponse response = paymentBusinessService.initiateSubscriptionPayment(request, consultantId);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Process a successful subscription payment (after Stripe checkout)
    @PostMapping("/process-subscription")
    public ResponseEntity<String> processSubscriptionPayment(@RequestParam String sessionId,
                                                             @RequestParam long consultantId,
                                                             @RequestParam String planType) {
        try {
            paymentBusinessService.processSuccessfulSubscriptionPayment(sessionId, consultantId, planType);
            return ResponseEntity.ok("Subscription payment processed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Initiate add-funds payment
    @PostMapping("/add-funds")
    public ResponseEntity<PaymentResponse> initiateAddFundsPayment(@RequestParam long userId,
                                                                   @RequestParam double amount) {
        try {
            PaymentResponse response = paymentBusinessService.initiateAddFundsPayment(userId, amount);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/customerBalance/{userId}")
    public ResponseEntity<?> getCustomerBalance(@PathVariable long userId) {
        try {
            BalanceDTO balance = paymentBusinessService.getCustomerBalance(userId);
            return ResponseEntity.ok(balance);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PostMapping("/customer/{customerID}/update")
    public ResponseEntity<CustomerData> updateCustomer(@PathVariable String customerID,
                                                       @RequestBody CustomerData updateData) {
        try {
            CustomerData data = stripeService.updateCustomer(customerID, updateData);
            return ResponseEntity.status(HttpStatus.OK).body(data);
        } catch (StripeException e) {
            System.out.println("Stripe Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    // Confirm add-funds payment
    @PostMapping("/confirm-add-funds")
    public ResponseEntity<String> confirmAddFunds(@RequestParam String sessionId) {
        try {
            paymentBusinessService.confirmAddFunds(sessionId);
            return ResponseEntity.ok("Funds added successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Process first slice payment for a mission
    @PostMapping("/{missionId}/first-payment")
    public ResponseEntity<String> processFirstPayment(@PathVariable Long missionId) {
        try {
            paymentBusinessService.initiateFirstSlicePayment(missionId);
            return ResponseEntity.ok("First payment (20% + 10% fee) processed successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}/payment-details")
    public ResponseEntity<Map<String, Object>> getPaymentDetails(@PathVariable Long id) {
        try {
            Map<String, Double> paymentDetails = paymentBusinessService.calculatePaymentDetails(id);
            boolean isFirstSlicePaid = paymentBusinessService.isFirstSlicePaid(id);
            boolean isFinalPaymentPaid = paymentBusinessService.isFinalPaymentPaid(id);

            Map<String, Object> response = new HashMap<>();
            response.put("firstSlice", paymentDetails.get("firstSlice"));
            response.put("frozenAmount", paymentDetails.get("frozenAmount"));
            response.put("applicationFee", paymentDetails.get("applicationFee"));
            response.put("isFirstSlicePaid", isFirstSlicePaid);
            response.put("isFinalPaymentPaid", isFinalPaymentPaid);

            return ResponseEntity.ok(response);
        } catch (MissionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Process final payment for a mission
    @PostMapping("/{missionId}/final-payment")
    public ResponseEntity<String> processFinalPayment(@PathVariable Long missionId) {
        try {
            paymentBusinessService.initiateFinalPayment(missionId);
            return ResponseEntity.ok("Final payment (70%) processed successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
