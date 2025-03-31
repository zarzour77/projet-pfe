package com.example.demo.Controller;

import com.example.demo.Service.AuthService;
import com.example.demo.Payload.LoginRequest;
import com.example.demo.Payload.SignupRequest;
import com.example.demo.Response.JwtResponse;
import com.example.demo.Response.MessageResponse;
import com.example.demo.Sec.UserDetailsImpl;
import com.example.demo.Sec.UserDetailsServiceImpl;
import com.example.demo.model.User;
import io.jsonwebtoken.Jwts;
import jakarta.validation.Valid;
import com.example.demo.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (!userDetails.isEmailVerified()) {
            // Envoi du code de vérification par email
            authService.sendVerificationCode(userDetails.getEmail());
            return ResponseEntity.badRequest().body(new MessageResponse("Votre email n'est pas vérifié. Un code de vérification vous a été envoyé."));
        }


        // Mise à jour du dernier login et du statut
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setLastConnection(LocalDateTime.now());
            user.setStatut("online");
            userRepository.save(user);
        }


        // Si vérifié, générer le token JWT
        String jwt = jwtUtils.generateJwtToken(
                authentication,
                userDetails.getTokenVersion() // Get from UserDetailsImpl
        );
        List<String> roles = List.of(userDetails.getRole());
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody SignupRequest signUpRequest) {
        User user = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(user);
    }

    // Endpoint pour vérifier le code envoyé par email
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String code) {
        return authService.verifyEmail(email, code);
    }
}
