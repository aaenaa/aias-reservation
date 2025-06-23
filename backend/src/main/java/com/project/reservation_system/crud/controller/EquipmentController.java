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

import com.project.reservation_system.crud.dto.equipment.EquipmentDTO;
import com.project.reservation_system.crud.entity.Equipment;
import com.project.reservation_system.crud.service.IEquipmentService;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    @Autowired
    private IEquipmentService iEquipmentService;

    @PostMapping
    public ApiResponse<?> registerUser(@RequestBody EquipmentDTO equipmentDTO) {
        try {
            Equipment equipment = iEquipmentService.createEquipment(equipmentDTO);
            return DefaultResponse.displayCreatedObject(equipment);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to create equipment");
        }
    }

    @GetMapping("/search")
    public ApiResponse<Page<Equipment>> getEquipments(@RequestParam(required = false) String keyword, Pageable pageable) {
        Page<Equipment> result = iEquipmentService.searchEquipment(keyword, pageable);
        return DefaultResponse.displayFoundObject(result);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateEquipment(@PathVariable long id, @RequestBody EquipmentDTO equipmentDTO) {
        try {
            Equipment updatedEquipment = iEquipmentService.updateEquipment(id, equipmentDTO);
            return DefaultResponse.displayUpdatedObject(updatedEquipment);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to update equipment");
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteEquipment(@PathVariable long id) {
        try {
            iEquipmentService.deleteEquipment(id);
            return DefaultResponse.displayDeleteSuccess();
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to delete equipment");
        }
    }
}
