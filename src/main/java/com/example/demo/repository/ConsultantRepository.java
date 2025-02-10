package com.example.demo.repository;


import com.example.demo.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultantRepository extends JpaRepository<Consultant, Long> {
    @Query("SELECT c FROM Consultant c WHERE c.workload < 3")
    List<Consultant> findAvailableConsultants();
}

