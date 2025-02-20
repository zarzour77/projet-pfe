package com.example.demo.Service;

import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.model.Avis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MissionService {
    @Autowired
    private final MissionRepository missionRepository;
    @Autowired
    private EntrepriseRepository entrepriseRepository;

    public MissionService(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    public void markAsReviewed(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));
        mission.setStatut("REVIEWED");
        missionRepository.save(mission);
    }

    // Méthode existante modifiée pour lever l'exception
    public Mission updateMission(Long id, Mission updatedMission) {
        return missionRepository.findById(id).map(mission -> {
            // Garder l'historique des propositions
            updatedMission.setPropositions(mission.getPropositions());

            mission.setTitre(updatedMission.getTitre());
            mission.setDescription(updatedMission.getDescription());
            mission.setBudget(updatedMission.getBudget());
            mission.setDeadline(updatedMission.getDeadline());
            mission.setStatut(updatedMission.getStatut());
            mission.setEntreprise(updatedMission.getEntreprise());
            mission.setCompetencesRequises(updatedMission.getCompetencesRequises());
            mission.setDomaine(updatedMission.getDomaine());

            return missionRepository.save(mission);
        }).orElseThrow(() -> new MissionNotFoundException(id));
    }


    public Optional<Object> getMissionById(Long missionId) {
        return Optional.of(missionRepository.findById(missionId));
    }
    public List<Avis> getMissionAvis(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));
        return mission.getAvis(); // Assurez-vous que la classe Mission contient une liste d'avis
    }

    // 🔹 Mettre à jour le statut d'une mission
    public Mission updateMissionStatus(Long id, String newStatus) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new MissionNotFoundException(id));
        mission.setStatut(newStatus);
        return missionRepository.save(mission);
    }
    public Mission ajoutermission(Mission mission) {
        // Récupération de l'id fourni dans la mission
        Long entrepriseId = mission.getEntreprise().getId();

        // Récupérer l'entité Entreprise complète depuis la DB
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId));

        // Associer l'objet entreprise complet à la mission
        mission.setEntreprise(entreprise);

        // Sauvegarde de la mission
        return missionRepository.save(mission);
    }


    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }
}

