package com.goldenboat.quanlytro.config;

import com.goldenboat.quanlytro.entity.*;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import com.goldenboat.quanlytro.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

/**
 * Tao san du lieu mau khi khoi dong lan dau: tai khoan, tien ich, va vai don vi hanh chinh.
 * Chi chen khi bang con trong nen co the chay nhieu lan an toan.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedUsers();
            seedAmenities();
            seedLocations();
        };
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@quanlytro.com")
                .phone("0900000001")
                .fullName("Quan Tri Vien")
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .build();

        User staff = User.builder()
                .username("staff")
                .password(passwordEncoder.encode("staff123"))
                .email("staff@quanlytro.com")
                .phone("0900000002")
                .fullName("Nhan Vien Dang Tin")
                .role(Role.STAFF)
                .status(UserStatus.ACTIVE)
                .balance(new BigDecimal("500000"))
                .build();

        User user = User.builder()
                .username("user")
                .password(passwordEncoder.encode("user123"))
                .email("user@quanlytro.com")
                .phone("0900000003")
                .fullName("Khach Tim Tro")
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .build();

        userRepository.saveAll(List.of(admin, staff, user));
        log.info("Da tao tai khoan mac dinh: admin/admin123, staff/staff123, user/user123");
    }

    private void seedAmenities() {
        if (amenityRepository.count() > 0) {
            return;
        }
        List<Amenity> amenities = List.of(
                Amenity.builder().name("Wifi").icon("fa-wifi").build(),
                Amenity.builder().name("Dieu hoa").icon("fa-snowflake").build(),
                Amenity.builder().name("May giat").icon("fa-soap").build(),
                Amenity.builder().name("Nong lanh").icon("fa-temperature-half").build(),
                Amenity.builder().name("Ban cong").icon("fa-house-chimney-window").build(),
                Amenity.builder().name("Khep kin").icon("fa-door-closed").build(),
                Amenity.builder().name("Cho de xe").icon("fa-motorcycle").build(),
                Amenity.builder().name("Tu lanh").icon("fa-box").build(),
                Amenity.builder().name("Giuong").icon("fa-bed").build(),
                Amenity.builder().name("Bep").icon("fa-fire-burner").build()
        );
        amenityRepository.saveAll(amenities);
        log.info("Da tao {} tien ich mau", amenities.size());
    }

    private void seedLocations() {
        if (provinceRepository.count() > 0) {
            return;
        }
        Province hanoi = provinceRepository.save(Province.builder().id("01").name("Thanh pho Ha Noi").build());
        Province hcm = provinceRepository.save(Province.builder().id("79").name("Thanh pho Ho Chi Minh").build());

        District baDinh = districtRepository.save(
                District.builder().id("001").name("Quan Ba Dinh").province(hanoi).build());
        District cauGiay = districtRepository.save(
                District.builder().id("005").name("Quan Cau Giay").province(hanoi).build());
        District quan1 = districtRepository.save(
                District.builder().id("760").name("Quan 1").province(hcm).build());
        District binhThanh = districtRepository.save(
                District.builder().id("765").name("Quan Binh Thanh").province(hcm).build());

        wardRepository.saveAll(List.of(
                Ward.builder().id("00001").name("Phuong Phuc Xa").district(baDinh).build(),
                Ward.builder().id("00004").name("Phuong Truc Bach").district(baDinh).build(),
                Ward.builder().id("00148").name("Phuong Dich Vong").district(cauGiay).build(),
                Ward.builder().id("26734").name("Phuong Ben Nghe").district(quan1).build(),
                Ward.builder().id("26737").name("Phuong Ben Thanh").district(quan1).build(),
                Ward.builder().id("26869").name("Phuong 12").district(binhThanh).build()
        ));
        log.info("Da tao du lieu dia gioi hanh chinh mau (2 tinh, 4 quan, 6 phuong)");
    }
}
