package com.project.reservation_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.project.reservation_system")
@EnableScheduling
public class ReservationSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReservationSystemApplication.class, args);
	}

}
