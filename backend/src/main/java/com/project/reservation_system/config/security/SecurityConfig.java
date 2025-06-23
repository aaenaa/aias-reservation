package com.project.reservation_system.config.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.project.reservation_system.global.authentication.JwtRequestFilter;
import com.project.reservation_system.global.authentication.user.CustomUserDetailsService;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    private static final String[] AUTH_WHITELIST = {
            // -- Swagger UI v2
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**",
            // -- Swagger UI v3 (OpenAPI)
            "/v3/api-docs/**",
            "/swagger-ui/**",
            // other public endpoints of your API may be appended to this array
            "/user/register",
            "/authentication/login",
            "/authentication/**",
    };

    /**
     * Authentication Manager Bean.
     * Configures the AuthenticationManager using the CustomUserDetailsService and
     * PasswordEncoder.
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder encoder) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(encoder)
                .and()
                .build();
    }

    /**
     * Security Filter Chain.
     * Configures HTTP security to manage authorization and session management.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests((authz) -> authz
                        .antMatchers("/public/**").permitAll()
                        .antMatchers(AUTH_WHITELIST).permitAll()
                        .anyRequest().permitAll())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // No sessions for
                                                                                             // stateless API

        // Add JwtRequestFilter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // CORS configuration
        http.cors().configurationSource(request -> {
            var cors = new CorsConfiguration();
            cors.setAllowedOrigins(List.of("*")); // Allow all origins (consider restricting for production)
            cors.setAllowedMethods(List.of("*")); // Allow all methods
            cors.setAllowedHeaders(List.of("*")); // Allow all headers
            cors.setExposedHeaders(List.of("*")); // Allow all headers to be exposed
            return cors;
        });

        return http.build();
    }

    /**
     * Password Encoder Bean.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt for secure password encoding
    }

    /**
     * Forwarded Header Filter Bean.
     * Handles forwarded headers for reverse proxy scenarios.
     */
    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }
}
