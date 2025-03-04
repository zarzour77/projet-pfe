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

    public Proposition createProposition(Proposition proposition) {
        if (proposition.getStatut() == null || proposition.getStatut().trim().isEmpty()) {
            proposition.setStatut("PENDING");
        }
        Proposition saved = propositionRepository.save(proposition);

        // Seules les propositions d'origine "APPLIED" déclenchent la notification et l'envoi d'email
        if ("APPLIED".equalsIgnoreCase(proposition.getOrigine())) {
            Long missionId = proposition.getMission().getId();
            Mission mission = missionRepository.findById(missionId).orElse(null);
            if (mission == null) {
                System.out.println("Mission introuvable pour l'id: " + missionId);
            } else if (mission.getEntreprise() == null) {
                System.out.println("Entreprise manquante pour la mission id: " + missionId);
            } else {
                Entreprise entreprise = mission.getEntreprise();
                // Création de la notification (si vous en avez besoin en base)
                String notifMsg = "Un consultant a postulé à votre mission : " + mission.getTitre();
                System.out.println("Création de la notification avec le message : " + notifMsg);
                notificationService.createNotification(notifMsg, entreprise);

                // Récupérer le consultant pour obtenir son CV
                // On suppose ici que proposition.getConsultant() retourne l'objet Consultant
                Consultant consultant = proposition.getConsultant();

                // Forcer le chargement complet de l'entité consultant
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

                // Le contenu de l'email est la lettre de motivation (champ message de la proposition)
                String emailSubject = "Nouvelle candidature pour votre mission : " + mission.getTitre();
                String emailContent = "Bonjour,\n\nUn consultant a postulé à votre mission.\n\nLettre de motivation:\n"
                        + proposition.getMessage()
                        + "\n\nCordialement,\nTrade for Talent";
                // Envoyer l'email à l'entreprise (on suppose que l'entreprise a un champ email)
                emailService.sendApplicationEmail(entreprise.getEmail(), emailSubject, emailContent, cvBytes, "CV.pdf");
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





    /*public Proposition updateProposition(Long id, Proposition updatedProposition) {
        return propositionRepository.findById(id).map(proposition -> {
            proposition.setMontant(updatedProposition.getMontant());
            proposition.setDurée_estimé(updatedProposition.getDurée_estimé());
            proposition.setStatut(updatedProposition.getStatut());
            proposition.setConsultant(updatedProposition.getConsultant());
            proposition.setMission(updatedProposition.getMission());
            return propositionRepository.save(proposition);
        }).orElseThrow(() -> new RuntimeException("Proposition not found with id " + id));
    }*/

    public void deleteProposition(Long id) {
        propositionRepository.deleteById(id);
    }

}

