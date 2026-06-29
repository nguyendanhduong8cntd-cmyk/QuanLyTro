package com.goldenboat.quanlytro.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectRequest {

    @NotBlank(message = "Vui long nhap ly do tu choi")
    private String reason;
}
