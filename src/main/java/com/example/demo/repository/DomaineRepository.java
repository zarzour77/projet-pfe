package com.example.demo.repository;

import com.example.demo.model.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Long> {
    Domaine findByNom(String nom);
    boolean existsByNom(String nom);
    Optional<Domaine> findByNomIgnoreCase(String nom);


}

