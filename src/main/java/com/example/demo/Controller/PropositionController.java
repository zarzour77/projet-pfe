package com.example.demo.Controller;


import com.example.demo.Service.PropositionService;
import com.example.demo.model.Mission;
import com.example.demo.model.Proposition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/propositions")
@CrossOrigin(origins = "http://localhost:5173")
public class PropositionController {
    private final PropositionService propositionService;

    @Autowired
    public PropositionController(PropositionService propositionService) {
        this.propositionService = propositionService;
    }
    @GetMapping("/mission/{missionId}")
    public ResponseEntity<List<Proposition>> getPropositionsByMission(@PathVariable Long missionId) {
        List<Proposition> propositions = propositionService.getPropositionsByMission(missionId);
        return ResponseEntity.ok(propositions);
    }

    @GetMapping
    public List<Proposition> getAllPropositions() {
        return propositionService.getAllPropositions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proposition> getPropositionById(@PathVariable Long id) {
        return propositionService.getPropositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proposition createProposition(@RequestBody Proposition proposition) {
        return propositionService.createProposition(proposition);
    }

    // Endpoint PUT pour mettre à jour le statut d'une proposition
    @PutMapping("/{id}")
    public ResponseEntity<Proposition> updatePropositionStatus(@PathVariable Long id, @RequestBody Map<String, String> updateRequest) {
        String newStatus = updateRequest.get("statut");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Proposition updatedProposition = propositionService.updatePropositionStatus(id, newStatus);
            return ResponseEntity.ok(updatedProposition);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProposition(@PathVariable Long id) {
        propositionService.deleteProposition(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/invite")
    public Proposition inviteConsultant(@RequestBody Proposition proposition) {
        // On force l'origine à INVITED dans le cas d'une invitation
        proposition.setOrigine("INVITED");
        // Vous pouvez ajouter ici d'autres logiques spécifiques aux invitations
        return propositionService.createProposition(proposition);
    }

    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<List<Proposition>> getPropositionsByConsultant(@PathVariable Long consultantId) {
        List<Proposition> propositions = propositionService.getPropositionsByConsultant(consultantId);
        return ResponseEntity.ok(propositions);
    }
    @GetMapping("/{id}/mission")
    public ResponseEntity<Mission> getMissionFromProposition(@PathVariable Long id) {
        try {
            Mission mission = propositionService.getMissionByPropositionId(id);
            return ResponseEntity.ok(mission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

