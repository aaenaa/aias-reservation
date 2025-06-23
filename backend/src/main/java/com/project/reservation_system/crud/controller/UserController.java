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

import com.project.reservation_system.crud.dto.user.UserRegistrationDTO;
import com.project.reservation_system.crud.entity.User;
import com.project.reservation_system.crud.service.IUserService;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/register")
    public ApiResponse<?> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        try {
            User user = iUserService.registerUser(userRegistrationDTO);
            return DefaultResponse.displayCreatedObject(user);
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to create user");
        }
    }

    @GetMapping("/search")
    public ApiResponse<Page<User>> getUsers(@RequestParam(required = false) String keyword, Pageable pageable) {
        Page<User> result = iUserService.searchUser(keyword, pageable);
        return DefaultResponse.displayFoundObject(result);
    }

    @PutMapping("/update/{userId}")
    public ApiResponse<?> updateUser(@PathVariable("userId") Long userId,
            @RequestBody UserRegistrationDTO userUpdateDTO) {
        try {
            // Calling the service to update the user
            User updatedUser = iUserService.updateUser(userId, userUpdateDTO);
            if (updatedUser != null) {
                return DefaultResponse.displayUpdatedObject(updatedUser);
            } else {
                return DefaultResponse.displayUnprocessable("User not found or update failed");
            }
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to update user");
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ApiResponse<?> deleteUser(@PathVariable("userId") Long userId) {
        try {
            boolean deleted = iUserService.deleteUserById(userId);
            if (deleted) {
                return DefaultResponse.displayDeleteSuccess();
            } else {
                return DefaultResponse.displayUnprocessable("User not found or deletion failed");
            }
        } catch (Exception e) {
            return DefaultResponse.displayUnprocessable("Failed to delete user");
        }
    }
}
