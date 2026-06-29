package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Appointment;
import com.goldenboat.quanlytro.entity.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // Lich hen do mot khach (user) tao
    Page<Appointment> findByUserId(Integer userId, Pageable pageable);

    Page<Appointment> findByUserIdAndStatus(Integer userId, AppointmentStatus status, Pageable pageable);

    // Lich hen cho cac bai dang thuoc ve mot staff
    Page<Appointment> findByPostStaffId(Integer staffId, Pageable pageable);

    Page<Appointment> findByPostStaffIdAndStatus(Integer staffId, AppointmentStatus status, Pageable pageable);

    long countByPostStaffIdAndStatus(Integer staffId, AppointmentStatus status);

    long countByStatus(AppointmentStatus status);
}
