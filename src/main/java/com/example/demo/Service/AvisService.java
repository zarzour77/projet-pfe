package com.example.demo.Service;

import com.example.demo.model.*;
import com.example.demo.repository.AvisRepository;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// AvisService.java
@Service
public class AvisService {
    private final AvisRepository avisRepository;
    private final UserRepository userRepository;
    private final ConsultantRepository consultantRepository;
    private final MissionRepository missionRepository;

    public AvisService(AvisRepository avisRepository,
                       UserRepository userRepository,
                       ConsultantRepository consultantRepository,
                       MissionRepository missionRepository) {
        this.avisRepository = avisRepository;
        this.userRepository = userRepository;
        this.consultantRepository = consultantRepository;
        this.missionRepository = missionRepository;
    }

    public AvisResponse createAvis(AvisRequest avisRequest, Long missionId) {
        User auteur = userRepository.findById(avisRequest.getAuteurId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        User cible = userRepository.findById(avisRequest.getCibleId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(auteur.equals(cible)) {
            throw new IllegalArgumentException("Cannot rate yourself");
        }

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        Avis avis = new Avis();
        avis.setAuteur(auteur);
        avis.setCible(cible);
        avis.setNote(avisRequest.getNote());
        avis.setCommentaire(avisRequest.getCommentaire());
        avis.setMission(mission);

        Avis savedAvis = avisRepository.save(avis);

        // Update consultant's job success
        updateJobSuccess(cible.getId());

        return mapToResponse(savedAvis);
    }

    private void updateJobSuccess(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        Double averageRating = avisRepository.findAverageRatingByCibleId(consultantId);
        consultant.setJobSuccess(averageRating != null ? averageRating * 20 : 0.0); // Convert 5-star to percentage

        consultantRepository.save(consultant);
    }

    private AvisResponse mapToResponse(Avis avis) {
        AvisResponse response = new AvisResponse();
        response.setId(avis.getId());
        response.setAuteurNom(avis.getAuteur().getNom() + " " + avis.getAuteur().getPrenom());
        response.setCibleNom(avis.getCible().getNom() + " " + avis.getCible().getPrenom());
        response.setNote(avis.getNote());
        response.setCommentaire(avis.getCommentaire());
        response.setDateAvis(avis.getDateAvis());
        response.setMissionTitre(avis.getMission().getTitre());
        return response;
    }
    public List<AvisResponse> getAvisByConsultantId(Long consultantId) {
        List<Avis> avisList = avisRepository.findByCibleIdAndMissionIsNotNull(consultantId);
        return avisList.stream()
                .map(avis -> new AvisResponse(
                        avis.getId(),
                        avis.getAuteur().getPrenom() + " " + avis.getAuteur().getNom(),
                        avis.getNote(),
                        avis.getCommentaire(),
                        avis.getDateAvis(),
                        avis.getMission().getTitre()))
                .collect(Collectors.toList());
    }
}