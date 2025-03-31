package com.example.demo.Payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class StripeWebhookSignatureGenerator {

    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeyException {
        // Your webhook secret from the Stripe Dashboard
        String secret = "whsec_DgR4aiQYZGT2sJioVM1AXQSmAmQL7nZc";

        // IMPORTANT: This payload must be exactly the same as what your endpoint receives.
        String payload = "{\"id\":\"evt_test_webhook\",\"object\":\"event\",\"api_version\":\"2020-08-27\",\"created\":1629390123," +
                "\"data\":{\"object\":{\"id\":\"acct_1R5ry1P2flzUcIu9\",\"object\":\"account\",\"charges_enabled\":true," +
                "\"payouts_enabled\":true,\"details_submitted\":true}}," +
                "\"livemode\":false,\"pending_webhooks\":1," +
                "\"request\":{\"id\":\"req_test_123\",\"idempotency_key\":null}," +
                "\"type\":\"account.updated\"}";

        // For testing purposes, we use a fixed timestamp.
        long fixedTimestamp = 1742765824L;

        System.out.println("=== GENERATION PAYLOAD ===");
        System.out.println(payload);
        System.out.println("==========================");

        String signature = generateSignature(secret, payload, fixedTimestamp);
        System.out.println("Stripe-Signature: " + signature);
    }

    /**
     * Generates a Stripe-style webhook signature using a fixed timestamp.
     *
     * @param secret    Your webhook secret
     * @param payload   The exact JSON payload string (must match what your endpoint receives)
     * @param timestamp The timestamp to use in the signature (for testing)
     * @return The formatted signature header, e.g., "t=timestamp,v1=signature"
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     */
    public static String generateSignature(String secret, String payload, long timestamp)
            throws NoSuchAlgorithmException, InvalidKeyException {

        // Build the signed payload string in the format "timestamp.payload"
        String signedPayload = timestamp + "." + payload;

        // Compute HMAC-SHA256 using the webhook secret
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] signatureBytes = sha256Hmac.doFinal(signedPayload.getBytes(StandardCharsets.UTF_8));

        // Convert the resulting byte array to a hexadecimal string
        StringBuilder hexSignature = new StringBuilder();
        for (byte b : signatureBytes) {
            hexSignature.append(String.format("%02x", b));
        }

        // Return the full signature header in Stripe's format
        return String.format("t=%d,v1=%s", timestamp, hexSignature.toString());
    }
}
