package com.project.reservation_system.crud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.reservation_system.crud.dto.equipment.reservation.EquipmentReservationDTO;
import com.project.reservation_system.crud.entity.EquipmentReservation;
import com.project.reservation_system.crud.service.IEquipmentReservationService;
import com.project.reservation_system.global.constant.EquipmentReservationStatus;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/equipment-reservation")
public class EquipmentReservationController {

    @Autowired
    private IEquipmentReservationService iEquipmentReservationService;

    @PostMapping
    public ApiResponse<?> createEquipmentReservation(@RequestBody EquipmentReservationDTO equipmentReservationDTO) {
        try {
            EquipmentReservation equipmentReservation = iEquipmentReservationService
                    .createEquipmentReservation(equipmentReservationDTO);
            return DefaultResponse.displayCreatedObject(equipmentReservation);

        } catch (Exception e) {
            System.out.println("EXCEPTION "+ e.getMessage());
            return DefaultResponse.displayUnprocessable("Failed to create equipment reservation");
        }
    }

    @GetMapping
    public ApiResponse<Page<EquipmentReservation>> searchEquipmentReservation(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = true) EquipmentReservationStatus equipmentReservationStatus, Pageable pageable) {

        return DefaultResponse.displayFoundObject(iEquipmentReservationService.searchEquipmentReservations(keyword,
                equipmentReservationStatus, pageable));
    }

    @GetMapping("/dashboard")
    public ApiResponse<?> countDashboardStatus() {
        return DefaultResponse.displayFoundObject(iEquipmentReservationService.countDashboardStatuses());
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateEquipmentReservation(@PathVariable Long id,
            @RequestBody EquipmentReservationDTO equipmentReservationDTO) {
        try {
            EquipmentReservation updatedReservation = iEquipmentReservationService.updateEquipmentReservation(id,
                    equipmentReservationDTO);
            return DefaultResponse.displayUpdatedObject(updatedReservation);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to update equipment reservation: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteEquipmentReservation(@PathVariable Long id) {
        try {
            iEquipmentReservationService.deleteEquipmentReservation(id);
            return DefaultResponse.displayDeleteSuccess();
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to delete equipment reservation: " + e.getMessage());
        }
    }
}
