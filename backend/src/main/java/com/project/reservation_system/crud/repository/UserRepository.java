package com.project.reservation_system.crud.repository;

import com.project.reservation_system.crud.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE " +
            "(CASE WHEN ?1 = '' THEN 1 ELSE 0 END = 1) OR " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', ?1, '%')))")
    Page<User> searchUsersByKeyword(String keyword, Pageable pageable);
}
