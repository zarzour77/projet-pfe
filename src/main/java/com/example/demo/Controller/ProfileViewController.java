package com.example.demo.Controller;


import com.example.demo.Service.ProfileViewService;
import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.ProfileView;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.ProfileViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProfileViewController {

    @Autowired
    private ProfileViewService profileViewService;
    @Autowired
    private ProfileViewRepository profileViewRepository;

    @Autowired
    private ConsultantRepository consultantRepository;
    @Autowired
    private EntrepriseRepository entrepriseRepository;


    @PostMapping("/profile-views/entreprise")
    public ResponseEntity<ProfileView> createProfileViewEntreprise(@RequestBody Map<String, Long> request) {
        Long entrepriseId = request.get("entrepriseId");
        if (entrepriseId == null) {
            return ResponseEntity.badRequest().build();
        }
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));
        ProfileView profileView = new ProfileView();
        profileView.setEntreprise(entreprise);
        profileView.setDateView(new Date());
        profileViewRepository.save(profileView);
        return ResponseEntity.ok(profileView);
    }

    // Endpoint pour récupérer les statistiques de vues de profil pour une entreprise
    @GetMapping("/entreprises/{entrepriseId}/profile-views")
    public ResponseEntity<Map<String, Object>> getProfileViewsEntreprise(
            @PathVariable Long entrepriseId,
            @RequestParam(defaultValue = "7") int periodDays) {
        Map<String, Object> stats = profileViewService.getEntrepriseProfileViews(entrepriseId, periodDays);
        return ResponseEntity.ok(stats);
    }
    @PostMapping("/profile-views")
    public ResponseEntity<ProfileView> createProfileViewConsultant(@RequestBody Map<String, Long> request) {
        Long consultantId = request.get("consultantId");
        if (consultantId == null) {
            return ResponseEntity.badRequest().build();
        }
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
        ProfileView profileView = new ProfileView();
        profileView.setConsultant(consultant);
        profileView.setDateView(new Date());
        profileViewRepository.save(profileView);
        return ResponseEntity.ok(profileView);
    }


    @GetMapping("/consultants/{consultantId}/profile-views")
    public ResponseEntity<Map<String, Object>> getProfileViews(
            @PathVariable Long consultantId,
            @RequestParam(defaultValue = "7") int periodDays) {
        Map<String, Object> stats = profileViewService.getConsultantProfileViews(consultantId, periodDays);
        return ResponseEntity.ok(stats);
    }
}
