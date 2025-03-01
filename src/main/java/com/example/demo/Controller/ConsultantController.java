package com.example.demo.Controller;

import com.example.demo.Service.ConsultantService;
import com.example.demo.model.Consultant;
import com.example.demo.model.Experience;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "http://localhost:5173")
public class ConsultantController {
    private final ConsultantService consultantService;

    @Autowired
    public ConsultantController(ConsultantService consultantService) {
        this.consultantService = consultantService;
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
        // Call the service layer to delete the experience
        return consultantService.deleteExperience(consultantId, experienceId);
    }
}
