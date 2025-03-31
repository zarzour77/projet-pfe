package com.example.demo.repository;


import com.example.demo.model.Competence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    Optional<Competence> findByNomIgnoreCase(String nom);
    Optional<Competence> findByNomIgnoreCaseAndCompetenceNiveau(String nom, String competenceNiveau);
    Optional<Competence> findByNomAndCompetenceNiveau(String nom, String competenceNiveau);

}

