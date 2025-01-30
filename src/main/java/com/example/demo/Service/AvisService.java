package com.example.demo.Service;


import com.example.demo.model.Avis;
import com.example.demo.repository.AvisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvisService {
    private final AvisRepository avisRepository;

    @Autowired
    public AvisService(AvisRepository avisRepository) {
        this.avisRepository = avisRepository;
    }

    public List<Avis> getAllAvis() {
        return avisRepository.findAll();
    }

    public Optional<Avis> getAvisById(Long id) {
        return avisRepository.findById(id);
    }

    public Avis createAvis(Avis avis) {
        return avisRepository.save(avis);
    }

    public Avis updateAvis(Long id, Avis updatedAvis) {
        return avisRepository.findById(id).map(avis -> {
            avis.setAuteur(updatedAvis.getAuteur());
            avis.setCible(updatedAvis.getCible());
            avis.setCommentaire(updatedAvis.getCommentaire());
            avis.setDateAvis(updatedAvis.getDateAvis());
            avis.setNote(updatedAvis.getNote());
            return avisRepository.save(avis);
        }).orElseThrow(() -> new RuntimeException("Avis not found with id " + id));
    }

    public void deleteAvis(Long id) {
        avisRepository.deleteById(id);
    }
}

