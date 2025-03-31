package com.example.demo.repository;


import com.example.demo.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultantRepository extends JpaRepository<Consultant, Long> {
    // Agrège les inscriptions des consultants par date (en extrayant la partie date uniquement)
    @Query("SELECT FUNCTION('DATE', c.dateInscription) as date, COUNT(c) as count " +
            "FROM Consultant c " +
            "WHERE c.dateInscription IS NOT NULL " +
            "GROUP BY FUNCTION('DATE', c.dateInscription)")
    List<Object[]> countConsultantsByDate();

    @Query("SELECT c FROM Consultant c WHERE c.workload < 3")
    List<Consultant> findAvailableConsultants();
    // Agrège les inscriptions des consultants par date (en extrayant la partie date uniquement)
    @Query("SELECT FUNCTION('DATE', c.dateInscription) as date, COUNT(c) as count " +
            "FROM Consultant c " +
            "WHERE c.dateInscription IS NOT NULL " +
            "GROUP BY FUNCTION('DATE', c.dateInscription)")
    List<Object[]> countConsultantsByDate();


}

