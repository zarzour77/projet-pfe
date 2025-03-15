package com.example.demo.Service;


import com.example.demo.model.Competence;
import com.example.demo.repository.CompetenceRepository;
import jakarta.transaction.Transactional;
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
    @Transactional
    public List<Competence> getAllCompetences() {
        return competenceRepository.findAll();
    }
    @Transactional
    public Optional<Competence> getCompetenceById(Long id) {
        return competenceRepository.findById(id);
    }
    @Transactional
    public Competence createCompetence(Competence competence) {
        return competenceRepository.save(competence);
    }

    @Transactional

    public void deleteCompetence(Long id) {
        competenceRepository.deleteById(id);
    }
}