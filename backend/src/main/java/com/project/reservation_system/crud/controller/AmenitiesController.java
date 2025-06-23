package com.project.reservation_system.crud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.reservation_system.crud.dto.amenity.AmenityDTO;
import com.project.reservation_system.crud.entity.Amenities;
import com.project.reservation_system.crud.service.IAmenitiesService;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/amenities")
public class AmenitiesController {

    @Autowired
    private IAmenitiesService iAmenitiesService;

    @PostMapping
    public ApiResponse<?> createAmenities(@RequestBody AmenityDTO amenityDTO) {
        try {
            Amenities amenities = iAmenitiesService.createAmenities(amenityDTO);
            return DefaultResponse.displayCreatedObject(amenities);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to create amenities");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateAmenities(@PathVariable long id, @RequestBody AmenityDTO amenityDTO) {
        try {
            Amenities updateAmenities = iAmenitiesService.updateAmenities(id, amenityDTO);
            return DefaultResponse.displayUpdatedObject(updateAmenities);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to update amenities");
        }
    }

    @GetMapping("/search")
    public ApiResponse<Page<Amenities>> getAmenities(@RequestParam(required = false) String keyword, Pageable pageable) {
        Page<Amenities> result = iAmenitiesService.searchAmenities(keyword, pageable);
        return DefaultResponse.displayFoundObject(result);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteAmenities(@PathVariable long id) {
        try {
            iAmenitiesService.deleteAmenities(id);
            return DefaultResponse.displayDeleteSuccess();
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to delete amenities");
        }
    }
}
