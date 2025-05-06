package com.example.demo.repository;

import com.example.demo.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    // Find active subscriptions whose expiration date has passed
    List<Subscription> findByExpirationDateBeforeAndStatut(Date now, String statut);
    Subscription findByConsultantId(Long consultantId);

}
