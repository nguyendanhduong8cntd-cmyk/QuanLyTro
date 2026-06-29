package com.goldenboat.quanlytro.dto.appointment;

import com.goldenboat.quanlytro.dto.post.PostBriefResponse;
import com.goldenboat.quanlytro.dto.user.AuthorResponse;
import com.goldenboat.quanlytro.entity.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private Integer id;
    private PostBriefResponse post;
    private AuthorResponse customer;   // khach dat lich
    private LocalDateTime appointmentDate;
    private String note;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
}
