package com.student.management.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI studentManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Student Management System API")
                        .description("Spring Boot REST API for Student Management System")
                        .version("v1.0.0")
                        .contact(new Contact().name("Development Team").email("dev@student.com")));
    }
}
