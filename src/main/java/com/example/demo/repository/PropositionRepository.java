package com.example.demo.repository;


import com.example.demo.model.Proposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropositionRepository extends JpaRepository<Proposition, Long> {
}
