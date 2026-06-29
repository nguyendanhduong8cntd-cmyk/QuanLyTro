package com.goldenboat.quanlytro.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {

    @NotNull(message = "Vui long chon bai dang")
    private Integer postId;

    @NotNull(message = "Vui long chon ngay gio xem phong")
    @Future(message = "Thoi gian hen phai o tuong lai")
    private LocalDateTime appointmentDate;

    private String note;
}
