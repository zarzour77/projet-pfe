package com.example.demo.Payment;

import com.example.demo.model.Consultant;
import com.example.demo.model.Subscription;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
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

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConsultantRepository consultantRepository;

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

    @Transactional
    public void processPayment(String paymentId, String paymentFor, Map<String, Object> details) {
        // First, verify the payment
        if (!verifyPayment(paymentId)) {
            throw new RuntimeException("Payment verification failed for payment id: " + paymentId);
        }

        // Process payment based on its type
        if ("subscription".equalsIgnoreCase(paymentFor)) {
            // Expected details: userId (Long), amount (Integer), planType (String)
            Long userId = (Long) details.get("userId");
            Integer amount = (Integer) details.get("amount");
            String planType = (String) details.get("planType");
            processSuccessfulSubscriptionPayment(userId, amount, planType);
        } else if ("mission".equalsIgnoreCase(paymentFor)) {
            // Expected details: missionId (Long), debiteurId (Long), destinataireId (Long), amount (Integer)
            Long missionId = (Long) details.get("missionId");
            Long debiteurId = (Long) details.get("debiteurId");
            Long destinataireId = (Long) details.get("destinataireId");
            Integer amount = (Integer) details.get("amount");
            processSuccessfulMissionPayment(missionId, debiteurId, destinataireId, amount);
        } else {
            throw new RuntimeException("Unsupported payment type: " + paymentFor);
        }
    }

    /**
     * Processes a subscription payment by creating a Transaction and a Subscription record.
     * Only consultants are allowed to have subscriptions.
     *
     * @param consultantId   the id of the user (consultant) who subscribed.
     * @param amount   the amount paid.
     * @param planType the subscription plan type (e.g., "monthly", "yearly").
     */
    @Transactional
    public void processSuccessfulSubscriptionPayment(Long consultantId, Integer amount, String planType) {
        // Retrieve the consultant directly using ConsultantRepository
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        // Create a new transaction for the subscription payment
        Transaction transaction = new Transaction();
        transaction.setType("subscription");
        transaction.setMontant(amount.doubleValue());
        transaction.setDate(new Date());
        transaction.setStatut("SUCCESS");
        transaction.setExpediteur(consultant);
        // Save transaction to generate an ID
        transaction = transactionRepository.save(transaction);

        // Calculate subscription expiration based on the plan type
        Date now = new Date();
        Date expirationDate = calculateExpirationDate(planType, now);

        // Create a new subscription record and link it to the consultant and transaction
        Subscription subscription = new Subscription(planType, now, expirationDate, consultant);
        subscription.setTransaction(transaction);

        // Save the subscription (adds to consultant's subscription history)
        subscriptionRepository.save(subscription);
    }
    /**
     * Processes a mission payment by creating a Transaction record.
     *
     * @param missionId     the mission id associated with the payment.
     * @param expediteurId  the id of the user paying.
     * @param destinataireId the id of the user receiving the payment.
     * @param amount        the mission amount.
     */
    @Transactional
    public void processSuccessfulMissionPayment(Long missionId, Long expediteurId, Long destinataireId, Integer amount) {
        // Retrieve the involved users (for mission payments)
        User expediteur = userRepository.findById(expediteurId)
                .orElseThrow(() -> new RuntimeException("Expediteur not found"));
        User destinataire = userRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Destinataire not found"));

        // Create a new transaction for the mission payment
        Transaction transaction = new Transaction();
        transaction.setType("mission");
        transaction.setMontant(amount.doubleValue());
        transaction.setDate(new Date());
        transaction.setStatut("SUCCESS");
        transaction.setExpediteur(expediteur); // Previously debiteur
        transaction.setDestinataire(destinataire);

        // Save the transaction
        transactionRepository.save(transaction);
    }

    private Date calculateExpirationDate(String planType, Date startDate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        if ("monthly".equalsIgnoreCase(planType)) {
            cal.add(Calendar.MONTH, 1);
        } else if ("yearly".equalsIgnoreCase(planType)) {
            cal.add(Calendar.YEAR, 1);
        } else {
            // Default to monthly if unrecognized
            cal.add(Calendar.MONTH, 1);
        }
        return cal.getTime();
    }
}
