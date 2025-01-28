package com.example.demo.Service;


import com.example.demo.Entity.Entreprise;
import com.example.demo.repository.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService {
    private final EntrepriseRepository entrepriseRepository;

    @Autowired
    public EntrepriseService(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    public Optional<Entreprise> getEntrepriseById(Long id) {
        return entrepriseRepository.findById(id);
    }

    public Entreprise createEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    public Entreprise updateEntreprise(Long id, Entreprise updatedEntreprise) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            entreprise.setNom(updatedEntreprise.getNom());
            entreprise.setEmail(updatedEntreprise.getEmail());
            entreprise.setTelephone(updatedEntreprise.getTelephone());
            entreprise.setAdresse(updatedEntreprise.getAdresse());
            entreprise.setMissions(updatedEntreprise.getMissions());
            return entrepriseRepository.save(entreprise);
        }).orElseThrow(() -> new RuntimeException("Entreprise not found with id " + id));
    }

    public void deleteEntreprise(Long id) {
        entrepriseRepository.deleteById(id);
    }
}

