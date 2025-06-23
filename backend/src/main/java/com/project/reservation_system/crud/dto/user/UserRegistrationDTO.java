package com.project.reservation_system.crud.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    private String firstName;
    private String lastName;
    private String middleInitial;
    private String username;
    private String password;
    private String role;
    private String contact;
    private String email;
    private String address;
    private String profileImage;
}
