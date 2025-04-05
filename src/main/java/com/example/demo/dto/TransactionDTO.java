package com.example.demo.dto;

import com.example.demo.Payment.PaymentTransaction;
import java.time.LocalDateTime;

public class TransactionDTO {
    private Long id;
    private Long amount;
    private String currency;
    private String paymentType;
    private String status;
    private LocalDateTime createdAt;
    private Long applicationFee;
    private Long netAmount;
    private String customerId;
    private String consultantAccountId;

    // Sender information
    private Long senderId;
    private String senderType;  // ENTERPRISE, CONSULTANT, ADMIN

    // Receiver information
    private Long receiverId;
    private String receiverType; // CONSULTANT, ADMIN, SYSTEM
    private Long ssiCommission;  // Add this field
    private Long ssiEnterpriseId;  // Add this field
    private Long missionId;
    // Conversion method
    public static TransactionDTO convertToDto(PaymentTransaction transaction) {
        TransactionDTO dto = new TransactionDTO();

        // Basic transaction info
        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setPaymentType(transaction.getPaymentType());
        dto.setStatus(transaction.getStatus());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setApplicationFee(transaction.getApplicationFee());
        dto.setNetAmount(transaction.getNetAmount());
        dto.setCustomerId(transaction.getCustomerId());
        dto.setConsultantAccountId(transaction.getConsultantAccountId());
        dto.setSsiCommission(transaction.getSsiCommission());
        if (transaction.getSsiEnterprise() != null) {
            dto.setSsiEnterpriseId(transaction.getSsiEnterprise().getId());
        }
        if (transaction.getMission() != null) {
            dto.setMissionId(transaction.getMission().getId());
        }
        // Enhanced receiver handling for SSI commissions
        if ("SSI_COMMISSION".equals(transaction.getPaymentType())) {
            if (transaction.getEntrepriseReceiver() != null) {
                dto.setReceiverId(transaction.getEntrepriseReceiver().getId());
                dto.setReceiverType("ENTERPRISE");
            }
        }
        // Handle sender
        if (transaction.getEntrepriseSender() != null) {
            dto.setSenderId(transaction.getEntrepriseSender().getId());
            dto.setSenderType("ENTERPRISE");
        } else if (transaction.getConsultantSender() != null) {
            dto.setSenderId(transaction.getConsultantSender().getId());
            dto.setSenderType("CONSULTANT");
        } else if (transaction.getAdminSender() != null) {
            dto.setSenderId(transaction.getAdminSender().getId());
            dto.setSenderType("ADMIN");
        }

        // Handle receiver
        if (transaction.getConsultantReceiver() != null) {
            dto.setReceiverId(transaction.getConsultantReceiver().getId());
            dto.setReceiverType("CONSULTANT");
        } else if (transaction.getAdminReceiver() != null) {
            dto.setReceiverId(transaction.getAdminReceiver().getId());
            dto.setReceiverType("ADMIN");
        } else {
            // For cases like fund additions to platform
            dto.setReceiverType("SYSTEM");
        }

        // Special case handling
        if ("FUND_ADDITION".equals(transaction.getPaymentType())) {
            dto.setReceiverType("SYSTEM");
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Long getApplicationFee() { return applicationFee; }
    public void setApplicationFee(Long applicationFee) { this.applicationFee = applicationFee; }
    public Long getNetAmount() { return netAmount; }
    public void setNetAmount(Long netAmount) { this.netAmount = netAmount; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getConsultantAccountId() { return consultantAccountId; }
    public void setConsultantAccountId(String consultantAccountId) { this.consultantAccountId = consultantAccountId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getReceiverType() { return receiverType; }
    public void setReceiverType(String receiverType) { this.receiverType = receiverType; }
    public Long getSsiCommission() { return ssiCommission; }
    public void setSsiCommission(Long ssiCommission) { this.ssiCommission = ssiCommission; }
    public Long getSsiEnterpriseId() { return ssiEnterpriseId; }
    public void setSsiEnterpriseId(Long ssiEnterpriseId) { this.ssiEnterpriseId = ssiEnterpriseId; }
    public Long getMissionId() { return missionId; }
    public void setMissionId(Long missionId) { this.missionId = missionId; }
}