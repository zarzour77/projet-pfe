package com.example.demo.repository;

import com.example.demo.model.Avis;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvisRepository extends JpaRepository<Avis, Long> {

    List<Avis> findByMissionId(Long missionId);

    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.cible.id = :userId")
    Double calculateAverageRatingByUserId(@Param("userId") Long userId);

    boolean existsByMissionIdAndAuteurId(Long missionId, Long auteurId);
}