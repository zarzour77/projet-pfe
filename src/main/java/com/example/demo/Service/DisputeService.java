package com.example.demo.Service;

import com.example.demo.model.Dispute;
import com.example.demo.repository.DisputeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    public Dispute createDispute(Dispute dispute) {
        dispute.setCreatedAt(LocalDateTime.now());
        dispute.setStatus(Dispute.DisputeStatus.OPEN);
        return disputeRepository.save(dispute);
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
