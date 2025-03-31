package com.example.demo.Service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.Payment.PaymentTransaction;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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

    public List<TransactionDTO> getUserTransactions(Long userId) {
        List<PaymentTransaction> transactions = new ArrayList<>();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String stripeCustomerId = user.getStripeCustomerId();
        // Get all possible transactions where the user is involved.
        transactions.addAll(paymentTransactionRepository.findByEntrepriseSenderId(userId));
        transactions.addAll(paymentTransactionRepository.findByConsultantSenderId(userId));
        transactions.addAll(paymentTransactionRepository.findByAdminSenderId(userId));
        transactions.addAll(paymentTransactionRepository.findByConsultantReceiverId(userId));
        transactions.addAll(paymentTransactionRepository.findByAdminReceiverId(userId));

        // Add FUND_ADDITION transactions explicitly.
        // (Assumes that FUND_ADDITION transactions are associated with the consultant receiver.)
        if (stripeCustomerId != null) {
            List<PaymentTransaction> fundAdditions = paymentTransactionRepository
                    .findByPaymentTypeAndCustomerId("FUND_ADDITION", stripeCustomerId);
            transactions.addAll(fundAdditions);
        }
        return transactions.stream()
                .map(TransactionDTO::convertToDto)  // Use static conversion method
                .distinct()
                .collect(Collectors.toList());
    }

    public List<PaymentTransaction> getSubscriptionPayments(Long userId) {
        return paymentTransactionRepository.findByConsultantSenderIdAndPaymentType(
                userId,
                "subscription"
        );
    }

}
