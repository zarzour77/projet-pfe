package com.example.demo.Service;

import com.example.demo.Entity.Support;
import com.example.demo.repository.SupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupportService {

    @Autowired
    private SupportRepository supportRepository;

    // Create or Update a Support Ticket
    public Support saveSupport(Support support) {
        return supportRepository.save(support);
    }

    // Get all Support Tickets
    public List<Support> getAllSupports() {
        return supportRepository.findAll();
    }

    // Get a specific Support Ticket by ID
    public Optional<Support> getSupportById(Long id) {
        return supportRepository.findById(id);
    }

    // Delete a Support Ticket by ID
    public void deleteSupport(Long id) {
        supportRepository.deleteById(id);
    }
}

