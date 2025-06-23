package com.project.reservation_system.crud.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.reservation_system.crud.entity.Amenities;

public interface AmenitiesRepository extends JpaRepository<Amenities, Long> {
    Amenities findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT a FROM Amenities a WHERE " +
            "(CASE WHEN ?1 = '' THEN 1 ELSE 0 END = 1) OR " +
            "(LOWER(a.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "CAST(a.capacity AS string) LIKE CONCAT('%', ?1, '%') OR " +
            "LOWER(a.status) LIKE LOWER(CONCAT('%', ?1, '%')))")
    Page<Amenities> searchAmenitiesByKeyword(String keyword, Pageable pageable);
}
