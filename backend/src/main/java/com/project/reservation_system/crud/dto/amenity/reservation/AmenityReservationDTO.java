package com.project.reservation_system.crud.dto.amenity.reservation;

import java.time.LocalDateTime;

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
public class AmenityReservationDTO {
    private ClientDTO client;
    private long amenityId;
    private String purpose;
    private String status;
    private String remarks;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}
