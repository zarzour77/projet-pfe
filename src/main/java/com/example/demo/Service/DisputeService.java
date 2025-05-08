package com.example.demo.Service;

import com.example.demo.model.Dispute;
import com.example.demo.model.User;
import com.example.demo.repository.DisputeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;
    public Dispute createDispute(Dispute dispute) {
        dispute.setCreatedAt(LocalDateTime.now());
        dispute.setStatus(Dispute.DisputeStatus.OPEN);

        // Sauvegarde de la dispute
        Dispute createdDispute = disputeRepository.save(dispute);

        // Recherche d'un utilisateur avec le rôle "Admin" via Optional
        Optional<User> adminOptional = userRepository.findByRole("Admin");

        // Création du message de notification (vous pouvez personnaliser ce message)
        String message = "Nouvelle dispute reçue : " + dispute.getDescription();

        if (adminOptional.isPresent()) {
            // Envoi de la notification pour l'admin trouvé
            User admin = adminOptional.get();
            notificationService.createNotificationForAdmin(message, admin);
        } else {
            System.out.println("Aucun utilisateur de rôle Admin n'a été trouvé.");
        }

        return createdDispute;
    }
    public List<Dispute> getDisputesByUserId(Long userId) {
        return disputeRepository.findBySenderIdWithTransaction(userId);
    }

    // Récupérer tous les litiges pour l'admin
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    // Mettre à jour la réponse de l'admin et le statut du litige
    public Dispute updateAdminResponse(Long id, String adminResponse, Dispute.DisputeStatus status) {
        Optional<Dispute> optionalDispute = disputeRepository.findById(id);
        if (optionalDispute.isPresent()) {
            Dispute dispute = optionalDispute.get();
            dispute.setAdminResponse(adminResponse);
            dispute.setStatus(status);
            dispute.setUpdatedAt(LocalDateTime.now());
            return disputeRepository.save(dispute);
        }
        throw new RuntimeException("Dispute non trouvée avec id " + id);
    }

    // Mettre à jour uniquement le statut du litige
    public Dispute updateStatus(Long id, Dispute.DisputeStatus status) {
        Optional<Dispute> optionalDispute = disputeRepository.findById(id);
        if (optionalDispute.isPresent()) {
            Dispute dispute = optionalDispute.get();
            dispute.setStatus(status);
            dispute.setUpdatedAt(LocalDateTime.now());
            return disputeRepository.save(dispute);
        }
        throw new RuntimeException("Dispute non trouvée avec id " + id);
    }
}
