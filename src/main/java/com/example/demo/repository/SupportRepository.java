package com.example.demo.repository;

import com.example.demo.Entity.Support;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRepository extends JpaRepository<Support, Long> {
    // Additional query methods can be added here if needed
}

