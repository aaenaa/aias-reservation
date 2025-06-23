package com.project.reservation_system.global.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.crud.entity.Equipment;
import com.project.reservation_system.crud.entity.EquipmentReservation;
import com.project.reservation_system.crud.entity.EquipmentReservationDetails;
import com.project.reservation_system.crud.repository.AmenityReservationRepository;
import com.project.reservation_system.crud.repository.EquipmentRepository;
import com.project.reservation_system.crud.repository.EquipmentReservationDetailsRepository;
import com.project.reservation_system.crud.repository.EquipmentReservationRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Transactional
@Slf4j
public class Scheduler {

    @Autowired
    private EquipmentReservationRepository equipmentReservationRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private AmenityReservationRepository amenityReservationRepository;

    @Scheduled(cron = "0 * * * * *")
    public void checkEquipmentReservationState() {
        log.info("Checking for expired equipment reservations...");

        LocalDateTime now = LocalDateTime.now();
        List<EquipmentReservation> expiredReservations = equipmentReservationRepository.findExpiredReservations(now);

        if (!expiredReservations.isEmpty()) {
            for (EquipmentReservation reservation : expiredReservations) {
                reservation.setStatus("COMPLETED");

                // Update the reserve equipment quantity
                for (EquipmentReservationDetails equipmentReservationDetails : reservation.getReservationDetails()) {

                    Equipment equipment = equipmentReservationDetails.getEquipment();
                    equipment.setQuantity(equipment.getQuantity() + equipmentReservationDetails.getQuantity());
                    equipmentRepository.save(equipment);
                }
            }

            // Settings its status into Completed
            equipmentReservationRepository.saveAll(expiredReservations);

            log.info("Updated {} expired reservations.", expiredReservations.size());
        } else {
            log.info("No expired reservations found.");
        }
    }

    // Runs every minute
    @Scheduled(cron = "0 * * * * *")
    public void checkAmenityReservationState() {
        log.info("Checking for expired amenity reservations...");

        LocalDateTime now = LocalDateTime.now();

        List<AmenityReservation> expiredReservations = amenityReservationRepository.findExpiredReservations(now);

        if (!expiredReservations.isEmpty()) {
            for (AmenityReservation reservation : expiredReservations) {
                reservation.setStatus("COMPLETED"); // Or "EXPIRED"
            }

            amenityReservationRepository.saveAll(expiredReservations);
            log.info("Updated {} expired amenity reservations.", expiredReservations.size());
        } else {
            log.info("No expired amenity reservations found.");
        }
    }
}
