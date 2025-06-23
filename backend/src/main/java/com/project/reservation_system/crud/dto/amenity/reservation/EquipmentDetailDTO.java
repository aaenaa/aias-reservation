package com.project.reservation_system.crud.dto.amenity.reservation;

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
public class EquipmentDetailDTO {
    private long equipmentId;
    private int quantity;
}
