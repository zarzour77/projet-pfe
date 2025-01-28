package com.example.demo.Service;

import com.example.demo.model.Consultant;
import com.example.demo.repository.ConsultantRepository;
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

    public Consultant updateConsultant(Long id, Consultant updatedConsultant) {
        return consultantRepository.findById(id).map(consultant -> {
            consultant.setNom(updatedConsultant.getNom());
            consultant.setPrenom(updatedConsultant.getPrenom());
            consultant.setEmail(updatedConsultant.getEmail());
            consultant.setTelephone(updatedConsultant.getTelephone());
            consultant.setPassword(updatedConsultant.getPassword());
            consultant.setAdresse(updatedConsultant.getAdresse());
            consultant.setCompetences(updatedConsultant.getCompetences());
            consultant.setPortfolio(updatedConsultant.getPortfolio());
            consultant.setPropositions(updatedConsultant.getPropositions());
            return consultantRepository.save(consultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id " + id));
    }

    public void deleteConsultant(Long id) {
        consultantRepository.deleteById(id);
    }
}