package com.project.reservation_system.global.authentication.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String username;
    private String firstName;
    private String lastName;
    private String role;
    private String profileImage;

}
