package com.example.Trade_For_Talent.Service;

import com.example.Trade_For_Talent.Entity.User;
import com.example.Trade_For_Talent.Payload.SignupRequest;
import com.example.Trade_For_Talent.Response.MessageResponse;
import com.example.Trade_For_Talent.Sec.UserDetailsServiceImpl;
import com.example.Trade_For_Talent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public MessageResponse registerUser(SignupRequest signUpRequest) {
        // Debugging logs
        System.out.println("Registering user with email: " + signUpRequest.getEmail());

        // Check if the email already exists in the database
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already taken!");
        }

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        // Create the new user object
        User user = new User(
                signUpRequest.getNom(),
                signUpRequest.getPrenom(),
                signUpRequest.getTelephone(),
                signUpRequest.getEmail(),
                encodedPassword,
                signUpRequest.getRole()
        );

        // Save the user into the repository
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

}
