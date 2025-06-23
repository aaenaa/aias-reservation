package com.project.reservation_system.crud.dto.amenity;

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
public class AmenityDTO {
    private String name;
    private int capacity;
    private String status;
}
