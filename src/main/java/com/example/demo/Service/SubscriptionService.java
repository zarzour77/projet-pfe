package com.example.demo.Service;

import com.example.demo.model.Subscription;
import com.example.demo.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    // Scheduled task to update expired subscriptions
    // This cron expression runs every day at midnight.
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateExpiredSubscriptions() {
        // Fetch active subscriptions where expiration date has passed
        List<Subscription> subscriptions = subscriptionRepository.findByExpirationDateBeforeAndStatut(new Date(), "active");
        for (Subscription subscription : subscriptions) {
            subscription.setStatut("expired");
            subscriptionRepository.save(subscription);
        }
        System.out.println("Updated expired subscriptions: " + subscriptions.size());
    }
    // SubscriptionService.java
    public String getCurrentSubscriptionPlan(Long consultantId) {
        Subscription subscription = subscriptionRepository.findByConsultantId(consultantId);
        if (subscription != null && "actif".equals(subscription.getStatut())) {
            return subscription.getPlanType();
        }
        return "Standard"; // Default value
    }
}
