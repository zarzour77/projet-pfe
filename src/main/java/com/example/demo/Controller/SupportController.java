package com.example.demo.Controller;

import com.example.demo.Entity.Support;
import com.example.demo.Service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/supports")
public class SupportController {

    @Autowired
    private SupportService supportService;

    // Create a new Support Ticket
    @PostMapping
    public ResponseEntity<Support> createSupport(@RequestBody Support support) {
        support.setDateCreation(LocalDateTime.now());
        support.setStatut(Support.Statut.OUVERT);
        return ResponseEntity.ok(supportService.saveSupport(support));
    }

    // Get all Support Tickets
    @GetMapping
    public ResponseEntity<List<Support>> getAllSupports() {
        return ResponseEntity.ok(supportService.getAllSupports());
    }

    // Get a Support Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Support> getSupportById(@PathVariable Long id) {
        return supportService.getSupportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a Support Ticket
    @PutMapping("/{id}")
    public ResponseEntity<Support> updateSupport(@PathVariable Long id, @RequestBody Support updatedSupport) {
        return supportService.getSupportById(id)
                .map(existingSupport -> {
                    existingSupport.setSujet(updatedSupport.getSujet());
                    existingSupport.setDescription(updatedSupport.getDescription());
                    existingSupport.setStatut(updatedSupport.getStatut());
                    return ResponseEntity.ok(supportService.saveSupport(existingSupport));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a Support Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupport(@PathVariable Long id) {
        supportService.deleteSupport(id);
        return ResponseEntity.noContent().build();
    }
}

