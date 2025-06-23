package com.project.reservation_system.crud.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.dto.equipment.EquipmentDTO;
import com.project.reservation_system.crud.entity.Equipment;
import com.project.reservation_system.crud.repository.EquipmentRepository;
import com.project.reservation_system.crud.service.IEquipmentService;

@Transactional
@Service
public class EquipmentServiceImpl implements IEquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Override
    public Equipment createEquipment(EquipmentDTO equipmentDTO) {
        if (equipmentRepository.existsByName(equipmentDTO.getName())) {
            throw new RuntimeException("Equipment name already exists.");
        }

        Equipment newEquipment = Equipment.builder()
                .name(equipmentDTO.getName())
                .category(equipmentDTO.getCategory())
                .quantity(equipmentDTO.getQuantity())
                .type(equipmentDTO.getType())
                .status(equipmentDTO.getStatus())
                .dateAcquired(equipmentDTO.getDateAcquired())
                .build();

        return equipmentRepository.save(newEquipment);
    }

    @Override
    public Equipment updateEquipment(Long id, EquipmentDTO equipmentDTO) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found with ID: " + id));

        equipment.setName(equipmentDTO.getName());
        equipment.setType(equipmentDTO.getType());
        equipment.setQuantity(equipmentDTO.getQuantity());
        equipment.setStatus(equipmentDTO.getStatus());
        equipment.setCategory(equipmentDTO.getCategory());
        equipment.setDateAcquired(equipmentDTO.getDateAcquired());

        return equipmentRepository.save(equipment);
    }

    @Override
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found with ID: " + id));

        equipmentRepository.delete(equipment);
    }

    @Override
    public Page<Equipment> searchEquipment(String keyword, Pageable pageable) {
        return equipmentRepository.searchEquipmentByKeyword(keyword, pageable);
    }
}
