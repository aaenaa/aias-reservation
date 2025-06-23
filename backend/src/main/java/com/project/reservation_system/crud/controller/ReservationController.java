package com.project.reservation_system.crud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.reservation_system.crud.dto.AmenityEquipmentReservationDTO;
import com.project.reservation_system.crud.service.IReservationService;
import com.project.reservation_system.global.constant.ReservationStatus;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private IReservationService iReservationService;

    @GetMapping
    public ApiResponse<?> getReservation(
            @RequestParam(required = true) String date) {
        return DefaultResponse.displayFoundObject(iReservationService.getBothReservationByDate(date));
    }

    @GetMapping("/monthly-reservation")
    public ApiResponse<?> getMonthlyReservation() {
        return DefaultResponse.displayFoundObject(iReservationService.getMonthlyReservation());
    }

    @PostMapping
    public ApiResponse<?> submitBothReservation(
            @RequestBody AmenityEquipmentReservationDTO amenityEquipmentReservationDTO) {
        try {
            return DefaultResponse
                    .displayCreatedObject(iReservationService.createBothReservation(amenityEquipmentReservationDTO));
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to create both reservations");
        }

    }

    @GetMapping("/report")
    public ApiResponse<?> getBothReservation(@RequestParam(required = true) String startDate,
            @RequestParam(required = true) String endDate,
            @RequestParam(required = true) ReservationStatus status) {

        return DefaultResponse.displayFoundObject(iReservationService.fetchBothReservation(startDate, endDate, status));
    }

}
