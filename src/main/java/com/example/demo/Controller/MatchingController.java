package com.example.demo.Controller;

import com.example.demo.model.Consultant;
import com.example.demo.model.Mission;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.Service.MatchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private static final Logger logger = LoggerFactory.getLogger(MatchingController.class);

    private final MatchingService matchingService;
    private final ConsultantRepository consultantRepository;
    private final MissionRepository missionRepository;

    public MatchingController(MatchingService matchingService, ConsultantRepository consultantRepository, MissionRepository missionRepository) {
        this.matchingService = matchingService;
        this.consultantRepository = consultantRepository;
        this.missionRepository = missionRepository;
    }

    @GetMapping("/consultant/{id}")
    public ResponseEntity<List<Mission>> getMissionsForConsultant(@PathVariable Long id) {
        logger.info("Recherche des missions pour le consultant avec id: {}", id);
        Optional<Consultant> consultantOpt = consultantRepository.findById(id);
        if (!consultantOpt.isPresent()) {
            logger.warn("Consultant avec id {} non trouvé", id);
            return ResponseEntity.notFound().build();
        }
        List<Mission> missions = matchingService.getMatchingMissionsForConsultant(consultantOpt.get());
        logger.info("Nombre de missions trouvées pour le consultant {} : {}", id, missions.size());
        return ResponseEntity.ok(missions);
    }


    @GetMapping("/mission/{id}")
    public ResponseEntity<List<Consultant>> getConsultantsForMission(@PathVariable Long id) {
        logger.info("Recherche des consultants pour la mission avec id: {}", id);
        Optional<Mission> missionOpt = missionRepository.findById(id);
        if (!missionOpt.isPresent()) {
            logger.warn("Mission avec id {} non trouvée", id);
            return ResponseEntity.notFound().build();
        }
        List<Consultant> consultants = matchingService.getMatchingConsultantsForMission(missionOpt.get());
        logger.info("Nombre de consultants trouvés pour la mission {} : {}", id, consultants.size());
        return ResponseEntity.ok(consultants);
    }
}
