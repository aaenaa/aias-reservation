package com.project.reservation_system.crud.response;

import java.util.List;

import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.crud.entity.EquipmentReservation;

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
public class BothReservationResponse {
    private List<AmenityReservation> amenityReservations;
    private List<EquipmentReservation> equipmentReservations;
}
