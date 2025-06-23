package com.project.reservation_system.global.authentication;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.reservation_system.crud.dto.user.UserLoginDTO;
import com.project.reservation_system.global.authentication.user.CustomUserDetails;
import com.project.reservation_system.global.authentication.user.LoginResponseDTO;
import com.project.reservation_system.global.response.ApiResponse;
import com.project.reservation_system.global.response.DefaultResponse;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ApiResponse<?> createAuthenticationToken(@RequestBody UserLoginDTO loginRequest) throws Exception {
        // Authenticate the user using AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate the JWT token
        String jwt = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());

        // Retrieve the user details from the authentication object
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        String firstName = ((CustomUserDetails) userDetails).getFirstName(); // Assuming you have a CustomUserDetails
                                                                             // class
        String lastName = ((CustomUserDetails) userDetails).getLastName(); // Same assumption
        String role = userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.joining(", "));

        String profileImage = ((CustomUserDetails) userDetails).getProfileImage();
        // Return both JWT and user details in the response
        LoginResponseDTO response = new LoginResponseDTO(jwt, username, firstName, lastName, role, profileImage);

        return DefaultResponse.displayFoundObject(response);
    }
}
