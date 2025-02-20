package com.example.demo.Service;

import com.example.demo.model.Entreprise;
import com.example.demo.model.User;
import com.example.demo.repository.AvisRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AvisRepository avisRepository;
    private final EntrepriseRepository entrepriseRepository;

    @Autowired
    public UserService(UserRepository userRepository, AvisRepository avisRepository, EntrepriseRepository entrepriseRepository) {
        this.userRepository = userRepository;
        this.avisRepository = avisRepository;
        this.entrepriseRepository = entrepriseRepository;
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
                user.setPassword(updatedUser.getPassword());
            }
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            if (updatedUser.getCompetences() != null) {
                user.setCompetences(updatedUser.getCompetences());
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

    // Mise à jour de la photo de profil
    public User updateProfilePicture(Long id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String base64Image = encodeImageToBase64(file);
        user.setPhotoprofile(base64Image);
        return userRepository.save(user);
    }

    @Transactional
    public void updateUserRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Double averageRating = avisRepository.calculateAverageRatingByUserId(userId);
        if(averageRating != null) {
            user.setRating(Math.round(averageRating * 10.0) / 10.0);
        } else {
            user.setRating(0.0);
        }
        userRepository.save(user);
    }

    public User updateSubscriptionType(Long id, String subscriptionType) {
        return userRepository.findById(id).map(user -> {
            user.setSubscriptionType(subscriptionType);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Mise à jour du rôle (sans créer d'entrée Entreprise)
    public User updateUserRole(Long id, String role) {
        return userRepository.findById(id).map(user -> {
            user.setRole(role);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByNomContainingIgnoreCase(query);
    }
}
