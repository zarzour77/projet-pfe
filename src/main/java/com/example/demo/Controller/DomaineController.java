package com.example.demo.Controller;

import com.example.demo.Service.DomaineService;
import com.example.demo.model.Domaine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domaines")
public class DomaineController {
    private final DomaineService domaineService;

    @Autowired
    public DomaineController(DomaineService domaineService) {
        this.domaineService = domaineService;
    }

    @GetMapping
    public List<Domaine> getAllDomaines() {
        return domaineService.getAlldomaines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Domaine> getDomaineById(@PathVariable Long id) {
        return domaineService.getdomaineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Domaine createDomaine(@RequestBody Domaine domaine) {
        return domaineService.createdomaine(domaine);
    }

   /* @PutMapping("/{id}")
    public ResponseEntity<Domaine> updateDomaine(@PathVariable Long id, @RequestBody Domaine domaine) {
        try {
            Domaine updatedDomaine = domaineService.updatedomaine(id, domaine);
            return ResponseEntity.ok(updatedDomaine);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }*/

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDomaine(@PathVariable Long id) {
        domaineService.deletedomaine(id);
        return ResponseEntity.noContent().build();
    }
}
