package com.project.reservation_system.crud.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.dto.amenity.AmenityDTO;
import com.project.reservation_system.crud.entity.Amenities;
import com.project.reservation_system.crud.repository.AmenitiesRepository;
import com.project.reservation_system.crud.service.IAmenitiesService;

@Transactional
@Service
public class AmenitiesServiceImpl implements IAmenitiesService {

    @Autowired
    private AmenitiesRepository amenitiesRepository;

    @Override
    public Amenities createAmenities(AmenityDTO amenityDTO) {
        if (amenitiesRepository.existsByName(amenityDTO.getName())) {
            throw new RuntimeException("Amenities name already exists.");
        }

        Amenities newAmenities = Amenities.builder()
                .name(amenityDTO.getName())
                .capacity(amenityDTO.getCapacity())
                .status(amenityDTO.getStatus())
                .build();

        return amenitiesRepository.save(newAmenities);
    }

    @Override
    public Page<Amenities> searchAmenities(String keyword, Pageable pageable) {
        return amenitiesRepository.searchAmenitiesByKeyword(keyword, pageable);
    }

    @Override
    public Amenities updateAmenities(Long id, AmenityDTO amenityDTO) {
        Amenities amenities = amenitiesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Amenities not found with ID: " + id));
        amenities.setCapacity(amenityDTO.getCapacity());
        amenities.setStatus(amenityDTO.getStatus());
        amenities.setName(amenityDTO.getName());

        return amenitiesRepository.save(amenities);
    }

    @Override
    public void deleteAmenities(Long id) {
        Amenities amenities = amenitiesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Amenities not found with ID: " + id));

        amenitiesRepository.delete(amenities);
    }
}
