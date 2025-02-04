package com.example.demo.Controller;


import com.example.demo.Service.AvisService;
import com.example.demo.exception.DuplicateReviewException;
import com.example.demo.exception.SelfReviewException;
import com.example.demo.model.Avis;
import com.example.demo.model.AvisRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisService avisService;

    @PostMapping("/{missionId}")
    public ResponseEntity<?> createAvis(
            @PathVariable Long missionId,
            @Valid @RequestBody AvisRequest request
    ) {
        try {

            Avis createdAvis = avisService.createReview(missionId,request );
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAvis);
        } catch (SelfReviewException | DuplicateReviewException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/rating")
    public ResponseEntity<Double> getUserRating(@PathVariable Long userId) {
        return ResponseEntity.ok(avisService.getUserRating(userId));
    }

    private Avis mapRequestToAvis(AvisRequest request) {
        Avis avis = new Avis();
        avis.setNote(request.getNote());
        avis.setCommentaire(request.getCommentaire());
        // Implémenter la logique de récupération des utilisateurs
        return avis;
    }
}