package com.project.reservation_system.crud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.project.reservation_system.crud.dto.amenity.reservation.AmenityReservationDTO;
import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.crud.service.IAmenityReservationService;
import com.project.reservation_system.global.constant.AmenityReservationStatus;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/amenity-reservation")
public class AmenityReservationController {

    @Autowired
    private IAmenityReservationService iAmenityReservationService;

    @PostMapping
    public ApiResponse<?> createAmenityReservation(@RequestBody AmenityReservationDTO amenityReservationDTO) {
        try {

            boolean isTaken = iAmenityReservationService.isAmenityTaken(amenityReservationDTO.getAmenityId(),
                    amenityReservationDTO.getStartDateTime(), amenityReservationDTO.getEndDateTime());

            if (isTaken) {
                return DefaultResponse
                        .displayUnprocessable("The amenity is already reserved for the selected time period.");
            }

            AmenityReservation amenityReservation = iAmenityReservationService
                    .createAmenityReservation(amenityReservationDTO);
            return DefaultResponse.displayCreatedObject(amenityReservation);

        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to create amenity reservation");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateAmenityReservation(@PathVariable Long id,
            @RequestBody AmenityReservationDTO amenityReservationDTO) {
        try {
            AmenityReservation updateAmenityReservation = iAmenityReservationService.updateAmenityReservation(id,
                    amenityReservationDTO);
            return DefaultResponse.displayUpdatedObject(updateAmenityReservation);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to update amenity reservation");
        }
    }

    @GetMapping("/search")
    public ApiResponse<Page<AmenityReservation>> searchAmenityReservation(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = true) AmenityReservationStatus amenityReservationStatus, Pageable pageable) {

        return DefaultResponse
                .displayFoundObject(iAmenityReservationService.searchAmenityReservation(keyword, amenityReservationStatus, pageable));
    }

    @GetMapping("/dashboard")
    public ApiResponse<?> countDashboardStatus(){
        return DefaultResponse.displayFoundObject(iAmenityReservationService.countDashboardStatuses());
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteAmenityReservation(@PathVariable Long id) {
        try {
            iAmenityReservationService.deleteAmenityReservation(id);
            return DefaultResponse.displayDeleteSuccess();
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to delete amenity reservation: " + e.getMessage());
        }
    }
}
