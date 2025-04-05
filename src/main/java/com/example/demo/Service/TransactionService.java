package com.example.demo.Service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.Payment.PaymentTransaction;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final UserRepository userRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    public TransactionService(UserRepository userRepository,
                              PaymentTransactionRepository paymentTransactionRepository) {
        this.userRepository = userRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    // TransactionService.java
    public List<TransactionDTO> getUserTransactions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String stripeCustomerId = user.getStripeCustomerId();

        // Use LinkedHashSet to maintain order while preventing duplicates
        Set<PaymentTransaction> transactionSet = new LinkedHashSet<>();

        // Add all transactions where user is involved in any role
        transactionSet.addAll(paymentTransactionRepository.findByEntrepriseSenderId(userId));
        transactionSet.addAll(paymentTransactionRepository.findByEntrepriseReceiverId(userId));
        transactionSet.addAll(paymentTransactionRepository.findByConsultantSenderId(userId));
        transactionSet.addAll(paymentTransactionRepository.findByAdminSenderId(userId));
        transactionSet.addAll(paymentTransactionRepository.findByConsultantReceiverId(userId));
        transactionSet.addAll(paymentTransactionRepository.findByAdminReceiverId(userId));

        // Add special cases using safe conditional checks
        if (stripeCustomerId != null && !stripeCustomerId.isEmpty()) {
            transactionSet.addAll(paymentTransactionRepository
                    .findByPaymentTypeAndCustomerId("FUND_ADDITION", stripeCustomerId));
        }

        // Convert to DTO list without duplicates
        return transactionSet.stream()
                .map(TransactionDTO::convertToDto)
                .collect(Collectors.toList());
    }
    public List<PaymentTransaction> getSubscriptionPayments(Long userId) {
        return paymentTransactionRepository.findByConsultantSenderIdAndPaymentType(
                userId,
                "subscription"
        );
    }

}
