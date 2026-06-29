package com.goldenboat.quanlytro.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Vui long nhap mat khau hien tai")
    private String oldPassword;

    @NotBlank(message = "Vui long nhap mat khau moi")
    @Size(min = 6, max = 100, message = "Mat khau moi toi thieu 6 ky tu")
    private String newPassword;
}
