package com.example.demo.Payment;

import com.example.demo.Payment.PaymentBusinessService;
import com.example.demo.Payment.PaymentRequest;
import com.example.demo.Payment.PaymentResponse;
import com.example.demo.dto.BalanceDTO;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.repository.PaymentTransactionRepository;
import com.stripe.exception.StripeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentBusinessService paymentBusinessService;
    private final StripeService stripeService;
    public PaymentController(PaymentBusinessService paymentBusinessService,
                             StripeService stripeService) {
        this.paymentBusinessService = paymentBusinessService;
        this.stripeService = stripeService;
    }
    @GetMapping("/global/applicationFee")
    public ResponseEntity<?> getGlobalApplicationFeeStats(@RequestParam("period") String period) {
        try {
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime now = LocalDateTime.now(zone);
            LocalDateTime startDate;
            LocalDateTime endDate;

            if ("6months".equalsIgnoreCase(period)) {
                // Pour les 6 derniers mois (6 mois complets) : du mois de (now - 5 mois) à now
                startDate = now.minusMonths(5).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                endDate = now;
            } else if ("year".equalsIgnoreCase(period)) {
                // Pour l'année complète : du 1er janvier au 31 décembre de l'année en cours
                int currentYear = now.getYear();
                startDate = LocalDateTime.of(currentYear, 1, 1, 0, 0);
                endDate = LocalDateTime.of(currentYear, 12, 31, 23, 59, 59);
            } else {
                logger.error("Période invalide reçue: {}", period);
                return ResponseEntity.badRequest().body("Invalid period. Use '6months' or 'year'.");
            }

            List<Object[]> results = paymentTransactionRepository.findGlobalMonthlyApplicationFee(startDate, endDate);
            List<String> labels = new ArrayList<>();
            List<Long> fees = new ArrayList<>();

            // Génération d'une liste de mois dans la période
            YearMonth startYM = YearMonth.from(startDate);
            YearMonth endYM = YearMonth.from(endDate);
            Map<String, Long> map = new HashMap<>();
            for (Object[] row : results) {
                String month = (String) row[0]; // format "YYYY-MM"
                Long sum = (Long) row[1];
                map.put(month, sum);
            }
            YearMonth current = startYM;
            while (!current.isAfter(endYM)) {
                String key = current.toString(); // format "YYYY-MM"
                labels.add(current.format(DateTimeFormatter.ofPattern("MMM yyyy")));
                fees.add(map.getOrDefault(key, 0L));
                current = current.plusMonths(1);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("labels", labels);
            response.put("data", fees);
            logger.info("Global applicationFee stats: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du calcul global de l'applicationFee: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }


    @GetMapping("/transactions/volume/all")
    public ResponseEntity<?> getTotalTransactionVolume(@RequestParam("period") String period) {
        try {
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime now = LocalDateTime.now(zone);
            List<String> labels = new ArrayList<>();
            List<Long> volumes = new ArrayList<>();

            if ("month".equalsIgnoreCase(period)) {
                // Derniers 28 jours répartis en 4 semaines
                LocalDateTime startDate = now.minusDays(27);
                for (int i = 0; i < 4; i++) {
                    LocalDateTime weekStart = startDate.plusDays(i * 7);
                    LocalDateTime weekEnd = weekStart.plusDays(6);
                    labels.add("Semaine " + (i + 1));
                    Long volume = paymentTransactionRepository.findTotalTransactionVolume(weekStart, weekEnd);
                    volumes.add(volume != null ? volume : 0L);
                }
            } else if ("year".equalsIgnoreCase(period)) {
                // Pour l'année en cours : 12 mois
                int currentYear = now.getYear();
                for (int m = 1; m <= 12; m++) {
                    YearMonth ym = YearMonth.of(currentYear, m);
                    LocalDateTime monthStart = ym.atDay(1).atStartOfDay();
                    LocalDateTime monthEnd = ym.atEndOfMonth().atTime(23, 59, 59);
                    labels.add(ym.format(DateTimeFormatter.ofPattern("MMM")));
                    Long volume = paymentTransactionRepository.findTotalTransactionVolume(monthStart, monthEnd);
                    volumes.add(volume != null ? volume : 0L);
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid period. Use 'month' or 'year'.");
            }
            Map<String, Object> response = new HashMap<>();
            response.put("labels", labels);
            Map<String, Object> dataset = new HashMap<>();
            dataset.put("label", "Volume des transactions");
            dataset.put("data", volumes);
            response.put("datasets", new Object[] { dataset });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du calcul du volume total des transactions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }
    @GetMapping("/donut/entreprise/{entrepriseId}")
    public ResponseEntity<?> getDonutDataEntreprise(@PathVariable Long entrepriseId,
                                                    @RequestParam("period") String period) {
        try {
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime now = LocalDateTime.now(zone);
            LocalDateTime startDate;

            if ("month".equalsIgnoreCase(period)) {
                startDate = now.minusMonths(1);
            } else if ("year".equalsIgnoreCase(period)) {
                startDate = now.minusYears(1);
            } else {
                logger.error("Période invalide reçue pour entrepriseId {}: {}", entrepriseId, period);
                return ResponseEntity.badRequest().body("Invalid period. Use 'month' or 'year'.");
            }

            // Calcul pour chaque type
            Long firstSlice = paymentTransactionRepository.findSumByEntrepriseAndPaymentType(
                    entrepriseId, startDate, now, "MISSION_FIRST_SLICE", "PROCESSED");
            logger.info("Première tranche de mission pour entrepriseId {}: {}", entrepriseId, firstSlice);

            Long finalPayment = paymentTransactionRepository.findSumByEntrepriseAndPaymentType(
                    entrepriseId, startDate, now, "MISSION_FINAL_PAYMENT", "PROCESSED");
            logger.info("Deuxième tranche de mission pour entrepriseId {}: {}", entrepriseId, finalPayment);

            Long frozenFunds = paymentTransactionRepository.findSumByEntrepriseAndPaymentType(
                    entrepriseId, startDate, now, "FROZEN_FUNDS", "PENDING");
            logger.info("Fonds gelés pour entrepriseId {}: {}", entrepriseId, frozenFunds);

            // Construction de la réponse
            Map<String, Long> donutData = new HashMap<>();
            donutData.put("firstSlice", firstSlice != null ? firstSlice : 0L);
            donutData.put("finalPayment", finalPayment != null ? finalPayment : 0L);
            donutData.put("frozenFunds", frozenFunds != null ? frozenFunds : 0L);

            logger.info("Donut data envoyée pour entrepriseId {}: {}", entrepriseId, donutData);
            return ResponseEntity.ok(donutData);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des données du donut pour entrepriseId {}: {}",
                    entrepriseId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    // for dashboard consultant (earning)
    @GetMapping("/{consultantId}")
    public ResponseEntity<?> getEarnings(@PathVariable Long consultantId,
                                         @RequestParam("period") String period) {
        try {
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime now = LocalDateTime.now(zone);
            LocalDateTime startDate;

            if ("month".equalsIgnoreCase(period)) {
                startDate = now.minusMonths(1);
            } else if ("year".equalsIgnoreCase(period)) {
                startDate = now.minusYears(1);
            } else {
                logger.error("Période invalide reçue pour consultantId {}: {}", consultantId, period);
                return ResponseEntity.badRequest().body("Invalid period. Use 'month' or 'year'.");
            }

            logger.info("Calcul des earnings pour consultantId {}. Période: {}. Date de début: {}, Date de fin: {}",
                    consultantId, period, startDate, now);

            // Appel de la méthode de debug pour lister les transactions dans cet intervalle

            Long earnings = paymentTransactionRepository.findEarningsByConsultantAndDateRange(consultantId, startDate, now);
            logger.info("Earnings calculés pour consultantId {}: {}", consultantId, earnings);
            return ResponseEntity.ok(earnings);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des earnings pour consultantId {}: {}", consultantId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    //for dashboard consultants doghnut
    // Nouvel endpoint pour récupérer les données du donut chart
    @GetMapping("/donut/{consultantId}")
    public ResponseEntity<?> getDonutData(@PathVariable Long consultantId,
                                          @RequestParam("period") String period) {
        try {
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime now = LocalDateTime.now(zone);
            LocalDateTime startDate;

            if ("month".equalsIgnoreCase(period)) {
                startDate = now.minusMonths(1);
            } else if ("year".equalsIgnoreCase(period)) {
                startDate = now.minusYears(1);
            } else {
                logger.error("Période invalide reçue pour consultantId {}: {}", consultantId, period);
                return ResponseEntity.badRequest().body("Invalid period. Use 'month' or 'year'.");
            }

            // Calcul de Frozen Funds : somme des "amount" où paymentType = "FROZEN_FUNDS" et status = "PENDING"
            Long frozenFunds = paymentTransactionRepository.findSumByConsultantAndCriteria(
                    consultantId, startDate, now, "FROZEN_FUNDS", "PENDING");
            logger.info("Frozen Funds pour consultantId {}: {}", consultantId, frozenFunds);

            // Calcul des Application Fee : somme des "applicationFee" pour les transactions du consultant
            Long applicationFee = paymentTransactionRepository.findSumApplicationFeeByConsultantAndDateRange(
                    consultantId, startDate, now);
            logger.info("Application Fee pour consultantId {}: {}", consultantId, applicationFee);

            // Amount Received : même calcul que l'earning
            Long amountReceived = paymentTransactionRepository.findEarningsByConsultantAndDateRange(
                    consultantId, startDate, now);
            logger.info("Amount Received pour consultantId {}: {}", consultantId, amountReceived);

            // Construction de la réponse
            Map<String, Long> donutData = new HashMap<>();
            donutData.put("frozenFunds", frozenFunds != null ? frozenFunds : 0L);
            donutData.put("applicationFee", applicationFee != null ? applicationFee : 0L);
            donutData.put("amountReceived", amountReceived != null ? amountReceived : 0L);

            logger.info("Donut data envoyée pour consultantId {}: {}", consultantId, donutData);
            return ResponseEntity.ok(donutData);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des données du donut pour consultantId {}: {}", consultantId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }


    // Initiate a subscription payment (consultant-to-platform)
    @PostMapping("/subscription")
    public ResponseEntity<PaymentResponse> initiateSubscriptionPayment(@RequestBody PaymentRequest request,
                                                                       @RequestParam long consultantId) {
        try {
            PaymentResponse response = paymentBusinessService.initiateSubscriptionPayment(request, consultantId);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Process a successful subscription payment (after Stripe checkout)
    @PostMapping("/process-subscription")
    public ResponseEntity<String> processSubscriptionPayment(@RequestParam String sessionId,
                                                             @RequestParam long consultantId,
                                                             @RequestParam String planType) {
        try {
            paymentBusinessService.processSuccessfulSubscriptionPayment(sessionId, consultantId, planType);
            return ResponseEntity.ok("Subscription payment processed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Initiate add-funds payment
    @PostMapping("/add-funds")
    public ResponseEntity<PaymentResponse> initiateAddFundsPayment(@RequestParam long userId,
                                                                   @RequestParam double amount) {
        try {
            PaymentResponse response = paymentBusinessService.initiateAddFundsPayment(userId, amount);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/customerBalance/{userId}")
    public ResponseEntity<?> getCustomerBalance(@PathVariable long userId) {
        try {
            BalanceDTO balance = paymentBusinessService.getCustomerBalance(userId);
            return ResponseEntity.ok(balance);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PostMapping("/customer/{customerID}/update")
    public ResponseEntity<CustomerData> updateCustomer(@PathVariable String customerID,
                                                       @RequestBody CustomerData updateData) {
        try {
            CustomerData data = stripeService.updateCustomer(customerID, updateData);
            return ResponseEntity.status(HttpStatus.OK).body(data);
        } catch (StripeException e) {
            System.out.println("Stripe Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    // Confirm add-funds payment
    @PostMapping("/confirm-add-funds")
    public ResponseEntity<String> confirmAddFunds(@RequestParam String sessionId) {
        try {
            paymentBusinessService.confirmAddFunds(sessionId);
            return ResponseEntity.ok("Funds added successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Process first slice payment for a mission
    @PostMapping("/{missionId}/first-payment")
    public ResponseEntity<String> processFirstPayment(@PathVariable Long missionId) {
        try {
            paymentBusinessService.initiateFirstSlicePayment(missionId);
            return ResponseEntity.ok("First payment (20% + 10% fee) processed successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}/payment-details")
    public ResponseEntity<Map<String, Object>> getPaymentDetails(@PathVariable Long id) {
        try {
            Map<String, Double> paymentDetails = paymentBusinessService.calculatePaymentDetails(id);
            boolean isFirstSlicePaid = paymentBusinessService.isFirstSlicePaid(id);
            boolean isFinalPaymentPaid = paymentBusinessService.isFinalPaymentPaid(id);

            Map<String, Object> response = new HashMap<>();
            response.put("firstSlice", paymentDetails.get("firstSlice"));
            response.put("frozenAmount", paymentDetails.get("frozenAmount"));
            response.put("applicationFee", paymentDetails.get("applicationFee"));
            response.put("isFirstSlicePaid", isFirstSlicePaid);
            response.put("isFinalPaymentPaid", isFinalPaymentPaid);

            return ResponseEntity.ok(response);
        } catch (MissionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Process final payment for a mission
    @PostMapping("/{missionId}/final-payment")
    public ResponseEntity<String> processFinalPayment(@PathVariable Long missionId) {
        try {
            paymentBusinessService.initiateFinalPayment(missionId);
            return ResponseEntity.ok("Final payment (70%) processed successfully");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Stripe error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
