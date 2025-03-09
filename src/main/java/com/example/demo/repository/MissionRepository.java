package com.example.demo.repository;

import com.example.demo.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

    @Query("SELECT m FROM Mission m WHERE m.statut = 'ACTIVE'")
    List<Mission> findActiveMissions();

    List<Mission> findDistinctByDomainesIdIn(List<Long> domainIds);
    List<Mission> findDistinctByNiveauExperienceRequisIgnoreCase(String experience);
    List<Mission> findDistinctByPortetravailIgnoreCase(String portetravail);
    List<Mission> findByBudgetBetween(Double minBudget, Double maxBudget);
    List<Mission> findDistinctByDureeEstimeIgnoreCase(String dureeEstime);
    List<Mission> findByStatut(String statut);


}
