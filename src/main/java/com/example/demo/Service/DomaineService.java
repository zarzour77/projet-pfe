package com.example.demo.Service;


import com.example.demo.model.Domaine;
import com.example.demo.repository.DomaineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DomaineService {
    private final DomaineRepository domaineRepository;

    @Autowired
    public DomaineService(DomaineRepository domaineRepository) {
        this.domaineRepository = domaineRepository;
    }

    public List<Domaine> getAlldomaines() {
        return domaineRepository.findAll();
    }

    public Optional<Domaine> getdomaineById(Long id) {
        return domaineRepository.findById(id);
    }

    public Domaine createdomaine(Domaine domaine) {
        return domaineRepository.save(domaine);
    }



    public void deletedomaine(Long id) {
        domaineRepository.deleteById(id);
    }
}