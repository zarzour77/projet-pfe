package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.exception.MissionNotFoundException;
import com.example.demo.model.Avis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MissionService {
    @Autowired
    private final MissionRepository missionRepository;
    @Autowired
    private EntrepriseRepository entrepriseRepository;
    @Autowired
    private ConsultantRepository consultantRepository;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private EmailService emailService;


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

    public Optional<Mission> getMissionByIdm(Long missionId) {
        return missionRepository.findById(missionId);
    }

    public Mission updateMissionStatus(Long id, String newStatus) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new MissionNotFoundException(id));
        mission.setStatut(newStatus);
        return missionRepository.save(mission);
    }
    // Seuil à définir selon vos tests (par exemple 0.8)
    private static final double MATCH_THRESHOLD = 0.6;
    public Mission ajoutermission(Mission mission) {
        Long entrepriseId = mission.getEntreprise().getId();
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId));
        mission.setEntreprise(entreprise);
        Mission savedMission = missionRepository.save(mission);

        // Recherche de tous les consultants dans la base
        List<Consultant> consultants = consultantRepository.findAll();
        for (Consultant consultant : consultants) {
            double score = matchingService.computeGlobalMatchScore(consultant, savedMission);
            if (score > MATCH_THRESHOLD) {
                String message = "Nouvelle mission \"" + savedMission.getTitre() +
                        "\" correspondant à vos compétences (score: " + score + ").";
                // Envoi de la notification
                notificationService.sendNotification(consultant, message);

                // Préparation des données pour l'email
                String subject = "Nouvelle mission disponible";
                String content = "Bonjour " + consultant.getNom() + ",\n\n" +
                        "Une nouvelle mission correspondant à vos compétences a été publiée.\n" +
                        "Titre : " + savedMission.getTitre() + "\n" +
                        "Score de correspondance : " + score + "\n\n" +
                        "Cordialement,\nVotre équipe";

                // Envoi de l'email
                emailService.sendInvitationEmail(consultant.getEmail(), subject, content);
            }
        }
        return savedMission;
    }

    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    // Nouvelle méthode de filtrage par domaines
    public List<Mission> getMissionsByDomainIds(List<Long> domainIds) {
        return missionRepository.findDistinctByDomainesIdIn(domainIds);
    }

    public List<Mission> getMissionsByExperience(String experience) {
        return missionRepository.findDistinctByNiveauExperienceRequisIgnoreCase(experience);
    }

    // Filtrage par porte de travail
    public List<Mission> getMissionsByPorteDeTravail(String portetravail) {
        return missionRepository.findDistinctByPortetravailIgnoreCase(portetravail);
    }

    public List<Mission> getMissionsByBudgetRange(Double minBudget, Double maxBudget) {
        return missionRepository.findByBudgetBetween(minBudget, maxBudget);
    }

    // Nouveau filtre : Filtrage par durée estimée
    public List<Mission> getMissionsByDureeEstime(String dureeEstime) {
        return missionRepository.findDistinctByDureeEstimeIgnoreCase(dureeEstime);
    }

    public Mission acceptMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));
        mission.setStatut("en cours"); // Passage au statut "en cours"
        mission.setStartdate(new Date()); // Mise à jour de la date de démarrage avec la date actuelle
        return missionRepository.save(mission);
    }

    public List<Mission> getAvailableMissionsForConsultant(String status, Long consultantId) {
        // Récupère toutes les missions avec le statut donné (par ex. "en attente")
        List<Mission> missions = missionRepository.findByStatut(status);
        // Filtrer pour exclure les missions ayant une proposition "INVITED" pour ce consultant
        missions = missions.stream().filter(mission -> {
            if (mission.getPropositions() != null) {
                return mission.getPropositions().stream()
                        .noneMatch(prop ->
                                prop.getConsultant() != null &&
                                        prop.getConsultant().getId().equals(consultantId) &&
                                        prop.getOrigine().equalsIgnoreCase("INVITED")
                        );
            }
            return true;
        }).collect(Collectors.toList());
        return missions;
    }

    // NEW: Terminate a mission by setting its status to "terminée" and filling the end date.
    public Mission terminateMission(Long missionId, String endDateStr) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));
        mission.setStatut("terminée");

        // Parse the endDateStr and set it as the mission's end date.
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        try {
            Date endDate = sdf.parse(endDateStr);
            mission.setEnddate(endDate);  // Ensure your Mission entity has a field 'enddate'
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format for endDate", e);
        }
        return missionRepository.save(mission);
    }
}
