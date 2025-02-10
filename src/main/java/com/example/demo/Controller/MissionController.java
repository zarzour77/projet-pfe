package com.example.demo.Controller;


import com.example.demo.Service.MissionService;
import com.example.demo.model.Mission;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.model.Avis;
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

    @PostMapping
    public Mission createMission(@RequestBody Mission mission) {
        return missionService.ajouterMission(mission);
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
                    Mission nouvelleMission = missionService.ajouterMission(mission);
                    return ResponseEntity.ok(nouvelleMission);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
            }
        }


