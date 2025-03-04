package com.example.demo.repository;

import com.example.demo.model.Langue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LangueRepository extends JpaRepository<Langue, Long> {
    Langue findByNom(String nom);
}
