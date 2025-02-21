package com.example.demo.Service;

import com.example.demo.model.Entreprise;
import com.example.demo.repository.EntrepriseRepository;
import jakarta.transaction.Transactional;
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
            if (updatedEntreprise.getSubscriptionType() != null) {
                entreprise.setSubscriptionType(updatedEntreprise.getSubscriptionType());
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
            return entrepriseRepository.save(entreprise);
        }).orElseThrow(() -> new RuntimeException("Entreprise not found with id " + id));
    }

    public void deleteEntreprise(Long id) {
        entrepriseRepository.deleteById(id);
    }
}
