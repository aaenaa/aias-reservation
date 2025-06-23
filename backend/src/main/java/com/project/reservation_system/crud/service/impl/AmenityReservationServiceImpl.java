package com.project.reservation_system.crud.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.dto.amenity.reservation.AmenityReservationDTO;
import com.project.reservation_system.crud.dto.amenity.reservation.AmenityReservationStatusCountDTO;
import com.project.reservation_system.crud.entity.Amenities;
import com.project.reservation_system.crud.entity.AmenityReservation;
import com.project.reservation_system.crud.entity.Client;
import com.project.reservation_system.crud.repository.AmenitiesRepository;
import com.project.reservation_system.crud.repository.AmenityReservationRepository;
import com.project.reservation_system.crud.repository.ClientRepository;
import com.project.reservation_system.crud.service.IAmenityReservationService;
import com.project.reservation_system.global.constant.AmenityReservationStatus;

@Transactional
@Service
public class AmenityReservationServiceImpl implements IAmenityReservationService {

        @Autowired
        private AmenityReservationRepository amenityReservationRepository;

        @Autowired
        private AmenitiesRepository amenitiesRepository;

        @Autowired
        private ClientRepository clientRepository;

        @Override
        public AmenityReservation createAmenityReservation(AmenityReservationDTO amenityReservationDTO) {

                Amenities amenities = amenitiesRepository.findById(amenityReservationDTO.getAmenityId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Amenities not found with ID: "
                                                                + amenityReservationDTO.getAmenityId()));

                Client client = Client.builder()
                                .address(amenityReservationDTO.getClient().getAddress())
                                .contact(amenityReservationDTO.getClient().getContact())
                                .email(amenityReservationDTO.getClient().getEmail())
                                .firstName(amenityReservationDTO.getClient().getFirstName())
                                .lastName(amenityReservationDTO.getClient().getLastName())
                                .middleInitial(amenityReservationDTO.getClient().getMiddleName())
                                .role(amenityReservationDTO.getClient().getEventRole())
                                .build();

                client = clientRepository.save(client);

                AmenityReservation amenityReservation = AmenityReservation.builder()
                                .amenities(amenities)
                                .client(client)
                                .endDateTime(amenityReservationDTO.getEndDateTime())
                                .startDateTime(amenityReservationDTO.getStartDateTime())
                                .purpose(amenityReservationDTO.getPurpose())
                                .remarks(amenityReservationDTO.getRemarks())
                                .status(amenityReservationDTO.getStatus())
                                .build();

                return amenityReservationRepository.save(amenityReservation);
        }

        @Override
        public boolean isAmenityTaken(Long amenityId, LocalDateTime startDateTime, LocalDateTime endDateTime) {

                Amenities amenity = amenitiesRepository.findById(amenityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Amenities not found with ID: " + amenityId));

                // Query the repository to check if there are any overlapping reservations
                List<AmenityReservation> reservations = amenityReservationRepository.checkAmenityReservation(amenity,
                                startDateTime, endDateTime);
                // If there are any reservations found, return true (the amenity is taken)
                return reservations.size() > 0;
        }

        @Override
        public AmenityReservation updateAmenityReservation(Long id, AmenityReservationDTO amenityReservationDTO) {
        AmenityReservation amenityReservation = amenityReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Amenity Reservation not found with ID: " + id));

        Amenities amenities = amenitiesRepository.findById(amenityReservationDTO.getAmenityId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Amenities not found with ID: " + amenityReservationDTO.getAmenityId()));

        Client client = clientRepository.findById(amenityReservationDTO.getClient().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Client not found with ID: " + amenityReservationDTO.getClient().getId()));

        client.setFirstName(amenityReservationDTO.getClient().getFirstName());
        client.setMiddleInitial(amenityReservationDTO.getClient().getMiddleName());
        client.setLastName(amenityReservationDTO.getClient().getLastName());
        client.setContact(amenityReservationDTO.getClient().getContact());
        client.setEmail(amenityReservationDTO.getClient().getEmail());
        client.setAddress(amenityReservationDTO.getClient().getAddress());
        client.setRole(amenityReservationDTO.getClient().getEventRole());

        clientRepository.save(client); 

        amenityReservation.setAmenities(amenities);
        amenityReservation.setClient(client);
        amenityReservation.setStartDateTime(amenityReservationDTO.getStartDateTime());
        amenityReservation.setEndDateTime(amenityReservationDTO.getEndDateTime());
        amenityReservation.setPurpose(amenityReservationDTO.getPurpose());
        amenityReservation.setRemarks(amenityReservationDTO.getRemarks());
        amenityReservation.setStatus(amenityReservationDTO.getStatus());

        return amenityReservationRepository.save(amenityReservation);
        }

        @Override
        public Page<AmenityReservation> searchAmenityReservation(String keyword,
                        AmenityReservationStatus amenityReservationStatus, Pageable pageable) {
                return amenityReservationRepository.searchAmenityReservationsByKeyword(
                                (keyword == null ? "" : keyword.toLowerCase()),
                                amenityReservationStatus.name(), pageable);
                // return amenityReservationRepository.findAll(pageable);
        }

        @Override
        public List<AmenityReservationStatusCountDTO> countDashboardStatuses() {
                List<Object[]> results = amenityReservationRepository.countReservationsByStatus();

                return results.stream()
                                .map(obj -> new AmenityReservationStatusCountDTO((String) obj[0], (Long) obj[1]))
                                .collect(Collectors.toList());
        }

        @Override
        public void deleteAmenityReservation(Long id) {
                AmenityReservation reservation = amenityReservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Amenity reservation not found with ID: " + id));

                amenityReservationRepository.delete(reservation);
        }
}
