package com.example.demo.Controller;

import com.example.demo.Service.PropositionService;
import com.example.demo.Service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    @GetMapping("/current/{consultantId}")
    public ResponseEntity<String> getCurrentSubscription(@PathVariable Long consultantId) {
        String plan = subscriptionService.getCurrentSubscriptionPlan(consultantId);
        return ResponseEntity.ok(plan);
    }
}