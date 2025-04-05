package com.example.demo.repository;

import com.example.demo.Payment.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    List<PaymentTransaction> findByEntrepriseReceiverId(Long enterpriseId);
    List<PaymentTransaction> findByPaymentTypeAndEntrepriseReceiverId(String paymentType, Long enterpriseId);
    // General queries
    List<PaymentTransaction> findByPaymentType(String paymentType);
    List<PaymentTransaction> findByStatus(String status);
    List<PaymentTransaction> findByMissionIdAndPaymentType(Long missionId, String paymentType);
    List<PaymentTransaction> findByMissionIdAndPaymentTypeAndStatus(
            Long missionId,
            String paymentType,
            String status
    );
    @Query("SELECT COALESCE(SUM(pt.amount)-SUM(pt.applicationFee), 0) FROM PaymentTransaction pt " +
            "WHERE pt.consultantReceiver.id = :consultantId " +
            "AND pt.status = 'PROCESSED' " +
            "AND (pt.paymentType = 'MISSION_FIRST_SLICE' OR pt.paymentType = 'MISSION_FINAL_PAYMENT') " +
            "AND pt.createdAt BETWEEN :startDate AND :endDate")
    Long findEarningsByConsultantAndDateRange(@Param("consultantId") Long consultantId,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate);
    List<PaymentTransaction> findByConsultantReceiverIdAndCreatedAtBetween(Long consultantId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(pt.amount) FROM PaymentTransaction pt " +
            "WHERE pt.consultantReceiver.id = :consultantId " +
            "AND pt.paymentType = :paymentType " +
            "AND pt.status = :status " +
            "AND pt.createdAt BETWEEN :startDate AND :endDate")
    Long findSumByConsultantAndCriteria(@Param("consultantId") Long consultantId,
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate,
                                        @Param("paymentType") String paymentType,
                                        @Param("status") String status);

    @Query("SELECT SUM(pt.applicationFee) FROM PaymentTransaction pt " +
            "WHERE pt.consultantReceiver.id = :consultantId " +
            "AND pt.createdAt BETWEEN :startDate AND :endDate")
    Long findSumApplicationFeeByConsultantAndDateRange(@Param("consultantId") Long consultantId,
                                                       @Param("startDate") LocalDateTime startDate,
                                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(pt.amount) FROM PaymentTransaction pt " +
            "WHERE pt.entrepriseSender.id = :entrepriseId " +
            "AND pt.paymentType = :paymentType " +
            "AND pt.status = :status " +
            "AND pt.createdAt BETWEEN :startDate AND :endDate")
    Long findSumByEntrepriseAndPaymentType(@Param("entrepriseId") Long entrepriseId,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate,
                                           @Param("paymentType") String paymentType,
                                           @Param("status") String status);
    @Query("SELECT COALESCE(SUM(pt.amount), 0) FROM PaymentTransaction pt " +
            "WHERE pt.createdAt BETWEEN :startDate AND :endDate")
    Long findTotalTransactionVolume(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);
    @Query("SELECT FUNCTION('DATE_FORMAT', pt.createdAt, '%Y-%m') as month, SUM(pt.applicationFee) " +
            "FROM PaymentTransaction pt " +
            "WHERE pt.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE_FORMAT', pt.createdAt, '%Y-%m') " +
            "ORDER BY FUNCTION('DATE_FORMAT', pt.createdAt, '%Y-%m')")
    List<Object[]> findGlobalMonthlyApplicationFee(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

}

