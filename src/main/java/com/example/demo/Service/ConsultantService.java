package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Experience;
import com.example.demo.model.Competence;
import com.example.demo.model.Domaine;
import com.example.demo.model.Mission;
import com.example.demo.model.Formation;
import com.example.demo.model.Langue;
import com.example.demo.model.Certification;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultantService {

    @Autowired
    private final ConsultantRepository consultantRepository;
    private final ExperienceRepository experienceRepository;
    private final MissionRepository missionRepository;
    private final FormationRepository formationRepository;
    private final LangueRepository langueRepository;
    private final CertificationRepository certificationRepository;
    private final PropositionRepository propositionRepository;
    private final CompetenceRepository competenceRepository;
    @Autowired
    public ConsultantService(ConsultantRepository consultantRepository,
                             ExperienceRepository experienceRepository,
                             MissionRepository missionRepository,
                             FormationRepository formationRepository,
                             LangueRepository langueRepository,
                             CertificationRepository certificationRepository,
                             PropositionRepository propositionRepository,
                             CompetenceRepository competenceRepository) {
        this.consultantRepository = consultantRepository;
        this.experienceRepository = experienceRepository;
        this.missionRepository = missionRepository;
        this.formationRepository = formationRepository;
        this.langueRepository = langueRepository;
        this.certificationRepository = certificationRepository;
        this.propositionRepository = propositionRepository;
        this.competenceRepository = competenceRepository;
    }
    @Transactional
    public List<Consultant> getAllConsultants() {
        return consultantRepository.findAll();
    }
    @Transactional
    public Optional<Consultant> getConsultantById(Long id) {
        return consultantRepository.findById(id);
    }

    public Consultant createConsultant(Consultant consultant) {
        return consultantRepository.save(consultant);
    }
    @Transactional
    public Consultant updateBadge(Long consultantId, String badge) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            consultant.setBadge(badge);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }


    @Transactional
    public Consultant updateConsultant(Long id, Consultant updatedConsultant) {
        return consultantRepository.findById(id).map(consultant -> {
            // Update common User fields if provided
            if (updatedConsultant.getNom() != null) {
                consultant.setNom(updatedConsultant.getNom());
            }
            if (updatedConsultant.getPrenom() != null) {
                consultant.setPrenom(updatedConsultant.getPrenom());
            }
            if (updatedConsultant.getEmail() != null) {
                consultant.setEmail(updatedConsultant.getEmail());
            }
            if (updatedConsultant.getTelephone() != null) {
                consultant.setTelephone(updatedConsultant.getTelephone());
            }
            if (updatedConsultant.getPassword() != null) {
                consultant.setPassword(updatedConsultant.getPassword());
            }
            if (updatedConsultant.getAdresse() != null) {
                consultant.setAdresse(updatedConsultant.getAdresse());
            }
            if (updatedConsultant.getRole() != null) {
                consultant.setRole(updatedConsultant.getRole());
            }
            if (updatedConsultant.getPhotoprofile() != null) {
                consultant.setPhotoprofile(updatedConsultant.getPhotoprofile());
            }
            if (updatedConsultant.getStatut() != null) {
                consultant.setStatut(updatedConsultant.getStatut());
            }
            if (updatedConsultant.getRating() != null) {
                consultant.setRating(updatedConsultant.getRating());
            }
            // Update Consultant-specific fields
            if (updatedConsultant.getCompetences() != null) {
                consultant.setCompetences(updatedConsultant.getCompetences());
            }
            if (updatedConsultant.getPortfolio() != null) {
                consultant.setPortfolio(updatedConsultant.getPortfolio());
            }
            if (updatedConsultant.getPropositions() != null) {
                consultant.setPropositions(updatedConsultant.getPropositions());
            }
            if (updatedConsultant.getExperienceYears() != null) {
                consultant.setExperienceYears(updatedConsultant.getExperienceYears());
            }
            if (updatedConsultant.getWorkload() != null) {
                consultant.setWorkload(updatedConsultant.getWorkload());
            }
            if (updatedConsultant.getLatitude() != null) {
                consultant.setLatitude(updatedConsultant.getLatitude());
            }
            if (updatedConsultant.getLongitude() != null) {
                consultant.setLongitude(updatedConsultant.getLongitude());
            }
            if (updatedConsultant.getDomaines() != null) {
                consultant.setDomaines(updatedConsultant.getDomaines());
            }
            if (updatedConsultant.getTaux_horaire() != null) {
                consultant.setTaux_horaire(updatedConsultant.getTaux_horaire());
            }
            if (updatedConsultant.getExperiences() != null) {
                consultant.setExperiences(updatedConsultant.getExperiences());
            }
            if (updatedConsultant.getLangues() != null) {
                consultant.setLangues(updatedConsultant.getLangues());
            }
            if (updatedConsultant.getFormations() != null) {
                consultant.setFormations(updatedConsultant.getFormations());
            }
            if (updatedConsultant.getCertifications() != null) {
                consultant.setCertifications(updatedConsultant.getCertifications());
            }
            if (updatedConsultant.getTypeConsultant() != null) {
                consultant.setTypeConsultant(updatedConsultant.getTypeConsultant());
            }
            if (updatedConsultant.getEntrepriseSsi() != null) {
                consultant.setEntrepriseSsi(updatedConsultant.getEntrepriseSsi());
            }
            if (updatedConsultant.getDateRecrutement() != null) {
                consultant.setDateRecrutement(updatedConsultant.getDateRecrutement());
            }


            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + id));
    }

    public void deleteConsultant(Long id) {
        consultantRepository.deleteById(id);
    }

    @Transactional
    public Consultant addExperienceToConsultant(Long consultantId, Experience experience) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            if (consultant.getExperiences() == null) {
                consultant.setExperiences(new ArrayList<>());
            }
            consultant.getExperiences().add(experience);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }

    @Transactional
    public String deleteExperience(Long consultantId, Long experienceId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Experience experience = experienceRepository.findById(experienceId).orElse(null);
        if (experience == null) {
            return "Experience not found!";
        }
        consultant.getExperiences().remove(experience);
        consultantRepository.save(consultant);
        experienceRepository.delete(experience);
        return "Experience deleted successfully!";
    }

    @Transactional
    public Consultant addCompetenceToConsultant(Long consultantId, Competence competence) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            if (consultant.getCompetences() == null) {
                consultant.setCompetences(new ArrayList<>());
            }
            // Check if a competence with the same name and level already exists
            Optional<Competence> existingCompetenceOpt =
                    competenceRepository.findByNomIgnoreCaseAndCompetenceNiveau(
                            competence.getNom(), competence.getCompetenceNiveau()
                    );
            // Reuse the existing competence if found; otherwise, save the new one
            Competence competenceToAdd = existingCompetenceOpt.orElseGet(() -> competenceRepository.save(competence));

            // Add the competence to the consultant if not already associated
            if (!consultant.getCompetences().contains(competenceToAdd)) {
                consultant.getCompetences().add(competenceToAdd);
            }
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }


    @Transactional
    public String deleteCompetence(Long consultantId, Long competenceId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Optional<Competence> competenceOpt = consultant.getCompetences().stream()
                .filter(c -> c.getId().equals(competenceId))
                .findFirst();
        if (!competenceOpt.isPresent()) {
            return "Competence not found!";
        }
        consultant.getCompetences().remove(competenceOpt.get());
        consultantRepository.save(consultant);
        return "Competence deleted successfully!";
    }

    @Transactional
    public Consultant addDomaineToConsultant(Long consultantId, Domaine domaine) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            if (consultant.getDomaines() == null) {
                consultant.setDomaines(new ArrayList<>());
            }
            consultant.getDomaines().add(domaine);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }

    @Transactional
    public String deleteDomaine(Long consultantId, Long domaineId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Optional<Domaine> domaineOpt = consultant.getDomaines().stream()
                .filter(d -> d.getId().equals(domaineId))
                .findFirst();
        if (!domaineOpt.isPresent()) {
            return "Domaine not found!";
        }
        consultant.getDomaines().remove(domaineOpt.get());
        consultantRepository.save(consultant);
        return "Domaine deleted successfully!";
    }

    // New methods for Formation

    @Transactional
    public Consultant addFormationToConsultant(Long consultantId, Formation formation) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            if (consultant.getFormations() == null) {
                consultant.setFormations(new ArrayList<>());
            }
            consultant.getFormations().add(formation);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }

    @Transactional
    public String deleteFormation(Long consultantId, Long formationId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Optional<Formation> formationOpt = consultant.getFormations().stream()
                .filter(f -> f.getId().equals(formationId))
                .findFirst();
        if (!formationOpt.isPresent()) {
            return "Formation not found!";
        }
        consultant.getFormations().remove(formationOpt.get());
        consultantRepository.save(consultant);
        return "Formation deleted successfully!";
    }

    // New methods for Langue

    @Transactional
    public Consultant addLangueToConsultant(Long consultantId, Langue langue) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            // Initialize the consultant's language list if null
            if (consultant.getLangues() == null) {
                consultant.setLangues(new ArrayList<>());
            }
            // Check if a Langue with the same nom and niveau exists
            Optional<Langue> existingLangueOpt = langueRepository.findByNomAndNiveau(langue.getNom(), langue.getNiveau());
            // Reuse the existing Langue if found, otherwise save the new one
            Langue langueToAdd = existingLangueOpt.orElseGet(() -> langueRepository.save(langue));

            // Add langue only if it's not already associated with the consultant
            if (!consultant.getLangues().contains(langueToAdd)) {
                consultant.getLangues().add(langueToAdd);
            }
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }


    @Transactional
    public String deleteLangue(Long consultantId, Long langueId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Optional<Langue> langueOpt = consultant.getLangues().stream()
                .filter(l -> l.getId().equals(langueId))
                .findFirst();
        if (!langueOpt.isPresent()) {
            return "Langue not found!";
        }
        consultant.getLangues().remove(langueOpt.get());
        consultantRepository.save(consultant);
        return "Langue deleted successfully!";
    }

    // New methods for Certification

    @Transactional
    public Consultant addCertificationToConsultant(Long consultantId, Certification certification) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            if (consultant.getCertifications() == null) {
                consultant.setCertifications(new ArrayList<>());
            }
            consultant.getCertifications().add(certification);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }

    @Transactional
    public String deleteCertification(Long consultantId, Long certificationId) {
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }
        Optional<Certification> certOpt = consultant.getCertifications().stream()
                .filter(c -> c.getId().equals(certificationId))
                .findFirst();
        if (!certOpt.isPresent()) {
            return "Certification not found!";
        }
        consultant.getCertifications().remove(certOpt.get());
        consultantRepository.save(consultant);
        return "Certification deleted successfully!";
    }
    @Transactional
    public Consultant saveMissionForConsultant(Long consultantId, Long missionId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant non trouvé"));
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        List<Mission> savedMissions = consultant.getSavedMissions();
        if (savedMissions == null) {
            savedMissions = new ArrayList<>();
        }
        if (!savedMissions.contains(mission)) {
            savedMissions.add(mission);
        }
        consultant.setSavedMissions(savedMissions);
        return consultantRepository.save(consultant);
    }
    @Transactional
    public List<Mission> getSavedMissionsForConsultant(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant non trouvé"));
        return consultant.getSavedMissions();
    }
    @Transactional
    // Méthode pour incrémenter le workload de 1
    public Consultant incrementWorkload(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
        Integer currentWorkload = consultant.getWorkload() == null ? 0 : consultant.getWorkload();
        consultant.setWorkload(currentWorkload + 1);
        return consultantRepository.save(consultant);
    }
    @Transactional
    // NEW: Méthode for decreasing the consultant's workload by 1
    public Consultant decrementWorkload(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
        Integer currentWorkload = consultant.getWorkload() == null ? 0 : consultant.getWorkload();
        consultant.setWorkload(Math.max(currentWorkload - 1, 0));
        return consultantRepository.save(consultant);
    }

    @Transactional
    public List<Date> getAcceptedInvitationDates(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));

        return propositionRepository.findAcceptationDatesByConsultant(consultant);
    }
}
