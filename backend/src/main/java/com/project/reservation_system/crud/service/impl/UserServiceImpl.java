package com.project.reservation_system.crud.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.reservation_system.crud.dto.user.UserRegistrationDTO;
import com.project.reservation_system.crud.entity.User;
import com.project.reservation_system.crud.repository.UserRepository;
import com.project.reservation_system.crud.service.IUserService;

@Transactional
@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(UserRegistrationDTO userRegistrationDTO) {

        // Check if user already exists
        if (userRepository.existsByUsername(userRegistrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }

        // Create a new User object from the registration data
        User newUser = User.builder()
                .firstName(userRegistrationDTO.getFirstName())
                .lastName(userRegistrationDTO.getLastName())
                .middleInitial(userRegistrationDTO.getMiddleInitial())
                .username(userRegistrationDTO.getUsername())
                .password(passwordEncoder.encode(userRegistrationDTO.getPassword()))
                .role(userRegistrationDTO.getRole())
                .contact(userRegistrationDTO.getContact())
                .email(userRegistrationDTO.getEmail())
                .address(userRegistrationDTO.getAddress())
                .profileImage(userRegistrationDTO.getProfileImage())
                .build();

        // Save the user to the database
        return userRepository.save(newUser);
    }

    @Override
    public Page<User> searchUser(String keyword, Pageable pageable) {
        return userRepository.searchUsersByKeyword(keyword, pageable);
    }

    @Override
    public User updateUser(Long userId, UserRegistrationDTO userUpdateDTO) {

        User user = userRepository.findById(userId).orElse(null);

        if (user != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
            user.setLastName(userUpdateDTO.getLastName());
            user.setMiddleInitial(userUpdateDTO.getMiddleInitial());
            user.setContact(userUpdateDTO.getContact());
            user.setEmail(userUpdateDTO.getEmail());
            user.setAddress(userUpdateDTO.getAddress());
            user.setRole(userUpdateDTO.getRole());
            user.setProfileImage(userUpdateDTO.getProfileImage());

            return userRepository.save(user);
        } else {
            return null;
        }
    }

    public boolean deleteUserById(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        } else {
            return false;
        }
    }
}
