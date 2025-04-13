package com.example.demo.dto;

public class RevenueDistributionDTO {
    private Long subscriptionRevenue;
    private Long commissionRevenue;

    public RevenueDistributionDTO(Long subscriptionRevenue, Long commissionRevenue) {
        this.subscriptionRevenue = subscriptionRevenue;
        this.commissionRevenue = commissionRevenue;
    }

    // Getters & Setters
    public Long getSubscriptionRevenue() {
        return subscriptionRevenue;
    }

    public void setSubscriptionRevenue(Long subscriptionRevenue) {
        this.subscriptionRevenue = subscriptionRevenue;
    }

    public Long getCommissionRevenue() {
        return commissionRevenue;
    }

    public void setCommissionRevenue(Long commissionRevenue) {
        this.commissionRevenue = commissionRevenue;
    }
}