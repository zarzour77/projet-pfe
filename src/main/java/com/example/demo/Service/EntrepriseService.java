package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.Mission;
import com.example.demo.model.Proposition;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.EntrepriseRepository;
import com.example.demo.repository.MissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EntrepriseService {
    private final EntrepriseRepository entrepriseRepository;
    private final ConsultantRepository consultantRepository;
    private final MissionRepository missionRepository;
    private final PropositionService propositionService;
    private final NotificationService notificationService;

    @Autowired
    public EntrepriseService(EntrepriseRepository entrepriseRepository,
                             ConsultantRepository consultantRepository,
                             MissionRepository missionRepository,
                             PropositionService propositionService,
                             NotificationService notificationService) {
        this.entrepriseRepository = entrepriseRepository;
        this.consultantRepository = consultantRepository;
        this.missionRepository = missionRepository;
        this.propositionService = propositionService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Map<String, Object> getAggregatedMissionsStats(Long entrepriseId, String period) {
        Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(entrepriseId);
        if (!entrepriseOpt.isPresent()) {
            throw new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId);
        }
        // On considère ici uniquement les missions ayant une date de publication
        List<Mission> missions = entrepriseOpt.get().getMissions()
                .stream()
                .filter(m -> m.getPublishedAt() != null)
                .collect(Collectors.toList());

        ZoneId zone = ZoneId.systemDefault();
        LocalDate endDate = LocalDate.now(zone);
        List<String> labels = new ArrayList<>();
        List<Map<String, Object>> datasets = new ArrayList<>();
        String[] statuses = {"Publié", "En cours", "Terminé", "En retard"};

        if (period.equalsIgnoreCase("week")) {
            // Dernier mois = 28 jours répartis sur 4 semaines
            LocalDate startDate = endDate.minusDays(27);
            // Création des intervalles hebdomadaires
            for (int i = 0; i < 4; i++) {
                labels.add("Semaine " + (i + 1));
            }
            for (String status : statuses) {
                List<Long> data = new ArrayList<>();
                for (int i = 0; i < 4; i++) {
                    LocalDate weekStart = startDate.plusDays(i * 7);
                    LocalDate weekEnd = weekStart.plusDays(6);
                    long count = missions.stream()
                            .filter(m -> {
                                LocalDate pubDate = m.getPublishedAt().toInstant().atZone(zone).toLocalDate();
                                return !pubDate.isBefore(weekStart) && !pubDate.isAfter(weekEnd)
                                        && m.calculerStatut().equalsIgnoreCase(status);
                            })
                            .count();
                    data.add(count);
                }
                Map<String, Object> dataset = new HashMap<>();
                dataset.put("label", status);
                dataset.put("data", data);
                // Vous pouvez définir ici des couleurs spécifiques par statut
                datasets.add(dataset);
            }
        } else if (period.equalsIgnoreCase("month")) {
            // Derniers 4 mois
            LocalDate startDate = endDate.minusMonths(3);
            YearMonth startMonth = YearMonth.from(startDate);
            List<YearMonth> months = new ArrayList<>();
            for (int i = 0; i < 4; i++) {
                YearMonth ym = startMonth.plusMonths(i);
                months.add(ym);
                labels.add(ym.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            }
            for (String status : statuses) {
                List<Long> data = new ArrayList<>();
                for (YearMonth ym : months) {
                    long count = missions.stream()
                            .filter(m -> {
                                LocalDate pubDate = m.getPublishedAt().toInstant().atZone(zone).toLocalDate();
                                YearMonth missionMonth = YearMonth.from(pubDate);
                                return missionMonth.equals(ym) && m.calculerStatut().equalsIgnoreCase(status);
                            })
                            .count();
                    data.add(count);
                }
                Map<String, Object> dataset = new HashMap<>();
                dataset.put("label", status);
                dataset.put("data", data);
                datasets.add(dataset);
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("datasets", datasets);
        return response;
    }
    @Transactional
    public List<Mission> getMissionsByStatusForEntreprise(Long entrepriseId, String statutRecherche) {
        Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(entrepriseId);
        if (entrepriseOpt.isPresent()) {
            Entreprise entreprise = entrepriseOpt.get();
            // Filtrer les missions dont le statut dynamique correspond au statut recherché
            return entreprise.getMissions()
                    .stream()
                    .filter(mission -> mission.calculerStatut().equalsIgnoreCase(statutRecherche))
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("Entreprise non trouvée avec l'id " + entrepriseId);
        }
    }
    @Transactional
    public Proposition applyWithConsultant(Long entrepriseId, Long missionId, Long consultantId, Double montant, String dureeEstime, String message) {
        // Retrieve the enterprise
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'id " + entrepriseId));

        // Ensure the enterprise is of type SSI
        if (entreprise.getTypeEntreprise() != Entreprise.TypeEntreprise.SSI) {
            throw new RuntimeException("L'entreprise n'est pas de type SSI");
        }

        // Retrieve the consultant and check association with the enterprise
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant introuvable"));
        if (consultant.getEntrepriseSsi() == null || !consultant.getEntrepriseSsi().getId().equals(entrepriseId)) {
            throw new RuntimeException("Ce consultant n'est pas associé à l'entreprise SSI");
        }

        // Retrieve the mission
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission introuvable avec l'id " + missionId));

        // Create and configure the proposition
        Proposition proposition = new Proposition();
        proposition.setConsultant(consultant);
        proposition.setEntreprise(entreprise);
        proposition.setMission(mission);
        proposition.setMontant(montant);
        proposition.setDureeEstime(dureeEstime);
        proposition.setMessage(message);
        proposition.setStatut("PENDING");
        proposition.setOrigine("APPLIED");

        // Save and return the proposition
        return propositionService.createPropositionconsultant(proposition);
    }

    @Transactional
    public List<Consultant> getConsultantsForEntreprise(Long entrepriseId) {
        Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(entrepriseId);
        if (entrepriseOpt.isPresent()) {
            Entreprise entreprise = entrepriseOpt.get();
            if (entreprise.getTypeEntreprise() == Entreprise.TypeEntreprise.SSI) {
                return entreprise.getConsultants();
            } else {
                throw new RuntimeException("L'entreprise n'est pas de type SSI");
            }
        } else {
            throw new RuntimeException("Entreprise introuvable avec l'id " + entrepriseId);
        }
    }

    @Transactional
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    @Transactional
    public Optional<Entreprise> getEntrepriseById(Long id) {
        return entrepriseRepository.findById(id);
    }

    @Transactional
    public Entreprise createEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    @Transactional
    public List<Mission> getPublishedMissionsForEntreprise(Long entrepriseId) {
        Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(entrepriseId);
        if (entrepriseOpt.isPresent()) {
            Entreprise entreprise = entrepriseOpt.get();
            return entreprise.getMissions();
        } else {
            throw new RuntimeException("Entreprise not found with id " + entrepriseId);
        }
    }

    @Transactional
    public Entreprise updateEntreprise(Long id, Entreprise updatedEntreprise) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            if (updatedEntreprise.getNom() != null) {
                entreprise.setNom(updatedEntreprise.getNom());
            }
            if (updatedEntreprise.getPrenom() != null) {
                entreprise.setPrenom(updatedEntreprise.getPrenom());
            }
            if (updatedEntreprise.getEmail() != null) {
                entreprise.setEmail(updatedEntreprise.getEmail());
            }
            if (updatedEntreprise.getTelephone() != null) {
                entreprise.setTelephone(updatedEntreprise.getTelephone());
            }
            if (updatedEntreprise.getAdresse() != null) {
                entreprise.setAdresse(updatedEntreprise.getAdresse());
            }
            if (updatedEntreprise.getPassword() != null) {
                entreprise.setPassword(updatedEntreprise.getPassword());
            }
            if (updatedEntreprise.getRole() != null) {
                entreprise.setRole(updatedEntreprise.getRole());
            }
            if (updatedEntreprise.getPhotoprofile() != null) {
                entreprise.setPhotoprofile(updatedEntreprise.getPhotoprofile());
            }
            if (updatedEntreprise.getStatut() != null) {
                entreprise.setStatut(updatedEntreprise.getStatut());
            }
            if (updatedEntreprise.getRating() != null) {
                entreprise.setRating(updatedEntreprise.getRating());
            }
            if (updatedEntreprise.getNomEntreprise() != null) {
                entreprise.setNomEntreprise(updatedEntreprise.getNomEntreprise());
            }
            if (updatedEntreprise.getMissions() != null) {
                entreprise.setMissions(updatedEntreprise.getMissions());
            }
            if (updatedEntreprise.getLatitude() != null) {
                entreprise.setLatitude(updatedEntreprise.getLatitude());
            }
            if (updatedEntreprise.getLongitude() != null) {
                entreprise.setLongitude(updatedEntreprise.getLongitude());
            }
            if (updatedEntreprise.getTypeEntreprise() != null) {
                entreprise.setTypeEntreprise(updatedEntreprise.getTypeEntreprise());
            }
            if (entreprise.getDateInscription() == null) {
                entreprise.setDateInscription(new Date());
            }
            return entrepriseRepository.save(entreprise);
        }).orElseThrow(() -> new RuntimeException("Entreprise not found with id " + id));
    }

    public void deleteEntreprise(Long id) {
        entrepriseRepository.deleteById(id);
    }

    @Transactional
    public void removeConsultantFromEntreprise(Long entrepriseId, Long consultantId) {
        Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(entrepriseId);
        if (!entrepriseOpt.isPresent()) {
            throw new RuntimeException("Entreprise not found with id " + entrepriseId);
        }
        Entreprise entreprise = entrepriseOpt.get();
        List<Consultant> consultants = entreprise.getConsultants();
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
        if (!consultants.contains(consultant)) {
            throw new RuntimeException("Consultant is not associated with this entreprise");
        }
        // Remove the consultant from the enterprise list and update associations
        consultants.remove(consultant);
        consultant.setEntrepriseSsi(null);
        consultant.setTypeConsultant(null); // Remove type_consultant
        consultantRepository.save(consultant);
        entrepriseRepository.save(entreprise);

        // Inform the consultant via a notification
        String notifMsg = "Vous avez été retiré de la liste des collaborateurs par l'entreprise " + entreprise.getNomEntreprise();
        notificationService.createNotificationConsultant(notifMsg, consultant);
    }
    @Transactional
    public Double getFrozenBalance(Long userId) {
        return entrepriseRepository.findById(userId)
                .map(Entreprise::getFrozenBalance)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with id: " + userId));
    }

}
