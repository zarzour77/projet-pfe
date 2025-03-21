package com.example.demo.repository;


import com.example.demo.model.Consultant;
import com.example.demo.model.Proposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PropositionRepository extends JpaRepository<Proposition, Long> {
    List<Proposition> findByMissionId(Long missionId);
    @Query("SELECT p FROM Proposition p LEFT JOIN FETCH p.entreprise WHERE p.consultant.id = :consultantId")
    List<Proposition> findByConsultantId(@Param("consultantId") Long consultantId);

    @Query("SELECT p.dateAcceptation FROM Proposition p WHERE " +
            "p.consultant = :consultant AND " +
            "p.statut = 'accepted' AND " +
            "p.origine = 'RECRUTEMENT'")
    List<Date> findAcceptationDatesByConsultant(@Param("consultant") Consultant consultant);
}
