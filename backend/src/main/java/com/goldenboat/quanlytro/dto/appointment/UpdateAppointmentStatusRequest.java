package com.goldenboat.quanlytro.dto.appointment;

import com.goldenboat.quanlytro.entity.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAppointmentStatusRequest {

    @NotNull(message = "Vui long chon trang thai")
    private AppointmentStatus status;
}
