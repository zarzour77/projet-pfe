package com.example.Trade_For_Talent.Controller;

import com.example.Trade_For_Talent.Service.AuthService;
import com.example.Trade_For_Talent.Payload.LoginRequest;
import com.example.Trade_For_Talent.Payload.SignupRequest;
import com.example.Trade_For_Talent.Response.JwtResponse;
import com.example.Trade_For_Talent.Response.MessageResponse;
import com.example.Trade_For_Talent.Sec.UserDetailsImpl;
import com.example.Trade_For_Talent.Sec.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import com.example.Trade_For_Talent.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.Trade_For_Talent.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
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
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
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
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Debugging log
        System.out.println("SignUp request received for: " + signUpRequest.getEmail());

        MessageResponse response = authService.registerUser(signUpRequest);
        if (response.getMessage().contains("Error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }


}
