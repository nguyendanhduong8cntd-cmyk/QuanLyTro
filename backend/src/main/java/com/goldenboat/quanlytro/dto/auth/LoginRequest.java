package com.goldenboat.quanlytro.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Vui long nhap ten dang nhap hoac email")
    private String usernameOrEmail;

    @NotBlank(message = "Vui long nhap mat khau")
    private String password;
}
