package com.example.demo.repository;

import com.example.demo.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    // Custom query methods (if needed) can be added here
}
