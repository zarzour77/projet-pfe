package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.repository.ConsultantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultantService {
    private final ConsultantRepository consultantRepository;

    @Autowired
    public ConsultantService(ConsultantRepository consultantRepository) {
        this.consultantRepository = consultantRepository;
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
            if (updatedConsultant.getBudgetMin() != null) {
                consultant.setBudgetMin(updatedConsultant.getBudgetMin());
            }

            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + id));
    }
    public void deleteConsultant(Long id) {
        consultantRepository.deleteById(id);
    }
}
