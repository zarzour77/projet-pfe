package com.example.demo.Controller;


import com.example.demo.Service.EntrepriseService;
import com.example.demo.Service.MissionService;
import com.example.demo.Service.NotificationService;
import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/entreprises")
public class EntrepriseController {
    private final EntrepriseService entrepriseService;
    private final NotificationService notificationService;

    @Autowired
    public EntrepriseController(EntrepriseService entrepriseService, NotificationService notificationService) {
        this.entrepriseService = entrepriseService;
        this.notificationService = notificationService;
    }
    @PostMapping("/{entrepriseId}/missions/{missionId}/apply-with-consultant")
    public ResponseEntity<?> applyWithConsultant(
            @PathVariable Long entrepriseId,
            @PathVariable Long missionId,
            @RequestParam Long consultantId,
            @RequestParam Double montant,
            @RequestParam String dureeEstime,
            @RequestParam String message) {
        try {
            Proposition savedProposition = entrepriseService.applyWithConsultant(entrepriseId, missionId, consultantId, montant, dureeEstime, message);
            return ResponseEntity.ok(savedProposition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}/consultants")
    public ResponseEntity<List<Consultant>> getConsultantsForEntreprise(@PathVariable Long id) {
        try {
            List<Consultant> consultants = entrepriseService.getConsultantsForEntreprise(id);
            return ResponseEntity.ok(consultants);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long id) {
        Optional<Entreprise> entrepriseOpt = entrepriseService.getEntrepriseById(id);
        if(entrepriseOpt.isPresent()){
            List<Notification> notifications = notificationService.getUnreadNotificationsForEntreprise(entrepriseOpt.get());
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<Entreprise> getAllEntreprises() {
        return entrepriseService.getAllEntreprises();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable Long id) {
        return entrepriseService.getEntrepriseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Entreprise createEntreprise(@RequestBody Entreprise entreprise) {
        return entrepriseService.createEntreprise(entreprise);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entreprise> updateEntreprise(@PathVariable Long id, @RequestBody Entreprise entreprise) {
        try {
            Entreprise updatedEntreprise = entrepriseService.updateEntreprise(id, entreprise);
            return ResponseEntity.ok(updatedEntreprise);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        entrepriseService.deleteEntreprise(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}/missions")
    public ResponseEntity<List<Mission>> getPublishedMissions(@PathVariable Long id) {
        try {
            List<Mission> missions = entrepriseService.getPublishedMissionsForEntreprise(id);
            return ResponseEntity.ok(missions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{entrepriseId}/consultants/{consultantId}")
    public ResponseEntity<?> removeConsultant(@PathVariable Long entrepriseId, @PathVariable Long consultantId) {
        try {
            entrepriseService.removeConsultantFromEntreprise(entrepriseId, consultantId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
