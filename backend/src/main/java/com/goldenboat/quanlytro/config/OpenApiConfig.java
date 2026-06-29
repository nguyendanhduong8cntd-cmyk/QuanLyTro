package com.goldenboat.quanlytro.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI quanLyTroOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Quan Ly Tro - REST API")
                        .description("Backend he thong quan ly phong tro (ADMIN / STAFF / USER). "
                                + "Dang nhap qua /auth/login de lay accessToken, sau do bam 'Authorize' "
                                + "va dan token vao.")
                        .version("1.0.0")
                        .contact(new Contact().name("GoldenBoat").email("contact@goldenboat.io")))
                .components(new Components().addSecuritySchemes(SECURITY_SCHEME_NAME,
                        new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
