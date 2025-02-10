package com.example.demo.Payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${flouci.app.token}")
    private String appToken;

    @Value("${flouci.app.secret}")
    private String appSecret;

    @Value("${flouci.developer.tracking.id}")
    private String developerTrackingId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResponsePayment generatePayment(Integer amount) throws IOException {
        String url = "https://developers.flouci.com/api/generate_payment";

        // Create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("app_token", appToken);
        requestBody.put("app_secret", appSecret);
        requestBody.put("accept_card", "true");
        requestBody.put("amount", amount);
        requestBody.put("success_link", "http://localhost:5173/paymentSuccess");
        requestBody.put("fail_link", "http://localhost:5173/paymentFailed");
        requestBody.put("session_timeout_secs", 1200);
        requestBody.put("developer_tracking_id", developerTrackingId);

        // Convert body to JSON string
        String jsonRequest = objectMapper.writeValueAsString(requestBody);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create request entity
        HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

        // Make HTTP request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            // Build ResponsePayment with new structure
            ResponsePayment.Result result = ResponsePayment.Result.builder()
                    .payment_id(jsonNode.path("result").path("payment_id").asText())
                    .link(jsonNode.path("result").path("link").asText())
                    .developer_tracking_id(jsonNode.path("result").path("developer_tracking_id").asText())
                    .success(jsonNode.path("result").path("success").asBoolean())
                    .build();

            return ResponsePayment.builder()
                    .result(result)
                    .code(0)
                    .name("developersapi")
                    .version("1.0.0")
                    .build();
        } else {
            throw new IOException("Payment API request failed with status: " + response.getStatusCode());
        }
    }



    public boolean verifyPayment(String paymentId) {
        String url = "https://developers.flouci.com/api/verify_payment/" + paymentId;

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("apppublic", appToken);
        headers.set("appsecret", appSecret);

        // Create request entity
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Make HTTP GET request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // Check the response
        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return "SUCCESS".equals(jsonNode.path("result").path("status").asText());
            } catch (IOException e) {
                throw new RuntimeException("Error parsing verification response", e);
            }
        } else {
            System.err.println("Error verifying payment: " + response.getStatusCode());
            return false;
        }
    }
}