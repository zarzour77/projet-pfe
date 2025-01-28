package com.example.demo.Service;


import com.example.demo.model.Proposition;
import com.example.demo.repository.PropositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropositionService {
    private final PropositionRepository propositionRepository;

    @Autowired
    public PropositionService(PropositionRepository propositionRepository) {
        this.propositionRepository = propositionRepository;
    }

    public List<Proposition> getAllPropositions() {
        return propositionRepository.findAll();
    }

    public Optional<Proposition> getPropositionById(Long id) {
        return propositionRepository.findById(id);
    }

    public Proposition createProposition(Proposition proposition) {
        return propositionRepository.save(proposition);
    }

    public Proposition updateProposition(Long id, Proposition updatedProposition) {
        return propositionRepository.findById(id).map(proposition -> {
            proposition.setMontant(updatedProposition.getMontant());
            proposition.setDurée_estimé(updatedProposition.getDurée_estimé());
            proposition.setStatut(updatedProposition.getStatut());
            proposition.setConsultant(updatedProposition.getConsultant());
            proposition.setMission(updatedProposition.getMission());
            return propositionRepository.save(proposition);
        }).orElseThrow(() -> new RuntimeException("Proposition not found with id " + id));
    }

    public void deleteProposition(Long id) {
        propositionRepository.deleteById(id);
    }
}

