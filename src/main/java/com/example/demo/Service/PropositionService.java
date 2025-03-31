package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.model.Proposition;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.MissionRepository;
import com.example.demo.repository.PropositionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PropositionService {
    private final PropositionRepository propositionRepository;
    private final NotificationService notificationService;
    private final MissionRepository missionRepository; // Injection du repository pour Mission
    private final EmailService emailService; // Pour envoyer l'email
    private final EntrepriseRepository entrepriseRepository;

    @Autowired
    private ConsultantRepository consultantRepository;

    @Autowired
    public PropositionService(PropositionRepository propositionRepository, NotificationService notificationService, MissionRepository missionRepository, EmailService emailService, EntrepriseRepository entrepriseRepository) {
        this.propositionRepository = propositionRepository;
        this.notificationService = notificationService;
        this.missionRepository = missionRepository;
        this.emailService = emailService;
        this.entrepriseRepository = entrepriseRepository;
    }

    @Transactional
    public List<Proposition> getPropositionsByMission(Long missionId) {
        return propositionRepository.findByMissionId(missionId);
    }

    public Proposition createPropositionconsultant(Proposition proposition) {
        if (proposition.getConsultant() == null && proposition.getEntreprise() == null) {
            throw new RuntimeException("Une proposition doit être associée à un consultant ou une entreprise.");
        }
       /* if (proposition.getConsultant() != null) {
            proposition.setEntreprise(null);
        }*/
        if (proposition.getStatut() == null || proposition.getStatut().trim().isEmpty()) {
            proposition.setStatut("PENDING");
        }
        // Pour l'origine RECRUTEMENT, charger l'objet Entreprise complet
        if ("RECRUTEMENT".equalsIgnoreCase(proposition.getOrigine())) {
            if (proposition.getEntreprise() != null && proposition.getEntreprise().getId() != null) {
                Entreprise entreprise = entrepriseRepository.findById(proposition.getEntreprise().getId())
                        .orElse(null);
                proposition.setEntreprise(entreprise);
            }
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
                        + proposition.getMessage();
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
                            + ".\n\nMessage :\n" + proposition.getMessage() ;
                    emailService.sendInvitationEmail(consultant.getEmail(), emailSubject, emailContent);
                }
            }
        }


        return saved;
    }
    @Transactional
    public Proposition createPropositionentreprise(Long entrepriseId, Long consultantId, Proposition proposition) {
        // Récupération de l'entreprise recruteuse
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable"));
        // Récupération du consultant
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant introuvable"));

        proposition.setConsultant(consultant);

        // Pour une invitation de recrutement, aucune mission n'est requise.
        if ("RECRUTEMENT".equalsIgnoreCase(proposition.getOrigine())) {
            proposition.setEntreprise(entreprise);

            // Ne pas assigner directement le consultant ; il devra accepter ou refuser.
            String notifMsg = "Vous avez reçu une invitation de recrutement de l'entreprise : " + entreprise.getNomEntreprise();
            notificationService.createNotificationConsultant(notifMsg, consultant);

            String emailSubject = "Invitation de recrutement de " + entreprise.getNomEntreprise();
            // Utilisation de <br/> pour les retours à la ligne en HTML
            String emailContent =
                    "Vous avez reçu une invitation de recrutement de l'entreprise " + entreprise.getNomEntreprise() + ".<br/><br/>"
                    + "Message :<br/>" + proposition.getMessage() + "<br/><br/>"
                    + "Veuillez consulter votre espace pour accepter ou refuser cette invitation.";

            emailService.sendInvitationEmail(consultant.getEmail(), emailSubject, emailContent);
        }
        // Pour une candidature ou invitation classique, la mission doit être renseignée
        else if ("INVITED".equalsIgnoreCase(proposition.getOrigine()) ||
                "APPLIED".equalsIgnoreCase(proposition.getOrigine())) {
            if (proposition.getMission() == null) {
                throw new RuntimeException("La mission est requise pour cette proposition");
            }
            Long missionId = proposition.getMission().getId();
            Mission mission = missionRepository.findById(missionId).orElse(null);

            if ("APPLIED".equalsIgnoreCase(proposition.getOrigine())) {
                if (mission == null) {
                    System.out.println("Mission introuvable pour l'id: " + missionId);
                } else if (mission.getEntreprise() == null) {
                    System.out.println("Entreprise manquante pour la mission id: " + missionId);
                } else {
                    Entreprise missionEntreprise = mission.getEntreprise();
                    String notifMsg = "Un consultant a postulé à votre mission : " + mission.getTitre();
                    notificationService.createNotification(notifMsg, missionEntreprise);

                    String emailSubject = "Nouvelle candidature pour votre mission : " + mission.getTitre();
                    String emailContent = "Un consultant a postulé à votre mission.<br/><br/>Lettre de motivation:<br/>"
                            + proposition.getMessage();

                    byte[] cvBytes = consultant.getCv();
                    emailService.sendApplicationEmail(missionEntreprise.getEmail(), emailSubject, emailContent, cvBytes, "CV.pdf");
                }
            } else if ("INVITED".equalsIgnoreCase(proposition.getOrigine())) {
                if (mission == null) {
                    System.out.println("Mission introuvable pour l'id: " + missionId);
                } else {
                    String notifMsg = "Vous avez reçu une invitation pour la mission : " + mission.getTitre();
                    notificationService.createNotificationConsultant(notifMsg, consultant);

                    String entrepriseNom = (mission.getEntreprise() != null && mission.getEntreprise().getNomEntreprise() != null)
                            ? mission.getEntreprise().getNomEntreprise()
                            : "votre entreprise";

                    String emailSubject = "Invitation pour la mission : " + mission.getTitre();
                    String emailContent = "L'entreprise " + entrepriseNom
                            + " vous a invité à postuler pour la mission : " + mission.getTitre()
                            + ".<br/><br/>Message :<br/>" + proposition.getMessage();

                    emailService.sendInvitationEmail(consultant.getEmail(), emailSubject, emailContent);
                }
            }
        }

        if (proposition.getStatut() == null || proposition.getStatut().trim().isEmpty()) {
            proposition.setStatut("PENDING");
        }
        return propositionRepository.save(proposition);
    }
    @Transactional
    public List<Proposition> getAllPropositions() {
        return propositionRepository.findAll();
    }
    @Transactional
    public Optional<Proposition> getPropositionById(Long id) {
        return propositionRepository.findById(id);
    }
    @Transactional
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

    public Map<String, Object> getAggregatedConsultantStats(Long consultantId, int periodDays) {
        List<Proposition> proposals = propositionRepository.findByConsultantId(consultantId);

        // Utilisation du fuseau horaire local de l'application
        ZoneId zone = ZoneId.systemDefault();
        LocalDate endDate = LocalDate.now(zone);
        LocalDate startDate = endDate.minusDays(periodDays - 1);

        // Filtrer les propositions sur la période demandée
        List<Proposition> filtered = proposals.stream()
                .filter(p -> {
                    LocalDate propDate = p.getDateProposition().toInstant().atZone(zone).toLocalDate();
                    return !propDate.isBefore(startDate) && !propDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        // Création des labels (ex: "03 Mar", "04 Mar", etc.)
        List<String> labels = Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(periodDays)
                .map(date -> date.format(DateTimeFormatter.ofPattern("dd MMM")))
                .collect(Collectors.toList());

        // Les statuts mappés pour le graphique
        String[] statuses = {"sent", "invited", "inProgress", "terminated", "refused"};

        // Préparation des datasets par date et par statut
        List<Map<String, Object>> datasets = new ArrayList<>();
        for (String status : statuses) {
            List<Long> data = new ArrayList<>();
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                LocalDate finalDate = date;
                long count = filtered.stream()
                        .filter(p -> {
                            // Priorité au statut pour déterminer le graphStatus
                            String graphStatus;
                            if ("ACCEPTED".equalsIgnoreCase(p.getStatut())) {
                                graphStatus = "inProgress";
                            } else if ("terminée".equalsIgnoreCase(p.getStatut())) {
                                graphStatus = "terminated";
                            } else if ("REFUSED".equalsIgnoreCase(p.getStatut())) {
                                graphStatus = "refused";
                            } else if ("APPLIED".equalsIgnoreCase(p.getOrigine())) {
                                graphStatus = "sent";
                            } else if ("INVITED".equalsIgnoreCase(p.getOrigine())) {
                                graphStatus = "invited";
                            } else {
                                graphStatus = "";
                            }
                            return status.equalsIgnoreCase(graphStatus);
                        })
                        .filter(p -> {
                            LocalDate propDate = p.getDateProposition().toInstant().atZone(zone).toLocalDate();
                            return propDate.equals(finalDate);
                        })
                        .count();
                data.add(count);
            }
            Map<String, Object> dataset = new HashMap<>();
            dataset.put("label", status);
            dataset.put("data", data);
            datasets.add(dataset);
        }

        // Calcul des totaux par statut (mappés)
        Map<String, Long> totals = new HashMap<>();
        for (String status : statuses) {
            long total = filtered.stream()
                    .filter(p -> {
                        String graphStatus;
                        if ("ACCEPTED".equalsIgnoreCase(p.getStatut())) {
                            graphStatus = "inProgress";
                        } else if ("terminée".equalsIgnoreCase(p.getStatut())) {
                            graphStatus = "terminated";
                        } else if ("REFUSED".equalsIgnoreCase(p.getStatut())) {
                            graphStatus = "refused";
                        } else if ("APPLIED".equalsIgnoreCase(p.getOrigine())) {
                            graphStatus = "sent";
                        } else if ("INVITED".equalsIgnoreCase(p.getOrigine())) {
                            graphStatus = "invited";
                        } else {
                            graphStatus = "";
                        }
                        return status.equalsIgnoreCase(graphStatus);
                    })
                    .count();
            totals.put(status, total);
        }

        // Calcul des totaux regroupés
        long totalInvitedApplied = totals.getOrDefault("sent", 0L) + totals.getOrDefault("invited", 0L);
        long totalStatus = totals.getOrDefault("inProgress", 0L)
                + totals.getOrDefault("terminated", 0L)
                + totals.getOrDefault("refused", 0L);

        // Construction de la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("datasets", datasets);
        response.put("totals", totals);
        response.put("totalInvitedApplied", totalInvitedApplied);
        response.put("totalStatus", totalStatus);

        return response;
    }

    @Transactional
    public Proposition acceptRecruitmentProposition(Long propositionId) {
        // Récupération de la proposition
        Proposition proposition = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new RuntimeException("Proposition non trouvée"));

        // Vérifier que l'origine est "RECRUTEMENT"
        if (!"RECRUTEMENT".equalsIgnoreCase(proposition.getOrigine())) {
            throw new RuntimeException("Cette proposition n'est pas de type recrutement");
        }

        // Récupération du consultant et de l'entreprise
        Consultant consultant = proposition.getConsultant();
        Entreprise entreprise = proposition.getEntreprise();
        if (consultant == null || entreprise == null) {
            throw new RuntimeException("Consultant ou entreprise introuvable dans la proposition");
        }

        // Mise à jour du statut de la proposition et enregistrer la date d'acceptation
        proposition.setStatut("ACCEPTED");
        proposition.setDateAcceptation(new Date()); // Save the current date as the acceptance date
        propositionRepository.save(proposition);

        // Mise à jour du consultant : changer son type et lui assigner l'entreprise SSI
        consultant.setTypeConsultant(Consultant.TypeConsultant.ENTREPRISE_SSI);
        consultant.setEntrepriseSsi(entreprise);
        consultant.setDateRecrutement(new Date()); // Définir la date de recrutement
        consultantRepository.save(consultant);

        // Ajout du consultant à la liste des consultants de l'entreprise (si non déjà présent)
        List<Consultant> consultants = entreprise.getConsultants();
        if (consultants != null && !consultants.contains(consultant)) {
            consultants.add(consultant);
            entrepriseRepository.save(entreprise);
        }

        return proposition;
    }

    



}


