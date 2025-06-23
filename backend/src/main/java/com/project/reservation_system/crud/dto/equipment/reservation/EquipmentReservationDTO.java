package com.project.reservation_system.crud.dto.equipment.reservation;

import java.time.LocalDateTime;
import java.util.List;

import com.project.reservation_system.crud.dto.amenity.reservation.EquipmentDetailDTO;
import com.project.reservation_system.crud.dto.client.ClientDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentReservationDTO {
    private ClientDTO client;
    private List<EquipmentDetailDTO> equipments;
    private String purpose;
    private String status;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}
