package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.model.Experience;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.ExperienceRepository;
import com.example.demo.model.Mission;
import com.example.demo.repository.ConsultantRepository;
import com.example.demo.repository.MissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultantService {
    @Autowired
    private final ConsultantRepository consultantRepository;
    private final ExperienceRepository experienceRepository;
    @Autowired
    private MissionRepository missionRepository;
    @Autowired
    public ConsultantService(ConsultantRepository consultantRepository, ExperienceRepository experienceRepository) {
        this.consultantRepository = consultantRepository;
        this.experienceRepository = experienceRepository;
    }

    public List<Consultant> getAllConsultants() {
        return consultantRepository.findAll();
    }

    public Optional<Consultant> getConsultantById(Long id) {
        return consultantRepository.findById(id);
    }

    public Consultant createConsultant(Consultant consultant) {
        return consultantRepository.save(consultant);
    }

    @Transactional
    public Consultant updateConsultant(Long id, Consultant updatedConsultant) {
        return consultantRepository.findById(id).map(consultant -> {
            // Update User fields only if they are provided
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
            if (updatedConsultant.getSubscriptionType() != null) {
                consultant.setSubscriptionType(updatedConsultant.getSubscriptionType());
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
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + id));
    }
    public void deleteConsultant(Long id) {
        consultantRepository.deleteById(id);
    }
    @Transactional
    public Consultant addExperienceToConsultant(Long consultantId, Experience experience) {
        return consultantRepository.findById(consultantId).map(consultant -> {
            // Initialize experiences list if null
            if (consultant.getExperiences() == null) {
                consultant.setExperiences(new ArrayList<>());
            }
            consultant.getExperiences().add(experience);
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + consultantId));
    }
    @Transactional
    public String deleteExperience(Long consultantId, Long experienceId) {
        // Find the consultant by their ID
        Consultant consultant = consultantRepository.findById(consultantId).orElse(null);
        if (consultant == null) {
            return "Consultant not found!";
        }

        // Find the experience by its ID
        Experience experience =experienceRepository.findById(experienceId).orElse(null);
        if (experience == null) {
            return "Experience not found!";
        }

        // Remove the experience from the consultant's list of experiences
        consultant.getExperiences().remove(experience);

        // Save the consultant with the updated list of experiences
        consultantRepository.save(consultant);

        // Delete the experience from the database
        experienceRepository.delete(experience);

        return "Experience deleted successfully!";
    }


    public Consultant saveMissionForConsultant(Long consultantId, Long missionId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant non trouvé"));
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        List<Mission> savedMissions = consultant.getSavedMissions();
        if (savedMissions == null) {
            savedMissions = new ArrayList<>();
        }
        // Ajoute la mission si elle n'est pas déjà sauvegardée
        if (!savedMissions.contains(mission)) {
            savedMissions.add(mission);
        }
        consultant.setSavedMissions(savedMissions);
        return consultantRepository.save(consultant);
    }

    public List<Mission> getSavedMissionsForConsultant(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant non trouvé"));
        return consultant.getSavedMissions();
    }
}
