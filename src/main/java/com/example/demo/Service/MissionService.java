package com.example.demo.Service;


import com.example.demo.Payment.PaymentBusinessService;
import com.example.demo.Payment.PaymentIntentRequest;
import com.example.demo.Payment.PaymentTransaction;
import com.example.demo.Payment.StripeService;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.exception.MissionNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

import com.example.demo.model.*;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.exception.MissionNotFoundException;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.*;

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
    UserRepository userRepository;
    @Autowired
    private MatchingService matchingService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private CompetenceRepository competenceRepository;
    @Autowired
    PaymentBusinessService paymentBusinessService;
    @Autowired
    StripeService stripeService;
    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;
    public MissionService(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    @Transactional
    public Map<String, Integer> getTopTalentsBadgeData() {
        List<Mission> missions = missionRepository.findAll();
        Map<String, Integer> badgeCounts = new HashMap<>();
        // Initialisation des badges recherchés
        badgeCounts.put("Rising Talent", 0);
        badgeCounts.put("Top Rated", 0);
        badgeCounts.put("Top Rated Plus", 0);
        badgeCounts.put("Expert-Vetted", 0);

        for (Mission mission : missions) {
            if (mission.getPropositions() != null) {
                for (Proposition prop : mission.getPropositions()) {
                    // On ne considère que les propositions terminées
                    if ("terminée".equalsIgnoreCase(prop.getStatut()) && prop.getConsultant() != null) {
                        String badge = prop.getConsultant().getBadge();
                        if (badge != null && badgeCounts.containsKey(badge)) {
                            badgeCounts.put(badge, badgeCounts.get(badge) + 1);
                        }
                    }
                }
            }
        }
        return badgeCounts;
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
    // Seuil à définir selon vos tests (par exemple 0.6)
    private static final double MATCH_THRESHOLD = 0.6;
    public Mission ajoutermission(Mission mission) {
        Long entrepriseId = mission.getEntreprise().getId();
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId));
        mission.setEntreprise(entreprise);

        // If the mission has competences, iterate and check each one.
        if (mission.getCompetencesRequises() != null) {
            mission.setCompetencesRequises(
                    mission.getCompetencesRequises().stream().map(competence -> {
                        Optional<Competence> existingCompetenceOpt =
                                competenceRepository.findByNomIgnoreCaseAndCompetenceNiveau(
                                        competence.getNom(), competence.getCompetenceNiveau());
                        // If found, return the existing competence; otherwise, save the new one.
                        return existingCompetenceOpt.orElseGet(() -> competenceRepository.save(competence));
                    }).collect(Collectors.toList())
            );
        }

        Mission savedMission = missionRepository.save(mission);

        // Lancer le traitement en arrière-plan
        processNotificationsAsync(savedMission);
        return savedMission;
    }
    @Async
    public void processNotificationsAsync(Mission savedMission) {
        List<Consultant> consultants = consultantRepository.findAll();
        for (Consultant consultant : consultants) {
            double score = matchingService.computeGlobalMatchScore(consultant, savedMission);
            if (score > 0.6) {  // Using your MATCH_THRESHOLD directly inline
                String message = "Nouvelle mission \"" + savedMission.getTitre() +
                        "\" correspondant à vos compétences (score: " + score + ").";
                notificationService.sendNotification(consultant, message);

                String subject = "Nouvelle mission disponible";
                String content = "Bonjour " + consultant.getNom() + ",\n\n" +
                        "Une nouvelle mission correspondant à vos compétences a été publiée.\n" +
                        "Titre : " + savedMission.getTitre() + "\n" +
                        "Score de correspondance : " + score + "\n\n" +
                        "Cordialement,\nVotre équipe";
                emailService.sendInvitationEmail(consultant.getEmail(), subject, content);
            }
        }
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

    @Transactional
    public Mission acceptMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new MissionNotFoundException(missionId));
        mission.setStatut("en cours");
        mission.setStartdate(new Date());
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
