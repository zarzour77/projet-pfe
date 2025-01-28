package com.example.demo.Service;


import com.example.demo.model.Competence;
import com.example.demo.repository.CompetenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompetenceService {
    private final CompetenceRepository competenceRepository;

    @Autowired
    public CompetenceService(CompetenceRepository competenceRepository) {
        this.competenceRepository = competenceRepository;
    }

    public List<Competence> getAllCompetences() {
        return competenceRepository.findAll();
    }

    public Optional<Competence> getCompetenceById(Long id) {
        return competenceRepository.findById(id);
    }

    public Competence createCompetence(Competence competence) {
        return competenceRepository.save(competence);
    }

    public Competence updateCompetence(Long id, Competence updatedCompetence) {
        return competenceRepository.findById(id).map(competence -> {
            competence.setNom(updatedCompetence.getNom());
            competence.setConsultants(updatedCompetence.getConsultants());
            competence.setMissions(updatedCompetence.getMissions());
            competence.setUtilisateurs(updatedCompetence.getUtilisateurs());
            return competenceRepository.save(competence);
        }).orElseThrow(() -> new RuntimeException("Competence not found with id " + id));
    }

    public void deleteCompetence(Long id) {
        competenceRepository.deleteById(id);
    }
}
