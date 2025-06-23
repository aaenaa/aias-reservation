package com.project.reservation_system.crud.dto;

import java.time.LocalDateTime;

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
public class AmenityReserveDTO {
    private long amenityId;
    private String purpose;
    private String status;
    private String remarks;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}
