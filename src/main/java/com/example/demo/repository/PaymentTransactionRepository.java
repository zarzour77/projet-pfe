package com.example.demo.repository;

import com.example.demo.Payment.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    // Valid query methods based on actual entity fields

    // Sender queries
    List<PaymentTransaction> findByEntrepriseSenderId(Long enterpriseId);
    List<PaymentTransaction> findByConsultantSenderId(Long consultantId);
    List<PaymentTransaction> findByAdminSenderId(Long adminId);
    List<PaymentTransaction> findByCustomerId(String customerId);
    List<PaymentTransaction> findByPaymentTypeAndCustomerId(String paymentType, String customerId);
    // Receiver queries
    List<PaymentTransaction> findByConsultantReceiverId(Long consultantId);
    List<PaymentTransaction> findByAdminReceiverId(Long adminId);

    // Payment type specific queries
    List<PaymentTransaction> findByEntrepriseSenderIdAndPaymentType(Long enterpriseId, String paymentType);
    List<PaymentTransaction> findByConsultantSenderIdAndPaymentType(Long consultantId, String paymentType);
    List<PaymentTransaction> findByAdminSenderIdAndPaymentType(Long adminId, String paymentType);

    // General queries
    List<PaymentTransaction> findByPaymentType(String paymentType);
    List<PaymentTransaction> findByStatus(String status);
    List<PaymentTransaction> findByMissionIdAndPaymentType(Long missionId, String paymentType);
    List<PaymentTransaction> findByMissionIdAndPaymentTypeAndStatus(
            Long missionId,
            String paymentType,
            String status
    );
}