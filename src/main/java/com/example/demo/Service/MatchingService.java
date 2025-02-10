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
    private DistanceService distanceService; // Injection du service de distance

    // Seuil de matching
    private static final double MATCH_THRESHOLD = 0.5;

    /**
     * Renvoie le niveau que possède le consultant pour une compétence donnée.
     */
    private int getConsultantCompetenceLevel(Consultant consultant, String competenceName) {
        if (consultant.getCompetences() != null) {
            for (Competence comp : consultant.getCompetences()) {
                if (comp.getNom() != null && comp.getNom().equalsIgnoreCase(competenceName)) {
                    return comp.getCompetenceNiveaux();
                }
            }
        }
        return 0;
    }

    /**
     * Calcule le score de matching entre un consultant et une mission en prenant en compte divers critères :
     *
     * 1. Compétences (ratio des compétences requises satisfaites)
     * 2. Domaine (bonus si le domaine de la mission figure dans les domaines du consultant)
     * 3. Budget (bonus si le budget de la mission est supérieur ou égal au budget minimum du consultant)
     * 4. Expérience (bonus si l'expérience du consultant est suffisante par rapport à la mission)
     * 5. Distance (bonus si la distance entre le consultant et la mission est inférieure à 50 km)
     * 6. Workload (bonus si la charge de travail du consultant est faible)
     * 7. Rating (bonus si le consultant a un rating élevé)
     * 8. Disponibilité temporelle (bonus si le consultant est disponible pendant la période de la mission)
     * 9. Relation client (bonus si le consultant a déjà travaillé avec l'entreprise de la mission)
     * 10. Taux d'acceptation (bonus si le consultant a un taux d'acceptation élevé)
     *
     * @param consultant Le consultant à évaluer
     * @param mission    La mission à évaluer
     * @return 1 si le score final est supérieur ou égal au seuil, sinon 0.
     */
    public int determineMatch(Consultant consultant, Mission mission) {
        // 1. Facteur compétences
        List<Competence> requiredCompetences = mission.getCompetencesRequises();
        double competenceRatio = 0.0;
        if (requiredCompetences != null && !requiredCompetences.isEmpty()) {
            int matchCount = 0;
            for (Competence req : requiredCompetences) {
                String requiredName = req.getNom();
                int requiredLevel = req.getCompetenceNiveaux();
                int consultantLevel = getConsultantCompetenceLevel(consultant, requiredName);
                if (consultantLevel >= requiredLevel) {
                    matchCount++;
                }
            }
            competenceRatio = (double) matchCount / requiredCompetences.size();
        }

        // 2. Facteur domaine
        double domainFactor = (consultant.getDomaines() != null && consultant.getDomaines().contains(mission.getDomaine())) ? 1.0 : 0.0;

        // 3. Facteur budget
        double budgetFactor = (mission.getBudget() != null && mission.getBudget() >= consultant.getBudgetMin()) ? 1.0 : 0.0;

        // 4. Facteur expérience
        double experienceFactor = (consultant.getExperienceYears() >= mission.getRequiredExperience()) ? 1.0 : 0.0;

        // 5. Facteur distance
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

        // 6. Facteur workload
        double workloadFactor = (consultant.getWorkload() <= 2) ? 1.0 : 0.0;

        // 7. Facteur rating
        double ratingFactor = (consultant.getRating() != null && consultant.getRating() >= 4.0) ? 1.0 : 0.0;

        // 8. Facteur disponibilité temporelle
        double disponibiliteFactor = consultant.isAvailableDuring(mission.getStartdate(), mission.getEnddate()) ? 1.0 : 0.5;

        // 9. Facteur relation client
        double clientRelationshipFactor = (consultant.hasWorkedWithClient(mission.getEntreprise())) ? 1.0 : 0.0;

        // 10. Facteur taux d'acceptation
        double acceptanceRateFactor = (consultant.getAcceptanceRate() >= 0.8) ? 1.0 : 0.5;

        // Adapter les pondérations en fonction de l'expérience requise pour la mission
        double competenceWeight = (mission.getRequiredExperience() > 5) ? 0.3 : 0.5;
        double experienceWeight = (mission.getRequiredExperience() > 5) ? 0.2 : 0.05;
        double distanceWeight = 0.05; // Pondération pour la distance

        // Calcul du score final
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
