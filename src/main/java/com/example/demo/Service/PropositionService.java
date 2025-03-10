package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.model.Proposition;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.repository.PropositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropositionService {
    private final PropositionRepository propositionRepository;
    private final NotificationService notificationService;
    private final MissionRepository missionRepository; // Injection du repository pour Mission
    private final EmailService emailService; // Pour envoyer l'email

    @Autowired
    private ConsultantRepository consultantRepository;

    @Autowired
    public PropositionService(PropositionRepository propositionRepository, NotificationService notificationService, MissionRepository missionRepository, EmailService emailService) {
        this.propositionRepository = propositionRepository;
        this.notificationService = notificationService;
        this.missionRepository = missionRepository;
        this.emailService = emailService;
    }
    public List<Proposition> getPropositionsByMission(Long missionId) {
        return propositionRepository.findByMissionId(missionId);
    }

    public Proposition createProposition(Proposition proposition) {
        if (proposition.getStatut() == null || proposition.getStatut().trim().isEmpty()) {
            proposition.setStatut("PENDING");
        }
        Proposition saved = propositionRepository.save(proposition);

        // Logique pour l'origine "APPLIED" (ne pas modifier)
        if ("APPLIED".equalsIgnoreCase(proposition.getOrigine())) {
            Long missionId = proposition.getMission().getId();
            Mission mission = missionRepository.findById(missionId).orElse(null);
            if (mission == null) {
                System.out.println("Mission introuvable pour l'id: " + missionId);
            } else if (mission.getEntreprise() == null) {
                System.out.println("Entreprise manquante pour la mission id: " + missionId);
            } else {
                Entreprise entreprise = mission.getEntreprise();
                // Création de la notification pour l'entreprise
                String notifMsg = "Un consultant a postulé à votre mission : " + mission.getTitre();
                System.out.println("Création de la notification avec le message : " + notifMsg);
                notificationService.createNotification(notifMsg, entreprise);

                // Récupérer le consultant pour obtenir son CV
                Consultant consultant = proposition.getConsultant();
                if (consultant != null) {
                    consultant = consultantRepository.findById(consultant.getId()).orElse(null);
                }
                byte[] cvBytes = null;
                if (consultant != null) {
                    cvBytes = consultant.getCv();
                }
                if (cvBytes != null) {
                    System.out.println("Taille du CV : " + cvBytes.length + " octets");
                } else {
                    System.out.println("CV non trouvé pour le consultant.");
                }

                // Préparation et envoi de l'email à l'entreprise
                String emailSubject = "Nouvelle candidature pour votre mission : " + mission.getTitre();
                String emailContent = "Bonjour,\n\nUn consultant a postulé à votre mission.\n\nLettre de motivation:\n"
                        + proposition.getMessage()
                        + "\n\nCordialement,\nTrade for Talent";
                emailService.sendApplicationEmail(entreprise.getEmail(), emailSubject, emailContent, cvBytes, "CV.pdf");
            }
        }
        // Nouvelle logique pour l'origine "INVITED"
        else if ("INVITED".equalsIgnoreCase(proposition.getOrigine())) {
            // Récupération complète de la mission à partir de l'id transmis dans la proposition
            Long missionId = proposition.getMission().getId();
            Mission mission = missionRepository.findById(missionId).orElse(null);
            if (mission == null) {
                System.out.println("Mission introuvable pour l'id: " + missionId);
            } else {
                // Récupération complète du consultant depuis le repository
                Consultant consultant = proposition.getConsultant();
                if (consultant != null) {
                    consultant = consultantRepository.findById(consultant.getId()).orElse(null);
                }
                if (consultant == null) {
                    System.out.println("Consultant introuvable pour la proposition INVITED.");
                } else {
                    // Création de la notification pour le consultant
                    String notifMsg = "Vous avez reçu une invitation pour la mission : " + mission.getTitre();
                    System.out.println("Création de la notification avec le message : " + notifMsg);
                    notificationService.createNotificationConsultant(notifMsg, consultant);

                    // Préparation de l'email
                    String entrepriseNom = (mission.getEntreprise() != null && mission.getEntreprise().getNomEntreprise() != null)
                            ? mission.getEntreprise().getNomEntreprise()
                            : "votre entreprise";
                    String emailSubject = "Invitation pour la mission : " + mission.getTitre();
                    String emailContent = "Bonjour,\n\nL'entreprise " + entrepriseNom
                            + " vous a invité à postuler pour la mission : " + mission.getTitre()
                            + ".\n\nMessage :\n" + proposition.getMessage()
                            + "\n\nCordialement,\nTrade for Talent";
                    emailService.sendInvitationEmail(consultant.getEmail(), emailSubject, emailContent);
                }
            }
        }


        return saved;
    }

    public List<Proposition> getAllPropositions() {
        return propositionRepository.findAll();
    }

    public Optional<Proposition> getPropositionById(Long id) {
        return propositionRepository.findById(id);
    }

    public void deleteProposition(Long id) {
        propositionRepository.deleteById(id);
    }
    public Proposition updatePropositionStatus(Long id, String newStatus) {
        Proposition proposition = propositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposition non trouvée pour l'id : " + id));
        proposition.setStatut(newStatus);
        return propositionRepository.save(proposition);
    }

    public List<Proposition> getPropositionsByConsultant(Long consultantId) {
        if (consultantId == null || consultantId <= 0) {
            throw new IllegalArgumentException("L'ID du consultant est invalide.");
        }

        // Vérification si le consultant existe
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant introuvable avec l'ID : " + consultantId));

        List<Proposition> propositions = propositionRepository.findByConsultantId(consultantId);

        if (propositions.isEmpty()) {
            System.out.println("Aucune proposition trouvée pour le consultant : " + consultant.getNom());
        }

        return propositions;
    }
    public Mission getMissionByPropositionId(Long propositionId) {
        Proposition proposition = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new RuntimeException("Proposition not found with id: " + propositionId));
        return proposition.getMission();
    }

}
