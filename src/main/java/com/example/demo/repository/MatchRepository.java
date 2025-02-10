package com.example.demo.repository;


import com.example.demo.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByConsultantId(Long consultantId);
    @Query("SELECT COUNT(m) FROM Match m")
    int countMatches();
}
