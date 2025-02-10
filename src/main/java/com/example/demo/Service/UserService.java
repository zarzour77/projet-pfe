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
            user.setNom(updatedUser.getNom());
            user.setPrenom(updatedUser.getPrenom());
            user.setEmail(updatedUser.getEmail());
            user.setTelephone(updatedUser.getTelephone());
            user.setAdresse(updatedUser.getAdresse());
            user.setPassword(updatedUser.getPassword());
            user.setRole(updatedUser.getRole());
            user.setCompetences(updatedUser.getCompetences());
            user.setAvisRecus(updatedUser.getAvisRecus());
            user.setAvisRediges(updatedUser.getAvisRediges());
            user.setNotifications(updatedUser.getNotifications());
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
}

