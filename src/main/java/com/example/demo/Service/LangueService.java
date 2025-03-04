package com.example.demo.Service;

import com.example.demo.model.Langue;
import com.example.demo.repository.LangueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LangueService {

    @Autowired
    private LangueRepository langueRepository;

    // Method to get all languages
    public List<Langue> getAllLangues() {
        return langueRepository.findAll();
    }

    // Optional: Create a new language only if it doesn't exist
    public Langue createLangue(Langue langue) {
        Langue existingLangue = langueRepository.findByNom(langue.getNom());
        if (existingLangue != null) {
            return existingLangue;
        }
        return langueRepository.save(langue);
    }
}
