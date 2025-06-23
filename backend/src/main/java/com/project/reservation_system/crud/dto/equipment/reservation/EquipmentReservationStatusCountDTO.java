package com.project.reservation_system.crud.dto.equipment.reservation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EquipmentReservationStatusCountDTO {
    private String status;
    private long count;
}
