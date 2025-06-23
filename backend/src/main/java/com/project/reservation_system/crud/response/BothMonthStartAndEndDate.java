package com.project.reservation_system.crud.response;

import java.time.LocalDateTime;

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
public class BothMonthStartAndEndDate {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
