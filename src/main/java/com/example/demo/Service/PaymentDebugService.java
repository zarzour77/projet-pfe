package com.example.demo.Service;

import com.example.demo.Payment.PaymentTransaction;
import com.example.demo.repository.PaymentTransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentDebugService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentDebugService.class);

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    public void debugTransactions(Long consultantId, LocalDateTime startDate, LocalDateTime now) {
        List<PaymentTransaction> transactions = paymentTransactionRepository.findByConsultantReceiverIdAndCreatedAtBetween(consultantId, startDate, now);
        logger.info("Nombre de transactions pour consultant {} entre {} et {}: {}", consultantId, startDate, now, transactions.size());
        transactions.forEach(tx -> {
            logger.info("Transaction id: {}, netAmount: {}, status: {}, paymentType: {}, createdAt: {}",
                    tx.getId(), tx.getAmount(), tx.getStatus(), tx.getPaymentType(), tx.getCreatedAt());
        });
    }
}

