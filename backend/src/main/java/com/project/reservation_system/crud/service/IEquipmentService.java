package com.project.reservation_system.crud.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.project.reservation_system.crud.dto.equipment.EquipmentDTO;
import com.project.reservation_system.crud.entity.Equipment;

public interface IEquipmentService {

    public Equipment createEquipment(EquipmentDTO equipmentDTO);

    public Equipment updateEquipment(Long id, EquipmentDTO equipmentDTO);

    public void deleteEquipment(Long id);

    public Page<Equipment> searchEquipment(String keyword, Pageable pageable);
}
