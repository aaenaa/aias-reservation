package com.project.reservation_system.crud.dto.amenity.reservation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AmenityReservationStatusCountDTO {
    private String status;
    private long count;
}
