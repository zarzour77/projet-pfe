package com.example.demo.Payment;

import com.example.demo.dto.BalanceDTO;
import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.model.Notification;
import com.example.demo.model.Proposition;
import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import com.example.demo.repository.*;
import com.example.demo.exception.MissionNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerUpdateParams;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class PaymentBusinessService {

    private final StripeService stripeService;
    private final PaymentTransactionRepository transactionRepository;
    private final ConsultantRepository consultantRepository;
    private final MissionRepository missionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private EntrepriseRepository entrepriseRepository;

    public PaymentBusinessService(StripeService stripeService,
                                  PaymentTransactionRepository transactionRepository,
                                  ConsultantRepository consultantRepository,
                                  MissionRepository missionRepository,
                                  SubscriptionRepository subscriptionRepository,
                                  UserRepository userRepository,
                                  EntrepriseRepository entrepriseRepository
                                  ) {
        this.stripeService = stripeService;
        this.transactionRepository = transactionRepository;
        this.consultantRepository = consultantRepository;
        this.missionRepository = missionRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.entrepriseRepository = entrepriseRepository;
    }

    @Transactional
    public PaymentResponse initiateSubscriptionPayment(PaymentRequest request, long consultantId)
            throws StripeException {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        if (consultant.getStripeCustomerId() == null) {
            throw new RuntimeException("Consultant has no Stripe customer ID");
        }
        // Create Stripe session (no DB records yet)
        return stripeService.checkPayment(request);
    }

    @Transactional
    public void processSuccessfulSubscriptionPayment(String sessionId, long consultantId, String planType) {
        try {
            Session session = stripeService.getSessionDetails(sessionId);
            if (!"paid".equals(session.getPaymentStatus())) {
                throw new RuntimeException("Payment not succeeded");
            }
            Consultant consultant = consultantRepository.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));
            // Create transaction: consultant is sender; admin receives funds.
            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setPaymentIntentId(sessionId);
            transaction.setPaymentType("Subscription");
            transaction.setAmount(session.getAmountTotal());
            transaction.setCurrency(session.getCurrency().toUpperCase());
            transaction.setCustomerId(consultant.getStripeCustomerId());
            transaction.setStatus("succeeded");
            transaction.setCreatedAt(LocalDateTime.now());
            transaction.setConsultantSender(consultant);
            User admin = userRepository.findByRole("Admin")
                    .orElseThrow(() -> new RuntimeException("Admin account not found"));
            transaction.setAdminReceiver(admin);
            transactionRepository.save(transaction);

            // Create subscription record
            Subscription subscription = new Subscription();
            subscription.setPlanType(planType);
            subscription.setDateDebut(new Date());
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, 1);
            subscription.setExpirationDate(cal.getTime());
            subscription.setConsultant(consultant);
            subscription.setTransaction(transaction);
            subscriptionRepository.save(subscription);

        } catch (StripeException e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        }
    }

    /**
     * Calculate payment details for a mission.
     * @param missionId the mission's ID
     * @return a map with keys "firstSlice", "frozenAmount", and "applicationFee"
     */
    public Map<String, Double> calculatePaymentDetails(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));

        double totalBudget = mission.getBudget();
        double firstSlice = totalBudget * 0.20;
        double frozenAmount = totalBudget * 0.70;
        double applicationFee = totalBudget * 0.10;

        return Map.of(
                "firstSlice", firstSlice,
                "frozenAmount", frozenAmount,
                "applicationFee", applicationFee
        );
    }
    public boolean isFirstSlicePaid(Long missionId) {
        List<PaymentTransaction> transactions = transactionRepository.findByMissionIdAndPaymentType(
                missionId,
                "MISSION_FIRST_SLICE"
        );
        return !transactions.isEmpty();
    }
    public boolean isFinalPaymentPaid(Long missionId) {
        List<PaymentTransaction> transactions = transactionRepository.findByMissionIdAndPaymentType(
                missionId,
                "MISSION_FINAL_PAYMENT"
        );
        return !transactions.isEmpty();
    }
    /**
     * Process the first slice of a mission payment.
     * The enterprise pays the full mission budget; funds are distributed to the consultant (first slice)
     * and to the platform (commission), and the remaining is frozen.
     */
    @Transactional
    public void initiateFirstSlicePayment(Long missionId) throws StripeException {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));

        double missionBudget = mission.getBudget();
        Map<String, Double> paymentDetails = calculatePaymentDetails(missionId);
        double firstSlice = paymentDetails.get("firstSlice");
        double platformFee = paymentDetails.get("applicationFee");
        double frozenAmount = paymentDetails.get("frozenAmount");

        Entreprise entreprise = mission.getEntreprise();
        Consultant consultant = mission.getPropositions().stream()
                .findFirst()
                .map(Proposition::getConsultant)
                .orElseThrow(() -> new RuntimeException("No consultant found"));
        User admin = userRepository.findByRole("Admin")
                .orElseThrow(() -> new RuntimeException("Admin account not found"));

        if (entreprise.getStripeCustomerId() == null || admin.getStripeCustomerId() == null) {
            throw new RuntimeException("Stripe customer ID missing");
        }

        // Check enterprise balance for full mission budget
        Customer enterpriseCustomer = stripeService.getCustomerBalance(entreprise.getStripeCustomerId());
        double enterpriseBalance = enterpriseCustomer.getBalance() != null ?
                enterpriseCustomer.getBalance() / 100.0 : 0.0;
        if (enterpriseBalance < missionBudget) {
            throw new RuntimeException("Enterprise balance insufficient for mission budget");
        }

        // Process full payment from enterprise
        stripeService.adjustCustomerBalance(
                entreprise.getStripeCustomerId(),
                -(long)(missionBudget * 100)
        );

        // Distribute funds:
        // a) Consultant receives the first slice
        stripeService.adjustCustomerBalance(
                consultant.getStripeCustomerId(),
                (long)(firstSlice * 100)
        );
        // b) Platform (admin) receives the commission fee
        stripeService.adjustCustomerBalance(
                admin.getStripeCustomerId(),
                (long)(platformFee * 100)
        );

        // Update frozen balance for remaining funds
        entreprise.setFrozenBalance(entreprise.getFrozenBalance() + frozenAmount);
        entrepriseRepository.save(entreprise);

        // Create transaction records: record first slice payment and commission.
        createTransaction(entreprise, consultant, firstSlice, platformFee, admin, mission);
        createFrozenRecord(entreprise, frozenAmount, mission);
    }

    // Create a transaction record for the first slice of mission payment.
    private void createTransaction(Entreprise entreprise, Consultant consultant,
                                   double amount, double fee, User admin,Mission mission) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setEntrepriseSender(entreprise);
        transaction.setConsultantReceiver(consultant);
        transaction.setAmount((long)(amount * 100));
        transaction.setApplicationFee((long)(fee * 100));
        transaction.setCurrency("EUR");
        transaction.setPaymentType("MISSION_FIRST_SLICE");
        transaction.setStatus("PROCESSED");
        transaction.setCustomerId(entreprise.getStripeCustomerId());
        transaction.setConsultantAccountId(consultant.getStripeCustomerId());
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setAdminReceiver(admin); // Admin receives the commission fee
        transaction.setMission(mission);
        transactionRepository.save(transaction);
    }

    // Create a transaction record for the frozen funds.
    private void createFrozenRecord(Entreprise entreprise, double frozenAmount, Mission mission) {
        PaymentTransaction frozenTransaction = new PaymentTransaction();
        frozenTransaction.setEntrepriseSender(entreprise);
        frozenTransaction.setAmount((long)(frozenAmount * 100));
        frozenTransaction.setCurrency("EUR");
        frozenTransaction.setPaymentType("FROZEN_FUNDS");
        frozenTransaction.setStatus("PENDING");
        frozenTransaction.setCustomerId(entreprise.getStripeCustomerId());
        frozenTransaction.setCreatedAt(LocalDateTime.now());
        frozenTransaction.setMission(mission);
        transactionRepository.save(frozenTransaction);
    }

    /**
     * Process the final payment for a mission.
     * The frozen funds are released to the consultant.
     */
    @Transactional
    public void initiateFinalPayment(Long missionId) throws StripeException {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));

        Map<String, Double> paymentDetails = calculatePaymentDetails(missionId);
        double frozenAmount = paymentDetails.get("frozenAmount");
        Entreprise entreprise = mission.getEntreprise();
        Consultant consultant = mission.getPropositions().stream()
                .findFirst()
                .map(Proposition::getConsultant)
                .orElseThrow(() -> new RuntimeException("No consultant found"));

        if (entreprise.getFrozenBalance() < frozenAmount) {
            throw new RuntimeException("No frozen funds available for this mission");
        }

        Customer enterpriseCustomer = stripeService.getCustomerBalance(entreprise.getStripeCustomerId());
        double enterpriseBalance = enterpriseCustomer.getBalance() != null ?
                enterpriseCustomer.getBalance() / 100.0 : 0.0;
        if (enterpriseBalance < frozenAmount) {
            throw new RuntimeException("Enterprise balance insufficient for final payment");
        }

        stripeService.adjustCustomerBalance(
                entreprise.getStripeCustomerId(),
                -(long)(frozenAmount * 100)
        );
        stripeService.adjustCustomerBalance(
                consultant.getStripeCustomerId(),
                (long)(frozenAmount * 100)
        );

        entreprise.setFrozenBalance(entreprise.getFrozenBalance() - frozenAmount);
        entrepriseRepository.save(entreprise);

        createFinalTransaction(entreprise, consultant, frozenAmount, mission);
    }

    // Create a transaction record for the final mission payment.
    private void createFinalTransaction(Entreprise entreprise, Consultant consultant, double amount, Mission mission) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setEntrepriseSender(entreprise);
        transaction.setConsultantReceiver(consultant);
        transaction.setAmount((long)(amount * 100));
        transaction.setCurrency("EUR");
        transaction.setPaymentType("MISSION_FINAL_PAYMENT");
        transaction.setStatus("PROCESSED");
        transaction.setCustomerId(entreprise.getStripeCustomerId());
        transaction.setConsultantAccountId(consultant.getStripeCustomerId());
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setMission(mission);
        transactionRepository.save(transaction);
    }

    @Transactional
    public PaymentResponse initiateAddFundsPayment(long userId, double amount) throws StripeException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStripeCustomerId() == null) {
            throw new RuntimeException("User has no Stripe customer ID");
        }

        PaymentRequest request = new PaymentRequest();
        request.setName("Add Funds to Balance");
        request.setUserId(userId);
        request.setAmount((long) (amount * 100));
        request.setCurrency("usd");
        request.setQuantity(1L);

        return stripeService.createAddFundsSession(request, user.getStripeCustomerId());
    }

    @Transactional
    public BalanceDTO getCustomerBalance(long userId) throws StripeException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Add debug logging

        Customer customer = stripeService.getCustomerBalance(user.getStripeCustomerId());
        double stripeBalance = customer.getBalance() != null ?
                customer.getBalance() / 100.0 : 0.0;

        double frozenBalance = 0.0;
        if (user instanceof Entreprise) {
            // Explicitly cast and fetch from database
            Entreprise entreprise = entrepriseRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Entreprise not found"));
            frozenBalance = entreprise.getFrozenBalance();
        }

        return new BalanceDTO(
                stripeBalance - frozenBalance,
                frozenBalance,
                "eur"
        );
    }

    @Transactional
    public void confirmAddFunds(String sessionId) throws StripeException {
        Session session = stripeService.getSessionDetails(sessionId);
        if (!"paid".equals(session.getPaymentStatus())) {
            throw new RuntimeException("Payment not succeeded");
        }

        String userId = session.getMetadata().get("userId");
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        String stripeCustomerId = user.getStripeCustomerId();
        if (stripeCustomerId == null) {
            throw new RuntimeException("User has no associated Stripe customer");
        }

        double amount = Double.parseDouble(session.getMetadata().get("amount"));
        long amountInCents = (long) (amount * 100);

        Customer customer = Customer.retrieve(stripeCustomerId);
        CustomerUpdateParams params = CustomerUpdateParams.builder()
                .setBalance(customer.getBalance() + amountInCents)
                .build();
        customer.update(params);

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setPaymentIntentId(sessionId);
        transaction.setPaymentType("FUND_ADDITION");
        transaction.setAmount(amountInCents);
        transaction.setCurrency(session.getCurrency().toUpperCase());
        transaction.setCustomerId(stripeCustomerId);
        transaction.setStatus("succeeded");
        transaction.setCreatedAt(LocalDateTime.now());

        if (user instanceof Entreprise) {
            transaction.setEntrepriseSender((Entreprise) user);
        } else if (user instanceof Consultant) {
            transaction.setConsultantSender((Consultant) user);
        } else if (user.getRole().equals("ADMIN")) {
            transaction.setAdminSender(user);
        }

        transactionRepository.save(transaction);
    }
}
