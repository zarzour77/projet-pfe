package com.example.demo.Service;


import com.example.demo.model.Avis;
import com.example.demo.repository.AvisRepository;
import org.springframework.stereotype.Service;
import com.example.demo.exception.DuplicateReviewException;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.exception.SelfReviewException;
import com.example.demo.model.Avis;
import com.example.demo.model.AvisRequest;
import com.example.demo.model.Mission;
import com.example.demo.model.User;
import com.example.demo.repository.AvisRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvisService {

    private final AvisRepository avisRepository;
    private final UserService userService;
    private final MissionService missionService;

    @Transactional
    public Avis createReview(Long missionId, AvisRequest avisRequest) { // Corriger le type de avisRequest
        Mission mission = (Mission) missionService.getMissionById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));

        User auteur = userService.getUserById(avisRequest.getAuteurId()) // Utiliser avisRequest
                .orElseThrow(() -> new RuntimeException("Auteur non trouvé"));

        User cible = userService.getUserById(avisRequest.getCibleId()) // Utiliser avisRequest
                .orElseThrow(() -> new RuntimeException("Cible non trouvée"));

        if(auteur.getId().equals(cible.getId())) {
            throw new SelfReviewException();
        }

        if(avisRepository.existsByMissionIdAndAuteurId(mission.getId(), auteur.getId())) {
            throw new DuplicateReviewException();
        }

        Avis avis = new Avis();
        avis.setAuteur(auteur);
        avis.setCible(cible);
        avis.setNote(avisRequest.getNote());
        avis.setCommentaire(avisRequest.getCommentaire());
        avis.setMission(mission);

        Avis savedAvis = avisRepository.save(avis);

        userService.updateUserRating(cible.getId());
        missionService.markAsReviewed(missionId);

        return savedAvis;
    }

    public Double getUserRating(Long userId) {
        return avisRepository.calculateAverageRatingByUserId(userId);
    }
}
