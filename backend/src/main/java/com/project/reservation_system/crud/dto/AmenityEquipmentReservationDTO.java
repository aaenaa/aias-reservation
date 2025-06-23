package com.project.reservation_system.crud.dto;

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
public class AmenityEquipmentReservationDTO {
    private ClientDTO client;
    private EquipmentReserveDTO equipmentReserveDTO;
    private AmenityReserveDTO amenityReserveDTO;
}
