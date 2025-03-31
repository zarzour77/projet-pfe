package com.example.demo.Controller;

import com.example.demo.Service.TransactionService;
import com.example.demo.Payment.PaymentTransaction;
import com.example.demo.dto.TransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getUserTransactions(@PathVariable Long userId) {
        List<TransactionDTO> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/user/{userId}/subscriptions")
    public ResponseEntity<List<PaymentTransaction>> getSubscriptionTransactions(@PathVariable Long userId) {
        List<PaymentTransaction> subscriptions = transactionService.getSubscriptionPayments(userId);
        return ResponseEntity.ok(subscriptions);
    }
}