package com.project.reservation_system.crud.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.project.reservation_system.crud.dto.amenity.reservation.AmenityReservationDTO;
import com.project.reservation_system.crud.dto.amenity.reservation.AmenityReservationStatusCountDTO;
import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.global.constant.AmenityReservationStatus;

public interface IAmenityReservationService {
    public AmenityReservation createAmenityReservation(AmenityReservationDTO amenityReservationDTO);

    public boolean isAmenityTaken(Long amenityId, LocalDateTime startDateTime, LocalDateTime endDateTime);

    public AmenityReservation updateAmenityReservation(Long id, AmenityReservationDTO amenityReservationDTO);

    public Page<AmenityReservation> searchAmenityReservation(String keyword, AmenityReservationStatus amenityReservationStatus, Pageable pageable);

    public List<AmenityReservationStatusCountDTO> countDashboardStatuses();

    void deleteAmenityReservation(Long id);
}
