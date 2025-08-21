package com.app.qtda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class QtdaApplication {

	public static void main(String[] args) {
		SpringApplication.run(QtdaApplication.class, args);
	}

}
