package com.project.reservation_system.crud.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.dto.AmenityEquipmentReservationDTO;
import com.project.reservation_system.crud.dto.amenity.reservation.EquipmentDetailDTO;
import com.project.reservation_system.crud.entity.Amenities;
import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.crud.entity.Client;
import com.project.reservation_system.crud.entity.Equipment;
import com.project.reservation_system.crud.entity.EquipmentReservation;
import com.project.reservation_system.crud.entity.EquipmentReservationDetails;
import com.project.reservation_system.crud.repository.AmenitiesRepository;
import com.project.reservation_system.crud.repository.AmenityReservationRepository;
import com.project.reservation_system.crud.repository.ClientRepository;
import com.project.reservation_system.crud.repository.EquipmentRepository;
import com.project.reservation_system.crud.repository.EquipmentReservationDetailsRepository;
import com.project.reservation_system.crud.repository.EquipmentReservationRepository;
import com.project.reservation_system.crud.response.BothMonthStartAndEndDate;
import com.project.reservation_system.crud.response.BothReservationResponse;
import com.project.reservation_system.crud.service.IReservationService;
import com.project.reservation_system.global.constant.ReservationStatus;

@Transactional
@Service
public class ReservationServiceImpl implements IReservationService {

        @Autowired
        private AmenityReservationRepository amenityReservationRepository;

        @Autowired
        private EquipmentReservationRepository equipmentReservationRepository;

        @Autowired
        private ClientRepository clientRepository;

        @Autowired
        private EquipmentRepository equipmentRepository;

        @Autowired
        private AmenitiesRepository amenitiesRepository;

        @Autowired
        private EquipmentReservationDetailsRepository equipmentReservationDetailsRepository;

        // @Override
        // public Page<AmenityReservation> getAmenityReservationByDate(Date dateToday,
        // Pageable pageable) {
        // return amenityReservationRepository.findReservationsByDate(dateToday,
        // pageable);
        // }

        // @Override
        // public Page<EquipmentReservation> getEquipmentReservationByDate(Date
        // dateToday, Pageable pageable) {
        // return equipmentReservationRepository.findReservationsByDate(dateToday,
        // pageable);
        // }

        @Override
        public AmenityEquipmentReservationDTO createBothReservation(
                        AmenityEquipmentReservationDTO amenityEquipmentReservationDTO) {

                Client client = Client.builder()
                                .address(amenityEquipmentReservationDTO.getClient().getAddress())
                                .contact(amenityEquipmentReservationDTO.getClient().getContact())
                                .email(amenityEquipmentReservationDTO.getClient().getEmail())
                                .firstName(amenityEquipmentReservationDTO.getClient().getFirstName())
                                .lastName(amenityEquipmentReservationDTO.getClient().getLastName())
                                .middleInitial(amenityEquipmentReservationDTO.getClient().getMiddleName())
                                .role(amenityEquipmentReservationDTO.getClient().getEventRole())
                                .build();
                client = clientRepository.save(client);

                Amenities amenities = amenitiesRepository
                                .findById(amenityEquipmentReservationDTO.getAmenityReserveDTO().getAmenityId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Amenities not found with ID: "
                                                                + amenityEquipmentReservationDTO
                                                                                .getAmenityReserveDTO()
                                                                                .getAmenityId()));

                AmenityReservation amenityReservation = AmenityReservation.builder()
                                .amenities(amenities)
                                .client(client)
                                .endDateTime(amenityEquipmentReservationDTO.getAmenityReserveDTO().getEndDateTime())
                                .startDateTime(amenityEquipmentReservationDTO.getAmenityReserveDTO()
                                                .getStartDateTime())
                                .purpose(amenityEquipmentReservationDTO.getAmenityReserveDTO().getPurpose())
                                .remarks(amenityEquipmentReservationDTO.getAmenityReserveDTO().getRemarks())
                                .status(amenityEquipmentReservationDTO.getAmenityReserveDTO().getStatus())
                                .build();

                amenityReservationRepository.save(amenityReservation);

                EquipmentReservation equipmentReservation = EquipmentReservation.builder()
                                .client(client)
                                .endDateTime(amenityEquipmentReservationDTO.getEquipmentReserveDTO()
                                                .getEndDateTime())
                                .startDateTime(amenityEquipmentReservationDTO.getEquipmentReserveDTO()
                                                .getStartDateTime())
                                .purpose(amenityEquipmentReservationDTO.getEquipmentReserveDTO().getPurpose())
                                .status(amenityEquipmentReservationDTO.getEquipmentReserveDTO().getStatus())
                                .build();

                equipmentReservation = equipmentReservationRepository.save(equipmentReservation);

                for (EquipmentDetailDTO equipmentDetailDTO : amenityEquipmentReservationDTO.getEquipmentReserveDTO()
                                .getEquipments()) {
                        Equipment equipment = equipmentRepository.findById(equipmentDetailDTO.getEquipmentId())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Equipment not found with ID: "
                                                                        + equipmentDetailDTO.getEquipmentId()));

                        equipment.setQuantity(equipment.getQuantity() - equipmentDetailDTO.getQuantity());
                        equipment = equipmentRepository.save(equipment);

                        EquipmentReservationDetails equipmentReservationDetails = EquipmentReservationDetails.builder()
                                        .equipment(equipment)
                                        .equipmentReservation(equipmentReservation)
                                        .quantity(equipmentDetailDTO.getQuantity())
                                        .build();

                        equipmentReservationDetailsRepository.save(equipmentReservationDetails);

                }
                return amenityEquipmentReservationDTO;
        }

        @Override
        public BothReservationResponse fetchBothReservation(String startDate, String endDate,
                        ReservationStatus status) {
                BothReservationResponse result = new BothReservationResponse();

                DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                LocalDateTime start = LocalDateTime.parse(startDate + " 00:00:00", dateTimeFormatter);

                LocalDateTime end = endDate.contains(":")
                                ? LocalDateTime.parse(endDate, dateTimeFormatter)
                                : LocalDateTime.parse(endDate + " 23:59:59", dateTimeFormatter);

                // List<AmenityReservation> amenityReservations = amenityReservationRepository
                //                 .findReservationsBetweenDatesAndStatus(start, end, status.name());

                // List<EquipmentReservation> equipmentReservations = equipmentReservationRepository
                //                 .findReservationsByStartDateTimeBetweenAndStatus(start, end, status.name());

                List<AmenityReservation> amenityReservations;
                List<EquipmentReservation> equipmentReservations;

                if (status == ReservationStatus.ALL) {
                        amenityReservations = amenityReservationRepository.findReservationsBetweenDatesAndStatus(start, end, null);
                        equipmentReservations = equipmentReservationRepository.findReservationsByStartDateTimeBetweenAndStatus(start, end, null);
                } else {
                        amenityReservations = amenityReservationRepository
                                .findReservationsBetweenDatesAndStatus(start, end, status.name());

                        equipmentReservations = equipmentReservationRepository
                                .findReservationsByStartDateTimeBetweenAndStatus(start, end, status.name());
                }


                result.setAmenityReservations(amenityReservations);
                result.setEquipmentReservations(equipmentReservations);
                return result;
        }

        @Override
        public BothReservationResponse getBothReservationByDate(String dateToday) {
                BothReservationResponse result = new BothReservationResponse();
                List<AmenityReservation> amenityReservations = amenityReservationRepository
                                .findReservationsByDate(dateToday);
                List<EquipmentReservation> equipmentReservations = equipmentReservationRepository
                                .findReservationsByDate(dateToday);

                result.setAmenityReservations(amenityReservations);
                result.setEquipmentReservations(equipmentReservations);

                return result;
        }

        @Override
        public List<BothMonthStartAndEndDate> getMonthlyReservation() {

                List<String> statuses = List.of("UPCOMING", "ONGOING");
                List<BothMonthStartAndEndDate> result = new ArrayList<>();
                List<AmenityReservation> amenityReservations = amenityReservationRepository
                                .findReservationsByStatus(statuses);
                List<EquipmentReservation> equipmentReservations = equipmentReservationRepository
                                .findReservationsByStatus(statuses);

                for (AmenityReservation amenityReservation : amenityReservations) {
                        BothMonthStartAndEndDate bothMonthStartAndEndDate = new BothMonthStartAndEndDate();
                        bothMonthStartAndEndDate.setStartDate(amenityReservation.getStartDateTime());
                        bothMonthStartAndEndDate.setEndDate(amenityReservation.getEndDateTime());
                        result.add(bothMonthStartAndEndDate);
                }

                for (EquipmentReservation equipmentReservation : equipmentReservations) {
                        BothMonthStartAndEndDate bothMonthStartAndEndDate = new BothMonthStartAndEndDate();
                        bothMonthStartAndEndDate.setStartDate(equipmentReservation.getStartDateTime());
                        bothMonthStartAndEndDate.setEndDate(equipmentReservation.getEndDateTime());
                        result.add(bothMonthStartAndEndDate);
                }
                return result;

        }

}
