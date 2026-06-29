package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.appointment.AppointmentResponse;
import com.goldenboat.quanlytro.entity.Appointment;

public final class AppointmentMapper {

    private AppointmentMapper() {
    }

    public static AppointmentResponse toResponse(Appointment a) {
        if (a == null) return null;
        return AppointmentResponse.builder()
                .id(a.getId())
                .post(PostMapper.toBrief(a.getPost()))
                .customer(UserMapper.toAuthor(a.getUser()))
                .appointmentDate(a.getAppointmentDate())
                .note(a.getNote())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
