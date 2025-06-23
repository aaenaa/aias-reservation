package com.project.reservation_system.crud.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.project.reservation_system.crud.dto.user.UserRegistrationDTO;
import com.project.reservation_system.crud.entity.User;

public interface IUserService {

    public User registerUser(UserRegistrationDTO userRegistrationDTO);

    public Page<User> searchUser(String keyword, Pageable pageable);

    public User updateUser(Long userId, UserRegistrationDTO updateUserDTO);

    public boolean deleteUserById(Long userId);
}
