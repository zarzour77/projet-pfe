package com.example.demo.Service;

import com.example.demo.Payload.SignupRequest;
import com.example.demo.Payment.CustomerData;
import com.example.demo.Payment.StripeService;
import com.example.demo.Response.MessageResponse;
import com.example.demo.Sec.UserDetailsServiceImpl;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static com.example.demo.model.VerificationUtil.generateVerificationCode;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    StripeService stripeService;

    public User registerUser(SignupRequest signUpRequest) {
        // Check if the email already exists in the database
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        // Set role to "ROLE_USER" if it's null or empty
        String role = signUpRequest.getRole();
        if (role == null || role.isEmpty()) {
            role = "ROLE_USER";
        }

        // Create and save the user
        User user = new User(
                signUpRequest.getNom(),
                signUpRequest.getPrenom(),
                signUpRequest.getTelephone(),
                signUpRequest.getEmail(),
                encodedPassword,
                role
        );


        // First save to get the generated ID
        User savedUser = userRepository.save(user);

        try {
            // Create Stripe customer
            CustomerData customerData = new CustomerData();
            customerData.setName(savedUser.getNom() + " " + savedUser.getPrenom());
            customerData.setEmail(savedUser.getEmail());
            customerData.setPhone(savedUser.getTelephone());

            // Add address if available
            if (savedUser.getAdresse() != null && !savedUser.getAdresse().isEmpty()) {
                customerData.setAddress(Map.of(
                        "line1", savedUser.getAdresse(),
                        "city", "Unknown",  // Replace with actual data if available
                        "country", "Unknown"
                ));
            }

            // Create Stripe customer and get response

            CustomerData stripeCustomer = stripeService.createCustomer(customerData);

            // Update user with Stripe customer ID
            savedUser.setStripeCustomerId(stripeCustomer.getCustomerID());
            userRepository.save(savedUser);

        } catch (StripeException e) {
            // Log error but allow user registration to complete
            System.err.println("Error creating Stripe customer: " + e.getMessage());
            // Consider adding retry logic or async processing here
        }

        return savedUser;
    }    @Autowired
    private EmailService emailService;
    public void sendVerificationCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String code = generateVerificationCode();
            user.setVerificationCode(code);
            userRepository.save(user);
            // Envoi de l'email
            emailService.sendVerificationEmail(email, code);
            System.out.println("Code de vérification envoyé à " + email + ": " + code);
        } else {
            System.out.println("Utilisateur non trouvé pour l'email: " + email);
        }
    }

    // Vérification du code de vérification
    public ResponseEntity<?> verifyEmail(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur non trouvé"));
        }
        User user = userOpt.get();
        if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
            user.setEmailVerified(true);
            user.setVerificationCode(null); // Réinitialisation
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Email vérifié avec succès"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Code de vérification invalide"));
        }
    }


}
