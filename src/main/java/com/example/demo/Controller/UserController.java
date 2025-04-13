package com.example.demo.Controller;

import com.example.demo.Response.MessageResponse;
import com.example.demo.Service.UserService;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }
    @PostMapping("/suspend/{userId}")
    public ResponseEntity<MessageResponse> suspendUser(@PathVariable Long userId,
                                                       @RequestParam("suspendedUntil") LocalDateTime suspendedUntil) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur introuvable"));
        }
        User user = optionalUser.get();
        user.setSuspendedUntil(suspendedUntil);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Utilisateur suspendu jusqu'au " + suspendedUntil.toString()));
    }

    /**
     * Endpoint permettant de lever la suspension d'un utilisateur.
     */
    @PostMapping("/unsuspend/{userId}")
    public ResponseEntity<MessageResponse> unsuspendUser(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur introuvable"));
        }
        User user = optionalUser.get();
        user.setSuspendedUntil(null);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Suspension levée pour l'utilisateur"));
    }
    @GetMapping("/connection-stats")
    public ResponseEntity<Map<String, Long>> getConnectionStats() {
        List<User> users = userRepository.findAll();
        Map<String, Long> hourCounts = new HashMap<>();

        // Initialiser pour chaque heure de 00 à 23 à zéro.
        for (int i = 0; i < 24; i++) {
            hourCounts.put(String.format("%02d", i), 0L);
        }

        // Parcourir les utilisateurs et compter ceux qui ont une connexion enregistrée.
        for (User user : users) {
            LocalDateTime lastConnection = user.getLastConnection();
            if (lastConnection != null) {
                int hour = lastConnection.getHour();
                String hourStr = String.format("%02d", hour);
                hourCounts.put(hourStr, hourCounts.get(hourStr) + 1);
            }
        }
        return ResponseEntity.ok(hourCounts);
    }
    @GetMapping("/role-stats")
    public ResponseEntity<Map<String, Long>> getUserRoleStats() {
        Map<String, Long> stats = userService.getUserRoleStats();
        return ResponseEntity.ok(stats);
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Adjusted update endpoint to check if email is changed.
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            Optional<User> currentUserOpt = userService.getUserById(id);
            if (!currentUserOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            User currentUser = currentUserOpt.get();

            // Check if email is being changed
            if (user.getEmail() != null && !user.getEmail().equals(currentUser.getEmail())) {
                // Validate email uniqueness
                if (userService.existsByEmail(user.getEmail())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Email is already registered");
                }
            }

            User updatedUser = userService.updateUser(id, user);

            // Handle email change response
            if (user.getEmail() != null && !user.getEmail().equals(currentUser.getEmail())) {
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("user", updatedUser);
                responseBody.put("message", "Email updated. Please re-login.");
                responseBody.put("reAuth", true);
                return ResponseEntity.ok(responseBody);
            }
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user");
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/uploadProfilePic")
    public ResponseEntity<String> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            User updatedUser = userService.updateProfilePicture(id, file);
            return ResponseEntity.ok("Profile picture updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error updating profile picture");
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String role = request.get("role");
        if (role == null || role.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            User updatedUser = userService.updateUserRole(id, role);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}
