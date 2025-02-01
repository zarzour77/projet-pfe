package com.example.demo.Payment;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymeeService {

    private final RestTemplate restTemplate;

    @Value("${paymee.api.key}")
    private String apiKey;

    @Value("${paymee.api.vendor.token}")
    private String vendorToken;

    private static final String PAYMEE_API_URL = "https://sandbox.paymee.tn/api/v2/payments/create";

    public PaymeePaymentResponse createPayment(PaymeePaymentRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Token " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("amount", request.getAmount());
        body.put("note", request.getNote());
        body.put("first_name", request.getCustomer().getFirstName());
        body.put("last_name", request.getCustomer().getLastName());
        body.put("email", request.getCustomer().getEmail());
        body.put("phone", request.getCustomer().getPhone());
        body.put("webhook_url", request.getWebhookUrl());
        body.put("vendor", vendorToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<PaymeePaymentResponse> response = restTemplate.postForEntity(
                    PAYMEE_API_URL, entity, PaymeePaymentResponse.class
            );

            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Erreur lors de la communication avec Paymee: " + e.getMessage());
        }
    }
}
