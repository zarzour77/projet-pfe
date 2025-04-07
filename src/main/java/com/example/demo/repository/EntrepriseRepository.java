package com.example.demo.repository;


import com.example.demo.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    // Agrège les inscriptions des entreprises par date et par type (CLIENTE ou SSI)
    @Query("SELECT FUNCTION('DATE', e.dateInscription) as date, e.typeEntreprise, COUNT(e) " +
            "FROM Entreprise e " +
            "WHERE e.dateInscription IS NOT NULL " +
            "GROUP BY FUNCTION('DATE', e.dateInscription), e.typeEntreprise")
    List<Object[]> countEntreprisesByDateAndType();
    @Query("SELECT e FROM Entreprise e " +
            "WHERE LOWER(e.nomEntreprise) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Entreprise> searchEntreprises(@Param("query") String query);
}

