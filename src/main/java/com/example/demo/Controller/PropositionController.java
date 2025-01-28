package com.example.demo.Controller;


import com.example.demo.Service.PropositionService;
import com.example.demo.Entity.Proposition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propositions")
public class PropositionController {
    private final PropositionService propositionService;

    @Autowired
    public PropositionController(PropositionService propositionService) {
        this.propositionService = propositionService;
    }

    @GetMapping
    public List<Proposition> getAllPropositions() {
        return propositionService.getAllPropositions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proposition> getPropositionById(@PathVariable Long id) {
        return propositionService.getPropositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proposition createProposition(@RequestBody Proposition proposition) {
        return propositionService.createProposition(proposition);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proposition> updateProposition(@PathVariable Long id, @RequestBody Proposition proposition) {
        try {
            Proposition updatedProposition = propositionService.updateProposition(id, proposition);
            return ResponseEntity.ok(updatedProposition);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProposition(@PathVariable Long id) {
        propositionService.deleteProposition(id);
        return ResponseEntity.noContent().build();
    }
}

