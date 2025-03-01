package com.example.demo.Controller;


import com.example.demo.Service.MissionService;
import com.example.demo.model.Mission;
import com.example.demo.exception.MissionNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<Mission> searchMissions() {
        return missionService.getAllMissions();
    }

    @Transactional
    @GetMapping("/stories")
    public ResponseEntity<List<Mission>> getMissionsForStories() {
        List<Mission> missions = missionService.getAllMissions();
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/searchByDomain")
    public ResponseEntity<List<Mission>> searchMissionsByDomain(@RequestParam("domaines") List<Long> domainIds) {
        List<Mission> missions = missionService.getMissionsByDomainIds(domainIds);
        return ResponseEntity.ok(missions);
    }
    @GetMapping("/searchByExperience")
    public ResponseEntity<List<Mission>> searchMissionsByExperience(@RequestParam("experience") String experience) {
        List<Mission> missions = missionService.getMissionsByExperience(experience);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/searchByPortetravail")
    public ResponseEntity<List<Mission>> searchMissionsByPorteDeTravail(@RequestParam("portetravail") String portetravail) {
        List<Mission> missions = missionService.getMissionsByPorteDeTravail(portetravail);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/searchByBudget")
    public ResponseEntity<List<Mission>> searchMissionsByBudget(
            @RequestParam("minBudget") Double minBudget,
            @RequestParam("maxBudget") Double maxBudget) {

        List<Mission> missions = missionService.getMissionsByBudgetRange(minBudget, maxBudget);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/searchByDureeEstime")
    public ResponseEntity<List<Mission>> searchMissionsByDureeEstime(@RequestParam("dureeEstime") String dureeEstime) {
        List<Mission> missions = missionService.getMissionsByDureeEstime(dureeEstime);
        return ResponseEntity.ok(missions);
    }
}


