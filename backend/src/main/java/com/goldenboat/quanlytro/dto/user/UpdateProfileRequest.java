package com.goldenboat.quanlytro.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Ho ten khong duoc de trong")
    @Size(max = 100)
    private String fullName;

    @NotBlank(message = "So dien thoai khong duoc de trong")
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "So dien thoai khong hop le")
    private String phone;

    private String avatar;
}
