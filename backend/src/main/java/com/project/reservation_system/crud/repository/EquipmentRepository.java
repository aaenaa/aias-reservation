package com.project.reservation_system.crud.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.reservation_system.crud.entity.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Equipment findByName(String name);
    boolean existsByName(String name);

    @Query("SELECT e FROM Equipment e WHERE " +
            "(CASE WHEN ?1 = '' THEN 1 ELSE 0 END = 1) OR " +
            "(LOWER(e.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(e.type) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
            "LOWER(e.category) LIKE LOWER(CONCAT('%', ?1, '%')))")
    Page<Equipment> searchEquipmentByKeyword(String keyword, Pageable pageable);
}   
