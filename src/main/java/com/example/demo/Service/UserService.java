package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.User;
import com.example.demo.repository.AvisRepository;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AvisRepository avisRepository;
    private final ConsultantRepository consultantRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder; // Inject the PasswordEncoder

    @Autowired
    public UserService(UserRepository userRepository, AvisRepository avisRepository,
                       ConsultantRepository consultantRepository, EntrepriseRepository entrepriseRepository,
                       EntityManager entityManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.avisRepository = avisRepository;
        this.consultantRepository = consultantRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.entityManager = entityManager;
        this.passwordEncoder = passwordEncoder;
    }
    public Map<String, Long> getUserRoleStats() {
        Map<String, Long> stats = new HashMap<>();
        long entrepriseCount = userRepository.countByRole("Entreprise");
        long consultantCount = userRepository.countByRole("Consultant");
        long adminCount = userRepository.countByRole("Admin");
        stats.put("Entreprise", entrepriseCount);
        stats.put("Consultant", consultantCount);
        stats.put("Admin", adminCount);

        return stats;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            boolean emailChanged = false;
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
                emailChanged = true;
                user.setTokenVersion(user.getTokenVersion() + 1); // Invalidate existing tokens
            }
            if (updatedUser.getNom() != null) {
                user.setNom(updatedUser.getNom());
            }
            if (updatedUser.getPrenom() != null) {
                user.setPrenom(updatedUser.getPrenom());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getTelephone() != null) {
                user.setTelephone(updatedUser.getTelephone());
            }
            if (updatedUser.getAdresse() != null) {
                user.setAdresse(updatedUser.getAdresse());
            }
            if (updatedUser.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public String encodeImageToBase64(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        return Base64.getEncoder().encodeToString(fileBytes);
    }

    // Méthode pour uploader et mettre à jour la photo de profil d'un utilisateur
    public User updateProfilePicture(Long id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String base64Image = encodeImageToBase64(file);
        // On stocke la chaîne raw sans le préfixe
        user.setPhotoprofile(base64Image);
        return userRepository.save(user);
    }

    @Transactional
    public void updateUserRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Double averageRating = avisRepository.calculateAverageRatingByUserId(userId);
        if (averageRating != null) {
            user.setRating(Math.round(averageRating * 10.0) / 10.0);
        } else {
            user.setRating(0.0);
        }
        userRepository.save(user);
    }



    @Transactional
    public User updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        User updatedUser = userRepository.save(user);

        if ("Consultant".equalsIgnoreCase(role)) {
            if (!consultantRepository.existsById(updatedUser.getId())) {
                entityManager.createNativeQuery("INSERT INTO consultant (id) VALUES (?)")
                        .setParameter(1, updatedUser.getId())
                        .executeUpdate();
            }
        } else if ("Entreprise".equalsIgnoreCase(role)) {
            if (!entrepriseRepository.existsById(updatedUser.getId())) {
                entityManager.createNativeQuery("INSERT INTO entreprise (id) VALUES (?)")
                        .setParameter(1, updatedUser.getId())
                        .executeUpdate();
            }
        }
        return updatedUser;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public List<User> searchUsers(String query) {
        return userRepository.findByNomContainingIgnoreCase(query);
    }
}
