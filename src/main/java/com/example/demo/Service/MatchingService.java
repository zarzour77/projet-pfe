package com.example.demo.Service;

import com.example.demo.model.Competence;
import com.example.demo.model.Consultant;
import com.example.demo.model.Mission;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.MissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class MatchingService {

    @Autowired
    private ConsultantRepository consultantRepository;

    @Autowired
    private MissionRepository missionRepository;

    @Autowired
    private DistanceService distanceService;

    private static final double MATCH_THRESHOLD = 0.5;

    private int getCompetenceRank(String level) {
        return switch (level.toLowerCase()) {
            case "débutant" -> 1;
            case "intermédiaire" -> 2;
            case "expert" -> 3;
            default -> 0;
        };
    }

    private int getConsultantCompetenceLevel(Consultant consultant, String competenceName) {
        if (consultant.getCompetences() != null) {
            for (Competence comp : consultant.getCompetences()) {
                if (comp.getNom() != null && comp.getNom().equalsIgnoreCase(competenceName)) {
                    return getCompetenceRank(comp.getCompetenceNiveau());
                }
            }
        }
        return 0;
    }

    public int determineMatch(Consultant consultant, Mission mission) {
        List<Competence> requiredCompetences = mission.getCompetencesRequises();
        double competenceRatio = 0.0;

        if (requiredCompetences != null && !requiredCompetences.isEmpty()) {
            int matchCount = 0;
            for (Competence req : requiredCompetences) {
                String requiredName = req.getNom();
                int requiredLevel = getCompetenceRank(req.getCompetenceNiveau());
                int consultantLevel = getConsultantCompetenceLevel(consultant, requiredName);
                if (consultantLevel >= requiredLevel) {
                    matchCount++;
                }
            }
            competenceRatio = (double) matchCount / requiredCompetences.size();
        }

        double domainFactor = (consultant.getDomaines() != null && consultant.getDomaines().contains(mission.getDomaines())) ? 1.0 : 0.0;
        double budgetFactor = (mission.getBudget() != null && mission.getBudget() >= consultant.getTaux_horaire()) ? 1.0 : 0.0;
        double experienceFactor = (consultant.getExperienceYears() >= mission.getRequiredExperience()) ? 1.0 : 0.0;

        double distanceFactor = 0.0;
        try {
            double distance = distanceService.getDistance(
                    consultant.getLatitude(), consultant.getLongitude(),
                    mission.getLatitude(), mission.getLongitude());
            if (distance != -1 && distance < 50) {
                distanceFactor = 1.0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        double workloadFactor = (consultant.getWorkload() <= 2) ? 1.0 : 0.0;
        double ratingFactor = (consultant.getRating() != null && consultant.getRating() >= 4.0) ? 1.0 : 0.0;
        double disponibiliteFactor = consultant.isAvailableDuring(mission.getStartdate(), mission.getEnddate()) ? 1.0 : 0.5;
        double clientRelationshipFactor = (consultant.hasWorkedWithClient(mission.getEntreprise())) ? 1.0 : 0.0;
        double acceptanceRateFactor = (consultant.getAcceptanceRate() >= 0.8) ? 1.0 : 0.5;

        double competenceWeight = (mission.getRequiredExperience() > 5) ? 0.3 : 0.5;
        double experienceWeight = (mission.getRequiredExperience() > 5) ? 0.2 : 0.05;
        double distanceWeight = 0.05;

        double finalScore = (competenceWeight * competenceRatio) +
                (0.2 * domainFactor) +
                (0.15 * budgetFactor) +
                (experienceWeight * experienceFactor) +
                (distanceWeight * distanceFactor) +
                (0.05 * workloadFactor) +
                (0.05 * ratingFactor) +
                (0.05 * disponibiliteFactor) +
                (0.05 * clientRelationshipFactor) +
                (0.05 * acceptanceRateFactor);

        return (finalScore >= MATCH_THRESHOLD) ? 1 : 0;
    }

    public List<Mission> getMatchingMissionsForConsultant(Consultant consultant) {
        List<Mission> allMissions = missionRepository.findAll();
        List<Mission> matchingMissions = new ArrayList<>();
        for (Mission mission : allMissions) {
            if (determineMatch(consultant, mission) == 1) {
                matchingMissions.add(mission);
            }
        }
        return matchingMissions;
    }

    public List<Consultant> getMatchingConsultantsForMission(Mission mission) {
        List<Consultant> allConsultants = consultantRepository.findAll();
        List<Consultant> matchingConsultants = new ArrayList<>();
        for (Consultant consultant : allConsultants) {
            if (determineMatch(consultant, mission) == 1) {
                matchingConsultants.add(consultant);
            }
        }
        return matchingConsultants;
    }
}
