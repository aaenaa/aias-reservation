package com.project.reservation_system.crud.repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.reservation_system.crud.entity.Amenities;
import com.project.reservation_system.crud.entity.AmenityReservation;

public interface AmenityReservationRepository extends JpaRepository<AmenityReservation, Long> {

        @Query("SELECT ar FROM AmenityReservation ar WHERE ar.amenities = ?1 AND " +
                        "( (ar.startDateTime BETWEEN ?2 AND ?3) OR " +
                        "(ar.endDateTime BETWEEN ?2 AND ?3) OR " +
                        "(ar.startDateTime <= ?2 AND ar.endDateTime >= ?3) )")
        List<AmenityReservation> checkAmenityReservation(Amenities amenity, LocalDateTime startDateTime,
                        LocalDateTime endDateTime);

        @Query("SELECT ar FROM AmenityReservation ar WHERE " +
                        "(CASE WHEN ?1 = '' THEN 1 ELSE 0 END = 1) OR " +
                        "(LOWER(ar.status) LIKE %?1%  OR " +
                        "LOWER(ar.remarks) LIKE %?1% OR " +
                        "LOWER(ar.purpose) LIKE %?1% OR " +
                        "LOWER(ar.client.firstName) LIKE %?1% OR " +
                        "LOWER(ar.client.lastName) LIKE %?1% OR " +
                        "LOWER(ar.amenities.name) LIKE %?1% ) AND " +
                        "(?2 = 'ALL' OR ar.status = ?2) ")
        Page<AmenityReservation> searchAmenityReservationsByKeyword(String keyword, String status, Pageable pageable);

        @Query("SELECT ar.status, COUNT(ar) FROM AmenityReservation ar GROUP BY ar.status")
        List<Object[]> countReservationsByStatus();

        @Query("SELECT ar FROM AmenityReservation ar WHERE ar.endDateTime <= :currentTime AND ar.status NOT IN ('COMPLETED', 'CANCELLED')")
        List<AmenityReservation> findExpiredReservations(LocalDateTime currentTime);

        @Query("SELECT ar FROM AmenityReservation ar WHERE DATE(ar.startDateTime) = DATE(:dateToday)")
        List<AmenityReservation> findReservationsByDate(String dateToday);

        @Query("SELECT ar FROM AmenityReservation ar WHERE ar.startDateTime BETWEEN :startDate AND :endDate AND (:status IS NULL OR ar.status = :status)")
        List<AmenityReservation> findReservationsBetweenDatesAndStatus(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("status") String status);

        @Query(value = "SELECT * FROM tbl_amenity_reservation ar " +
                        "WHERE ar.status in (:status)", nativeQuery = true)
        List<AmenityReservation> findReservationsByStatus(@Param("status") List<String> status);
}
