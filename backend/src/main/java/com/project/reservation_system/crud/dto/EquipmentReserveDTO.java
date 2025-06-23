package com.project.reservation_system.crud.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.project.reservation_system.crud.dto.amenity.reservation.EquipmentDetailDTO;

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
public class EquipmentReserveDTO {
    private List<EquipmentDetailDTO> equipments;
    private String purpose;
    private String status;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}
