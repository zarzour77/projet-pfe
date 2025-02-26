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

    public Mission updateMission(Long id, Mission updatedMission) {
        return missionRepository.findById(id).map(mission -> {
            updatedMission.setPropositions(mission.getPropositions());
            mission.setTitre(updatedMission.getTitre());
            mission.setDescription(updatedMission.getDescription());
            mission.setBudget(updatedMission.getBudget());
            mission.setStatut(updatedMission.getStatut());
            mission.setEntreprise(updatedMission.getEntreprise());
            mission.setCompetencesRequises(updatedMission.getCompetencesRequises());
            return missionRepository.save(mission);
        }).orElseThrow(() -> new MissionNotFoundException(id));
    }

    public Optional<Object> getMissionById(Long missionId) {
        return Optional.of(missionRepository.findById(missionId));
    }



    public Mission updateMissionStatus(Long id, String newStatus) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new MissionNotFoundException(id));
        mission.setStatut(newStatus);
        return missionRepository.save(mission);
    }

    public Mission ajoutermission(Mission mission) {
        Long entrepriseId = mission.getEntreprise().getId();
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId));
        mission.setEntreprise(entreprise);
        return missionRepository.save(mission);
    }

    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }
}
