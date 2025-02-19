package com.example.demo.Service;


import com.example.demo.model.User;
import com.example.demo.repository.AvisRepository;
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



    @Autowired
    public UserService(UserRepository userRepository, AvisRepository avisRepository) {
        this.userRepository = userRepository;
        this.avisRepository = avisRepository;
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

    // Method to upload and update the user's profile picture
    public User updateProfilePicture(Long id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Encode the image and update the profile
        String base64Image = encodeImageToBase64(file);
        user.setPhotoprofile(base64Image);

        return userRepository.save(user);
    }


    @Transactional
    public void updateUserRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Double averageRating = avisRepository.calculateAverageRatingByUserId(userId);

        // Arrondir à 1 décimale et gérer les cas null
        if(averageRating != null) {
            user.setRating(Math.round(averageRating * 10.0) / 10.0);
        } else {
            user.setRating(0.0); // Valeur par défaut si pas d'avis
        }

        userRepository.save(user);
    }
    public User updateSubscriptionType(Long id, String subscriptionType) {
        return userRepository.findById(id).map(user -> {
            user.setSubscriptionType(subscriptionType);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserRole(Long id, String role) {
        return userRepository.findById(id).map(user -> {
            user.setRole(role); // Set the new role
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

}

