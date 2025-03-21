package com.example.demo.Controller;

import com.example.demo.Service.ConsultantService;
import com.example.demo.Service.PropositionService;
import com.example.demo.model.*;
import com.example.demo.repository.ConsultantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "http://localhost:5173")
public class ConsultantController {

    private final ConsultantService consultantService;
    private final ConsultantRepository consultantRepository;
    private final PropositionService propositionService;

    @Autowired
    public ConsultantController(PropositionService propositionService, ConsultantRepository consultantRepository,
                                ConsultantService consultantService) {
        this.consultantRepository = consultantRepository;
        this.consultantService = consultantService;
        this.propositionService = propositionService;
    }

    @GetMapping
    public List<Consultant> getAllConsultants() {
        return consultantService.getAllConsultants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultant> getConsultantById(@PathVariable Long id) {
        return consultantService.getConsultantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}/badge")
    public ResponseEntity<Consultant> updateBadge(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String badge = payload.get("badge");
        if (badge == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Consultant updatedConsultant = consultantService.updateBadge(id, badge);
            return ResponseEntity.ok(updatedConsultant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public Consultant createConsultant(@RequestBody Consultant consultant) {
        return consultantService.createConsultant(consultant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultant> updateConsultant(@PathVariable Long id, @RequestBody Consultant consultant) {
        try {
            Consultant updatedConsultant = consultantService.updateConsultant(id, consultant);
            return ResponseEntity.ok(updatedConsultant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultant(@PathVariable Long id) {
        consultantService.deleteConsultant(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/addExperience")
    public ResponseEntity<Consultant> addExperience(@PathVariable Long id, @RequestBody Experience experience) {
        try {
            Consultant updatedConsultant = consultantService.addExperienceToConsultant(id, experience);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteExperience/{experienceId}")
    public String deleteExperience(@PathVariable Long consultantId, @PathVariable Long experienceId) {
        return consultantService.deleteExperience(consultantId, experienceId);
    }

    // New endpoints for competences
    @PostMapping("/{id}/addCompetence")
    public ResponseEntity<Consultant> addCompetence(@PathVariable Long id, @RequestBody Competence competence) {
        try {
            Consultant updatedConsultant = consultantService.addCompetenceToConsultant(id, competence);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteCompetence/{competenceId}")
    public String deleteCompetence(@PathVariable Long consultantId, @PathVariable Long competenceId) {
        return consultantService.deleteCompetence(consultantId, competenceId);
    }

    // New endpoints for domaines
    @PostMapping("/{id}/addDomaine")
    public ResponseEntity<Consultant> addDomaine(@PathVariable Long id, @RequestBody Domaine domaine) {
        try {
            Consultant updatedConsultant = consultantService.addDomaineToConsultant(id, domaine);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteDomaine/{domaineId}")
    public String deleteDomaine(@PathVariable Long consultantId, @PathVariable Long domaineId) {
        return consultantService.deleteDomaine(consultantId, domaineId);
    }

    @PostMapping("/{consultantId}/savedMissions")
    public ResponseEntity<Consultant> saveMission(
            @PathVariable Long consultantId,
            @RequestParam Long missionId) {
        try {
            Consultant updatedConsultant = consultantService.saveMissionForConsultant(consultantId, missionId);
            return ResponseEntity.ok(updatedConsultant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{consultantId}/savedMissions")
    public ResponseEntity<List<Mission>> getSavedMissions(@PathVariable Long consultantId) {
        try {
            List<Mission> savedMissions = consultantService.getSavedMissionsForConsultant(consultantId);
            return ResponseEntity.ok(savedMissions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Formation endpoints
    @PostMapping("/{id}/addFormation")
    public ResponseEntity<Consultant> addFormation(@PathVariable Long id, @RequestBody Formation formation) {
        try {
            Consultant updatedConsultant = consultantService.addFormationToConsultant(id, formation);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteFormation/{formationId}")
    public String deleteFormation(@PathVariable Long consultantId, @PathVariable Long formationId) {
        return consultantService.deleteFormation(consultantId, formationId);
    }

    // Langue endpoints
    @PostMapping("/{id}/addLangue")
    public ResponseEntity<Consultant> addLangue(@PathVariable Long id, @RequestBody Langue langue) {
        try {
            Consultant updatedConsultant = consultantService.addLangueToConsultant(id, langue);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteLangue/{langueId}")
    public String deleteLangue(@PathVariable Long consultantId, @PathVariable Long langueId) {
        return consultantService.deleteLangue(consultantId, langueId);
    }

    // Certification endpoints
    @PostMapping("/{id}/addCertification")
    public ResponseEntity<Consultant> addCertification(@PathVariable Long id, @RequestBody Certification certification) {
        try {
            Consultant updatedConsultant = consultantService.addCertificationToConsultant(id, certification);
            return ResponseEntity.ok(updatedConsultant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{consultantId}/deleteCertification/{certificationId}")
    public String deleteCertification(@PathVariable Long consultantId, @PathVariable Long certificationId) {
        return consultantService.deleteCertification(consultantId, certificationId);
    }
    @PutMapping("/{id}/incrementWorkload")
    public ResponseEntity<Consultant> incrementWorkload(@PathVariable Long id) {
        try {
            Consultant updatedConsultant = consultantService.incrementWorkload(id);
            return ResponseEntity.ok(updatedConsultant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}/decrementWorkload")
    public ResponseEntity<Consultant> decrementWorkload(@PathVariable Long id) {
        try {
            Consultant updatedConsultant = consultantService.decrementWorkload(id);
            return ResponseEntity.ok(updatedConsultant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/accepted-invitations")
    public ResponseEntity<List<Date>> getAcceptedInvitationDates(@PathVariable Long id) {
        try {
            List<Date> acceptationDates = consultantService.getAcceptedInvitationDates(id);
            return ResponseEntity.ok(acceptationDates);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
