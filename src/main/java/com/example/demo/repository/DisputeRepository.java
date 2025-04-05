    package com.example.demo.repository;

    import com.example.demo.model.Dispute;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface DisputeRepository extends JpaRepository<Dispute, Long> {
        List<Dispute> findBySenderId(Long userId);
        @Query("SELECT d FROM Dispute d LEFT JOIN FETCH d.paymentTransaction WHERE d.sender.id = :userId")
        List<Dispute> findBySenderIdWithTransaction(@Param("userId") Long userId);
    }
