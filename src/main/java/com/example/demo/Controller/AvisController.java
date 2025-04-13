package com.example.demo.Controller;

import com.example.demo.Service.AvisService;
import com.example.demo.model.AvisRequest;
import com.example.demo.model.AvisResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avis")
public class AvisController {
    private final AvisService avisService;

    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    @PostMapping
    public ResponseEntity<AvisResponse> createAvis(
            @RequestBody AvisRequest avisRequest,
            @RequestParam Long missionId
    ) {
        AvisResponse response = avisService.createAvis(avisRequest, missionId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<List<AvisResponse>> getAvisByConsultantId(
            @PathVariable Long consultantId
    ) {
        List<AvisResponse> avis = avisService.getAvisByConsultantId(consultantId);
        return ResponseEntity.ok(avis);
    }
}