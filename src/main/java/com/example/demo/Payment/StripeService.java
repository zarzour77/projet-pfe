package com.example.demo.Payment;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.ApiResource;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.*;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StripeService {

    @Value("${stripe.secretKey}")
    private String secretKey;
    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    public PaymentResponse checkPayment(PaymentRequest paymentRequest) {
        Stripe.apiKey = secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(paymentRequest.getName())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(paymentRequest.getCurrency())
                        .setUnitAmount(paymentRequest.getAmount())
                        .setProductData(productData)
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setQuantity(paymentRequest.getQuantity())
                        .setPriceData(priceData)
                        .build();

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:5173/paymentSuccess")
                        .setCancelUrl("http://localhost:5173/paymentFailed")
                        .addLineItem(lineItem)
                        .build();

        Session session;
        try {
            session = Session.create(params);
        } catch (StripeException ex) {
            System.out.println("Stripe Exception: " + ex.getMessage());
            return PaymentResponse.builder()
                    .status("FAILED")
                    .message("Error creating payment session: " + ex.getMessage())
                    .build();
        }

        return PaymentResponse.builder()
                .status("SUCCESS")
                .message("Payment session created")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();
    }
    public boolean verifyStripePayment(String sessionId) {
        try {
            Session session = Session.retrieve(sessionId);
            return "paid".equals(session.getPaymentStatus());
        } catch (StripeException e) {
            return false;
        }
    }
    public CustomerData createCustomer(CustomerData data) throws StripeException {
        Stripe.apiKey = secretKey;

        CustomerCreateParams params = CustomerCreateParams.builder()
                .setName(data.getName())
                .setEmail(data.getEmail())
                .build();

        Customer customer = Customer.create(params);
        data.setCustomerID(customer.getId());
        return data;
    }

    public List<CustomerData> getAllCustomers() throws StripeException {
        Stripe.apiKey = secretKey;

        CustomerListParams params = CustomerListParams.builder()
                .setLimit(3L)
                .build();
        CustomerCollection customerCollection = Customer.list(params);

        return customerCollection.getData().stream().map(customer -> {
            CustomerData data = new CustomerData();
            data.setCustomerID(customer.getId());
            data.setEmail(customer.getEmail());
            data.setName(customer.getName());
            return data;
        }).collect(Collectors.toList());
    }

    public String deleteCustomer(String customerID) throws StripeException {
        Stripe.apiKey = secretKey;
        Customer customer = Customer.retrieve(customerID);
        Customer deletedCustomer = customer.delete();
        if (Boolean.TRUE.equals(deletedCustomer.getDeleted())) {
            return "Customer deleted successfully";
        } else {
            return "Customer deletion failed";
        }
    }

    // New: Retrieve a customer by ID
    public CustomerData getCustomerById(String customerID) throws StripeException {
        Stripe.apiKey = secretKey;
        Customer customer = Customer.retrieve(customerID);
        CustomerData data = new CustomerData();
        data.setCustomerID(customer.getId());
        data.setEmail(customer.getEmail());
        data.setName(customer.getName());
        data.setDescription(customer.getDescription());
        data.setPhone(customer.getPhone());
        data.setBalance(customer.getBalance());
        // Add address mapping
        if (customer.getAddress() != null) {
            Map<String, Object> addressMap = Map.of(
                    "line1", customer.getAddress().getLine1(),
                    "line2", customer.getAddress().getLine2(),
                    "city", customer.getAddress().getCity(),
                    "state", customer.getAddress().getState(),
                    "postal_code", customer.getAddress().getPostalCode(),
                    "country", customer.getAddress().getCountry()
            );
            data.setAddress(addressMap);
        }
        return data;
    }
    public Session getSessionDetails(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
    // New: Update a customer's metadata (example: setting an order_id)
    public CustomerData updateCustomer(String customerID, CustomerData updateData) throws StripeException {
        Stripe.apiKey = secretKey;
        Customer resource = Customer.retrieve(customerID);
        CustomerUpdateParams.Builder builder = CustomerUpdateParams.builder();

        if (updateData.getName() != null) {
            builder.setName(updateData.getName());
        }
        if (updateData.getEmail() != null) {
            builder.setEmail(updateData.getEmail());
        }
        if (updateData.getDescription() != null) {
            builder.setDescription(updateData.getDescription());
        }
        // Add balance update
        if (updateData.getBalance() != null) {
            builder.setBalance(updateData.getBalance());
        }
        // Address update remains the same
        if (updateData.getAddress() != null && !updateData.getAddress().isEmpty()) {
            builder.setAddress(
                    CustomerUpdateParams.Address.builder()
                            .setLine1((String) updateData.getAddress().get("line1"))
                            .setLine2((String) updateData.getAddress().get("line2"))
                            .setCity((String) updateData.getAddress().get("city"))
                            .setState((String) updateData.getAddress().get("state"))
                            .setPostalCode((String) updateData.getAddress().get("postal_code"))
                            .setCountry((String) updateData.getAddress().get("country"))
                            .build()
            );
        }

        Customer updatedCustomer = resource.update(builder.build());

        CustomerData data = new CustomerData();
        data.setCustomerID(updatedCustomer.getId());
        data.setName(updatedCustomer.getName());
        data.setEmail(updatedCustomer.getEmail());
        data.setDescription(updatedCustomer.getDescription());
        // Add balance to response
        data.setBalance(updatedCustomer.getBalance());

        // Address mapping remains the same
        if (updatedCustomer.getAddress() != null) {
            Map<String, Object> addressMap = Map.of(
                    "line1", updatedCustomer.getAddress().getLine1(),
                    "line2", updatedCustomer.getAddress().getLine2(),
                    "city", updatedCustomer.getAddress().getCity(),
                    "state", updatedCustomer.getAddress().getState(),
                    "postal_code", updatedCustomer.getAddress().getPostalCode(),
                    "country", updatedCustomer.getAddress().getCountry()
            );
            data.setAddress(addressMap);
        }

        return data;
    }    // New: Search for customers based on a query string


    public PaymentIntent createConsultantPayment(PaymentIntentRequest request) throws StripeException {
        Stripe.apiKey = secretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount())
                .setCurrency(request.getCurrency())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                // Direct payment to consultant's Stripe account
                .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(request.getConsultantAccountId())
                                .build()
                )
                // Platform commission (e.g., 10%)
                .setApplicationFeeAmount((long) (request.getAmount() * 0.10))
                .build();

        return PaymentIntent.create(params);
    }

    public PaymentResponse createAddFundsSession(PaymentRequest paymentRequest, String customerId) {
        Stripe.apiKey = secretKey;
        if (paymentRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(paymentRequest.getName())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(paymentRequest.getCurrency())
                        .setUnitAmount(paymentRequest.getAmount())
                        .setProductData(productData)
                        .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setCustomer(customerId)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/paymentSuccess")
                .setCancelUrl("http://localhost:5173/paymentFailed")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPriceData(priceData)
                        .setQuantity(paymentRequest.getQuantity())
                        .build())
                .putMetadata("userId", paymentRequest.getUserId().toString())
                .putMetadata("amount", String.valueOf(paymentRequest.getAmount() / 100.0))
                .build();

        try {
            Session session = Session.create(params);
            return PaymentResponse.builder()
                    .status("SUCCESS")
                    .message("Payment session created")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();
        } catch (StripeException ex) {
            return PaymentResponse.builder()
                    .status("FAILED")
                    .message("Error creating payment session: " + ex.getMessage())
                    .build();
        }
    }

    // Add to StripeService.java
    public void adjustCustomerBalance(String customerId, long amountDeltaCents) throws StripeException {
        Stripe.apiKey = secretKey;

        Customer customer = Customer.retrieve(customerId);

        CustomerUpdateParams params = CustomerUpdateParams.builder()
                .setBalance(customer.getBalance() + amountDeltaCents)
                .build();

        customer.update(params);
    }

    // This method already exists but should be updated to return Customer
    public Customer getCustomerBalance(String customerId) throws StripeException {
        Stripe.apiKey = secretKey;
        return Customer.retrieve(customerId);
    }
}