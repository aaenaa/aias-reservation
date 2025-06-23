package com.project.reservation_system.global.authentication.user;

import com.project.reservation_system.crud.entity.User;
import com.project.reservation_system.crud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.AuthorityUtils;

import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user from the database using the username
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Return an authenticated UserDetails object
        // Create a CustomUserDetails object with additional properties
        return new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                AuthorityUtils.createAuthorityList(user.getRole()), 
                user.getProfileImage());
    }
}
