package com.example.demo.Controller;


import com.example.demo.Service.EntrepriseService;
import com.example.demo.Service.MissionService;
import com.example.demo.Service.NotificationService;
import com.example.demo.model.*;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/entreprises")
public class EntrepriseController {
    private final EntrepriseService entrepriseService;
    private final NotificationService notificationService;
    private final ConsultantRepository consultantRepository;
    private final EntrepriseRepository entrepriseRepository;

    @Autowired
    public EntrepriseController(EntrepriseService entrepriseService, NotificationService notificationService, ConsultantRepository consultantRepository, EntrepriseRepository entrepriseRepository) {
        this.entrepriseService = entrepriseService;
        this.notificationService = notificationService;
        this.consultantRepository = consultantRepository;
        this.entrepriseRepository = entrepriseRepository;
    }
    @GetMapping("/inscriptions")
    public List<Map<String, Object>> getInscriptionsStats(
            @RequestParam(required = false, defaultValue = "all") String filter) {

        // Regrouper les données par date (format ISO) dans une map
        Map<String, Map<String, Object>> statsMap = new HashMap<>();
        ZoneId zone = ZoneId.systemDefault();

        // Récupération des inscriptions pour les consultants
        List<Object[]> consultantResults = consultantRepository.countConsultantsByDate();
        for (Object[] row : consultantResults) {
            Date date = (Date) row[0];
            if (date == null) continue;
            LocalDate localDate = Instant.ofEpochMilli(date.getTime()).atZone(zone).toLocalDate();
            String dateKey = localDate.toString(); // ex : "2025-03-20"
            Long count = (Long) row[1];
            Map<String, Object> stat = statsMap.getOrDefault(dateKey, new HashMap<>());
            stat.put("date", localDate);
            stat.put("consultantCount", count);
            // Initialiser les autres compteurs si non présents
            stat.put("entrepriseClienteCount", stat.getOrDefault("entrepriseClienteCount", 0L));
            stat.put("entrepriseSsiCount", stat.getOrDefault("entrepriseSsiCount", 0L));
            statsMap.put(dateKey, stat);
        }

        // Récupération des inscriptions pour les entreprises par type
        List<Object[]> entrepriseResults = entrepriseRepository.countEntreprisesByDateAndType();
        for (Object[] row : entrepriseResults) {
            Date date = (Date) row[0];
            if (date == null) continue;
            LocalDate localDate = Instant.ofEpochMilli(date.getTime()).atZone(zone).toLocalDate();
            String dateKey = localDate.toString();
            Entreprise.TypeEntreprise type = (Entreprise.TypeEntreprise) row[1];
            Long count = (Long) row[2];
            Map<String, Object> stat = statsMap.getOrDefault(dateKey, new HashMap<>());
            stat.put("date", localDate);
            stat.put("consultantCount", stat.getOrDefault("consultantCount", 0L));
            stat.put("entrepriseClienteCount", stat.getOrDefault("entrepriseClienteCount", 0L));
            stat.put("entrepriseSsiCount", stat.getOrDefault("entrepriseSsiCount", 0L));
            if (type == Entreprise.TypeEntreprise.CLIENTE) {
                stat.put("entrepriseClienteCount", ((Long) stat.get("entrepriseClienteCount")) + count);
            } else if (type == Entreprise.TypeEntreprise.SSI) {
                stat.put("entrepriseSsiCount", ((Long) stat.get("entrepriseSsiCount")) + count);
            }
            statsMap.put(dateKey, stat);
        }

        // Conversion de la map en liste et tri par date (LocalDate)
        List<Map<String, Object>> statsList = new ArrayList<>(statsMap.values());
        statsList.sort(Comparator.comparing(m -> (LocalDate) m.get("date")));

        // Application du filtre si nécessaire
        if (!filter.equals("all")) {
            LocalDate now = LocalDate.now();
            if (filter.equals("lastWeek")) {
                LocalDate lastWeek = now.minusDays(7);
                statsList = statsList.stream()
                        .filter(stat -> {
                            LocalDate date = (LocalDate) stat.get("date");
                            return !date.isBefore(lastWeek); // date >= lastWeek
                        })
                        .collect(Collectors.toList());
            } else if (filter.equals("lastMonth")) {
                LocalDate lastMonth = now.minusDays(30);
                statsList = statsList.stream()
                        .filter(stat -> {
                            LocalDate date = (LocalDate) stat.get("date");
                            return !date.isBefore(lastMonth);
                        })
                        .collect(Collectors.toList());
            }
        }
        return statsList;
    }

    @GetMapping("/{id}/missions/aggregate")
    public ResponseEntity<Map<String, Object>> getAggregatedMissions(
            @PathVariable Long id,
            @RequestParam("period") String period) {
        try {
            Map<String, Object> aggregatedData = entrepriseService.getAggregatedMissionsStats(id, period);
            return ResponseEntity.ok(aggregatedData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/missions/status")
    public ResponseEntity<List<Mission>> getMissionsByStatus(
            @PathVariable Long id,
            @RequestParam("statut") String statut) {
        try {
            List<Mission> missions = entrepriseService.getMissionsByStatusForEntreprise(id, statut);
            return ResponseEntity.ok(missions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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

    @GetMapping("/frozen-balance/{userId}")
    public ResponseEntity<Double> getFrozenBalance(@PathVariable Long userId) {
        try {
            Double frozenBalance = entrepriseService.getFrozenBalance(userId);
            return ResponseEntity.ok(frozenBalance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/search")
    public ResponseEntity<List<Entreprise>> search(
            @RequestParam("q") String q
    ) {
        List<Entreprise> results = entrepriseService.searchEntreprises(q);
        return ResponseEntity.ok(results);
    }
}
