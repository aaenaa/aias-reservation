package com.project.reservation_system.crud.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.project.reservation_system.crud.dto.amenity.AmenityDTO;
import com.project.reservation_system.crud.entity.Amenities;

public interface IAmenitiesService {
    public Amenities createAmenities(AmenityDTO dto);

    public Amenities updateAmenities(Long id, AmenityDTO dto);

    public void deleteAmenities(Long id);

    public Page<Amenities> searchAmenities(String keyword, Pageable pageable);
}
