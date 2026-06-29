package com.goldenboat.quanlytro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuanLyTroApplication {

    public static void main(String[] args) {
        // Cho phep ByteBuddy/Hibernate hoat dong tren cac ban JDK rat moi (vd: JDK 25)
        System.setProperty("net.bytebuddy.experimental", "true");
        SpringApplication.run(QuanLyTroApplication.class, args);
    }
}
