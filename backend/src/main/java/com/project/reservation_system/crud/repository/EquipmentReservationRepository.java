package com.project.reservation_system.crud.repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.reservation_system.crud.entity.EquipmentReservation;

public interface EquipmentReservationRepository extends JpaRepository<EquipmentReservation, Long> {
        @Query("SELECT er FROM EquipmentReservation er WHERE " +
                        "(CASE WHEN ?1 = '' THEN 1 ELSE 0 END = 1) OR " +
                        "(LOWER(er.status) LIKE %?1% OR " +
                        "LOWER(er.remarks) LIKE %?1% OR " +
                        "LOWER(er.purpose) LIKE %?1% OR " +
                        "LOWER(er.client.firstName) LIKE %?1% OR " +
                        "LOWER(er.client.lastName) LIKE %?1% ) AND " +
                        "(?2 = 'ALL' OR er.status = ?2)")
        Page<EquipmentReservation> searchEquipmentReservationsByKeyword(String keyword, String status,
                        Pageable pageable);

        @Query("SELECT er.status, COUNT(er) FROM EquipmentReservation er GROUP BY er.status")
        List<Object[]> countReservationsByStatus();

        @Query("SELECT er FROM EquipmentReservation er WHERE er.endDateTime <= :currentTime AND er.status NOT IN ('COMPLETED', 'CANCELLED')")
        List<EquipmentReservation> findExpiredReservations(LocalDateTime currentTime);

        @Query("SELECT er FROM EquipmentReservation er WHERE DATE(er.startDateTime) = DATE(:dateToday)")
        List<EquipmentReservation> findReservationsByDate(String dateToday);

        @Query("SELECT e FROM EquipmentReservation e WHERE e.startDateTime BETWEEN :startDate AND :endDate AND (:status IS NULL OR e.status = :status)")
        List<EquipmentReservation> findReservationsByStartDateTimeBetweenAndStatus(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("status") String status);

        @Query(value = "SELECT * FROM tbl_equipment_reservation er " +
                        "WHERE er.status in (:status)", nativeQuery = true)
        List<EquipmentReservation> findReservationsByStatus(@Param("status") List<String> status);
}
