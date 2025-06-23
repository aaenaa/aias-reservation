package com.project.reservation_system.crud.dto.client;

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
public class ClientDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String contact;
    private String email;
    private String eventRole;
    private String address;
}
