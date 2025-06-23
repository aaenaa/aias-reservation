package com.project.reservation_system.crud.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.project.reservation_system.crud.dto.equipment.reservation.EquipmentReservationDTO;
import com.project.reservation_system.crud.dto.equipment.reservation.EquipmentReservationStatusCountDTO;
import com.project.reservation_system.crud.entity.EquipmentReservation;
import com.project.reservation_system.global.constant.EquipmentReservationStatus;

public interface IEquipmentReservationService {

    EquipmentReservation createEquipmentReservation(EquipmentReservationDTO equipmentReservationDTO);

    Page<EquipmentReservation> searchEquipmentReservations(String keyword, EquipmentReservationStatus status,
            Pageable pageable);

    List<EquipmentReservationStatusCountDTO> countDashboardStatuses();

    void deleteEquipmentReservation(Long id);

    EquipmentReservation updateEquipmentReservation(Long id, EquipmentReservationDTO equipmentReservationDTO);
}
