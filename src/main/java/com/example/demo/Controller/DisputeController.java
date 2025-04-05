package com.example.demo.Controller;

import com.example.demo.model.Dispute;
import com.example.demo.Service.DisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    // Créer un nouveau litige
    @PostMapping
    public ResponseEntity<Dispute> createDispute(@RequestBody Dispute dispute) {
        Dispute createdDispute = disputeService.createDispute(dispute);
        return ResponseEntity.ok(createdDispute);
    }

    // Récupérer les litiges d'un utilisateur (consultant ou entreprise)
    @GetMapping
    public ResponseEntity<List<Dispute>> getDisputes(@RequestParam Long userId) {
        List<Dispute> disputes = disputeService.getDisputesByUserId(userId);
        return ResponseEntity.ok(disputes);
    }

    // Endpoint pour l'admin : récupérer tous les litiges
    @GetMapping("/all")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        List<Dispute> disputes = disputeService.getAllDisputes();
        return ResponseEntity.ok(disputes);
    }

    // Endpoint pour l'admin : mettre à jour la réponse du litige et son statut
    @PutMapping("/{id}/response")
    public ResponseEntity<Dispute> updateAdminResponse(
            @PathVariable Long id,
            @RequestBody AdminResponsePayload payload) {
        Dispute updatedDispute = disputeService.updateAdminResponse(id, payload.getAdminResponse(), payload.getStatus());
        return ResponseEntity.ok(updatedDispute);
    }

    // Endpoint pour l'admin : mettre à jour uniquement le statut
    @PutMapping("/{id}/status")
    public ResponseEntity<Dispute> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusPayload payload) {
        Dispute updatedDispute = disputeService.updateStatus(id, payload.getStatus());
        return ResponseEntity.ok(updatedDispute);
    }
}

// Payload pour la réponse de l'admin et mise à jour du statut
class AdminResponsePayload {
    private String adminResponse;
    private Dispute.DisputeStatus status;

    public String getAdminResponse() {
        return adminResponse;
    }
    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }
    public Dispute.DisputeStatus getStatus() {
        return status;
    }
    public void setStatus(Dispute.DisputeStatus status) {
        this.status = status;
    }
}

// Payload pour mettre à jour le statut uniquement
class StatusPayload {
    private Dispute.DisputeStatus status;

    public Dispute.DisputeStatus getStatus() {
        return status;
    }
    public void setStatus(Dispute.DisputeStatus status) {
        this.status = status;
    }
}
