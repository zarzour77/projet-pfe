package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select distinct u from User u where u.email = ?1")
    Optional<User> findByEmail(String email);
    User findUserByEmail(String email); // Version sans Optional
    Optional<User> findByRole(String role);

    boolean existsByEmail(String email);
    List<User> findByNomContainingIgnoreCase(String username);
}