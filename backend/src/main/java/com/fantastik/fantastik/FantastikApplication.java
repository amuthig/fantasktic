package com.fantastik.fantastik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.fantastik.fantastik")
@EnableJpaRepositories(basePackages = "com.fantastik.fantastik.repository")
@EntityScan(basePackages = "com.fantastik.fantastik.model")
public class FantastikApplication {

	public static void main(String[] args) {
		SpringApplication.run(FantastikApplication.class, args);
	}

}
