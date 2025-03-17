package com.example.demo.repository;

import com.example.demo.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

    @Query("SELECT m FROM Mission m LEFT JOIN FETCH m.propositions WHERE m.statut = 'ACTIVE'")
    List<Mission> findActiveMissionsWithPropositions();
    @Query("SELECT DISTINCT m FROM Mission m LEFT JOIN FETCH m.domaines d WHERE d.id IN :domainIds")
    List<Mission> findDistinctByDomainesIdIn(List<Long> domainIds);

    @Query("SELECT m FROM Mission m WHERE LOWER(m.niveauExperienceRequis) = LOWER(:experience)")
    List<Mission> findDistinctByNiveauExperienceRequisIgnoreCase(String experience);

    @Query("SELECT m FROM Mission m WHERE LOWER(m.portetravail) = LOWER(:portetravail)")
    List<Mission> findDistinctByPortetravailIgnoreCase(String portetravail);

    @Query("SELECT m FROM Mission m WHERE m.budget BETWEEN :minBudget AND :maxBudget")
    List<Mission> findByBudgetBetween(Double minBudget, Double maxBudget);

    @Query("SELECT m FROM Mission m WHERE LOWER(m.dureeEstime) = LOWER(:dureeEstime)")
    List<Mission> findDistinctByDureeEstimeIgnoreCase(String dureeEstime);

    List<Mission> findByStatut(String statut);
}
