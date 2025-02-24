package com.example.demo.Controller;


import com.example.demo.Service.MissionService;
import com.example.demo.model.Mission;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.model.Avis;
import com.example.demo.model.MissionDTO;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/missions")
public class MissionController {
    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @GetMapping
    public List<Mission> getAllMissions() {
        return missionService.getAllMissions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getMissionById(@PathVariable Long id) {
        return missionService.getMissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Mission> updateMission(@PathVariable Long id, @RequestBody Mission mission) {
        try {
            Mission updatedMission = missionService.updateMission(id, mission);
            return ResponseEntity.ok(updatedMission);
        } catch (RuntimeException e) {

        return ResponseEntity.notFound().build();}
    }

            @GetMapping("/{id}/avis")
            public ResponseEntity<List<Avis>> getMissionAvis (@PathVariable Long id){
                return ResponseEntity.ok(missionService.getMissionAvis(id));
            }

            @PatchMapping("/{id}/status")
            public ResponseEntity<Mission> updateMissionStatus (@PathVariable Long id, @RequestParam String newStatus){
                try {
                    return ResponseEntity.ok(missionService.updateMissionStatus(id, newStatus));
                } catch (MissionNotFoundException e) {
                    return ResponseEntity.notFound().build();
                }
            }


            @PostMapping("/add")
            public ResponseEntity<?> ajouterMission (@RequestBody Mission mission){
                try {
                    Mission nouvelleMission = missionService.ajoutermission(mission);
                    return ResponseEntity.ok(nouvelleMission);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
            }
    @Transactional
    @GetMapping("/search")
    public List<MissionDTO> searchMissions() {
        List<Mission> missions = missionService.getAllMissions();
        return missions.stream().map(m -> {
            MissionDTO dto = new MissionDTO();
            dto.setId(m.getId());
            dto.setTitle(m.getTitre());
            dto.setDescription(m.getDescription());
            dto.setBudget(m.getBudget());
            // Formatage du budget pour l'affichage (par exemple "$500+")
            dto.setSpent("$" + m.getBudget() + "+");
            // On utilise la date de début si présente, sinon la deadline
            dto.setPublishedAt(m.getStartdate() != null ? m.getStartdate() : m.getDeadline());
            // Pour la localisation, on utilise par exemple le nom de l'entreprise
            dto.setLocation(m.getEntreprise() != null ? m.getEntreprise().getNom() : "Unknown");
            // On récupère les compétences requises en tant que tags
            dto.setTags(m.getCompetencesRequises() != null
                    ? m.getCompetencesRequises().stream().map(c -> c.getNom()).collect(Collectors.toList())
                    : new ArrayList<>());
            // Ajout de l'entreprise
            if (m.getEntreprise() != null) {
                dto.setEntreprise(m.getEntreprise());
            }
            // Par simplicité, on retourne true pour paymentVerified (vous pouvez adapter la logique)
            dto.setPaymentVerified(true);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    @GetMapping("/stories")
    public ResponseEntity<List<Mission>> getMissionsForStories() {
        List<Mission> missions = missionService.getAllMissions();
        return ResponseEntity.ok(missions);
    }

}


