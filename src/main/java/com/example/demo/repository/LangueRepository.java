package com.example.demo.repository;

import com.example.demo.model.Langue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LangueRepository extends JpaRepository<Langue, Long> {
    Optional<Langue> findByNomAndNiveau(String nom, String niveau);
    Langue findByNom(String nom);

}
