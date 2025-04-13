package com.example.demo.repository;


import com.example.demo.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultantRepository extends JpaRepository<Consultant, Long> {
    @Query("SELECT c FROM Consultant c JOIN User u ON c.id = u.id WHERE u.id = :id AND u.role = :role")
    Optional<Consultant> findByUserIdAndRole(@Param("id") Long id, @Param("role") String role);

    // Agrège les inscriptions des consultants par date (en extrayant la partie date uniquement)
    @Query("SELECT FUNCTION('DATE', c.dateInscription) as date, COUNT(c) as count " +
            "FROM Consultant c " +
            "WHERE c.dateInscription IS NOT NULL " +
            "GROUP BY FUNCTION('DATE', c.dateInscription)")
    List<Object[]> countConsultantsByDate();

    @Query("SELECT c FROM Consultant c WHERE c.workload < 3")
    List<Consultant> findAvailableConsultants();

    @Query("SELECT c FROM Consultant c " +
            "WHERE LOWER(c.nom) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "   OR LOWER(c.prenom) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Consultant> searchConsultants(@Param("query") String query);
    @Query("SELECT DISTINCT c FROM Consultant c JOIN c.subscriptions s " +
            "WHERE s.planType = 'Premium' AND s.expirationDate > CURRENT_TIMESTAMP")
    List<Consultant> findActivePremiumConsultants();
}

