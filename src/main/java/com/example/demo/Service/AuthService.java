package com.example.demo.Service;

import com.example.demo.Payload.SignupRequest;
import com.example.demo.Response.MessageResponse;
import com.example.demo.Sec.UserDetailsServiceImpl;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
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

    public User registerUser(SignupRequest signUpRequest) {
        // Check if the email already exists in the database
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        // Create and save the user
        User user = new User(
                signUpRequest.getNom(),
                signUpRequest.getPrenom(),
                signUpRequest.getTelephone(),
                signUpRequest.getEmail(),
                encodedPassword,
                signUpRequest.getRole()
        );

        return userRepository.save(user);
    }

}
